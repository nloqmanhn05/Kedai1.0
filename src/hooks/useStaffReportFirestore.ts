import { useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import {
  collection,
  onSnapshot,
  doc,
  setDoc,
  deleteDoc
} from 'firebase/firestore';

export interface StaffReportData {
  attendanceDays: number;
  hoursWorked: number;
  totalPay: number;
  shiftStatus: string;
}

export function useStaffReportFirestore() {
  const [reports, setReports] = useState<Record<string, StaffReportData>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, 'staffreport'),
      (snapshot) => {
        const dataMap: Record<string, StaffReportData> = {};
        snapshot.docs.forEach((doc) => {
          const data = doc.data();
          dataMap[doc.id] = {
            attendanceDays: data.attendanceDays ?? 0,
            hoursWorked: data.hoursWorked ?? 0,
            totalPay: data.totalPay ?? 0,
            shiftStatus: data.shiftStatus || 'Ended',
          };
        });
        setReports(dataMap);
        setLoading(false);
      },
      (err) => {
        console.error('Error fetching staff reports:', err);
        setError(err.message);
        setLoading(false);
      }
    );

    return unsubscribe;
  }, []);

  const updateReport = async (staffId: string, data: Partial<StaffReportData>) => {
    try {
      const reportRef = doc(db, 'staffreport', staffId);
      await setDoc(reportRef, data, { merge: true });
    } catch (err) {
      console.error('Error updating staffreport doc:', err);
      throw err;
    }
  };

  const deleteReport = async (staffId: string) => {
    try {
      await deleteDoc(doc(db, 'staffreport', staffId));
    } catch (err) {
      console.error('Error deleting staffreport doc:', err);
      throw err;
    }
  };

  return { reports, loading, error, updateReport, deleteReport };
}
