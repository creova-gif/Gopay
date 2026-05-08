import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TextInput,
  TouchableOpacity, Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { Header } from '../components/ui/Header';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { PinPad } from '../components/ui/PinPad';
import { colors } from '../theme/colors';

const NETWORKS = [
  { id: 'mpesa', name: 'M-Pesa', color: '#00a550', prefix: '0744,0769' },
  { id: 'airtel', name: 'Airtel Money', color: '#f00', prefix: '0782,0783' },
  { id: 'tigo', name: 'Tigo Pesa', color: '#0066cc', prefix: '0716,0717' },
  { id: 'halo', name: 'Halopesa', color: '#ff6600', prefix: '0621' },
  { id: 'gopay', name: 'goPay', color: colors.greenLight, prefix: 'Akaunti' },
];

const RECENTS = [
  { id: '1', name: 'Amina Hassan', phone: '0744 567 890', initial: 'A', color: colors.purple },
  { id: '2', name: 'Bakari Juma', phone: '0782 234 567', initial: 'B', color: colors.blue },
  { id: '3', name: 'Clara Mushi', phone: '0716 890 123', initial: 'C', color: colors.orange },
  { id: '4', name: 'Daudi Ali', phone: '0621 456 789', initial: 'D', color: colors.cyan },
];

type Step = 'recipient' | 'amount' | 'pin' | 'success';

