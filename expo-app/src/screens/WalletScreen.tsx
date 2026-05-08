import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '../context/AuthContext';
import { Card } from '../components/ui/Card';
import { colors } from '../theme/colors';

const { width } = Dimensions.get('window');

const MOBILE_MONEY = [
  { id: 'mpesa', name: 'M-Pesa', balance: 450_000, color: '#00a550', icon: 'phone-portrait' },
  { id: 'airtel', name: 'Airtel Money', balance: 120_000, color: '#f00', icon: 'phone-portrait' },
  { id: 'tigo', name: 'Tigo Pesa', balance: 85_000, color: '#0066cc', icon: 'phone-portrait' },
  { id: 'halo', name: 'Halopesa', balance: 0, color: '#ff6600', icon: 'phone-portrait' },
];

const ACTIONS = [
  { icon: 'add-circle-outline', label: 'Weka Pesa', color: colors.greenLight },
  { icon: 'arrow-up-circle-outline', label: 'Tuma', color: colors.blue },
  { icon: 'arrow-down-circle-outline', label: 'Pokea', color: colors.emerald },
  { icon: 'swap-horizontal-outline', label: 'Badilisha', color: colors.purple },
];

export function WalletScreen({ navigation }: any) {
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const [activeCard, setActiveCard] = useState(0);

  const total = MOBILE_MONEY.reduce((s, m) => s + m.balance, 0) + (user?.balance ?? 0);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: insets.bottom + 80 }}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <Text style={styles.headerTitle}>Pochi yangu</Text>
        <TouchableOpacity style={styles.historyBtn} onPress={() => navigation.navigate('TransactionHistory')}>
          <Ionicons name="time-outline" size={22} color={colors.white} />
        </TouchableOpacity>
      </View>

      {/* Main Balance */}
      <LinearGradient colors={['rgba(22,163,74,0.3)', 'rgba(8,13,8,0)']} style={styles.balanceSection}>
        <Text style={styles.totalLabel}>Jumla ya Fedha Zote</Text>
        <Text style={styles.totalAmount}>TZS {total.toLocaleString('sw-TZ')}</Text>
        <View style={styles.actionsRow}>
          {ACTIONS.map((a) => (
            <TouchableOpacity key={a.label} style={styles.action} onPress={() => navigation.navigate('SendMoney')}>
              <View style={[styles.actionIcon, { backgroundColor: `${a.color}20` }]}>
                <Ionicons name={a.icon as any} size={22} color={a.color} />
              </View>
              <Text style={styles.actionLabel}>{a.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </LinearGradient>

      {/* Virtual Card */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Kadi ya Dijitali</Text>
        <LinearGradient
          colors={['#052e16', '#16a34a', '#4ade80']}
          start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
          style={styles.card}
        >
          <View style={styles.cardTop}>
            <Text style={styles.cardAppName}>goPay</Text>
            <Ionicons name="wifi" size={22} color="rgba(255,255,255,0.7)" style={{ transform: [{ rotate: '90deg' }] }} />
          </View>
          <Text style={styles.cardNumber}>•••• •••• •••• 4821</Text>
          <View style={styles.cardBottom}>
            <View>
              <Text style={styles.cardLabel}>MMILIKI</Text>
              <Text style={styles.cardValue}>{user?.name?.toUpperCase() ?? 'JUMA MWANGI'}</Text>
            </View>
            <View>
              <Text style={styles.cardLabel}>INAISHA</Text>
              <Text style={styles.cardValue}>12/28</Text>
            </View>
            <View style={styles.cardNetwork}>
              <View style={[styles.circle, { backgroundColor: '#eb001b' }]} />
              <View style={[styles.circle, { backgroundColor: '#f79e1b', marginLeft: -10 }]} />
            </View>
          </View>
        </LinearGradient>
      </View>

      {/* Mobile Money Wallets */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Pochi za Simu</Text>
        {MOBILE_MONEY.map((m) => (
          <Card key={m.id} style={styles.mmRow}>
            <View style={[styles.mmIcon, { backgroundColor: `${m.color}22` }]}>
              <Ionicons name="phone-portrait" size={20} color={m.color} />
            </View>
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={styles.mmName}>{m.name}</Text>
              <Text style={styles.mmBalance}>TZS {m.balance.toLocaleString('sw-TZ')}</Text>
            </View>
            <TouchableOpacity style={styles.mmBtn}>
              <Text style={styles.mmBtnText}>Hamisha</Text>
            </TouchableOpacity>
          </Card>
        ))}
      </View>

      {/* Multi Currency */}
      <View style={styles.section}>
        <View style={styles.rowBetween}>
          <Text style={styles.sectionTitle}>Sarafu za Kigeni</Text>
          <TouchableOpacity onPress={() => navigation.navigate('MultiCurrency')}>
            <Text style={styles.link}>Tazama zote</Text>
          </TouchableOpacity>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 8 }}>
          {[
            { code: 'USD', name: 'Dola ya Marekani', rate: 2580, flag: '🇺🇸' },
            { code: 'EUR', name: 'Euro', rate: 2780, flag: '🇪🇺' },
            { code: 'GBP', name: 'Pauni', rate: 3240, flag: '🇬🇧' },
            { code: 'KES', name: 'Shilingi ya Kenya', rate: 19.8, flag: '🇰🇪' },
          ].map((c) => (
            <Card key={c.code} style={styles.currencyCard}>
              <Text style={styles.currencyFlag}>{c.flag}</Text>
              <Text style={styles.currencyCode}>{c.code}</Text>
              <Text style={styles.currencyRate}>TZS {c.rate.toLocaleString()}</Text>
            </Card>
          ))}
        </ScrollView>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingBottom: 8 },
  headerTitle: { fontSize: 24, fontWeight: '800', color: colors.white },
  historyBtn: { width: 40, height: 40, justifyContent: 'center', alignItems: 'flex-end' },
  balanceSection: { padding: 20, alignItems: 'center' },
  totalLabel: { fontSize: 13, color: colors.white40, marginBottom: 4 },
  totalAmount: { fontSize: 32, fontWeight: '800', color: colors.white, letterSpacing: -1, marginBottom: 24 },
  actionsRow: { flexDirection: 'row', gap: 28 },
  action: { alignItems: 'center', gap: 6 },
  actionIcon: { width: 52, height: 52, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  actionLabel: { fontSize: 12, color: colors.white70, fontWeight: '600' },
  section: { paddingHorizontal: 16, marginBottom: 20 },
  sectionTitle: { fontSize: 17, fontWeight: '700', color: colors.white, marginBottom: 12 },
  card: { borderRadius: 20, padding: 24, height: 190 },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 },
  cardAppName: { fontSize: 20, fontWeight: '800', color: '#fff' },
  cardNumber: { fontSize: 20, color: 'rgba(255,255,255,0.9)', letterSpacing: 3, marginBottom: 24, fontWeight: '600' },
  cardBottom: { flexDirection: 'row', alignItems: 'flex-end', gap: 24 },
  cardLabel: { fontSize: 10, color: 'rgba(255,255,255,0.6)', marginBottom: 2, letterSpacing: 1 },
  cardValue: { fontSize: 14, color: '#fff', fontWeight: '700' },
  cardNetwork: { flexDirection: 'row', marginLeft: 'auto' },
  circle: { width: 28, height: 28, borderRadius: 14 },
  mmRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  mmIcon: { width: 44, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  mmName: { fontSize: 14, fontWeight: '600', color: colors.white },
  mmBalance: { fontSize: 13, color: colors.white70, marginTop: 2 },
  mmBtn: { backgroundColor: colors.greenDim, borderRadius: 8, paddingHorizontal: 12, paddingVertical: 6, borderWidth: 1, borderColor: 'rgba(74,222,128,0.3)' },
  mmBtnText: { fontSize: 12, color: colors.greenLight, fontWeight: '700' },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  link: { fontSize: 13, color: colors.greenLight, fontWeight: '600' },
  currencyCard: { width: 130, marginRight: 10, alignItems: 'center' },
  currencyFlag: { fontSize: 28, marginBottom: 4 },
  currencyCode: { fontSize: 16, fontWeight: '700', color: colors.white },
  currencyRate: { fontSize: 12, color: colors.white40, marginTop: 2 },
});
