import React from 'react';
import {
  TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle, ActivityIndicator,
} from 'react-native';
import { colors } from '../../theme/colors';

interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export function Button({
  label, onPress, variant = 'primary', size = 'md',
  loading, disabled, style, textStyle,
}: ButtonProps) {
  return (
    <TouchableOpacity
      style={[
        styles.base,
        styles[variant],
        styles[`size_${size}`],
        (disabled || loading) && styles.disabled,
        style,
      ]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.75}
    >
      {loading
        ? <ActivityIndicator color={variant === 'primary' ? '#000' : colors.white} size="small" />
        : <Text style={[styles.text, styles[`text_${variant}`], styles[`textSize_${size}`], textStyle]}>{label}</Text>
      }
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: { borderRadius: 12, alignItems: 'center', justifyContent: 'center', flexDirection: 'row' },
  primary: { backgroundColor: colors.greenLight },
  secondary: { backgroundColor: colors.bgCardHover, borderWidth: 1, borderColor: colors.borderBright },
  ghost: { backgroundColor: 'transparent' },
  danger: { backgroundColor: 'rgba(248,113,113,0.15)', borderWidth: 1, borderColor: 'rgba(248,113,113,0.3)' },
  disabled: { opacity: 0.45 },
  size_sm: { paddingVertical: 8, paddingHorizontal: 16 },
  size_md: { paddingVertical: 14, paddingHorizontal: 20 },
  size_lg: { paddingVertical: 18, paddingHorizontal: 24 },
  text: { fontWeight: '700', letterSpacing: 0.2 },
  text_primary: { color: '#000' },
  text_secondary: { color: colors.white },
  text_ghost: { color: colors.greenLight },
  text_danger: { color: colors.red },
  textSize_sm: { fontSize: 13 },
  textSize_md: { fontSize: 15 },
  textSize_lg: { fontSize: 16 },
});
