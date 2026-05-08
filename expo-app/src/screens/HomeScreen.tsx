import React, { useState } from 'react';
import {
  View, Text, ScrollView, StyleSheet, TouchableOpacity,
  RefreshControl, Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '../context/AuthContext';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { colors } from '../theme/colors';

const { width } = Dimensions.get('window');

const QUICK_ACTIONS = [
  { icon: 'arrow-up-circle', label: 'Tuma', color: colors.blue, screen: 'SendMoney' },
  { icon: 'arrow-down-circle', label: 'Pokea', color: colors.green, screen: null },
  { icon: 'qr-code', label: 'Lipa QR', color: colors.purple, screen: 'QRScanner' },
  { icon: 'receipt', label: 'Bili', color: colors.orange, screen: 'BillPayments' },
];

const SERVICES = [
  { icon: 'airplane', label: 'Ndege', color: colors.blue, screen: 'FlightSearch' },
  { icon: 'boat', label: 'Feri', color: colors.cyan, screen: 'FerryBooking' },
  { icon: 'bus', label: 'Basi', color: colors.green, screen: 'BusBooking' },
  { icon: 'train', label: 'SGR', color: colors.red, screen: 'SGRBooking' },
  { icon: 'leaf', label: 'Mbuga', color: colors.emerald, screen: 'NationalParks' },
  { icon: 'bed', label: 'Hoteli', color: colors.purple, screen: 'HotelSearch' },
  { icon: 'cash', label: 'Mikopo', color: colors.yellow, screen: 'MicroLoans' },
  { icon: 'people', label: 'Vikundi', color: colors.orange, screen: 'GroupPools' },
  { icon: 'globe', label: 'Sarafu', color: colors.cyan, screen: 'MultiCurrency' },
  { icon: 'document-text', label: 'Serikali', color: colors.blue, screen: 'GovernmentServices' },
];

const TRANSACTIONS = [
  { id: '1', name: 'M-Pesa', desc: 'Kutoka Amina Hassan', amount: '+50,000', type: 'credit', time: '2 saa zilizopita' },
  { id: '2', name: 'TANESCO', desc: 'Bili ya umeme - Jan', amount: '-35,000', type: 'debit', time: 'Jana' },
  { id: '3', name: 'Ndege - ZNZ', desc: 'Precision Air PW101', amount: '-280,000', type: 'debit', time: 'Juzi' },
  { id: '4', name: 'Tuma Pesa', desc: 'Kwa John Mtoto', amount: '-100,000', type: 'debit', time: '3 Mei' },
  { id: '5', name: 'GOrewards', desc: 'Pointi 240 zimeongezwa', amount: '+240 pts', type: 'reward', time: '2 Mei' },
];

export function HomeScreen({ navigation }: any) {
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const [hidden, setHidden] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1200);
  };

  return (
    <ScrollView
      style={[styles.container]}
      contentContainerStyle={{ paddingBottom: insets.bottom + 80 }}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.greenLight} />}
      showsVerticalScrollIndicator={false}
    >
      {/* Top Bar */}
      <View style={[styles.topBar, { paddingTop: insets.top + 8 }]}>
        <View>
          <Text style={styles.greeting}>Habari, {user?.name?.split(' ')[0]} 👋</Text>
          <Text style={styles.date}>{new Date().toLocaleDateString('sw-TZ', { weekday: 'long', day: 'numeric', month: 'long' })}</Text>
        </View>
        <View style={styles.topRight}>
          <TouchableOpacity style={styles.iconBtn} onPress={() => navigation.navigate('Notifications')}>
            <Ionicons name="notifications-outline" size={22} color={colors.white} />
            <View style={styles.notifDot} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.avatar} onPress={() => navigation.navigate('Profile')}>
            <Text style={styles.avatarText}>{user?.name?.[0] ?? 'G'}</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Balance Card */}
      <LinearGradient colors={['rgba(22,163,74,0.25)', 'rgba(8,13,8,0)']} style={styles.balanceGrad}>
        <Card style={styles.balanceCard}>
          <View style={styles.balanceHeader}>
            <View>
              <Text style={styles.balanceLabel}>Salio la Jumla</Text>
              <View style={styles.balanceRow}>
                <Text style={styles.balanceCurrency}>TZS</Text>
                <Text style={styles.balanceAmount}>
                  {hidden ? '••••••' : (user?.balance ?? 0).toLocaleString('sw-TZ')}
                </Text>
                <TouchableOpacity onPress={() => setHidden(!hidden)}>
                  <Ionicons name={hidden ? 'eye-off-outline' : 'eye-outline'} size={18} color={colors.white40} />
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.rewardsBadge}>
              <Ionicons name="star" size={14} color={colors.yellow} />
              <Text style={styles.rewardsText}>{(user?.loyaltyPoints ?? 0).toLocaleString()} pts</Text>
            </View>
          </View>

          {/* Quick Actions */}
          <View style={styles.quickActions}>
            {QUICK_ACTIONS.map((a) => (
              <TouchableOpacity
                key={a.label}
                style={styles.quickAction}
                onPress={() => a.screen && navigation.navigate(a.screen)}
                activeOpacity={0.75}
              >
                <View style={[styles.quickActionIcon, { backgroundColor: `${a.color}22` }]}>
                  <Ionicons name={a.icon as any} size={22} color={a.color} />
                </View>
                <Text style={styles.quickActionLabel}>{a.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </Card>
      </LinearGradient>

      {/* Promo Banner */}
      <LinearGradient colors={['rgba(22,163,74,0.3)', 'rgba(74,222,128,0.1)']} style={styles.promo} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
        <View style={styles.promoContent}>
          <Ionicons name="gift" size={28} color={colors.greenLight} />
          <View style={{ flex: 1 }}>
            <Text style={styles.promoTitle}>Tuma pesa bure leo!</Text>
            <Text style={styles.promoSub}>Hakuna ada ya uhamisho kwa M-Pesa & Airtel</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={colors.white40} />
        </View>
      </LinearGradient>

      {/* Services Grid */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Huduma Zote</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Services')}>
            <Text style={styles.sectionLink}>Tazama zote</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.servicesGrid}>
          {SERVICES.map((s) => (
            <TouchableOpacity
              key={s.label}
              style={styles.serviceItem}
              onPress={() => s.screen && navigation.navigate(s.screen)}
              activeOpacity={0.75}
            >
              <View style={[styles.serviceIcon, { backgroundColor: `${s.color}18` }]}>
                <Ionicons name={s.icon as any} size={22} color={s.color} />
              </View>
              <Text style={styles.serviceLabel}>{s.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Recent Transactions */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Miamala ya Hivi Karibuni</Text>
          <TouchableOpacity onPress={() => navigation.navigate('TransactionHistory')}>
            <Text style={styles.sectionLink}>Tazama zote</Text>
          </TouchableOpacity>
        </View>
        <Card style={styles.txCard}>
          {TRANSACTIONS.map((tx, i) => (
            <View key={tx.id}>
              <View style={styles.txRow}>
                <View style={[styles.txIcon, {
                  backgroundColor: tx.type === 'credit' ? 'rgba(74,222,128,0.15)' :
                    tx.type === 'reward' ? 'rgba(251,191,36,0.15)' : colors.bgCardHover
                }]}>
                  <Ionicons
                    name={tx.type === 'credit' ? 'arrow-down' : tx.type === 'reward' ? 'star' : 'arrow-up'}
                    size={16}
                    color={tx.type === 'credit' ? colors.greenLight : tx.type === 'reward' ? colors.yellow : colors.white40}
                  />
                </View>
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text style={styles.txName}>{tx.name}</Text>
                  <Text style={styles.txDesc}>{tx.desc}</Text>
                </View>
                <View style={{ alignItems: 'flex-end' }}>
                  <Text style={[styles.txAmount, { color: tx.type === 'credit' ? colors.greenLight : tx.type === 'reward' ? colors.yellow : colors.white }]}>
                    {tx.amount}
                  </Text>
                  <Text style={styles.txTime}>{tx.time}</Text>
                </View>
              </View>
              {i < TRANSACTIONS.length - 1 && <View style={styles.divider} />}
            </View>
          ))}
        </Card>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  topBar: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 20, paddingBottom: 8,
  },
  greeting: { fontSize: 20, fontWeight: '700', color: colors.white },
  date: { fontSize: 12, color: colors.white40, marginTop: 2 },
  topRight: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  iconBtn: { position: 'relative' },
  notifDot: {
    position: 'absolute', top: -2, right: -2,
    width: 8, height: 8, borderRadius: 4, backgroundColor: colors.red,
  },
  avatar: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: 'rgba(22,163,74,0.3)', alignItems: 'center', justifyContent: 'center',
    borderWidth: 2, borderColor: 'rgba(74,222,128,0.4)',
  },
  avatarText: { fontSize: 15, fontWeight: '700', color: colors.greenLight },
  balanceGrad: { margin: 16, borderRadius: 20 },
  balanceCard: { borderRadius: 20 },
  balanceHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 },
  balanceLabel: { fontSize: 13, color: colors.white40, marginBottom: 4 },
  balanceRow: { flexDirection: 'row', alignItems: 'flex-end', gap: 6 },
  balanceCurrency: { fontSize: 14, color: colors.white40, marginBottom: 5, fontWeight: '600' },
  balanceAmount: { fontSize: 34, fontWeight: '800', color: colors.white, letterSpacing: -1 },
  rewardsBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: 'rgba(251,191,36,0.15)', borderRadius: 8,
    paddingHorizontal: 10, paddingVertical: 6,
    borderWidth: 1, borderColor: 'rgba(251,191,36,0.25)',
  },
  rewardsText: { fontSize: 12, fontWeight: '700', color: colors.yellow },
  quickActions: { flexDirection: 'row', justifyContent: 'space-between' },
  quickAction: { alignItems: 'center', gap: 6 },
  quickActionIcon: { width: 52, height: 52, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  quickActionLabel: { fontSize: 12, color: colors.white70, fontWeight: '600' },
  promo: {
    marginHorizontal: 16, marginBottom: 8, borderRadius: 14,
    borderWidth: 1, borderColor: 'rgba(74,222,128,0.2)',
  },
  promoContent: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14 },
  promoTitle: { fontSize: 14, fontWeight: '700', color: colors.white },
  promoSub: { fontSize: 12, color: colors.white70, marginTop: 2 },
  section: { paddingHorizontal: 16, marginTop: 8 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  sectionTitle: { fontSize: 17, fontWeight: '700', color: colors.white },
  sectionLink: { fontSize: 13, color: colors.greenLight, fontWeight: '600' },
  servicesGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  serviceItem: { width: (width - 32 - 40) / 5, alignItems: 'center', gap: 6 },
  serviceIcon: { width: 52, height: 52, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  serviceLabel: { fontSize: 10, color: colors.white70, fontWeight: '600', textAlign: 'center' },
  txCard: { padding: 0 },
  txRow: { flexDirection: 'row', alignItems: 'center', padding: 14 },
  txIcon: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  txName: { fontSize: 14, fontWeight: '600', color: colors.white },
  txDesc: { fontSize: 12, color: colors.white40, marginTop: 1 },
  txAmount: { fontSize: 14, fontWeight: '700' },
  txTime: { fontSize: 11, color: colors.white40, marginTop: 2 },
  divider: { height: 1, backgroundColor: colors.border, marginLeft: 66 },
});
