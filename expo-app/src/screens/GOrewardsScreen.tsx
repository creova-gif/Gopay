import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '../context/AuthContext';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { colors } from '../theme/colors';

const { width } = Dimensions.get('window');

const TIERS = [
  { name: 'Bronze', min: 0, max: 1000, color: '#cd7f32', icon: '🥉' },
  { name: 'Silver', min: 1000, max: 5000, color: '#c0c0c0', icon: '🥈' },
  { name: 'Gold', min: 5000, max: 15000, color: colors.yellow, icon: '🥇' },
  { name: 'Platinum', min: 15000, max: 50000, color: colors.cyan, icon: '💎' },
  { name: 'Diamond', min: 50000, max: 999999, color: colors.purple, icon: '👑' },
];

const REWARDS = [
  { id: '1', title: 'Airtime ya Bure', desc: 'TZS 5,000 ya airtime Vodacom', points: 500, icon: 'phone-portrait', color: colors.green },
  { id: '2', title: 'Tiketi ya Basi', desc: 'Dar - Arusha kwenda', points: 1200, icon: 'bus', color: colors.blue },
  { id: '3', title: 'Kupunguzo kwa Chakula', desc: '20% punguzo GoFood', points: 300, icon: 'fast-food', color: colors.orange },
  { id: '4', title: 'Tiketi ya Mbuga', desc: 'Serengeti siku moja', points: 5000, icon: 'leaf', color: colors.emerald },
  { id: '5', title: 'Cashback TZS 10,000', desc: 'Kurudi kwenye akaunti', points: 1000, icon: 'cash', color: colors.yellow },
  { id: '6', title: 'Bima ya Safari', desc: 'Bima ya siku 7', points: 2500, icon: 'shield-checkmark', color: colors.purple },
];

const HISTORY = [
  { label: 'Ulilipa bili - TANESCO', pts: '+35', date: 'Leo', type: 'earn' },
  { label: 'Ulituma pesa M-Pesa', pts: '+50', date: 'Jana', type: 'earn' },
  { label: 'Ulibadilisha kwa airtime', pts: '-500', date: '3 Mei', type: 'redeem' },
  { label: 'Ununuzi wa ndege', pts: '+280', date: '1 Mei', type: 'earn' },
];

