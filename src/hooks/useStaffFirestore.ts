import { useState, useEffect, useMemo } from 'react';
import { db } from '../lib/firebase';
import {
  collection,
  onSnapshot,
  query,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  orderBy,
  setDoc,
} from 'firebase/firestore';
import { StaffMember } from '../pages/types';
import { useStaffSummaryFirestore, StaffSummaryData } from './useStaffSummaryFirestore';
import { useStaffReportFirestore, StaffReportData } from './useStaffReportFirestore';

export function useStaffFirestore() {
  const [staffList, setStaffList] = useState<any[]>([]);
  const [loadingStaff, setLoadingStaff] = useState(true);
  const [errorStaff, setErrorStaff] = useState<string | null>(null);

  const {
    summaries,
    loading: loadingSummary,
    error: errorSummary,
    updateSummary,
    deleteSummary
  } = useStaffSummaryFirestore();

  const {
    reports,
    loading: loadingReport,
    error: errorReport,
    updateReport,
    deleteReport
  } = useStaffReportFirestore();

  // Real-time listener for core staff members
  useEffect(() => {
    const q = query(collection(db, 'staff'), orderBy('name', 'asc'));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const list = snapshot.docs.map((doc) => {
          const data = doc.data();
          const pinVal = data.pin || data.clockInPin || '';
          return {
            id: doc.id,
            name: data.name || '',
            email: data.email || '',
            role: data.role || '',
            joinDate: data.joinDate || '',
            phone: data.phone || undefined,
            clockInPin: pinVal,
            pin: pinVal,
            ic: data.ic || '',
            shift: data.shift || 'Morning',
            rate: data.rate || '6.00',
          };
        });
        setStaffList(list);
        setLoadingStaff(false);
      },
      (err) => {
        console.error('Error fetching staff from Firestore:', err);
        setErrorStaff(err.message);
        setLoadingStaff(false);
      }
    );

    return unsubscribe;
  }, []);

  // Combine core staff, summaries, and reports
  const staff = useMemo(() => {
    return staffList.map((item) => {
      const summary = (summaries[item.id] || {}) as Partial<StaffSummaryData>;
      const report = (reports[item.id] || {}) as Partial<StaffReportData>;
      return {
        ...item,
        // Summary fields
        clockInTime: summary.clockInTime || 'N/A',
        clockOutTime: summary.clockOutTime || 'N/A',
        workHours: summary.workHours ?? 0,
        clockInTimestamp: summary.clockInTimestamp,
        lastAttendanceDate: summary.lastAttendanceDate,
        status: summary.status || 'Active',
        lastLogin: summary.lastLogin || 'Never logged in',
        timestamp: summary.timestamp || Date.now(),
        cashEarned: summary.cashEarned ?? 0,
        ewalletEarned: summary.ewalletEarned ?? 0,
        totalTransaction: summary.totalTransaction ?? 0,
        totalEarned: summary.totalEarned ?? 0,
        // Report fields
        attendanceDays: report.attendanceDays ?? 0,
        hoursWorked: report.hoursWorked ?? 0,
        totalPay: report.totalPay ?? 0,
        shiftStatus: report.shiftStatus || 'Ended',
      } as StaffMember;
    });
  }, [staffList, summaries, reports]);

  const loading = loadingStaff || loadingSummary || loadingReport;
  const error = errorStaff || errorSummary || errorReport;

  // Add a new staff member
  const addStaff = async (staffData: any) => {
    try {
      const pinVal = staffData.pin || staffData.clockInPin || '';
      
      // Separate core staff fields
      const coreFields = {
        name: staffData.name || '',
        email: staffData.email || '',
        role: staffData.role || '',
        joinDate: staffData.joinDate || '',
        phone: staffData.phone || null,
        clockInPin: pinVal,
        pin: pinVal,
        ic: staffData.ic || '',
        shift: staffData.shift || 'Morning',
        rate: staffData.rate || '6.00',
      };

      // Add to core collection
      const docRef = await addDoc(collection(db, 'staff'), coreFields);
      const staffId = docRef.id;

      // Add corresponding summary document
      await setDoc(doc(db, 'staffsummary', staffId), {
        clockInTime: 'N/A',
        clockOutTime: 'N/A',
        workHours: 0,
        clockInTimestamp: null,
        lastAttendanceDate: '',
        status: 'Active',
        lastLogin: 'Never logged in',
        timestamp: Date.now(),
        cashEarned: 0,
        ewalletEarned: 0,
        totalTransaction: 0,
        totalEarned: 0,
      });

      // Add corresponding report document
      await setDoc(doc(db, 'staffreport', staffId), {
        attendanceDays: 0,
        hoursWorked: 0,
        totalPay: 0,
        shiftStatus: 'Ended',
      });
    } catch (err) {
      console.error('Error adding staff to Firestore:', err);
      throw err;
    }
  };

  // Update existing staff member
  const updateStaff = async (staffId: string, staffData: any) => {
    try {
      const coreKeys = [
        'name', 'email', 'role', 'pin', 'clockInPin', 'ic', 'rate', 'shift', 'phone', 'joinDate'
      ];
      const summaryKeys = [
        'clockInTime', 'clockOutTime', 'workHours', 'clockInTimestamp', 'lastAttendanceDate',
        'status', 'lastLogin', 'timestamp', 'cashEarned', 'ewalletEarned', 'totalTransaction', 'totalEarned'
      ];
      const reportKeys = [
        'attendanceDays', 'hoursWorked', 'totalPay', 'shiftStatus'
      ];

      const coreFields: any = {};
      const summaryFields: any = {};
      const reportFields: any = {};

      Object.keys(staffData).forEach((key) => {
        if (coreKeys.includes(key)) {
          coreFields[key] = staffData[key];
        } else if (summaryKeys.includes(key)) {
          summaryFields[key] = staffData[key];
        } else if (reportKeys.includes(key)) {
          reportFields[key] = staffData[key];
        } else {
          // Default fallback
          coreFields[key] = staffData[key];
        }
      });

      if (staffData.pin || staffData.clockInPin) {
        const pinVal = staffData.pin || staffData.clockInPin || '';
        coreFields.clockInPin = pinVal;
        coreFields.pin = pinVal;
      }

      const promises: Promise<any>[] = [];

      if (Object.keys(coreFields).length > 0) {
        promises.push(updateDoc(doc(db, 'staff', staffId), coreFields));
      }
      if (Object.keys(summaryFields).length > 0) {
        promises.push(updateSummary(staffId, summaryFields));
      }
      if (Object.keys(reportFields).length > 0) {
        promises.push(updateReport(staffId, reportFields));
      }

      await Promise.all(promises);
    } catch (err) {
      console.error('Error updating staff in Firestore:', err);
      throw err;
    }
  };

  // Delete staff member
  const deleteStaff = async (staffId: string) => {
    try {
      await Promise.all([
        deleteDoc(doc(db, 'staff', staffId)),
        deleteSummary(staffId),
        deleteReport(staffId),
      ]);
    } catch (err) {
      console.error('Error deleting staff from Firestore:', err);
      throw err;
    }
  };

  return { staff, loading, error, addStaff, updateStaff, deleteStaff };
}
