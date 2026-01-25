export const TEMPLATE_IMAGES = [
  '/images/img1.jpg',
  '/images/img2.jpg',
  '/images/img3.jpg',
  '/images/img4.jpg',
  '/images/img5.jpg',
  '/images/img6.jpg',
  '/images/img7.jpg',
  '/images/img8.jpg',
] as const

export const TEMPLATES_SCROLL = {
  startOffset: 0.65,
  endOffset: 0.85,
} as const

export const TEMPLATES_SLIDE = {
  imageScale: [0.3, 0.225] as [number, number],  // 4:3 비율
  gap: 0.2,
  speed: 0.7,
} as const
