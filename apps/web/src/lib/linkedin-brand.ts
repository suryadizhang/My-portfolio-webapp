import linkedinBrand from '../data/linkedin-brand.json';

export type LinkedInBrand = typeof linkedinBrand;

export const useLinkedInBrand = () => linkedinBrand;

export const getBrandColors = () => linkedinBrand.brand.colors;

export const getBrandTone = () => linkedinBrand.brand.tone;

export const getProfile = () => linkedinBrand.profile;

export const getContent = () => linkedinBrand.content;

export const getCTA = () => linkedinBrand.cta;

// Utility to apply LinkedIn brand styling
export const linkedinTheme = {
  primary: 'bg-brand hover:bg-brand-700 text-white',
  secondary: 'bg-brand-50 hover:bg-brand-100 text-brand-700 border border-brand-200',
  outline: 'border border-brand hover:bg-brand hover:text-white',
  text: 'text-brand hover:text-brand-700',
  accent: 'bg-brand-50 text-brand-800',
} as const;

export default linkedinBrand;