export function GOrewardsScreen({ navigation }: any) {
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const [tab, setTab] = useState<'overview' | 'redeem' | 'history'>('overview');
  const points = user?.loyaltyPoints ?? 3840;
  const tier = TIERS.find(t => points >= t.min && points < t.max) ?? TIERS[1];
  const nextTier = TIERS[TIERS.indexOf(tier) + 1];
  const progress = nextTier ? ((points - tier.min) / (nextTier.min - tier.min)) * 100 : 100;

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={22} color={colors.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>GOrewards</Text>
        <View style={{ width: 22 }} />
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: insets.bottom + 20 }} showsVerticalScrollIndicator={false}>
        {/* Membership Card */}
        <LinearGradient
          colors={tier.name === 'Gold' ? ['#78350f', '#d97706', '#fbbf24'] :
                  tier.name === 'Silver' ? ['#1e293b', '#475569', '#94a3b8'] :
                  ['#1c1917', '#57534e', '#a8a29e']}
          start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
          style={styles.memberCard}
        >
          <View style={styles.cardTop}>
            <View>
              <Text style={styles.cardTier}>{tier.icon} {tier.name} Member</Text>
              <Text style={styles.cardName}>{user?.name}</Text>
            </View>
            <Text style={styles.cardPoints}>{points.toLocaleString()}</Text>
          </View>
          <Text style={styles.cardPointsLabel}>Pointi za GOrewards</Text>
          {nextTier && (
            <View style={{ marginTop: 16 }}>
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: `${progress}%`, backgroundColor: tier.color }]} />
              </View>
              <Text style={styles.progressText}>{(nextTier.min - points).toLocaleString()} pointi hadi {nextTier.name}</Text>
            </View>
          )}
        </LinearGradient>

        {/* Tabs */}
        <View style={styles.tabs}>
          {(['overview', 'redeem', 'history'] as const).map((t) => (
            <TouchableOpacity key={t} style={[styles.tab, tab === t && styles.tabActive]} onPress={() => setTab(t)}>
              <Text style={[styles.tabText, tab === t && styles.tabTextActive]}>
                {t === 'overview' ? 'Muhtasari' : t === 'redeem' ? 'Badilisha' : 'Historia'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={{ paddingHorizontal: 16 }}>
          {tab === 'overview' && (
            <View style={{ gap: 12 }}>
              {/* Stats */}
              <View style={styles.statsRow}>
                <Card style={[styles.statCard, { flex: 1 }]}>
                  <Ionicons name="trending-up" size={20} color={colors.green} />
                  <Text style={styles.statNum}>{points.toLocaleString()}</Text>
                  <Text style={styles.statLabel}>Pointi Zote</Text>
                </Card>
                <Card style={[styles.statCard, { flex: 1 }]}>
                  <Ionicons name="gift" size={20} color={colors.yellow} />
                  <Text style={styles.statNum}>2,400</Text>
                  <Text style={styles.statLabel}>Zilizotumika</Text>
                </Card>
                <Card style={[styles.statCard, { flex: 1 }]}>
                  <Ionicons name="calendar" size={20} color={colors.blue} />
                  <Text style={styles.statNum}>Dec</Text>
                  <Text style={styles.statLabel}>Zinaisha</Text>
                </Card>
              </View>

              {/* Tier roadmap */}
              <Text style={styles.sectionTitle}>Ngazi za Uanachama</Text>
              <Card>
                {TIERS.map((t, i) => (
                  <View key={t.name} style={[styles.tierRow, i < TIERS.length - 1 && { borderBottomWidth: 1, borderBottomColor: colors.border }]}>
                    <Text style={styles.tierIcon}>{t.icon}</Text>
                    <View style={{ flex: 1 }}>
                      <Text style={[styles.tierName, { color: t.name === tier.name ? t.color : colors.white }]}>{t.name}</Text>
                      <Text style={styles.tierRange}>{t.min.toLocaleString()} – {t.max === 999999 ? '∞' : t.max.toLocaleString()} pointi</Text>
                    </View>
                    {t.name === tier.name && <Badge label="Wewe" variant="green" />}
                  </View>
                ))}
              </Card>

              {/* How to earn */}
              <Text style={styles.sectionTitle}>Jinsi ya Kupata Pointi</Text>
              <Card style={{ gap: 10 }}>
                {[
                  { action: 'Tuma pesa', pts: '1 pt / TZS 1,000', icon: 'arrow-up' },
                  { action: 'Lipa bili', pts: '5 pts / bili', icon: 'receipt' },
                  { action: 'Nunua tiketi', pts: '20 pts / tiketi', icon: 'airplane' },
                  { action: 'Mtu mpya', pts: '200 pts / rufaa', icon: 'people' },
                ].map((e) => (
                  <View key={e.action} style={styles.earnRow}>
                    <View style={styles.earnIcon}>
                      <Ionicons name={e.action as any} size={16} color={colors.greenLight} />
                    </View>
                    <Text style={styles.earnAction}>{e.action}</Text>
                    <Badge label={e.pts} variant="green" />
                  </View>
                ))}
              </Card>
            </View>
          )}

          {tab === 'redeem' && (
            <View style={{ gap: 12 }}>
              <Text style={styles.sectionTitle}>Badilisha Pointi Zako</Text>
              {REWARDS.map((r) => (
                <Card key={r.id} style={styles.rewardRow}>
                  <View style={[styles.rewardIcon, { backgroundColor: `${r.color}20` }]}>
                    <Ionicons name={r.icon as any} size={22} color={r.color} />
                  </View>
                  <View style={{ flex: 1, marginLeft: 12 }}>
                    <Text style={styles.rewardTitle}>{r.title}</Text>
                    <Text style={styles.rewardDesc}>{r.desc}</Text>
                  </View>
                  <TouchableOpacity style={[styles.redeemBtn, { opacity: points >= r.points ? 1 : 0.4 }]} disabled={points < r.points}>
                    <Text style={styles.redeemPts}>{r.points.toLocaleString()}</Text>
                    <Text style={styles.redeemLabel}>pts</Text>
                  </TouchableOpacity>
                </Card>
              ))}
            </View>
          )}

          {tab === 'history' && (
            <View style={{ gap: 8 }}>
              <Text style={styles.sectionTitle}>Historia ya Pointi</Text>
              {HISTORY.map((h, i) => (
                <Card key={i} style={styles.histRow}>
                  <View style={[styles.histIcon, { backgroundColor: h.type === 'earn' ? 'rgba(74,222,128,0.15)' : 'rgba(251,191,36,0.15)' }]}>
                    <Ionicons name={h.type === 'earn' ? 'add' : 'swap-horizontal'} size={16} color={h.type === 'earn' ? colors.greenLight : colors.yellow} />
                  </View>
                  <View style={{ flex: 1, marginLeft: 10 }}>
                    <Text style={styles.histLabel}>{h.label}</Text>
                    <Text style={styles.histDate}>{h.date}</Text>
                  </View>
                  <Text style={[styles.histPts, { color: h.type === 'earn' ? colors.greenLight : colors.yellow }]}>{h.pts} pts</Text>
                </Card>
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingBottom: 8 },
  headerTitle: { fontSize: 18, fontWeight: '700', color: colors.white },
  memberCard: { margin: 16, borderRadius: 20, padding: 24 },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  cardTier: { fontSize: 14, fontWeight: '700', color: 'rgba(255,255,255,0.8)', marginBottom: 4 },
  cardName: { fontSize: 20, fontWeight: '800', color: '#fff' },
  cardPoints: { fontSize: 36, fontWeight: '800', color: '#fff' },
  cardPointsLabel: { fontSize: 12, color: 'rgba(255,255,255,0.6)', marginTop: 2 },
  progressBar: { height: 6, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 3, marginTop: 12 },
  progressFill: { height: 6, borderRadius: 3 },
  progressText: { fontSize: 11, color: 'rgba(255,255,255,0.6)', marginTop: 6 },
  tabs: { flexDirection: 'row', marginHorizontal: 16, marginBottom: 16, backgroundColor: colors.bgCard, borderRadius: 12, padding: 4, borderWidth: 1, borderColor: colors.border },
  tab: { flex: 1, paddingVertical: 8, alignItems: 'center', borderRadius: 10 },
  tabActive: { backgroundColor: colors.greenLight },
  tabText: { fontSize: 13, fontWeight: '600', color: colors.white40 },
  tabTextActive: { color: '#000' },
  statsRow: { flexDirection: 'row', gap: 10 },
  statCard: { alignItems: 'center', gap: 4 },
  statNum: { fontSize: 18, fontWeight: '800', color: colors.white },
  statLabel: { fontSize: 11, color: colors.white40 },
  sectionTitle: { fontSize: 17, fontWeight: '700', color: colors.white, marginBottom: 4 },
  tierRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, gap: 10 },
  tierIcon: { fontSize: 24, width: 32 },
  tierName: { fontSize: 14, fontWeight: '700' },
  tierRange: { fontSize: 11, color: colors.white40, marginTop: 1 },
  earnRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  earnIcon: { width: 32, height: 32, borderRadius: 8, backgroundColor: colors.greenDim, alignItems: 'center', justifyContent: 'center' },
  earnAction: { flex: 1, fontSize: 14, color: colors.white },
  rewardRow: { flexDirection: 'row', alignItems: 'center' },
  rewardIcon: { width: 46, height: 46, borderRadius: 13, alignItems: 'center', justifyContent: 'center' },
  rewardTitle: { fontSize: 14, fontWeight: '700', color: colors.white },
  rewardDesc: { fontSize: 12, color: colors.white40, marginTop: 1 },
  redeemBtn: { alignItems: 'center', backgroundColor: colors.greenDim, borderRadius: 10, paddingHorizontal: 10, paddingVertical: 6, borderWidth: 1, borderColor: 'rgba(74,222,128,0.3)' },
  redeemPts: { fontSize: 15, fontWeight: '800', color: colors.greenLight },
  redeemLabel: { fontSize: 9, color: colors.white40 },
  histRow: { flexDirection: 'row', alignItems: 'center' },
  histIcon: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  histLabel: { fontSize: 13, fontWeight: '600', color: colors.white },
  histDate: { fontSize: 11, color: colors.white40, marginTop: 1 },
  histPts: { fontSize: 14, fontWeight: '700' },
});
