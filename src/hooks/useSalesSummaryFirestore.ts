import { useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';

export interface SalesSummary {
  startingCash: number;
  expectedCash: number;
  grossSalesBaseline: number;
  refund: number;
  cashCollected: number;
  eWalletCollected: number;
}

const DEFAULT_SUMMARY: SalesSummary = {
  startingCash: 5420,
  expectedCash: 8200,
  grossSalesBaseline: 12450,
  refund: 150,
  cashCollected: 31875,
  eWalletCollected: 10625
};

export function useSalesSummaryFirestore() {
  const [summary, setSummary] = useState<SalesSummary>(DEFAULT_SUMMARY);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const docRef = doc(db, 'sales_summary', 'current');
    
    const unsubscribe = onSnapshot(docRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        setSummary({
          startingCash: typeof data.startingCash === 'number' ? data.startingCash : DEFAULT_SUMMARY.startingCash,
          expectedCash: typeof data.expectedCash === 'number' ? data.expectedCash : DEFAULT_SUMMARY.expectedCash,
          grossSalesBaseline: typeof data.grossSalesBaseline === 'number' ? data.grossSalesBaseline : DEFAULT_SUMMARY.grossSalesBaseline,
          refund: typeof data.refund === 'number' ? data.refund : DEFAULT_SUMMARY.refund,
          cashCollected: typeof data.cashCollected === 'number' ? data.cashCollected : DEFAULT_SUMMARY.cashCollected,
          eWalletCollected: typeof data.eWalletCollected === 'number' ? data.eWalletCollected : DEFAULT_SUMMARY.eWalletCollected
        });
      } else {
        // Document doesn't exist, initialize it with default values
        setDoc(docRef, DEFAULT_SUMMARY).catch((err) => {
          console.error('Error initializing sales summary in Firestore:', err);
        });
      }
      setLoading(false);
    }, (err) => {
      console.error('Error fetching sales summary from Firestore:', err);
      setError(err.message);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const updateSummary = async (newFields: Partial<SalesSummary>) => {
    try {
      const docRef = doc(db, 'sales_summary', 'current');
      await setDoc(docRef, {
        ...summary,
        ...newFields
      }, { merge: true });
    } catch (err) {
      console.error('Error updating sales summary in Firestore:', err);
      throw err;
    }
  };

  return { summary, loading, error, updateSummary };
}
