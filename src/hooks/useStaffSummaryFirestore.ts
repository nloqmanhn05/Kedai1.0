import { useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import {
  collection,
  onSnapshot,
  doc,
  setDoc,
  deleteDoc
} from 'firebase/firestore';

export interface StaffSummaryData {
  clockInTime: string;
  clockOutTime: string;
  workHours: number;
  clockInTimestamp?: number;
  lastAttendanceDate?: string;
  status: string;
  lastLogin: string;
  timestamp: number;
  cashEarned: number;
  ewalletEarned: number;
  totalTransaction: number;
  totalEarned: number;
}

export function useStaffSummaryFirestore() {
  const [summaries, setSummaries] = useState<Record<string, StaffSummaryData>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, 'staffsummary'),
      (snapshot) => {
        const dataMap: Record<string, StaffSummaryData> = {};
        snapshot.docs.forEach((doc) => {
          const data = doc.data();
          dataMap[doc.id] = {
            clockInTime: data.clockInTime || 'N/A',
            clockOutTime: data.clockOutTime || 'N/A',
            workHours: data.workHours ?? 0,
            clockInTimestamp: data.clockInTimestamp || undefined,
            lastAttendanceDate: data.lastAttendanceDate || undefined,
            status: data.status || 'Active',
            lastLogin: data.lastLogin || 'Never logged in',
            timestamp: data.timestamp?.toMillis() || data.timestamp || Date.now(),
            cashEarned: data.cashEarned ?? 0,
            ewalletEarned: data.ewalletEarned ?? 0,
            totalTransaction: data.totalTransaction ?? 0,
            totalEarned: data.totalEarned ?? 0,
          };
        });
        setSummaries(dataMap);
        setLoading(false);
      },
      (err) => {
        console.error('Error fetching staff summaries:', err);
        setError(err.message);
        setLoading(false);
      }
    );

    return unsubscribe;
  }, []);

  const updateSummary = async (staffId: string, data: Partial<StaffSummaryData>) => {
    try {
      const summaryRef = doc(db, 'staffsummary', staffId);
      await setDoc(summaryRef, data, { merge: true });
    } catch (err) {
      console.error('Error updating staffsummary doc:', err);
      throw err;
    }
  };

  const deleteSummary = async (staffId: string) => {
    try {
      await deleteDoc(doc(db, 'staffsummary', staffId));
    } catch (err) {
      console.error('Error deleting staffsummary doc:', err);
      throw err;
    }
  };

  return { summaries, loading, error, updateSummary, deleteSummary };
}
