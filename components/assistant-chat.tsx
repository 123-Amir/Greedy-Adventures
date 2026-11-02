'use client';

import { useMemo, useState } from 'react';
import { AssistantRuntimeProvider, ComposerPrimitive, MessagePrimitive, ThreadPrimitive, useLocalRuntime, type ChatModelAdapter } from '@assistant-ui/react';
import { useMessageReload, type DataMessagePartProps } from '@assistant-ui/core/react';
import { ArrowUp, Bot, ChevronDown, Download, ExternalLink, FileText, Film, RotateCcw, X } from 'lucide-react';

type ChatSource = { id: string; title: string; url: string };
type ChatMedia = { id: string; title: string; mediaType: 'pdf' | 'video'; description: string; url: string; material: 'demo' | 'third-party-public'; availability: 'available' | 'unavailable'; availabilityNote: string };
type ChatResponse = { answer: string; mode: 'provider' | 'demo'; sources: ChatSource[]; media: ChatMedia[] };

type ChatMessage = { role: 'user' | 'assistant'; content: string };

type MediaPartProps = DataMessagePartProps<ChatMedia>;

function MediaCard({ data }: MediaPartProps) {
  const isPdf = data.mediaType === 'pdf';
  return <div className="media-card"><div className="media-card-icon">{isPdf ? <FileText size={18} /> : <Film size={18} />}</div><div className="media-card-copy"><strong>{data.title}</strong><span>{isPdf ? 'PDF brochure · Demo material' : 'Video link · Third-party public media'}</span><small>{data.description}</small></div><a href={data.url} target={isPdf ? undefined : '_blank'} rel={isPdf ? undefined : 'noreferrer'} download={isPdf ? true : undefined} aria-label={`${isPdf ? 'Open or download' : 'Watch'} ${data.title}`}>{isPdf ? <Download size={16} /> : <ExternalLink size={16} />}</a></div>;
}

const adapter: ChatModelAdapter = {
  async run({ messages, abortSignal }) {
    const requestMessages: ChatMessage[] = messages.flatMap((message) => {
      const content = message.content.filter((part): part is { type: 'text'; text: string } => part.type === 'text').map((part) => part.text).join('');
      return content ? [{ role: message.role === 'user' ? 'user' : 'assistant', content }] : [];
    });
    const response = await fetch('/api/chat', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ messages: requestMessages }), signal: abortSignal });
    const payload: unknown = await response.json();
    if (!response.ok) throw new Error((payload as { error?: string }).error || 'The guide is temporarily unavailable.');
    const data = payload as ChatResponse;
    return { content: [{ type: 'text' as const, text: data.answer }, ...data.sources.map((source) => ({ type: 'source' as const, sourceType: 'url' as const, id: source.id, title: source.title, url: source.url })), ...data.media.map((media) => ({ type: 'data' as const, name: 'media', data: media }))], metadata: { custom: { mode: data.mode, sources: data.sources, media: data.media } } };
  },
};

function AssistantMessage() {
  const { canReload, reload } = useMessageReload();
  return <MessagePrimitive.Root className="assistant-message"><div className="assistant-avatar"><Bot size={16} /></div><div className="assistant-bubble"><MessagePrimitive.Parts components={{ data: { by_name: { media: MediaCard } } }} /><MessagePrimitive.Error>{canReload && <button type="button" className="chat-retry" onClick={reload}><RotateCcw size={12} /> Try again</button>}</MessagePrimitive.Error></div></MessagePrimitive.Root>;
}

function UserMessage() {
  return <MessagePrimitive.Root className="user-message"><div className="user-bubble"><MessagePrimitive.Parts /></div></MessagePrimitive.Root>;
}

function ChatPanel({ onClose }: { onClose: () => void }) {
  return <div className="chat-panel" role="dialog" aria-label="Greedy Adventures guide"><div className="chat-header"><div><p className="chat-kicker">Greedy Adventures</p><h2>Ask the guide</h2><p className="chat-status"><span /> Source-grounded answers</p></div><button type="button" onClick={onClose} aria-label="Close guide"><X size={18} /></button></div><div className="chat-body"><ThreadPrimitive.Root><ThreadPrimitive.Viewport><ThreadPrimitive.Messages components={{ UserMessage, AssistantMessage }} /><ThreadPrimitive.If running><div className="chat-typing" aria-live="polite"><span /><span /><span /> Guide is thinking</div></ThreadPrimitive.If><ThreadPrimitive.ViewportFooter /></ThreadPrimitive.Viewport><ComposerPrimitive.Root className="chat-composer"><ComposerPrimitive.Input aria-label="Message the guide" placeholder="Ask about the packages..." submitMode="enter" /><ComposerPrimitive.Send aria-label="Send message" className="chat-send"><ArrowUp size={17} /></ComposerPrimitive.Send></ComposerPrimitive.Root></ThreadPrimitive.Root></div><div className="chat-footnote">Answers use the approved prototype content only. Memory resets when this tab is closed.</div></div>;
}

export function AssistantChat() {
  const [open, setOpen] = useState(false);
  const runtime = useLocalRuntime(adapter);
  const panel = useMemo(() => open ? <ChatPanel onClose={() => setOpen(false)} /> : null, [open]);

  return <AssistantRuntimeProvider runtime={runtime}><div className="assistant-chat-shell">{panel}<button type="button" className={`chat-launcher group ${open ? 'chat-launcher-open' : ''}`} onClick={() => setOpen(!open)} aria-expanded={open} aria-label={open ? 'Close guide' : 'Open guide'}><span className="chat-launcher-icon">{open ? <ChevronDown size={21} /> : <Bot size={21} />}</span><span className="chat-launcher-label">{open ? 'Close' : 'Ask the guide'}</span></button></div></AssistantRuntimeProvider>;
}
