/**
 * React Hook for Secure Storage with Encryption
 * - Automatically encrypts/decrypts data
 * - Stores encrypted data in localStorage
 * - Uses user's PIN/password as encryption key
 */

import { useState, useEffect, useCallback } from 'react';
import encryption from '../utils/encryption';

interface SecureStorageOptions {
  key: string;
  password: string;
  defaultValue?: any;
}

export function useSecureStorage<T>({ 
  key, 
  password, 
  defaultValue = null 
}: SecureStorageOptions) {
  const [value, setValue] = useState<T | null>(defaultValue);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load encrypted data on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const decryptedData = await encryption.secureLocalStorageGet(key, password);
        setValue(decryptedData || defaultValue);
        setError(null);
      } catch (err) {
        console.error('Failed to load secure storage:', err);
        setError('Failed to decrypt data');
        setValue(defaultValue);
      } finally {
        setLoading(false);
      }
    };

    if (password) {
      loadData();
    }
  }, [key, password]);

  // Save encrypted data
  const setSecureValue = useCallback(async (newValue: T) => {
    try {
      await encryption.secureLocalStorageSet(key, newValue, password);
      setValue(newValue);
      setError(null);
      return true;
    } catch (err) {
      console.error('Failed to save secure storage:', err);
      setError('Failed to encrypt data');
      return false;
    }
  }, [key, password]);

  // Remove encrypted data
  const removeSecureValue = useCallback(() => {
    try {
      localStorage.removeItem(key);
      setValue(null);
      setError(null);
      return true;
    } catch (err) {
      console.error('Failed to remove secure storage:', err);
      setError('Failed to remove data');
      return false;
    }
  }, [key]);

  return {
    value,
    setValue: setSecureValue,
    removeValue: removeSecureValue,
    loading,
    error
  };
}

/**
 * Hook for encrypting transaction data before sending to backend
 */
export function useEncryptedTransaction() {
  const [isEncrypting, setIsEncrypting] = useState(false);

  const encryptTransaction = useCallback(async (
    transactionData: any,
    userPassword: string
  ): Promise<string | null> => {
    try {
      setIsEncrypting(true);
      const encrypted = await encryption.encryptTransaction(transactionData, userPassword);
      return encrypted;
    } catch (error) {
      console.error('Transaction encryption failed:', error);
      return null;
    } finally {
      setIsEncrypting(false);
    }
  }, []);

  const decryptTransaction = useCallback(async (
    encryptedData: string,
    userPassword: string
  ): Promise<any | null> => {
    try {
      const decrypted = await encryption.decryptTransaction(encryptedData, userPassword);
      return decrypted;
    } catch (error) {
      console.error('Transaction decryption failed:', error);
      return null;
    }
  }, []);

  return {
    encryptTransaction,
    decryptTransaction,
    isEncrypting
  };
}

/**
 * Hook for secure password/PIN management
 */
export function useSecureAuth() {
  const hashPassword = useCallback(async (password: string): Promise<string | null> => {
    try {
      return await encryption.hashPassword(password);
    } catch (error) {
      console.error('Password hashing failed:', error);
      return null;
    }
  }, []);

  const verifyPassword = useCallback(async (
    password: string,
    hash: string
  ): Promise<boolean> => {
    try {
      return await encryption.verifyPassword(password, hash);
    } catch (error) {
      console.error('Password verification failed:', error);
      return false;
    }
  }, []);

  const generateSecurePin = useCallback((): string => {
    // Generate cryptographically secure 4-digit PIN
    const array = new Uint8Array(1);
    let pin = '';
    while (pin.length < 4) {
      crypto.getRandomValues(array);
      const digit = array[0] % 10;
      pin += digit.toString();
    }
    return pin;
  }, []);

  return {
    hashPassword,
    verifyPassword,
    generateSecurePin
  };
}
