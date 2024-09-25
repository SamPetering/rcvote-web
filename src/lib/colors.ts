import { COLOR } from '@/lib/schemas';
import twColors from 'tailwindcss/colors';
import { DefaultColors } from 'tailwindcss/types/generated/colors';

export const COLORS: Record<COLOR, DefaultColors[COLOR]> = {
  red: twColors['red'],
  orange: twColors['orange'],
  amber: twColors['amber'],
  yellow: twColors['yellow'],
  lime: twColors['lime'],
  green: twColors['green'],
  emerald: twColors['emerald'],
  teal: twColors['teal'],
  cyan: twColors['cyan'],
  sky: twColors['sky'],
  blue: twColors['blue'],
  violet: twColors['violet'],
  purple: twColors['purple'],
  fuchsia: twColors['fuchsia'],
  pink: twColors['pink'],
  rose: twColors['rose'],
};
