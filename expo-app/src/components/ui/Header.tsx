import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, StatusBar } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';

interface HeaderProps {
  title: string;
  onBack?: () => void;
  rightElement?: React.ReactNode;
  subtitle?: string;
}

export function Header({ title, onBack, rightElement, subtitle }: HeaderProps) {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.container, { paddingTop: insets.top + 8 }]}>
      <StatusBar barStyle="light-content" backgroundColor={colors.bg} />
      <View style={styles.row}>
        {onBack ? (
          <TouchableOpacity style={styles.backBtn} onPress={onBack} activeOpacity={0.7}>
            <Ionicons name="arrow-back" size={22} color={colors.white} />
          </TouchableOpacity>
        ) : <View style={styles.backBtn} />}
        <View style={styles.titleWrap}>
          <Text style={styles.title}>{title}</Text>
          {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
        </View>
        <View style={styles.right}>{rightElement}</View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(8,13,8,0.97)',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingBottom: 12,
    paddingHorizontal: 16,
  },
  row: { flexDirection: 'row', alignItems: 'center' },
  backBtn: { width: 40, height: 40, justifyContent: 'center' },
  titleWrap: { flex: 1, alignItems: 'center' },
  title: { fontSize: 17, fontWeight: '700', color: colors.white },
  subtitle: { fontSize: 12, color: colors.white40, marginTop: 1 },
  right: { width: 40, alignItems: 'flex-end' },
});
