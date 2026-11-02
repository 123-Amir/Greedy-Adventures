import { describe, expect, it } from 'vitest';
import { getMediaById, getAvailableMediaByType, validateMediaIds, mediaCatalog } from '../media';

describe('mediaCatalog', () => {
  it('contains exactly 3 entries', () => {
    expect(mediaCatalog).toHaveLength(3);
  });

  it('has stable IDs', () => {
    const ids = mediaCatalog.map((m) => m.id);
    expect(ids).toContain('demo-brochure-pdf');
    expect(ids).toContain('pexels-skydiving-video');
    expect(ids).toContain('official-greedy-brochure');
  });

  it('all entries have required fields', () => {
    for (const asset of mediaCatalog) {
      expect(asset.title).toBeTruthy();
      expect(asset.description).toBeTruthy();
      expect(asset.url).toBeTruthy();
      expect(['demo', 'third-party-public']).toContain(asset.material);
      expect(['available', 'unavailable']).toContain(asset.availability);
    }
  });
});

describe('getMediaById', () => {
  it('returns the matching asset', () => {
    const asset = getMediaById('demo-brochure-pdf');
    expect(asset?.title).toBe('Greedy Adventures experience brochure');
  });

  it('returns undefined for unknown ID', () => {
    expect(getMediaById('nonexistent')).toBeUndefined();
  });
});

describe('getAvailableMediaByType', () => {
  it('returns only available PDFs', () => {
    const pdfs = getAvailableMediaByType('pdf');
    expect(pdfs).toHaveLength(1);
    expect(pdfs[0].id).toBe('demo-brochure-pdf');
  });

  it('returns only available videos', () => {
    const videos = getAvailableMediaByType('video');
    expect(videos).toHaveLength(1);
    expect(videos[0].id).toBe('pexels-skydiving-video');
  });
});

describe('validateMediaIds', () => {
  it('returns available assets for valid IDs', () => {
    const result = validateMediaIds(['demo-brochure-pdf', 'pexels-skydiving-video']);
    expect(result).toHaveLength(2);
    expect(result.map((m) => m.id).sort()).toEqual(['demo-brochure-pdf', 'pexels-skydiving-video']);
  });

  it('filters out unavailable assets', () => {
    const result = validateMediaIds(['official-greedy-brochure']);
    expect(result).toEqual([]);
  });

  it('filters out unknown IDs', () => {
    const result = validateMediaIds(['fake-id-123']);
    expect(result).toEqual([]);
  });

  it('filters out arbitrary model-generated URLs', () => {
    const result = validateMediaIds(['https://evil.com/malware.pdf']);
    expect(result).toEqual([]);
  });

  it('returns empty for empty input', () => {
    expect(validateMediaIds([])).toEqual([]);
  });
});
