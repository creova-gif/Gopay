import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';

export interface QueuedPayment {
  id: string;
  type: 'send' | 'bill' | 'airtime';
  payload: Record<string, unknown>;
  endpoint: string;
  accessToken: string;
  createdAt: number;
  retries: number;
}

const DB_NAME = 'gopay_offline';
const STORE_NAME = 'payment_queue';
const MAX_RETRIES = 3;

async function getDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1);
    req.onupgradeneeded = () => {
      req.result.createObjectStore(STORE_NAME, { keyPath: 'id' });
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function getAllQueued(): Promise<QueuedPayment[]> {
  const db = await getDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readonly');
    const req = tx.objectStore(STORE_NAME).getAll();
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function removeQueued(id: string): Promise<void> {
  const db = await getDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const req = tx.objectStore(STORE_NAME).delete(id);
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
}

async function saveQueued(payment: QueuedPayment): Promise<void> {
  const db = await getDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const req = tx.objectStore(STORE_NAME).put(payment);
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
}

export function useOfflineQueue() {
  const [queuedCount, setQueuedCount] = useState(0);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  const refreshCount = useCallback(async () => {
    const items = await getAllQueued();
    setQueuedCount(items.length);
  }, []);

  const enqueue = useCallback(async (payment: Omit<QueuedPayment, 'id' | 'createdAt' | 'retries'>) => {
    const queued: QueuedPayment = {
      ...payment,
      id: `q_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      createdAt: Date.now(),
      retries: 0,
    };
    await saveQueued(queued);
    await refreshCount();
    toast.info('Mtandao hauko. Malipo yatumwa mtandao ukiwepo.', {
      description: 'Payment queued for when you\'re back online',
    });
  }, [refreshCount]);

  const processQueue = useCallback(async () => {
    if (!navigator.onLine) return;
    const items = await getAllQueued();
    if (items.length === 0) return;

    toast.info(`Kutuma malipo ${items.length} yaliyosubiri...`);

    for (const item of items) {
      try {
        const response = await fetch(item.endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${item.accessToken}`,
          },
          body: JSON.stringify(item.payload),
        });

        if (response.ok) {
          await removeQueued(item.id);
          toast.success('Malipo yaliyosubiri yametumwa!');
        } else if (item.retries >= MAX_RETRIES) {
          await removeQueued(item.id);
          toast.error('Malipo hayakufanikiwa baada ya majaribio mengi.');
        } else {
          await saveQueued({ ...item, retries: item.retries + 1 });
        }
      } catch {
        // Network still unavailable
      }
    }
    await refreshCount();
  }, [refreshCount]);

  useEffect(() => {
    refreshCount();

    const handleOnline = () => {
      setIsOnline(true);
      processQueue();
    };
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [processQueue, refreshCount]);

  return { queuedCount, isOnline, enqueue, processQueue };
}
