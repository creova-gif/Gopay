import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { Header } from '../components/ui/Header';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { PinPad } from '../components/ui/PinPad';
import { colors } from '../theme/colors';

const AIRPORTS = [
  { code: 'DAR', name: 'Julius Nyerere International', city: 'Dar es Salaam' },
  { code: 'ZNZ', name: 'Abeid Amani Karume', city: 'Zanzibar' },
  { code: 'JRO', name: 'Kilimanjaro International', city: 'Kilimanjaro' },
  { code: 'MWZ', name: 'Mwanza Airport', city: 'Mwanza' },
  { code: 'ARK', name: 'Arusha Airport', city: 'Arusha' },
  { code: 'NBO', name: 'Jomo Kenyatta', city: 'Nairobi' },
];

const RESULTS = [
  { airline: 'Precision Air', code: 'PW', flight: 'PW101', dep: '06:30', arr: '07:15', duration: '45min', price: 85_000, stops: 0, class: 'Economy' },
  { airline: 'Air Tanzania', code: 'TC', flight: 'TC204', dep: '09:00', arr: '10:05', duration: '1h 05min', price: 120_000, stops: 0, class: 'Business' },
  { airline: 'Fastjet', code: 'FN', flight: 'FN302', dep: '13:45', arr: '14:35', duration: '50min', price: 95_000, stops: 0, class: 'Economy' },
  { airline: 'Auric Air', code: 'UI', flight: 'UI55', dep: '16:20', arr: '17:10', duration: '50min', price: 78_000, stops: 0, class: 'Economy' },
];

type Step = 'search' | 'results' | 'seat' | 'payment' | 'success';

const SEATS = Array.from({ length: 24 }, (_, i) => ({
  id: `${Math.floor(i / 4) + 1}${['A','B','C','D'][i % 4]}`,
  row: Math.floor(i / 4) + 1,
  col: ['A','B','C','D'][i % 4],
  taken: [0,3,5,9,14,17].includes(i),
  type: i < 8 ? 'business' : 'economy',
}));

