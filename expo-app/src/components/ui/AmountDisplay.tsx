import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';

interface AmountDisplayProps {
  amount: number;
  currency?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function AmountDisplay({ amount, currency = 'TZS', size = 'lg' }: AmountDisplayProps) {
  const [hidden, setHidden] = useState(false);
  const formatted = amount.toLocaleString('sw-TZ');
  const fontSize = size === 'lg' ? 36 : size === 'md' ? 26 : 18;

  return (
    <View style={styles.row}>
      <Text style={[styles.currency, { fontSize: fontSize * 0.5 }]}>{currency}</Text>
      <Text style={[styles.amount, { fontSize }]}>
        {hidden ? '••••••' : formatted}
      </Text>
      <TouchableOpacity onPress={() => setHidden(!hidden)} style={styles.eyeBtn}>
        <Ionicons name={hidden ? 'eye-off-outline' : 'eye-outline'} size={18} color={colors.white40} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'flex-end', gap: 4 },
  currency: { color: colors.white40, marginBottom: 4, fontWeight: '600' },
  amount: { color: colors.white, fontWeight: '700', letterSpacing: -1 },
  eyeBtn: { marginBottom: 4, marginLeft: 6 },
});
