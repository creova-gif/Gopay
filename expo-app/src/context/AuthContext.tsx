import React, { createContext, useContext, useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';

export type User = {
  id: string;
  email: string;
  name: string;
  phone: string;
  balance: number;
  loyaltyPoints: number;
};

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (data: Partial<User> & { password: string }) => Promise<void>;
  signOut: () => void;
  updateUser: (data: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    SecureStore.getItemAsync('gopay_user').then((val) => {
      if (val) setUser(JSON.parse(val));
      setIsLoading(false);
    });
  }, []);

  const signIn = async (email: string, _password: string) => {
    const demoUser: User = {
      id: '1',
      email,
      name: 'Juma Mwangi',
      phone: '+255 712 345 678',
      balance: 2_450_000,
      loyaltyPoints: 3_840,
    };
    setUser(demoUser);
    await SecureStore.setItemAsync('gopay_user', JSON.stringify(demoUser));
  };

  const signUp = async (data: Partial<User> & { password: string }) => {
    const newUser: User = {
      id: Date.now().toString(),
      email: data.email ?? '',
      name: data.name ?? '',
      phone: data.phone ?? '',
      balance: 0,
      loyaltyPoints: 100,
    };
    setUser(newUser);
    await SecureStore.setItemAsync('gopay_user', JSON.stringify(newUser));
  };

  const signOut = async () => {
    setUser(null);
    await SecureStore.deleteItemAsync('gopay_user');
  };

  const updateUser = (data: Partial<User>) => {
    if (!user) return;
    const updated = { ...user, ...data };
    setUser(updated);
    SecureStore.setItemAsync('gopay_user', JSON.stringify(updated));
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, signIn, signUp, signOut, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
