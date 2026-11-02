import { NextResponse } from 'next/server';
import { createChatResponse, type IncomingMessage } from '../../../lib/chat-service';

type ChatRequest = { messages: IncomingMessage[]; trace?: boolean };

const MAX_MESSAGES = 20;
const MAX_MESSAGE_LENGTH = 2000;

function isValidRequest(value: unknown): value is ChatRequest {
  if (!value || typeof value !== 'object' || !Array.isArray((value as ChatRequest).messages)) return false;
  const messages = (value as ChatRequest).messages;
  return messages.length > 0 && messages.length <= MAX_MESSAGES && messages.every((message) => message && (message.role === 'user' || message.role === 'assistant') && typeof message.content === 'string' && message.content.length > 0 && message.content.length <= MAX_MESSAGE_LENGTH);
}

export async function POST(request: Request) {
  try {
    const body: unknown = await request.json();
    if (!isValidRequest(body)) return NextResponse.json({ error: 'Please send a valid conversation with messages under 2,000 characters.' }, { status: 400 });
    if (process.env.CHAT_FORCE_FAILURE === '1') return NextResponse.json({ error: 'The guide is temporarily unavailable. Please try again.' }, { status: 503 });

    const response = await createChatResponse(body.messages, body.trace === true);
    return NextResponse.json(response);
  } catch (error) {
    if (error instanceof Error && error.message === 'provider_timeout') return NextResponse.json({ error: 'The guide took too long to respond. Please try again.' }, { status: 504 });
    if (error instanceof Error && error.message === 'provider_rate_limit') return NextResponse.json({ error: 'The guide is busy right now. Please try again in a moment.' }, { status: 429 });
    if (error instanceof Error && error.message === 'provider_error') return NextResponse.json({ error: 'The guide could not reach its model provider. Please try again.' }, { status: 502 });
    if (error instanceof Error && error.message === 'user_message_required') return NextResponse.json({ error: 'A user message is required.' }, { status: 400 });
    return NextResponse.json({ error: 'The guide could not read that request. Please try again.' }, { status: 400 });
  }
}
