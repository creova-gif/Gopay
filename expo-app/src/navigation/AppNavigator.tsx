import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { colors } from '../theme/colors';

// Screens
import { AuthScreen } from '../screens/AuthScreen';
import { HomeScreen } from '../screens/HomeScreen';
import { WalletScreen } from '../screens/WalletScreen';
import { PaymentsScreen } from '../screens/PaymentsScreen';
import { TravelScreen } from '../screens/TravelScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { SendMoneyScreen } from '../screens/SendMoneyScreen';
import { FlightSearchScreen } from '../screens/FlightSearchScreen';
import { GOrewardsScreen } from '../screens/GOrewardsScreen';
import { MicroLoansScreen } from '../screens/MicroLoansScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function BottomTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: 'rgba(8,13,8,0.97)',
          borderTopColor: colors.border,
          borderTopWidth: 1,
          paddingBottom: 4,
          height: 60,
        },
        tabBarActiveTintColor: colors.greenLight,
        tabBarInactiveTintColor: colors.white40,
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600', marginBottom: 2 },
        tabBarIcon: ({ color, size, focused }) => {
          const icons: Record<string, [string, string]> = {
            Home: ['home', 'home-outline'],
            Wallet: ['wallet', 'wallet-outline'],
            Payments: ['receipt', 'receipt-outline'],
            Travel: ['airplane', 'airplane-outline'],
            Profile: ['person', 'person-outline'],
          };
          const [active, inactive] = icons[route.name] ?? ['help', 'help-outline'];
          return <Ionicons name={(focused ? active : inactive) as any} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ tabBarLabel: 'Nyumbani' }} />
      <Tab.Screen name="Wallet" component={WalletScreen} options={{ tabBarLabel: 'Pochi' }} />
      <Tab.Screen name="Payments" component={PaymentsScreen} options={{ tabBarLabel: 'Malipo' }} />
      <Tab.Screen name="Travel" component={TravelScreen} options={{ tabBarLabel: 'Safari' }} />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ tabBarLabel: 'Mimi' }} />
    </Tab.Navigator>
  );
}

export function AppNavigator() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.bg, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size="large" color={colors.greenLight} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!user ? (
          <Stack.Screen name="Auth" component={AuthScreen} />
        ) : (
          <>
            <Stack.Screen name="Main" component={BottomTabs} />
            <Stack.Screen name="SendMoney" component={SendMoneyScreen} options={{ presentation: 'card' }} />
            <Stack.Screen name="FlightSearch" component={FlightSearchScreen} />
            <Stack.Screen name="GOrewards" component={GOrewardsScreen} />
            <Stack.Screen name="MicroLoans" component={MicroLoansScreen} />
            <Stack.Screen name="FerryBooking" component={PlaceholderScreen('Feri', colors.cyan)} />
            <Stack.Screen name="BusBooking" component={PlaceholderScreen('Basi', colors.greenLight)} />
            <Stack.Screen name="SGRBooking" component={PlaceholderScreen('SGR Treni', colors.red)} />
            <Stack.Screen name="NationalParks" component={PlaceholderScreen('Mbuga za Wanyama', colors.emerald)} />
            <Stack.Screen name="HotelSearch" component={PlaceholderScreen('Hoteli', colors.purple)} />
            <Stack.Screen name="TransactionHistory" component={PlaceholderScreen('Historia ya Miamala', colors.blue)} />
            <Stack.Screen name="QRScanner" component={PlaceholderScreen('Skana QR', colors.purple)} />
            <Stack.Screen name="Notifications" component={PlaceholderScreen('Arifa', colors.orange)} />
            <Stack.Screen name="EditProfile" component={PlaceholderScreen('Hariri Wasifu', colors.blue)} />
            <Stack.Screen name="Security" component={PlaceholderScreen('Usalama', colors.green)} />
            <Stack.Screen name="Insights" component={PlaceholderScreen('Uchunguzi wa Fedha', colors.cyan)} />
            <Stack.Screen name="BudgetTracker" component={PlaceholderScreen('Bajeti', colors.orange)} />
            <Stack.Screen name="GroupPools" component={PlaceholderScreen('Vikundi vya Pesa', colors.purple)} />
            <Stack.Screen name="MultiCurrency" component={PlaceholderScreen('Sarafu za Kigeni', colors.cyan)} />
            <Stack.Screen name="GovernmentServices" component={PlaceholderScreen('Huduma za Serikali', colors.blue)} />
            <Stack.Screen name="Support" component={PlaceholderScreen('Msaada', colors.green)} />
            <Stack.Screen name="WalletDetail" component={PlaceholderScreen('Kadi za Dijitali', colors.purple)} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

function PlaceholderScreen(title: string, accentColor: string) {
  return function Screen({ navigation }: any) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.bg }}>
        <View style={{ paddingTop: 60, paddingBottom: 16, paddingHorizontal: 20, flexDirection: 'row', alignItems: 'center', gap: 12, borderBottomWidth: 1, borderBottomColor: colors.border }}>
          <Ionicons name="arrow-back" size={22} color={colors.white} onPress={() => navigation.goBack()} />
          <View style={{ flex: 1 }}>
            <View style={{ height: 6, width: 60, borderRadius: 3, backgroundColor: accentColor, marginBottom: 6 }} />
            <View style={{ fontSize: 18 } as any} />
          </View>
        </View>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: 16 }}>
          <View style={{ width: 80, height: 80, borderRadius: 24, backgroundColor: `${accentColor}20`, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: `${accentColor}40` }}>
            <Ionicons name="construct" size={32} color={accentColor} />
          </View>
          <View style={{ alignItems: 'center', gap: 6 }}>
            <View style={{ fontSize: 20, fontWeight: '700', color: colors.white } as any} />
            <View style={{ height: 22, width: 160, borderRadius: 4, backgroundColor: colors.bgCard, marginBottom: 4 }} />
            <View style={{ height: 14, width: 220, borderRadius: 3, backgroundColor: colors.bgCard }} />
          </View>
          <View style={{ backgroundColor: `${accentColor}15`, borderRadius: 12, paddingHorizontal: 20, paddingVertical: 10, borderWidth: 1, borderColor: `${accentColor}30` }}>
            <View style={{ fontSize: 14, color: accentColor } as any} />
          </View>
        </View>
      </View>
    );
  };
}
