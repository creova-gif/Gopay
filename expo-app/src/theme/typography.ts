import { StyleSheet } from 'react-native';
import { colors } from './colors';

export const typography = StyleSheet.create({
  h1: { fontSize: 28, fontWeight: '700', color: colors.white, letterSpacing: -0.5 },
  h2: { fontSize: 22, fontWeight: '700', color: colors.white, letterSpacing: -0.3 },
  h3: { fontSize: 18, fontWeight: '600', color: colors.white },
  h4: { fontSize: 16, fontWeight: '600', color: colors.white },
  body: { fontSize: 14, fontWeight: '400', color: colors.white70 },
  bodyBold: { fontSize: 14, fontWeight: '600', color: colors.white },
  small: { fontSize: 12, fontWeight: '400', color: colors.white40 },
  smallBold: { fontSize: 12, fontWeight: '600', color: colors.white70 },
  caption: { fontSize: 11, fontWeight: '400', color: colors.white40 },
  mono: { fontSize: 14, fontFamily: 'monospace', color: colors.white },
});
