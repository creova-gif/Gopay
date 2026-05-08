import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Header } from '../components/ui/Header';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { colors } from '../theme/colors';

const LOAN_TYPES = [
  { id: 'dharura', name: 'Dharura', desc: 'Mkopo wa haraka bila hati', max: 500_000, rate: '5%/mwezi', icon: 'flash', color: colors.orange },
  { id: 'biashara', name: 'Biashara', desc: 'Kukuza biashara yako', max: 5_000_000, rate: '3%/mwezi', icon: 'briefcase', color: colors.blue },
  { id: 'elimu', name: 'Elimu', desc: 'Kulipa ada ya shule', max: 2_000_000, rate: '2%/mwezi', icon: 'school', color: colors.cyan },
  { id: 'nyumba', name: 'Nyumba', desc: 'Ukarabati wa nyumba', max: 10_000_000, rate: '2.5%/mwezi', icon: 'home', color: colors.purple },
];

const ACTIVE_LOAN = { amount: 300_000, paid: 120_000, monthly: 37_500, dueDate: '25 Juni 2026', type: 'Dharura' };

export function MicroLoansScreen({ navigation }: any) {
  const insets = useSafeAreaInsets();
  const [tab, setTab] = useState<'overview' | 'apply'>('overview');
  const [selectedType, setSelectedType] = useState(LOAN_TYPES[0]);
  const [loanAmount, setLoanAmount] = useState('');
  const [months, setMonths] = useState(3);
  const creditScore = 720;
  const scoreColor = creditScore >= 700 ? colors.greenLight : creditScore >= 600 ? colors.yellow : colors.red;
  const progress = (ACTIVE_LOAN.paid / ACTIVE_LOAN.amount) * 100;
  const monthly = loanAmount ? Math.round((parseInt(loanAmount) * 1.05) / months) : 0;

  return (
    <View style={styles.container}>
      <Header title="Mikopo" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: insets.bottom + 20 }} showsVerticalScrollIndicator={false}>

        {/* Credit Score */}
        <LinearGradient colors={['rgba(22,163,74,0.15)', 'rgba(8,13,8,0)']} style={styles.scoreCard}>
          <View style={styles.scoreRing}>
            <View style={[styles.scoreInner, { borderColor: scoreColor }]}>
              <Text style={[styles.scoreNum, { color: scoreColor }]}>{creditScore}</Text>
              <Text style={styles.scoreLabel}>Alama</Text>
            </View>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.scoreTitle}>Alama yako ya Mikopo</Text>
            <Badge label={creditScore >= 700 ? 'Nzuri Sana' : creditScore >= 600 ? 'Nzuri' : 'Inabidi kuboresha'} variant={creditScore >= 700 ? 'green' : 'orange'} style={{ alignSelf: 'flex-start', marginTop: 4 }} />
            <Text style={styles.scoreInfo}>Unastahili mkopo hadi TZS 5,000,000</Text>
          </View>
        </LinearGradient>

        {/* Tabs */}
        <View style={styles.tabs}>
          {(['overview', 'apply'] as const).map((t) => (
            <TouchableOpacity key={t} style={[styles.tab, tab === t && styles.tabActive]} onPress={() => setTab(t)}>
              <Text style={[styles.tabText, tab === t && styles.tabTextActive]}>{t === 'overview' ? 'Muhtasari' : 'Omba Mkopo'}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {tab === 'overview' && (
          <View style={{ gap: 16 }}>
            {/* Active Loan */}
            <Text style={styles.sectionTitle}>Mkopo Unaoendelea</Text>
            <Card style={styles.activeLoan}>
              <View style={styles.loanHeader}>
                <Badge label={ACTIVE_LOAN.type} variant="orange" />
                <Text style={styles.loanAmount}>TZS {ACTIVE_LOAN.amount.toLocaleString()}</Text>
              </View>
              <View style={styles.progressWrap}>
                <View style={styles.progressBg}>
                  <View style={[styles.progressFill, { width: `${progress}%` }]} />
                </View>
                <Text style={styles.progressLabel}>TZS {ACTIVE_LOAN.paid.toLocaleString()} / {ACTIVE_LOAN.amount.toLocaleString()}</Text>
              </View>
              <View style={styles.loanDetails}>
                <LoanDetail label="Malipo ya Mwezi" value={`TZS ${ACTIVE_LOAN.monthly.toLocaleString()}`} />
                <LoanDetail label="Siku ya Kulipa" value={ACTIVE_LOAN.dueDate} />
              </View>
              <Button label="Lipa Sasa — TZS 37,500" onPress={() => Alert.alert('Malipo', 'Deni limefanikiwa')} size="md" style={{ marginTop: 12 }} />
            </Card>

            {/* Loan types */}
            <Text style={styles.sectionTitle}>Aina za Mikopo</Text>
            {LOAN_TYPES.map((lt) => (
              <Card key={lt.id} style={styles.loanTypeRow}>
                <View style={[styles.loanTypeIcon, { backgroundColor: `${lt.color}20` }]}>
                  <Ionicons name={lt.icon as any} size={22} color={lt.color} />
                </View>
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text style={styles.loanTypeName}>{lt.name}</Text>
                  <Text style={styles.loanTypeDesc}>{lt.desc}</Text>
                </View>
                <View style={{ alignItems: 'flex-end' }}>
                  <Text style={styles.loanTypeMax}>Hadi TZS {(lt.max / 1_000_000).toFixed(lt.max >= 1_000_000 ? 1 : 0)}M</Text>
                  <Text style={styles.loanTypeRate}>{lt.rate}</Text>
                </View>
              </Card>
            ))}
          </View>
        )}

        {tab === 'apply' && (
          <View style={{ gap: 16 }}>
            <Text style={styles.sectionTitle}>Aina ya Mkopo</Text>
            <View style={styles.typeGrid}>
              {LOAN_TYPES.map((lt) => (
                <TouchableOpacity key={lt.id} style={[styles.typeBtn, selectedType.id === lt.id && { borderColor: lt.color, backgroundColor: `${lt.color}15` }]}
                  onPress={() => setSelectedType(lt)}>
                  <Ionicons name={lt.icon as any} size={20} color={lt.color} />
                  <Text style={[styles.typeBtnText, selectedType.id === lt.id && { color: lt.color }]}>{lt.name}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <View>
              <Text style={styles.fieldLabel}>Kiasi cha Mkopo (TZS)</Text>
              <View style={styles.amountInput}>
                <TextInput style={styles.amountField} value={loanAmount} onChangeText={setLoanAmount} placeholder="0" placeholderTextColor={colors.white20} keyboardType="numeric" />
              </View>
              <Text style={styles.maxNote}>Kiwango cha juu: TZS {selectedType.max.toLocaleString()}</Text>
            </View>

            <View>
              <Text style={styles.fieldLabel}>Muda wa Kulipa (miezi)</Text>
              <View style={styles.monthsRow}>
                {[1, 3, 6, 12].map((m) => (
                  <TouchableOpacity key={m} style={[styles.monthBtn, months === m && styles.monthBtnActive]} onPress={() => setMonths(m)}>
                    <Text style={[styles.monthText, months === m && styles.monthTextActive]}>{m} mwezi{m > 1 ? 'ni' : ''}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {loanAmount && (
              <Card style={styles.calcCard}>
                <Text style={styles.calcTitle}>Muhtasari wa Mkopo</Text>
                <LoanDetail label="Mkopo" value={`TZS ${parseInt(loanAmount).toLocaleString()}`} />
                <LoanDetail label="Riba ({selectedType.rate})" value={`TZS ${Math.round(parseInt(loanAmount) * 0.05 * months).toLocaleString()}`} />
                <LoanDetail label="Jumla ya Kulipa" value={`TZS ${Math.round(parseInt(loanAmount) * 1.05).toLocaleString()}`} />
                <LoanDetail label="Malipo ya Kila Mwezi" value={`TZS ${monthly.toLocaleString()}`} valueColor={colors.greenLight} />
              </Card>
            )}

            <Button label="Wasilisha Ombi" onPress={() => Alert.alert('Ombi Limepokelewa', 'Tutawasiliana nawe ndani ya masaa 24')} size="lg" />
          </View>
        )}
      </ScrollView>
    </View>
  );
}

function LoanDetail({ label, value, valueColor }: { label: string; value: string; valueColor?: string }) {
  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 5 }}>
      <Text style={{ fontSize: 13, color: colors.white40 }}>{label}</Text>
      <Text style={{ fontSize: 13, fontWeight: '600', color: valueColor ?? colors.white }}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  scoreCard: { borderRadius: 16, padding: 16, flexDirection: 'row', alignItems: 'center', gap: 16, marginBottom: 16, borderWidth: 1, borderColor: colors.border },
  scoreRing: { width: 90, height: 90, borderRadius: 45, borderWidth: 3, borderColor: colors.border, alignItems: 'center', justifyContent: 'center' },
  scoreInner: { width: 78, height: 78, borderRadius: 39, borderWidth: 3, alignItems: 'center', justifyContent: 'center' },
  scoreNum: { fontSize: 24, fontWeight: '800' },
  scoreLabel: { fontSize: 10, color: colors.white40 },
  scoreTitle: { fontSize: 16, fontWeight: '700', color: colors.white },
  scoreInfo: { fontSize: 12, color: colors.white40, marginTop: 6 },
  tabs: { flexDirection: 'row', marginBottom: 16, backgroundColor: colors.bgCard, borderRadius: 12, padding: 4, borderWidth: 1, borderColor: colors.border },
  tab: { flex: 1, paddingVertical: 8, alignItems: 'center', borderRadius: 10 },
  tabActive: { backgroundColor: colors.greenLight },
  tabText: { fontSize: 13, fontWeight: '600', color: colors.white40 },
  tabTextActive: { color: '#000' },
  sectionTitle: { fontSize: 17, fontWeight: '700', color: colors.white },
  activeLoan: { gap: 8 },
  loanHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  loanAmount: { fontSize: 20, fontWeight: '800', color: colors.white },
  progressWrap: { gap: 4 },
  progressBg: { height: 8, backgroundColor: colors.bgCardHover, borderRadius: 4, overflow: 'hidden' },
  progressFill: { height: 8, backgroundColor: colors.greenLight, borderRadius: 4 },
  progressLabel: { fontSize: 12, color: colors.white40 },
  loanDetails: { flexDirection: 'row', justifyContent: 'space-between' },
  loanTypeRow: { flexDirection: 'row', alignItems: 'center' },
  loanTypeIcon: { width: 46, height: 46, borderRadius: 13, alignItems: 'center', justifyContent: 'center' },
  loanTypeName: { fontSize: 14, fontWeight: '700', color: colors.white },
  loanTypeDesc: { fontSize: 12, color: colors.white40, marginTop: 1 },
  loanTypeMax: { fontSize: 13, fontWeight: '700', color: colors.white },
  loanTypeRate: { fontSize: 11, color: colors.white40 },
  typeGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  typeBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.bgCard },
  typeBtnText: { fontSize: 13, fontWeight: '600', color: colors.white70 },
  fieldLabel: { fontSize: 13, fontWeight: '600', color: colors.white70, marginBottom: 6 },
  amountInput: { backgroundColor: colors.bgCard, borderRadius: 12, borderWidth: 1, borderColor: colors.border, paddingHorizontal: 14 },
  amountField: { color: colors.white, fontSize: 18, fontWeight: '700', paddingVertical: 14 },
  maxNote: { fontSize: 11, color: colors.white40, marginTop: 4 },
  monthsRow: { flexDirection: 'row', gap: 8 },
  monthBtn: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 10, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.bgCard },
  monthBtnActive: { backgroundColor: colors.greenDim, borderColor: colors.greenLight },
  monthText: { fontSize: 12, fontWeight: '600', color: colors.white70 },
  monthTextActive: { color: colors.greenLight },
  calcCard: { gap: 2 },
  calcTitle: { fontSize: 15, fontWeight: '700', color: colors.white, marginBottom: 8 },
});
