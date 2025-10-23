import tailwindColors from 'tailwindcss/colors';

export { tailwindColors };

export function getComputedColor(colorName: string): string {
  const root = getComputedStyle(document.documentElement);
  const rgb = root.getPropertyValue(`--color-${colorName}`).trim();
  
  return rgb;
}

export const mutedColors = {
  cream: '#FBFAE6',
  offWhite: '#F9F5EC',
  lavender: '#D7E8B9',
  lightGreen: '#BADCBD',
  green: '#96D294',
  turquoise: '#85C1BB',
  teal: '#6B9797',
  skyBlue: '#85B0C1',
  blue: '#83A1CD',
  navyBlue: '#4B456B',
  darkBlue: '#3E436F',
  indigo: '#4C367E',
  purple: '#9673A5',
  magenta: '#D57ED5',
  violet: '#EBD1F3',
  pink: '#E4ADC4',
  rose: '#B86273',
  red: '#CB4C4E',
  orange: '#EB9C5C',
  coral: '#EFA282',
  fawn: '#DBB18F',
  honeyYellow: '#beaa33',
  gold: '#D2B450',
  yellow: '#E0D268',
  lime: '#D1C87C',
  bronze: '#CEA175',
  honeyBrown: '#b37039',
  brown: '#997864',
  gray: '#A9A9A9',
  silver: '#CBCBCB',
};

export const mutedColorsList = Object.values(mutedColors);

export function numberToColorHex(num: number) {
  const hex = num.toString(16);
  return `#${hex.padStart(6, '0').slice(0, 6)}`;
}

export function colorHexToNumber(hex: string) {
  return parseInt(hex.replace("#", ""), 16);
}