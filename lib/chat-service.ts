import { findRelevantSources, formatKnowledgeContext, knowledgeSources, type KnowledgeSource } from './knowledge';
import { detectIntent, type IntentResult } from './intents';
import { getMediaById, validateMediaIds, type MediaAsset } from './media';

export type IncomingMessage = { role: 'user' | 'assistant'; content: string };
export type ChatMode = 'provider' | 'demo';
export type ChatSource = Pick<KnowledgeSource, 'id' | 'title' | 'url'>;
export type ChatMedia = Pick<MediaAsset, 'id' | 'title' | 'mediaType' | 'description' | 'url' | 'material' | 'availability' | 'availabilityNote'>;

export type ChatTrace = {
  requestId: string;
  normalizedIntent: IntentResult['intent'];
  normalizedQuery: string;
  sourceIds: string[];
  sourceTextPassedToModel: Array<{ id: string; text: string }>;
  selectedMediaIds: string[];
  mediaSelectionReasons: string[];
  modelCalled: boolean;
  mode: ChatMode;
  fallbackReason?: string;
};

export type ChatResponse = {
  answer: string;
  mode: ChatMode;
  sources: ChatSource[];
  media: ChatMedia[];
  intent: IntentResult['intent'];
  trace: ChatTrace;
};

const demoAnswer = (question: string, sources: KnowledgeSource[], history: IncomingMessage[]): string => {
  const normalized = question.toLowerCase();
  const packageSource = sources.find((source) => source.id === 'greedy-page-packages');
  const faqSource = sources.find((source) => source.id === 'greedy-page-faq');
  const safetySource = sources.find((source) => source.id === 'greedy-page-safety');
  const isFollowUp = history.length > 1 || /\b(second|that one|this package|it|also)\b/.test(normalized);

  if (/\b(price|cost|availability|book|location|age|weight|weather|spectator|bring)\b/.test(normalized)) {
    return `I don’t have a confirmed answer for that yet. The page labels those details as demo content and says the real operator would need to confirm them. ${faqSource ? `See the FAQ source: ${faqSource.title} (${faqSource.url})` : ''}`.trim();
  }
  if (/package|include|inclusion|first leap|full send|keepsake|second/.test(normalized) || isFollowUp) {
    return `The package details on this prototype are illustrative. The First Leap includes a tandem jump with an instructor, a pre-flight briefing, and a scenic coastal flight. The Full Send includes everything in The First Leap, plus jump-day photo moments and an extended coastal flight. The Keepsake includes a personal jump-day host, curated photo moments, and a post-flight coastline toast. Final inclusions are not verified operational claims. ${packageSource ? `Source: ${packageSource.title} (${packageSource.url})` : ''}`.trim();
  }
  if (/\b(safe|safety|instructor|experience|previous|beginner)\b/.test(normalized)) {
    return `The page presents the experience as instructor-led from briefing to landing and emphasizes clear information and qualified guidance. It also says previous experience is not required for the illustrative tandem experience, while final requirements must be confirmed by the operator. ${safetySource ? `Source: ${safetySource.title} (${safetySource.url})` : ''} ${faqSource ? `FAQ: ${faqSource.title} (${faqSource.url})` : ''}`.trim();
  }
  return `I can answer questions about the illustrative packages, the described experience, and the FAQ. I don’t have enough approved information to answer that specific question without guessing.`;
};

function mediaAnswer(intent: IntentResult['intent'], media: MediaAsset[]): string | undefined {
  if (intent === 'brochure' && media.length > 0) return 'I found the available brochure below. It is clearly labelled demo material and is not an official company brochure.';
  if (intent === 'video' && media.length > 0) return 'I found a verified public video link below. It is third-party stock media, not official Greedy Adventures footage.';
  if (intent === 'brochure_and_video' && media.length > 0) return 'I found both requested media items below. The PDF is demo material and the video is third-party public stock media; neither is official Greedy Adventures material.';
  if (intent === 'brochure' || intent === 'video' || intent === 'brochure_and_video') return 'I could not provide the requested media because the requested asset is unavailable. I have not substituted unrelated material.';
  return undefined;
}