export function FlightSearchScreen({ navigation }: any) {
  const [step, setStep] = useState<Step>('search');
  const [from, setFrom] = useState(AIRPORTS[0]);
  const [to, setTo] = useState(AIRPORTS[1]);
  const [date, setDate] = useState('2026-05-20');
  const [pax, setPax] = useState(1);
  const [selectedFlight, setSelectedFlight] = useState<typeof RESULTS[0] | null>(null);
  const [selectedSeat, setSelectedSeat] = useState('');
  const [pin, setPin] = useState('');

  const swap = () => { const t = from; setFrom(to); setTo(t); Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); };

  if (step === 'success') {
    return (
      <View style={styles.container}>
        <Header title="Tiketi ya Ndege" onBack={() => navigation.navigate('Travel')} />
        <ScrollView contentContainerStyle={{ padding: 24, alignItems: 'center' }}>
          <LinearGradient colors={['rgba(96,165,250,0.3)', 'transparent']} style={styles.successGlow}>
            <View style={styles.successCircle}>
              <Ionicons name="airplane" size={40} color={colors.blue} />
            </View>
          </LinearGradient>
          <Text style={styles.successTitle}>Tiketi Imenunuliwa!</Text>
          <Text style={styles.successSub}>{from.code} → {to.code} · {selectedSeat}</Text>

          <LinearGradient colors={['#1e3a5f', '#0f172a']} style={styles.ticket}>
            <View style={styles.ticketHeader}>
              <Text style={styles.ticketAirline}>{selectedFlight?.airline}</Text>
              <Badge label={selectedFlight?.flight ?? ''} variant="blue" />
            </View>
            <View style={styles.ticketRoute}>
              <View style={{ alignItems: 'center' }}>
                <Text style={styles.ticketCode}>{from.code}</Text>
                <Text style={styles.ticketCity}>{from.city}</Text>
                <Text style={styles.ticketTime}>{selectedFlight?.dep}</Text>
              </View>
              <View style={{ flex: 1, alignItems: 'center' }}>
                <Ionicons name="airplane" size={20} color={colors.blue} />
                <Text style={styles.ticketDuration}>{selectedFlight?.duration}</Text>
              </View>
              <View style={{ alignItems: 'center' }}>
                <Text style={styles.ticketCode}>{to.code}</Text>
                <Text style={styles.ticketCity}>{to.city}</Text>
                <Text style={styles.ticketTime}>{selectedFlight?.arr}</Text>
              </View>
            </View>
            <View style={styles.ticketDivider} />
            <View style={styles.ticketInfo}>
              <InfoItem label="Tarehe" value={date} />
              <InfoItem label="Kiti" value={selectedSeat} />
              <InfoItem label="Abiria" value={`${pax}`} />
              <InfoItem label="Darasa" value={selectedFlight?.class ?? ''} />
            </View>
            <View style={styles.barcodeWrap}>
              <Text style={styles.barcode}>████ ████ ████ ████</Text>
              <Text style={styles.barcodeLabel}>Piga chini tiketi kuonyesha uwanja</Text>
            </View>
          </LinearGradient>
          <Button label="Rudi Nyumbani" onPress={() => navigation.navigate('Home')} size="lg" style={{ width: '100%', marginTop: 16 }} />
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header title="Tafuta Ndege" onBack={() => step === 'search' ? navigation.goBack() : setStep(step === 'results' ? 'search' : step === 'seat' ? 'results' : step === 'payment' ? 'seat' : 'payment')} />
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 40 }} showsVerticalScrollIndicator={false}>

        {step === 'search' && (
          <View style={{ gap: 16 }}>
            <Card style={styles.routeCard}>
              <TouchableOpacity style={styles.airportRow}>
                <Ionicons name="radio-button-on" size={18} color={colors.blue} />
                <View style={{ flex: 1, marginLeft: 10 }}>
                  <Text style={styles.airportLabel}>Kutoka</Text>
                  <Text style={styles.airportCode}>{from.code}</Text>
                  <Text style={styles.airportName}>{from.name}</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity style={styles.swapBtn} onPress={swap}>
                <Ionicons name="swap-vertical" size={20} color={colors.blue} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.airportRow}>
                <Ionicons name="location" size={18} color={colors.blue} />
                <View style={{ flex: 1, marginLeft: 10 }}>
                  <Text style={styles.airportLabel}>Kwenda</Text>
                  <Text style={styles.airportCode}>{to.code}</Text>
                  <Text style={styles.airportName}>{to.name}</Text>
                </View>
              </TouchableOpacity>
            </Card>

            <View style={styles.rowTwo}>
              <Card style={[styles.halfCard, { flex: 1 }]}>
                <Text style={styles.fieldLabel}>Tarehe</Text>
                <TextInput style={styles.fieldInput} value={date} onChangeText={setDate} placeholderTextColor={colors.white20} />
              </Card>
              <Card style={[styles.halfCard, { flex: 1 }]}>
                <Text style={styles.fieldLabel}>Abiria</Text>
                <View style={styles.paxRow}>
                  <TouchableOpacity onPress={() => setPax(Math.max(1, pax - 1))} style={styles.paxBtn}>
                    <Ionicons name="remove" size={16} color={colors.white} />
                  </TouchableOpacity>
                  <Text style={styles.paxNum}>{pax}</Text>
                  <TouchableOpacity onPress={() => setPax(Math.min(9, pax + 1))} style={styles.paxBtn}>
                    <Ionicons name="add" size={16} color={colors.white} />
                  </TouchableOpacity>
                </View>
              </Card>
            </View>

            <Button label="Tafuta Ndege" onPress={() => setStep('results')} size="lg" />

            <Text style={styles.sectionTitle}>Njia Maarufu</Text>
            {[['DAR', 'ZNZ'], ['DAR', 'JRO'], ['ZNZ', 'MWZ']].map(([f, t]) => (
              <TouchableOpacity key={`${f}-${t}`} style={styles.popularRoute}
                onPress={() => { setFrom(AIRPORTS.find(a => a.code === f)!); setTo(AIRPORTS.find(a => a.code === t)!); setStep('results'); }}>
                <Text style={styles.popularText}>{f} → {t}</Text>
                <Ionicons name="chevron-forward" size={16} color={colors.white40} />
              </TouchableOpacity>
            ))}
          </View>
        )}

        {step === 'results' && (
          <View style={{ gap: 12 }}>
            <Text style={styles.resultsHeader}>{from.code} → {to.code} · {date} · {pax} abiria</Text>
            {RESULTS.map((f) => (
              <TouchableOpacity key={f.flight} style={styles.flightCard}
                onPress={() => { setSelectedFlight(f); setStep('seat'); Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); }}>
                <View style={styles.flightTop}>
                  <View style={styles.flightIconWrap}>
                    <Ionicons name="airplane" size={18} color={colors.blue} />
                  </View>
                  <Text style={styles.flightAirline}>{f.airline}</Text>
                  <Badge label={f.class} variant={f.class === 'Business' ? 'purple' : 'default'} />
                  <Text style={styles.flightPrice}>TZS {f.price.toLocaleString()}</Text>
                </View>
                <View style={styles.flightRoute}>
                  <Text style={styles.flightTime}>{f.dep}</Text>
                  <View style={{ flex: 1, alignItems: 'center' }}>
                    <Text style={styles.flightDuration}>{f.duration}</Text>
                    <View style={styles.flightLine} />
                    <Text style={styles.flightStops}>{f.stops === 0 ? 'Moja kwa moja' : `${f.stops} stop`}</Text>
                  </View>
                  <Text style={styles.flightTime}>{f.arr}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {step === 'seat' && (
          <View style={{ gap: 16 }}>
            <Text style={styles.sectionTitle}>Chagua Kiti — {selectedFlight?.flight}</Text>
            <View style={styles.seatLegend}>
              {[{ color: colors.blue, label: 'Darasa la Biashara' }, { color: colors.bgCardHover, label: 'Kawaida' }, { color: colors.greenDim, label: 'Kiti chako' }, { color: 'rgba(248,113,113,0.3)', label: 'Kimechukuliwa' }].map((l) => (
                <View key={l.label} style={styles.legendItem}>
                  <View style={[styles.legendDot, { backgroundColor: l.color }]} />
                  <Text style={styles.legendText}>{l.label}</Text>
                </View>
              ))}
            </View>
            <View style={styles.seatGrid}>
              {SEATS.map((seat) => (
                <TouchableOpacity key={seat.id} style={[
                  styles.seat,
                  seat.type === 'business' && { backgroundColor: 'rgba(96,165,250,0.2)', borderColor: colors.blue },
                  seat.taken && styles.seatTaken,
                  selectedSeat === seat.id && styles.seatSelected,
                  (seat.col === 'B' || seat.col === 'C') && { marginRight: 12 },
                ]}
                  onPress={() => { if (!seat.taken) { setSelectedSeat(seat.id); Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); } }}
                  disabled={seat.taken}
                >
                  <Text style={[styles.seatLabel, seat.taken && { color: colors.white20 }, selectedSeat === seat.id && { color: '#000' }]}>{seat.id}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <Button label={`Endelea na Kiti ${selectedSeat || '—'}`} onPress={() => { if (!selectedSeat) { Alert.alert('Chagua kiti'); return; } setStep('payment'); }} size="lg" disabled={!selectedSeat} />
          </View>
        )}

        {step === 'payment' && (
          <View style={{ gap: 16, alignItems: 'center' }}>
            <Card style={{ width: '100%' }}>
              <InfoRow label="Ndege" value={`${selectedFlight?.airline} · ${selectedFlight?.flight}`} />
              <InfoRow label="Njia" value={`${from.code} → ${to.code}`} />
              <InfoRow label="Tarehe" value={date} />
              <InfoRow label="Kiti" value={selectedSeat} />
              <InfoRow label="Abiria" value={`${pax}`} />
              <InfoRow label="Jumla" value={`TZS ${((selectedFlight?.price ?? 0) * pax).toLocaleString()}`} valueColor={colors.greenLight} />
            </Card>
            <Text style={styles.pinPrompt}>Ingiza PIN yako kuthibitisha</Text>
            <PinPad value={pin} onChange={(v) => { setPin(v); if (v.length === 4) { Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success); setTimeout(() => setStep('success'), 800); } }} maxLength={4} />
          </View>
        )}
      </ScrollView>
    </View>
  );
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <View style={{ alignItems: 'center' }}>
      <Text style={{ fontSize: 10, color: 'rgba(255,255,255,0.5)', marginBottom: 2 }}>{label}</Text>
      <Text style={{ fontSize: 13, fontWeight: '700', color: '#fff' }}>{value}</Text>
    </View>
  );
}

function InfoRow({ label, value, valueColor }: { label: string; value: string; valueColor?: string }) {
  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6 }}>
      <Text style={{ fontSize: 13, color: colors.white40 }}>{label}</Text>
      <Text style={{ fontSize: 13, fontWeight: '600', color: valueColor ?? colors.white }}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  routeCard: { gap: 4 },
  airportRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8 },
  airportLabel: { fontSize: 11, color: colors.white40, marginBottom: 2 },
  airportCode: { fontSize: 22, fontWeight: '800', color: colors.white },
  airportName: { fontSize: 12, color: colors.white70 },
  swapBtn: { alignSelf: 'center', width: 36, height: 36, borderRadius: 10, backgroundColor: 'rgba(96,165,250,0.15)', alignItems: 'center', justifyContent: 'center', marginVertical: 4 },
  rowTwo: { flexDirection: 'row', gap: 10 },
  halfCard: { padding: 14 },
  fieldLabel: { fontSize: 11, color: colors.white40, marginBottom: 4 },
  fieldInput: { fontSize: 15, fontWeight: '600', color: colors.white },
  paxRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  paxBtn: { width: 28, height: 28, borderRadius: 8, backgroundColor: colors.bgCard, borderWidth: 1, borderColor: colors.border, alignItems: 'center', justifyContent: 'center' },
  paxNum: { fontSize: 18, fontWeight: '700', color: colors.white },
  sectionTitle: { fontSize: 17, fontWeight: '700', color: colors.white },
  popularRoute: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: colors.bgCard, borderRadius: 10, padding: 14, borderWidth: 1, borderColor: colors.border },
  popularText: { fontSize: 14, fontWeight: '600', color: colors.white },
  resultsHeader: { fontSize: 13, color: colors.white70, marginBottom: 4 },
  flightCard: { backgroundColor: colors.bgCard, borderRadius: 14, padding: 14, borderWidth: 1, borderColor: colors.border, gap: 12 },
  flightTop: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  flightIconWrap: { width: 32, height: 32, borderRadius: 8, backgroundColor: 'rgba(96,165,250,0.15)', alignItems: 'center', justifyContent: 'center' },
  flightAirline: { flex: 1, fontSize: 14, fontWeight: '700', color: colors.white },
  flightPrice: { fontSize: 15, fontWeight: '800', color: colors.blue },
  flightRoute: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  flightTime: { fontSize: 18, fontWeight: '800', color: colors.white },
  flightDuration: { fontSize: 11, color: colors.white40, marginBottom: 4 },
  flightLine: { width: '80%', height: 1, backgroundColor: colors.border },
  flightStops: { fontSize: 11, color: colors.greenLight, marginTop: 4 },
  seatLegend: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  legendDot: { width: 10, height: 10, borderRadius: 3 },
  legendText: { fontSize: 11, color: colors.white40 },
  seatGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, justifyContent: 'center' },
  seat: { width: 44, height: 44, borderRadius: 8, backgroundColor: colors.bgCard, borderWidth: 1, borderColor: colors.border, alignItems: 'center', justifyContent: 'center' },
  seatTaken: { backgroundColor: 'rgba(248,113,113,0.15)', borderColor: 'rgba(248,113,113,0.3)' },
  seatSelected: { backgroundColor: colors.greenLight, borderColor: colors.greenLight },
  seatLabel: { fontSize: 11, fontWeight: '700', color: colors.white70 },
  pinPrompt: { fontSize: 16, fontWeight: '600', color: colors.white, textAlign: 'center' },
  successGlow: { width: 130, height: 130, borderRadius: 65, alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  successCircle: { width: 100, height: 100, borderRadius: 50, backgroundColor: 'rgba(96,165,250,0.2)', borderWidth: 2, borderColor: colors.blue, alignItems: 'center', justifyContent: 'center' },
  successTitle: { fontSize: 26, fontWeight: '800', color: colors.white, marginBottom: 6 },
  successSub: { fontSize: 14, color: colors.white70, marginBottom: 20 },
  ticket: { width: '100%', borderRadius: 20, padding: 20, borderWidth: 1, borderColor: 'rgba(96,165,250,0.3)' },
  ticketHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
  ticketAirline: { fontSize: 16, fontWeight: '700', color: '#fff' },
  ticketRoute: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  ticketCode: { fontSize: 28, fontWeight: '800', color: '#fff' },
  ticketCity: { fontSize: 11, color: 'rgba(255,255,255,0.5)' },
  ticketTime: { fontSize: 14, fontWeight: '600', color: 'rgba(255,255,255,0.8)', marginTop: 4 },
  ticketDuration: { fontSize: 11, color: 'rgba(255,255,255,0.5)', marginTop: 4 },
  ticketDivider: { height: 1, backgroundColor: 'rgba(255,255,255,0.1)', marginBottom: 16, borderStyle: 'dashed' },
  ticketInfo: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
  barcodeWrap: { alignItems: 'center', borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.1)', paddingTop: 14 },
  barcode: { fontSize: 18, color: 'rgba(255,255,255,0.4)', letterSpacing: 4 },
  barcodeLabel: { fontSize: 11, color: 'rgba(255,255,255,0.4)', marginTop: 4 },
});
