// src/imageData.ts
import { Image } from "../types";

const image1 = '/images/img1.jpg';
const image2 = '/images/img2.jpg';
const image3 = '/images/img3.jpg';
const image4 = '/images/img4.jpg';
const image5 = '/images/img5.jpg';
const image6 = '/images/img6.jpg';
const image7 = '/images/img7.jpg';
const image8 = '/images/img8.jpg';

export const defaultImages: Image[] = [
  { id: 1, url: image1, name: 'Default Image 1', description: 'This is a default image.' },
  { id: 2, url: image2, name: 'Default Image 2', description: 'This is another default image.' },
  { id: 3, url: image3, name: 'Default Image 3', description: 'Yet another default image.' },
  { id: 4, url: image4, name: 'Default Image 4', description: 'A fourth default image.' },
  { id: 5, url: image5, name: 'Default Image 5', description: 'A fifth default image.' },
  { id: 6, url: image6, name: 'Default Image 6', description: 'A sixth default image.' },
  { id: 7, url: image7, name: 'Default Image 7', description: 'A seventh default image.' },
  { id: 8, url: image8, name: 'Default Image 8', description: 'An eighth default image.' },
];
