export const PROJECT_IMAGES = [
  '/images/img1.jpg',
  '/images/img2.jpg',
  '/images/img3.jpg',
  '/images/img4.jpg',
  '/images/img5.jpg',
  '/images/img6.jpg',
  '/images/img7.jpg',
  '/images/img8.jpg',
] as const

export const PROJECTS_SCROLL = {
  startOffset: 0.35,
  fullOffset: 0.42,
  rotateEndOffset: 0.52,
  expandEndOffset: 0.62,
} as const

export const PROJECTS_ORBIT = {
  radius: 0.18,
  speed: 0.08,
  imageScale: [0.24, 0.12] as [number, number],
} as const
