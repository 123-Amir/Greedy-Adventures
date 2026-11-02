export type MediaType = 'pdf' | 'video';
export type MediaAvailability = 'available' | 'unavailable';

export type MediaAsset = {
  id: string;
  title: string;
  mediaType: MediaType;
  description: string;
  url: string;
  material: 'demo' | 'third-party-public';
  sourceIds: string[];
  availability: MediaAvailability;
  availabilityNote: string;
};

export const mediaCatalog: MediaAsset[] = [
  {
    id: 'demo-brochure-pdf',
    title: 'Greedy Adventures experience brochure',
    mediaType: 'pdf',
    description: 'A short prototype brochure covering the illustrative packages and what is currently confirmed on this page.',
    url: '/brochure/greedy-adventures-demo-brochure.pdf',
    material: 'demo',
    sourceIds: ['greedy-page-packages', 'greedy-page-safety', 'greedy-page-faq'],
    availability: 'available',
    availabilityNote: 'Available as a clearly labelled demo PDF. It is not an official company brochure.',
  },
  {
    id: 'pexels-skydiving-video',
    title: 'Skydiving over ocean views',
    mediaType: 'video',
    description: 'A verified public Pexels stock video link showing a skydiving experience over ocean views.',
    url: 'https://www.pexels.com/video/man-sky-diving-in-hawaii-7997309',
    material: 'third-party-public',
    sourceIds: ['greedy-page-packages'],
    availability: 'available',
    availabilityNote: 'Public third-party stock media. It is not official Greedy Adventures footage.',
  },
  {
    id: 'official-greedy-brochure',
    title: 'Official Greedy Adventures brochure',
    mediaType: 'pdf',
    description: 'An official brochure was not supplied for this prototype.',
    url: '#contact',
    material: 'demo',
    sourceIds: [],
    availability: 'unavailable',
    availabilityNote: 'Unavailable because no official brochure was supplied.',
  },
];

export function getMediaById(id: string): MediaAsset | undefined {
  return mediaCatalog.find((asset) => asset.id === id);
}

export function getAvailableMediaByType(mediaType: MediaType): MediaAsset[] {
  return mediaCatalog.filter((asset) => asset.mediaType === mediaType && asset.availability === 'available');
}

export function validateMediaIds(ids: string[]): MediaAsset[] {
  return ids.map((id) => getMediaById(id)).filter((asset): asset is MediaAsset => asset?.availability === 'available');
}
