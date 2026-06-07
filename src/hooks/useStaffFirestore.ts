import { useState, useEffect } from 'react';
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
} from 'firebase/firestore';
import { StaffMember } from '../pages/types';

export function useStaffFirestore() {
  const [staffList, setStaffList] = useState<StaffMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Real-time listener for all staff members directly inside 'staff' collection
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
            // Consolidated summary fields
            clockInTime: data.clockInTime || 'N/A',
            clockOutTime: data.clockOutTime || 'N/A',
            workHours: data.workHours ?? 0,
            clockInTimestamp: data.clockInTimestamp || undefined,
            lastAttendanceDate: data.lastAttendanceDate || undefined,
            status: data.status || 'Active',
            lastLogin: data.lastLogin || 'Never logged in',
            timestamp: data.timestamp || Date.now(),
            cashEarned: data.cashEarned ?? 0,
            ewalletEarned: data.ewalletEarned ?? 0,
            totalTransaction: data.totalTransaction ?? 0,
            totalEarned: data.totalEarned ?? 0,
            // Consolidated report fields
            attendanceDays: data.attendanceDays ?? 0,
            hoursWorked: data.hoursWorked ?? 0,
            totalPay: data.totalPay ?? 0,
            shiftStatus: data.shiftStatus || 'Ended',
          } as StaffMember;
        });
        setStaffList(list);
        setLoading(false);
      },
      (err) => {
        console.error('Error fetching staff from Firestore:', err);
        setError(err.message);
        setLoading(false);
      }
    );

    return unsubscribe;
  }, []);

  // Add a new staff member with all tracking fields consolidated
  const addStaff = async (staffData: any) => {
    try {
      const pinVal = staffData.pin || staffData.clockInPin || '';
      
      const fields = {
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
        attendanceDays: 0,
        hoursWorked: 0,
        totalPay: 0,
        shiftStatus: 'Ended',
      };

      await addDoc(collection(db, 'staff'), fields);
    } catch (err) {
      console.error('Error adding staff to Firestore:', err);
      throw err;
    }
  };

  // Update staff fields directly in a single updateDoc call
  const updateStaff = async (staffId: string, staffData: any) => {
    try {
      // Normalize PIN updates if present
      const updates = { ...staffData };
      if (updates.pin || updates.clockInPin) {
        const pinVal = updates.pin || updates.clockInPin || '';
        updates.clockInPin = pinVal;
        updates.pin = pinVal;
      }

      await updateDoc(doc(db, 'staff', staffId), updates);
    } catch (err) {
      console.error('Error updating staff in Firestore:', err);
      throw err;
    }
  };

  // Delete staff member document
  const deleteStaff = async (staffId: string) => {
    try {
      await deleteDoc(doc(db, 'staff', staffId));
    } catch (err) {
      console.error('Error deleting staff from Firestore:', err);
      throw err;
    }
  };

  return { staff: staffList, loading, error, addStaff, updateStaff, deleteStaff };
}
