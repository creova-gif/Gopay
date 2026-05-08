import React, { useState } from 'react';
import {
  View, Text, TextInput, StyleSheet, ScrollView,
  TouchableOpacity, KeyboardAvoidingView, Platform, Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/Button';
import { colors } from '../theme/colors';

export function AuthScreen() {
  const insets = useSafeAreaInsets();
  const { signIn, signUp } = useAuth();
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!email || !password) { Alert.alert('Tafadhali jaza sehemu zote'); return; }
    setLoading(true);
    try {
      if (mode === 'login') {
        await signIn(email, password);
      } else {
        if (!name || !phone) { Alert.alert('Tafadhali jaza sehemu zote'); return; }
        await signUp({ email, password, name, phone });
      }
    } catch (e: any) {
      Alert.alert('Hitilafu', e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDemo = async () => {
    setLoading(true);
    await signIn('demo@gopay.tz', 'demo123');
    setLoading(false);
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: insets.bottom + 32 }}>
        {/* Header */}
        <LinearGradient colors={['rgba(22,163,74,0.2)', 'transparent']} style={styles.hero}>
          <View style={styles.logoWrap}>
            <View style={styles.logo}>
              <Ionicons name="wallet" size={32} color={colors.greenLight} />
            </View>
          </View>
          <Text style={styles.appName}>goPay</Text>
          <Text style={styles.tagline}>Pochi yako ya dijitali Tanzania</Text>
        </LinearGradient>

        {/* Features strip */}
        <View style={styles.featuresRow}>
          {[
            { icon: 'shield-checkmark', label: 'Salama' },
            { icon: 'flash', label: 'Haraka' },
            { icon: 'phone-portrait', label: 'Rahisi' },
          ].map((f) => (
            <View key={f.label} style={styles.feature}>
              <Ionicons name={f.icon as any} size={20} color={colors.greenLight} />
              <Text style={styles.featureLabel}>{f.label}</Text>
            </View>
          ))}
        </View>

        {/* Tab */}
        <View style={styles.tabRow}>
          <TouchableOpacity style={[styles.tab, mode === 'login' && styles.tabActive]} onPress={() => setMode('login')}>
            <Text style={[styles.tabText, mode === 'login' && styles.tabTextActive]}>Ingia</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.tab, mode === 'signup' && styles.tabActive]} onPress={() => setMode('signup')}>
            <Text style={[styles.tabText, mode === 'signup' && styles.tabTextActive]}>Jisajili</Text>
          </TouchableOpacity>
        </View>

        {/* Form */}
        <View style={styles.form}>
          {mode === 'signup' && (
            <>
              <InputField label="Jina Kamili" value={name} onChange={setName} placeholder="Juma Mwangi" icon="person-outline" />
              <InputField label="Namba ya Simu" value={phone} onChange={setPhone} placeholder="+255 7XX XXX XXX" icon="call-outline" keyboardType="phone-pad" />
            </>
          )}
          <InputField label="Barua Pepe" value={email} onChange={setEmail} placeholder="juma@mfano.co.tz" icon="mail-outline" keyboardType="email-address" />
          <View>
            <Text style={styles.label}>Nywila</Text>
            <View style={styles.inputWrap}>
              <Ionicons name="lock-closed-outline" size={18} color={colors.white40} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                value={password}
                onChangeText={setPassword}
                placeholder="••••••••"
                placeholderTextColor={colors.white20}
                secureTextEntry={!showPass}
              />
              <TouchableOpacity onPress={() => setShowPass(!showPass)} style={styles.eyeBtn}>
                <Ionicons name={showPass ? 'eye-off-outline' : 'eye-outline'} size={18} color={colors.white40} />
              </TouchableOpacity>
            </View>
          </View>

          <Button label={mode === 'login' ? 'Ingia' : 'Fungua Akaunti'} onPress={handleSubmit} loading={loading} style={styles.submitBtn} size="lg" />

          <View style={styles.divider}>
            <View style={styles.divLine} />
            <Text style={styles.divText}>au</Text>
            <View style={styles.divLine} />
          </View>

          <TouchableOpacity style={styles.demoBtn} onPress={handleDemo} activeOpacity={0.7}>
            <Ionicons name="play-circle-outline" size={18} color={colors.greenLight} />
            <Text style={styles.demoBtnText}>Jaribu Demo — Ingia bila akaunti</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function InputField({ label, value, onChange, placeholder, icon, keyboardType }: any) {
  return (
    <View>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.inputWrap}>
        <Ionicons name={icon} size={18} color={colors.white40} style={styles.inputIcon} />
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChange}
          placeholder={placeholder}
          placeholderTextColor={colors.white20}
          keyboardType={keyboardType ?? 'default'}
          autoCapitalize="none"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  hero: { alignItems: 'center', paddingTop: 80, paddingBottom: 32 },
  logoWrap: { marginBottom: 12 },
  logo: {
    width: 72, height: 72, borderRadius: 20,
    backgroundColor: 'rgba(22,163,74,0.2)', borderWidth: 1,
    borderColor: 'rgba(74,222,128,0.3)', alignItems: 'center', justifyContent: 'center',
  },
  appName: { fontSize: 34, fontWeight: '800', color: colors.white, letterSpacing: -1 },
  tagline: { fontSize: 14, color: colors.white40, marginTop: 4 },
  featuresRow: { flexDirection: 'row', justifyContent: 'center', gap: 32, paddingVertical: 16 },
  feature: { alignItems: 'center', gap: 4 },
  featureLabel: { fontSize: 12, color: colors.white70, fontWeight: '600' },
  tabRow: {
    flexDirection: 'row', marginHorizontal: 20, marginBottom: 24,
    backgroundColor: colors.bgCard, borderRadius: 12, padding: 4,
    borderWidth: 1, borderColor: colors.border,
  },
  tab: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 10 },
  tabActive: { backgroundColor: colors.greenLight },
  tabText: { fontSize: 14, fontWeight: '600', color: colors.white40 },
  tabTextActive: { color: '#000' },
  form: { paddingHorizontal: 20, gap: 16 },
  label: { fontSize: 13, fontWeight: '600', color: colors.white70, marginBottom: 6 },
  inputWrap: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: colors.bgCard, borderRadius: 12,
    borderWidth: 1, borderColor: colors.border, paddingHorizontal: 12,
  },
  inputIcon: { marginRight: 8 },
  input: { flex: 1, color: colors.white, fontSize: 15, paddingVertical: 14 },
  eyeBtn: { padding: 4 },
  submitBtn: { marginTop: 8 },
  divider: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  divLine: { flex: 1, height: 1, backgroundColor: colors.border },
  divText: { fontSize: 12, color: colors.white40 },
  demoBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    paddingVertical: 14, borderRadius: 12,
    borderWidth: 1, borderColor: 'rgba(74,222,128,0.3)',
    backgroundColor: 'rgba(74,222,128,0.05)',
  },
  demoBtnText: { fontSize: 14, color: colors.greenLight, fontWeight: '600' },
});
