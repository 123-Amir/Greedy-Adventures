'use client';

import { FormEvent, useEffect, useState } from 'react';
import { ArrowLeft, FileText, Film, LoaderCircle, Search, ShieldCheck } from 'lucide-react';

type Source = { id: string; title: string; url: string; captureDate: string; sourceType: string; captureMethod: string; approvedText: string };
type Media = { id: string; title: string; mediaType: 'pdf' | 'video'; description: string; url: string; material: string; sourceIds: string[]; availability: string; availabilityNote: string };
type Trace = { requestId: string; normalizedIntent: string; normalizedQuery: string; sourceIds: string[]; sourceTextPassedToModel: Array<{ id: string; text: string }>; selectedMediaIds: string[]; mediaSelectionReasons: string[]; modelCalled: boolean; mode: string; fallbackReason?: string };
type TraceResponse = { answer: string; sources: Array<{ id: string; title: string; url: string }>; media: Media[]; trace: Trace };

export default function KnowledgeView() {
  const [sources, setSources] = useState<Source[]>([]);
  const [media, setMedia] = useState<Media[]>([]);
  const [question, setQuestion] = useState('What is included in the Full Send package?');
  const [result, setResult] = useState<TraceResponse | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch('/api/knowledge').then(async (response) => {
      if (!response.ok) throw new Error('Knowledge could not be loaded.');
      const data = (await response.json()) as { sources: Source[]; media: Media[] };
      setSources(data.sources);
      setMedia(data.media);
    }).catch((loadError: unknown) => setError(loadError instanceof Error ? loadError.message : 'Knowledge could not be loaded.'));
  }, []);

  async function runTrace(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await fetch('/api/knowledge', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ question }) });
      const data = (await response.json()) as TraceResponse & { error?: string };
      if (!response.ok) throw new Error(data.error || 'The trace could not be completed.');
      setResult(data);
    } catch (traceError: unknown) {
      setError(traceError instanceof Error ? traceError.message : 'The trace could not be completed.');
    } finally {
      setLoading(false);
    }
  }

  return <main className="knowledge-page"><header className="knowledge-header"><a href="/" className="knowledge-back"><ArrowLeft size={16} /> Greedy Adventures</a><div><p className="chat-kicker">Read-only transparency view</p><h1>Knowledge View</h1><p>See exactly which approved content and catalog assets power the guide.</p></div><span className="knowledge-badge"><ShieldCheck size={14} /> No private data</span></header><div className="knowledge-content">{error && <div className="knowledge-error" role="alert">{error}</div>}<section className="knowledge-card"><div className="knowledge-section-heading"><div><p className="knowledge-eyebrow">Live backend test</p><h2>Inspect a question</h2></div><Search size={22} /></div><form onSubmit={runTrace} className="knowledge-form"><label htmlFor="knowledge-question">Test question</label><div><input id="knowledge-question" value={question} onChange={(event) => setQuestion(event.target.value)} maxLength={2000} /><button type="submit" disabled={loading || question.trim().length === 0}>{loading ? <LoaderCircle className="spin" size={16} /> : 'Run trace'}</button></div></form>{result && <div className="trace-grid"><div className="trace-answer"><p className="knowledge-eyebrow">Backend answer</p><p>{result.answer}</p>{result.media.map((asset) => <a key={asset.id} className="trace-media-link" href={asset.url} target={asset.mediaType === 'video' ? '_blank' : undefined} rel={asset.mediaType === 'video' ? 'noreferrer' : undefined}>{asset.mediaType === 'pdf' ? <FileText size={15} /> : <Film size={15} />}{asset.title}</a>)}</div><div className="trace-details"><TraceRow label="Request ID" value={result.trace.requestId} /><TraceRow label="Normalized intent" value={result.trace.normalizedIntent} /><TraceRow label="Normalized query" value={result.trace.normalizedQuery} /><TraceRow label="Model called" value={result.trace.modelCalled ? 'Yes' : 'No'} /><TraceRow label="Mode" value={result.trace.mode} />{result.trace.fallbackReason && <TraceRow label="Fallback reason" value={result.trace.fallbackReason} />}<TraceRow label="Source IDs" value={result.trace.sourceIds.join(', ') || 'None'} /><TraceRow label="Selected media IDs" value={result.trace.selectedMediaIds.join(', ') || 'None'} /><TraceRow label="Selection reasons" value={result.trace.mediaSelectionReasons.join(' ')} /></div><div className="trace-context"><p className="knowledge-eyebrow">Exact source text passed to model</p>{result.trace.sourceTextPassedToModel.map((source) => <details key={source.id}><summary>{source.id}</summary><p>{source.text}</p></details>)}</div></div>}</section><section><div className="knowledge-section-heading"><div><p className="knowledge-eyebrow">Approved context</p><h2>Loaded sources</h2></div></div><div className="knowledge-source-grid">{sources.map((source) => <article key={source.id} className="knowledge-card source-card"><p className="knowledge-eyebrow">{source.sourceType}</p><h3>{source.title}</h3><p className="source-meta">{source.id} · Captured {source.captureDate}</p><a href={source.url} className="source-link">Open page section</a><p className="source-text">{source.approvedText}</p><small>Capture method: {source.captureMethod}. This is static content authored from the existing prototype, not a live crawl.</small></article>)}</div></section><section><div className="knowledge-section-heading"><div><p className="knowledge-eyebrow">Server-side catalog</p><h2>Available media</h2></div></div><div className="knowledge-source-grid">{media.map((asset) => <article key={asset.id} className="knowledge-card source-card"><div className="media-catalog-icon">{asset.mediaType === 'pdf' ? <FileText size={18} /> : <Film size={18} />}</div><p className="knowledge-eyebrow">{asset.mediaType} · {asset.availability}</p><h3>{asset.title}</h3><p>{asset.description}</p><p className="source-meta">{asset.material === 'demo' ? 'Demo material' : 'Third-party public material'} · Sources: {asset.sourceIds.join(', ') || 'None'}</p><small>{asset.availabilityNote}</small></article>)}</div></section></div></main>;
}

function TraceRow({ label, value }: { label: string; value: string }) {
  return <div className="trace-row"><span>{label}</span><strong>{value}</strong></div>;
}
