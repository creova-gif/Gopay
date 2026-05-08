import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { colors } from '../../theme/colors';

interface PinPadProps {
  value: string;
  onChange: (val: string) => void;
  maxLength?: number;
}

const KEYS = ['1','2','3','4','5','6','7','8','9','','0','⌫'];

export function PinPad({ value, onChange, maxLength = 4 }: PinPadProps) {
  const handlePress = (key: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (key === '⌫') {
      onChange(value.slice(0, -1));
    } else if (key && value.length < maxLength) {
      onChange(value + key);
    }
  };

  return (
    <View>
      <View style={styles.dots}>
        {Array.from({ length: maxLength }).map((_, i) => (
          <View key={i} style={[styles.dot, i < value.length && styles.dotFilled]} />
        ))}
      </View>
      <View style={styles.grid}>
        {KEYS.map((key, i) => (
          <TouchableOpacity
            key={i}
            style={[styles.key, !key && styles.keyEmpty]}
            onPress={() => handlePress(key)}
            disabled={!key}
            activeOpacity={0.6}
          >
            {key === '⌫'
              ? <Ionicons name="backspace-outline" size={22} color={colors.white} />
              : <Text style={styles.keyText}>{key}</Text>
            }
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  dots: { flexDirection: 'row', justifyContent: 'center', gap: 16, marginBottom: 32 },
  dot: { width: 14, height: 14, borderRadius: 7, borderWidth: 2, borderColor: colors.white40 },
  dotFilled: { backgroundColor: colors.greenLight, borderColor: colors.greenLight },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, justifyContent: 'center' },
  key: {
    width: 80, height: 80, borderRadius: 40,
    backgroundColor: colors.bgCard, borderWidth: 1, borderColor: colors.border,
    alignItems: 'center', justifyContent: 'center',
  },
  keyEmpty: { backgroundColor: 'transparent', borderColor: 'transparent' },
  keyText: { fontSize: 24, fontWeight: '600', color: colors.white },
});
