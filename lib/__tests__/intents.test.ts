import { describe, expect, it } from 'vitest';
import { detectIntent, normalizeIntentQuery } from '../intents';

describe('normalizeIntentQuery', () => {
  it('lowercases and strips punctuation', () => {
    expect(normalizeIntentQuery('Send me a BROCHURE!!!')).toBe('send me a brochure');
  });

  it('collapses extra spaces', () => {
    expect(normalizeIntentQuery('  hello   world  ')).toBe('hello world');
  });
});

describe('detectIntent — text-only / package info', () => {
  it('detects package info with no media', () => {
    const result = detectIntent('What is included in the package?');
    expect(result.intent).toBe('package_info');
    expect(result.mediaIds).toEqual([]);
  });

  it('detects first leap package question', () => {
    const result = detectIntent('Tell me about the First Leap');
    expect(result.intent).toBe('package_info');
    expect(result.mediaIds).toEqual([]);
  });

  it('detects full send package question', () => {
    const result = detectIntent('What does the Full Send include?');
    expect(result.intent).toBe('package_info');
    expect(result.mediaIds).toEqual([]);
  });
});

describe('detectIntent — brochure', () => {
  it('selects demo PDF for brochure request', () => {
    const result = detectIntent('Can you send me a brochure?');
    expect(result.intent).toBe('brochure');
    expect(result.mediaIds).toEqual(['demo-brochure-pdf']);
  });

  it('selects demo PDF for PDF request', () => {
    const result = detectIntent('I would like the PDF document');
    expect(result.intent).toBe('brochure');
    expect(result.mediaIds).toEqual(['demo-brochure-pdf']);
  });

  it('selects unavailable official brochure when "official" is requested', () => {
    const result = detectIntent('Can you send me the official brochure?');
    expect(result.intent).toBe('brochure');
    expect(result.mediaIds).toEqual(['official-greedy-brochure']);
  });
});

describe('detectIntent — video', () => {
  it('selects video for video request', () => {
    const result = detectIntent('Can I see a video of the experience?');
    expect(result.intent).toBe('video');
    expect(result.mediaIds).toEqual(['pexels-skydiving-video']);
  });

  it('selects video for watch request', () => {
    const result = detectIntent('I want to watch the footage');
    expect(result.intent).toBe('video');
    expect(result.mediaIds).toEqual(['pexels-skydiving-video']);
  });
});

describe('detectIntent — combined', () => {
  it('selects both brochure and video', () => {
    const result = detectIntent('Send me the brochure and a video');
    expect(result.intent).toBe('brochure_and_video');
    expect(result.mediaIds).toEqual(['demo-brochure-pdf', 'pexels-skydiving-video']);
  });

  it('selects both for PDF and video', () => {
    const result = detectIntent('Can I get the PDF and watch a video?');
    expect(result.intent).toBe('brochure_and_video');
    expect(result.mediaIds).toEqual(['demo-brochure-pdf', 'pexels-skydiving-video']);
  });
});

describe('detectIntent — unknown', () => {
  it('returns unknown for unrelated questions', () => {
    const result = detectIntent('What is the capital of France?');
    expect(result.intent).toBe('unknown');
    expect(result.mediaIds).toEqual([]);
  });

  it('returns unknown for empty string', () => {
    const result = detectIntent('');
    expect(result.intent).toBe('unknown');
  });
});
