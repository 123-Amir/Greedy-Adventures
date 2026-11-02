# Greedy Adventures — Sea View Skydiving Experience

A premium landing page with a source-grounded AI assistant for a skydiving experience concept. The assistant answers questions from approved prototype content, serves media (brochure PDF and video), and exposes a read-only Knowledge View that shows exactly what the backend does.
---
### Data flow
```
User message
  → lib/intents.ts (deterministic intent + media IDs)
  → lib/knowledge.ts (keyword-matched sources)
  → lib/media.ts (validate media IDs against catalog)
  → lib/chat-service.ts (call OpenAI with context, or demo fallback)
  → response: { answer, sources, media, intent, trace }
```
The model **never selects media**. It receives context and produces a text answer. Media selection is deterministic and catalog-validated.

---
## Technology stack

- **Next.js 13.5** (App Router, Route Handlers)
- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **assistant-ui** (`@assistant-ui/react` 0.15.32) for the chat runtime
- **OpenAI** (optional) for live model responses
- **Vitest** for automated tests
- No database — conversation memory is client-side and tab-scoped

---
## Local setup

```bash
# Install dependencies
npm install --legacy-peer-deps

# Run the dev server
npm run dev

# Open http://localhost:3000
```

### Required environment variables
```bash
OPENAI_API_KEY=your_openai_api_key_here

# Optional — defaults to gpt-4o-mini
OPENAI_MODEL=gpt-4o-mini

# Test-only — forces a 503 error on all chat requests
CHAT_FORCE_FAILURE=0
```

**Safe example** (no real key):
```bash
# .env
OPENAI_API_KEY=
OPENAI_MODEL=gpt-4o-mini
CHAT_FORCE_FAILURE=0
```
### How to enable and recognize demo mode

Demo mode activates automatically when `OPENAI_API_KEY` is not set or empty. You will see:

- The answer text contains: "Add a server-side OPENAI_API_KEY to enable live model responses."
- The Knowledge View trace shows `modelCalled: false` and `mode: "demo"`
- The fallback reason reads: "No OPENAI_API_KEY is configured; deterministic demo mode was used."

Demo mode is **never** represented as a real model response. The answer text and trace both label it explicitly.

## Verification commands
```bash
# Lint
npm run lint

# Type check
npm run typecheck

# Automated tests (media selection + intent detection)
npm run test

# Production build
npm run build
```

### Automated test results

The following checks were run locally on 2026-11-02 after installing dependencies:

```
Test Files  2 passed (2)
     Tests  26 passed (26)
```

### Manual browser test scenarios

These are repeatable checks for a reviewer. They are instructions, not claims that browser automation has run.

| # | Scenario | Steps | Expected result |
|---|---|---|---|
| 1 | Package question | Open chat, type "What is included in the package?" | Text answer with source links, no media cards |
| 2 | Follow-up | After #1, type "Tell me more about the Full Send" | Answer referencing the Full Send package (conversation context used) |
| 3 | Brochure request | Type "Can you send me a brochure?" | PDF card with download button; clicking opens the demo PDF |
| 4 | Video request | Type "Can I see a video of the experience?" | Video link card; clicking opens the Pexels video in a new tab |
| 5 | Combined request | Type "Send me the brochure and a video" | Both PDF and video cards in one response |
| 6 | Unavailable media | Type "Send me the official brochure" | Text answer explaining the official brochure is unavailable; no media card |
| 7 | Unknown question | Type "What is the capital of France?" | Fallback answer explaining the guide cannot answer that |
| 8 | Missing API key | Run without `OPENAI_API_KEY` | Demo mode answers with explicit labelling |
| 9 | Model failure | Set `CHAT_FORCE_FAILURE=1` | 503 error with "temporarily unavailable" message; retry button appears |
| 10 | Knowledge View trace | Go to `/knowledge`, type a question, click "Run trace" | Full trace with request ID, intent, sources, media, mode |

---
## Phase 4 demo script

1. Open the home page and use keyboard focus to open **Ask the guide**.
2. Ask **“What is included in the package?”** and confirm the illustrative answer and source link.
3. Ask **“What about the second package?”** and confirm the active thread is preserved.
4. Ask **“Can you send me a brochure?”** and open/download the demo PDF.
5. Ask **“Can I see a video of the experience?”** and open the clearly labelled third-party video link.
6. Ask **“Send me the brochure and a video.”** and confirm both cards appear in one response.
7. Ask **“Can you send me the official brochure?”** and confirm the unavailable fallback.
8. Open **Knowledge view**, submit a test question, and verify the request ID, normalized intent, source text, selected media, mode, and fallback reason come from the returned trace.
9. For failure handling, set `CHAT_FORCE_FAILURE=1`, restart the dev server, submit a message, and verify the error/retry state; restore it to `0` afterward.