export function SendMoneyScreen({ navigation }: any) {
  const [step, setStep] = useState<Step>('recipient');
  const [network, setNetwork] = useState(NETWORKS[0]);
  const [phone, setPhone] = useState('');
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [pin, setPin] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (pin.length < 4) return;
    setLoading(true);
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setTimeout(() => { setLoading(false); setStep('success'); }, 1500);
  };

  if (step === 'success') {
    return (
      <View style={styles.container}>
        <View style={styles.successWrap}>
          <LinearGradient colors={['rgba(74,222,128,0.2)', 'transparent']} style={styles.successGlow}>
            <View style={styles.successIcon}>
              <Ionicons name="checkmark" size={52} color={colors.greenLight} />
            </View>
          </LinearGradient>
          <Text style={styles.successTitle}>Pesa Imetumwa!</Text>
          <Text style={styles.successSub}>TZS {parseInt(amount).toLocaleString('sw-TZ')} imetumwa kwa {phone}</Text>
          <View style={styles.successCard}>
            <Row label="Mtandao" value={network.name} />
            <Row label="Namba" value={phone} />
            <Row label="Kiasi" value={`TZS ${parseInt(amount).toLocaleString()}`} />
            <Row label="Kumbukumbu" value={note || '—'} />
            <Row label="Wakati" value={new Date().toLocaleTimeString('sw-TZ')} />
          </View>
          <Button label="Rudi Nyumbani" onPress={() => navigation.navigate('Home')} style={{ marginTop: 24 }} size="lg" />
          <Button label="Tuma Tena" onPress={() => { setStep('recipient'); setPhone(''); setAmount(''); setPin(''); }} variant="ghost" style={{ marginTop: 8 }} size="lg" />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header title="Tuma Pesa" onBack={() => step === 'recipient' ? navigation.goBack() : setStep(step === 'pin' ? 'amount' : 'recipient')} />

      {/* Step indicators */}
      <View style={styles.steps}>
        {(['recipient', 'amount', 'pin'] as Step[]).map((s, i) => (
          <View key={s} style={styles.stepItem}>
            <View style={[styles.stepDot, step === s && styles.stepDotActive, i < ['recipient', 'amount', 'pin'].indexOf(step) && styles.stepDotDone]}>
              {i < ['recipient', 'amount', 'pin'].indexOf(step)
                ? <Ionicons name="checkmark" size={12} color="#000" />
                : <Text style={styles.stepNum}>{i + 1}</Text>
              }
            </View>
            {i < 2 && <View style={[styles.stepLine, i < ['recipient', 'amount', 'pin'].indexOf(step) && styles.stepLineDone]} />}
          </View>
        ))}
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 20 }} showsVerticalScrollIndicator={false}>

        {step === 'recipient' && (
          <View style={{ gap: 20 }}>
            <Text style={styles.stepTitle}>Chagua Mtandao</Text>
            <View style={styles.networkGrid}>
              {NETWORKS.map((n) => (
                <TouchableOpacity key={n.id} style={[styles.networkItem, network.id === n.id && { borderColor: n.color, backgroundColor: `${n.color}18` }]}
                  onPress={() => { setNetwork(n); Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); }}>
                  <View style={[styles.networkDot, { backgroundColor: n.color }]} />
                  <Text style={[styles.networkName, network.id === n.id && { color: n.color }]}>{n.name}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.stepTitle}>Namba ya Simu</Text>
            <View style={styles.phoneInput}>
              <Text style={styles.phoneFlag}>🇹🇿 +255</Text>
              <TextInput style={styles.phoneField} value={phone} onChangeText={setPhone} placeholder="7XX XXX XXX" placeholderTextColor={colors.white20} keyboardType="phone-pad" maxLength={10} />
            </View>

            <Text style={styles.stepTitle}>Watu wa Hivi Karibuni</Text>
            <View style={{ gap: 8 }}>
              {RECENTS.map((r) => (
                <TouchableOpacity key={r.id} style={styles.recentRow} onPress={() => setPhone(r.phone.replace(/\s/g, ''))}>
                  <View style={[styles.initial, { backgroundColor: `${r.color}22` }]}>
                    <Text style={[styles.initialText, { color: r.color }]}>{r.initial}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.recentName}>{r.name}</Text>
                    <Text style={styles.recentPhone}>{r.phone}</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={16} color={colors.white40} />
                </TouchableOpacity>
              ))}
            </View>

            <Button label="Endelea" onPress={() => { if (!phone) { Alert.alert('Weka namba ya simu'); return; } setStep('amount'); }} size="lg" />
          </View>
        )}

        {step === 'amount' && (
          <View style={{ gap: 20 }}>
            <Text style={styles.stepTitle}>Kiasi cha Kutuma</Text>
            <Card style={styles.amountCard}>
              <Text style={styles.amountLabel}>TZS</Text>
              <TextInput
                style={styles.amountInput}
                value={amount}
                onChangeText={setAmount}
                placeholder="0"
                placeholderTextColor={colors.white20}
                keyboardType="numeric"
                textAlign="center"
              />
            </Card>

            <View style={styles.presetGrid}>
              {['10,000', '20,000', '50,000', '100,000', '200,000', '500,000'].map((p) => (
                <TouchableOpacity key={p} style={styles.preset} onPress={() => { setAmount(p.replace(',', '')); Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); }}>
                  <Text style={styles.presetText}>{p}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <View>
              <Text style={styles.stepTitle}>Kumbukumbu (hiari)</Text>
              <View style={styles.noteInput}>
                <TextInput style={styles.noteField} value={note} onChangeText={setNote} placeholder="Kwa nini unatuma..." placeholderTextColor={colors.white20} />
              </View>
            </View>

            <Card style={styles.summaryCard}>
              <Row label="Kwa" value={phone} />
              <Row label="Mtandao" value={network.name} />
              <Row label="Kiasi" value={`TZS ${amount ? parseInt(amount).toLocaleString() : '0'}`} />
              <Row label="Ada" value="Bure" valueColor={colors.greenLight} />
            </Card>

            <Button label="Endelea na PIN" onPress={() => { if (!amount || parseInt(amount) < 100) { Alert.alert('Weka kiasi sahihi'); return; } setStep('pin'); }} size="lg" />
          </View>
        )}

        {step === 'pin' && (
          <View style={{ alignItems: 'center', gap: 24, paddingTop: 20 }}>
            <View style={styles.pinSummary}>
              <Ionicons name="lock-closed" size={24} color={colors.greenLight} />
              <Text style={styles.pinTitle}>Weka PIN yako</Text>
              <Text style={styles.pinSub}>Kuthibitisha kutuma TZS {parseInt(amount).toLocaleString()} kwa {phone}</Text>
            </View>
            <PinPad value={pin} onChange={(v) => { setPin(v); if (v.length === 4) handleSend(); }} maxLength={4} />
            {loading && <Text style={{ color: colors.greenLight }}>Inatuma...</Text>}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

function Row({ label, value, valueColor }: { label: string; value: string; valueColor?: string }) {
  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6 }}>
      <Text style={{ fontSize: 13, color: colors.white40 }}>{label}</Text>
      <Text style={{ fontSize: 13, fontWeight: '600', color: valueColor ?? colors.white }}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  steps: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 16, gap: 0 },
  stepItem: { flexDirection: 'row', alignItems: 'center' },
  stepDot: { width: 28, height: 28, borderRadius: 14, backgroundColor: colors.bgCard, borderWidth: 1, borderColor: colors.border, alignItems: 'center', justifyContent: 'center' },
  stepDotActive: { backgroundColor: colors.greenDim, borderColor: colors.greenLight },
  stepDotDone: { backgroundColor: colors.greenLight },
  stepNum: { fontSize: 12, fontWeight: '700', color: colors.white40 },
  stepLine: { width: 40, height: 2, backgroundColor: colors.border },
  stepLineDone: { backgroundColor: colors.greenLight },
  stepTitle: { fontSize: 15, fontWeight: '700', color: colors.white },
  networkGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  networkItem: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.bgCard },
  networkDot: { width: 8, height: 8, borderRadius: 4 },
  networkName: { fontSize: 13, fontWeight: '600', color: colors.white70 },
  phoneInput: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.bgCard, borderRadius: 12, borderWidth: 1, borderColor: colors.border, paddingHorizontal: 12 },
  phoneFlag: { fontSize: 14, color: colors.white70, marginRight: 8 },
  phoneField: { flex: 1, color: colors.white, fontSize: 16, paddingVertical: 14 },
  recentRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.bgCard, borderRadius: 12, padding: 12, borderWidth: 1, borderColor: colors.border, gap: 12 },
  initial: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  initialText: { fontSize: 16, fontWeight: '700' },
  recentName: { fontSize: 14, fontWeight: '600', color: colors.white },
  recentPhone: { fontSize: 12, color: colors.white40, marginTop: 1 },
  amountCard: { alignItems: 'center', paddingVertical: 24 },
  amountLabel: { fontSize: 14, color: colors.white40, marginBottom: 4 },
  amountInput: { fontSize: 48, fontWeight: '800', color: colors.white, minWidth: 80 },
  presetGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  preset: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 10, backgroundColor: colors.bgCard, borderWidth: 1, borderColor: colors.border },
  presetText: { fontSize: 13, color: colors.white70, fontWeight: '600' },
  noteInput: { backgroundColor: colors.bgCard, borderRadius: 12, borderWidth: 1, borderColor: colors.border, paddingHorizontal: 14 },
  noteField: { color: colors.white, fontSize: 14, paddingVertical: 12 },
  summaryCard: { gap: 2 },
  pinSummary: { alignItems: 'center', gap: 8 },
  pinTitle: { fontSize: 20, fontWeight: '700', color: colors.white },
  pinSub: { fontSize: 13, color: colors.white40, textAlign: 'center' },
  successWrap: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  successGlow: { width: 120, height: 120, borderRadius: 60, alignItems: 'center', justifyContent: 'center', marginBottom: 24 },
  successIcon: { width: 90, height: 90, borderRadius: 45, backgroundColor: 'rgba(74,222,128,0.2)', borderWidth: 2, borderColor: colors.greenLight, alignItems: 'center', justifyContent: 'center' },
  successTitle: { fontSize: 28, fontWeight: '800', color: colors.white, marginBottom: 8 },
  successSub: { fontSize: 14, color: colors.white70, textAlign: 'center', marginBottom: 24 },
  successCard: { width: '100%', backgroundColor: colors.bgCard, borderRadius: 16, padding: 16, borderWidth: 1, borderColor: colors.border },
});
