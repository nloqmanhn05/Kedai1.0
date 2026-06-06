import { useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { collection, onSnapshot, query, addDoc, serverTimestamp, orderBy, doc, deleteDoc } from 'firebase/firestore';
import { SalesTransaction } from '../pages/types';

export function useTransactionsFirestore() {
  const [transactions, setTransactions] = useState<SalesTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // We order by timestamp descending so the newest are first
    const q = query(collection(db, 'transactions'), orderBy('timestamp', 'desc'));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const txs = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          date: data.date,
          time: data.time,
          orderId: data.orderId,
          staffId: data.staffId || '',
          staffName: data.staffName,
          staffInitials: data.staffInitials,
          staffColor: data.staffColor,
          amount: data.amount,
          paymentMethod: data.paymentMethod,
          timestamp: data.timestamp?.toMillis() || Date.now(),
        } as SalesTransaction;
      });
      setTransactions(txs);
      setLoading(false);
    }, (err) => {
      console.error('Error fetching real-time transactions from Firestore:', err);
      setError(err.message);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const addTransaction = async (tx: Omit<SalesTransaction, 'id' | 'timestamp'>) => {
    try {
      await addDoc(collection(db, 'transactions'), {
        ...tx,
        timestamp: serverTimestamp()
      });
    } catch (err) {
      console.error('Error adding transaction to Firestore:', err);
      throw err;
    }
  };

  const deleteTransaction = async (id: string | number) => {
    try {
      const txRef = doc(db, 'transactions', String(id));
      await deleteDoc(txRef);
    } catch (err) {
      console.error('Error deleting transaction from Firestore:', err);
      throw err;
    }
  };

  return { transactions, loading, error, addTransaction, deleteTransaction };
}
