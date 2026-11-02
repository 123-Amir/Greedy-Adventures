import { NextResponse } from 'next/server';
import { createChatResponse, type IncomingMessage } from '../../../lib/chat-service';
import { knowledgeSources } from '../../../lib/knowledge';
import { mediaCatalog } from '../../../lib/media';

export async function GET() {
  return NextResponse.json({
    sources: knowledgeSources,
    media: mediaCatalog,
  });
}

export async function POST(request: Request) {
  try {
    const body: unknown = await request.json();
    const question = body && typeof body === 'object' && 'question' in body ? (body as { question?: unknown }).question : undefined;
    if (typeof question !== 'string' || question.trim().length === 0 || question.length > 2000) return NextResponse.json({ error: 'Enter a question under 2,000 characters.' }, { status: 400 });
    if (process.env.CHAT_FORCE_FAILURE === '1') return NextResponse.json({ error: 'The guide is temporarily unavailable. No trace was produced.' }, { status: 503 });
    const response = await createChatResponse([{ role: 'user', content: question } satisfies IncomingMessage], true);
    return NextResponse.json({ ...response, trace: response.trace });
  } catch (error) {
    if (error instanceof Error && error.message === 'provider_timeout') return NextResponse.json({ error: 'The model timed out before a trace could be completed.' }, { status: 504 });
    if (error instanceof Error && error.message === 'provider_rate_limit') return NextResponse.json({ error: 'The model rate limit prevented a trace from completing.' }, { status: 429 });
    if (error instanceof Error && error.message === 'provider_error') return NextResponse.json({ error: 'The model provider failed before a trace could be completed.' }, { status: 502 });
    return NextResponse.json({ error: 'The Knowledge View could not process that question.' }, { status: 400 });
  }
}