async function askProvider(messages: IncomingMessage[], context: string, signal: AbortSignal): Promise<string> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return '';
  const providerMessages = [
    { role: 'system', content: `You are the Greedy Adventures guide. Answer only from the approved context below. Clearly call details illustrative or demo when the context does. If the answer is not in context, say you do not have that information and do not guess. Keep answers concise. Cite source IDs in square brackets. Do not create or select media URLs; media selection is handled separately by the application.\n\nAPPROVED CONTEXT:\n${context}` },
    ...messages.map((message) => ({ role: message.role, content: message.content })),
  ];
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ model: process.env.OPENAI_MODEL || 'gpt-4o-mini', messages: providerMessages, temperature: 0.2, max_tokens: 350 }),
    signal,
  });
  if (response.status === 429) throw new Error('provider_rate_limit');
  if (!response.ok) throw new Error('provider_error');
  const payload: unknown = await response.json();
  const answer = (payload as { choices?: Array<{ message?: { content?: unknown } }> }).choices?.[0]?.message?.content;
  if (typeof answer !== 'string' || !answer.trim()) throw new Error('provider_malformed');
  return answer.trim();
}

export async function createChatResponse(messages: IncomingMessage[], includeTrace = false): Promise<ChatResponse> {
  const lastUserMessage = [...messages].reverse().find((message) => message.role === 'user');
  if (!lastUserMessage) throw new Error('user_message_required');
  const intent = detectIntent(lastUserMessage.content);
  const relevantSources = findRelevantSources(lastUserMessage.content);
  const contextSources = relevantSources.length > 0 ? relevantSources : knowledgeSources;
  const selectedMedia = validateMediaIds(intent.mediaIds);
  const requestedUnavailable = intent.mediaIds.map((id) => getMediaById(id)).filter((asset): asset is MediaAsset => asset?.availability === 'unavailable');
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 12000);
  const modelConfigured = Boolean(process.env.OPENAI_API_KEY);
  let answer = '';
  let mode: ChatMode = 'demo';
  let fallbackReason: string | undefined;

  try {
    answer = await askProvider(messages, formatKnowledgeContext(contextSources), controller.signal);
    mode = answer ? 'provider' : 'demo';
    if (!answer) fallbackReason = 'No OPENAI_API_KEY is configured; deterministic demo mode was used.';
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') throw new Error('provider_timeout');
    if (error instanceof Error && error.message === 'provider_rate_limit') throw new Error('provider_rate_limit');
    if (modelConfigured) throw new Error('provider_error');
    fallbackReason = 'No OPENAI_API_KEY is configured; deterministic demo mode was used.';
  } finally {
    clearTimeout(timeout);
  }

  const selectedMediaAnswer = mediaAnswer(intent.intent, selectedMedia);
  if (!answer) answer = selectedMediaAnswer || `Demo mode: ${demoAnswer(lastUserMessage.content, contextSources, messages)} Add a server-side OPENAI_API_KEY to enable live model responses.`;
  if (selectedMediaAnswer && mode === 'provider') answer = `${answer}\n\n${selectedMediaAnswer}`;
  if (requestedUnavailable.length > 0) answer = `${answer}\n\nUnavailable requested assets: ${requestedUnavailable.map((asset) => asset.title).join(', ')}.`;
  const trace: ChatTrace = {
    requestId: crypto.randomUUID(),
    normalizedIntent: intent.intent,
    normalizedQuery: intent.normalizedQuery,
    sourceIds: contextSources.map((source) => source.id),
    sourceTextPassedToModel: contextSources.map((source) => ({ id: source.id, text: source.approvedText })),
    selectedMediaIds: selectedMedia.map((asset) => asset.id),
    mediaSelectionReasons: [...intent.selectionReasons, ...(requestedUnavailable.length > 0 ? ['A requested catalog asset was unavailable, so it was not returned.'] : [])],
    modelCalled: modelConfigured,
    mode,
    fallbackReason,
  };
  return { answer, mode, sources: relevantSources.map((source) => ({ id: source.id, title: source.title, url: source.url })), media: selectedMedia.map(({ id, title, mediaType, description, url, material, availability, availabilityNote }) => ({ id, title, mediaType, description, url, material, availability, availabilityNote })), intent: intent.intent, trace: includeTrace ? trace : trace };
}
