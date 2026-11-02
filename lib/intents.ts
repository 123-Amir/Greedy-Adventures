export type UserIntent = 'package_info' | 'brochure' | 'video' | 'brochure_and_video' | 'unknown';

export type IntentResult = {
  intent: UserIntent;
  normalizedQuery: string;
  mediaIds: string[];
  selectionReasons: string[];
};

export function normalizeIntentQuery(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim();
}

export function detectIntent(value: string): IntentResult {
  const normalizedQuery = normalizeIntentQuery(value);
  const asksForBrochure = /\b(brochure|pdf|download|document)\b/.test(normalizedQuery);
  const asksForVideo = /\b(video|watch|film|footage|clip)\b/.test(normalizedQuery);
  const asksAboutPackages = /\b(package|include|inclusion|first leap|full send|keepsake)\b/.test(normalizedQuery);

  if (asksForBrochure && asksForVideo) {
    return { intent: 'brochure_and_video', normalizedQuery, mediaIds: ['demo-brochure-pdf', 'pexels-skydiving-video'], selectionReasons: ['The request explicitly asks for both a brochure and a video.'] };
  }
  if (asksForBrochure) {
    const officialRequest = /\bofficial\b/.test(normalizedQuery);
    return { intent: 'brochure', normalizedQuery, mediaIds: [officialRequest ? 'official-greedy-brochure' : 'demo-brochure-pdf'], selectionReasons: [officialRequest ? 'The request asks for an official brochure, which is not in the catalog.' : 'The request asks for a brochure, so the available demo PDF is selected.'] };
  }
  if (asksForVideo) {
    return { intent: 'video', normalizedQuery, mediaIds: ['pexels-skydiving-video'], selectionReasons: ['The request asks to see or watch a video, so the verified public stock link is selected.'] };
  }
  if (asksAboutPackages) {
    return { intent: 'package_info', normalizedQuery, mediaIds: [], selectionReasons: ['The request asks about package content, so no media is selected.'] };
  }
  return { intent: 'unknown', normalizedQuery, mediaIds: [], selectionReasons: ['No supported package or media intent was detected.'] };
}
