import tailwindColors from 'tailwindcss/colors';

export { tailwindColors };

export const getComputedColor = (token: string) => `var(--${token})`;


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

// Parses a hex color into its 0-255 channels. Handles both 6-digit (#RRGGBB)
// and 8-digit (#RRGGBBAA) colors, returning alpha = 255 when not provided.
function parseHexColor(hex: string) {
  const num = colorHexToNumber(hex);
  const hasAlpha = (hex.replace("#", "").length >= 8);

  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255,
    a: hasAlpha ? (num >> 24) & 255 : 255,
  };
}

export function mixColors(a: string, b: string, t: number): string {
  const ac = parseHexColor(a);
  const bc = parseHexColor(b);

  const r = Math.round(ac.r + (bc.r - ac.r) * t);
  const g = Math.round(ac.g + (bc.g - ac.g) * t);
  const blu = Math.round(ac.b + (bc.b - ac.b) * t);
  const alpha = Math.round(ac.a + (bc.a - ac.a) * t);

  const rgb = (r << 16) | (g << 8) | blu;

  // Include the alpha channel only when either input carries transparency.
  if (ac.a < 255 || bc.a < 255) {
    const toHexByte = (n: number) => Math.max(0, Math.min(255, n)).toString(16).padStart(2, '0');
    return `#${toHexByte(alpha)}${toHexByte(r)}${toHexByte(g)}${toHexByte(blu)}`;
  }

  return numberToColorHex(rgb);
}