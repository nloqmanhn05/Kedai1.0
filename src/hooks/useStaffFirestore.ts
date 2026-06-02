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
  serverTimestamp,
  orderBy,
  Timestamp,
} from 'firebase/firestore';
import { StaffMember } from '../pages/types';

export function useStaffFirestore() {
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Real-time listener for staff members
  useEffect(() => {
    const q = query(collection(db, 'staff'), orderBy('name', 'asc'));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const staffList = snapshot.docs.map((doc) => {
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
            lastLogin: data.lastLogin || 'Never logged in',
            status: data.status || 'Active',
            timestamp: data.timestamp?.toMillis() || Date.now(),
            attendanceDays: data.attendanceDays ?? 0,
            hoursWorked: data.hoursWorked ?? 0,
            totalPay: data.totalPay ?? 0,
            shiftStatus: data.shiftStatus || 'Ended',
            clockInTime: data.clockInTime || 'N/A',
            clockOutTime: data.clockOutTime || 'N/A',
            workHours: data.workHours ?? 0,
            clockInTimestamp: data.clockInTimestamp || undefined,
            lastAttendanceDate: data.lastAttendanceDate || undefined,
          } as StaffMember;
        });
        setStaff(staffList);
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

  // Add a new staff member — payroll stats start at zero
  const addStaff = async (
    staffData: any
  ) => {
    try {
      const pinVal = staffData.pin || staffData.clockInPin || '';
      await addDoc(collection(db, 'staff'), {
        ...staffData,
        clockInPin: pinVal,
        pin: pinVal,
        // Payroll tracking: starts at zero, accumulated by clock-in/out events
        attendanceDays: 0,
        hoursWorked: 0,
        totalPay: 0,
        lastAttendanceDate: '', // track last attendance day
        timestamp: serverTimestamp(),
      });
    } catch (err) {
      console.error('Error adding staff to Firestore:', err);
      throw err;
    }
  };

  // Update existing staff member
  const updateStaff = async (
    staffId: string,
    staffData: any
  ) => {
    try {
      const staffRef = doc(db, 'staff', staffId);
      const updateData: any = { ...staffData };
      if (staffData.pin || staffData.clockInPin) {
        const pinVal = staffData.pin || staffData.clockInPin || '';
        updateData.clockInPin = pinVal;
        updateData.pin = pinVal;
      }
      await updateDoc(staffRef, {
        ...updateData,
        timestamp: serverTimestamp(),
      });
    } catch (err) {
      console.error('Error updating staff in Firestore:', err);
      throw err;
    }
  };

  // Delete staff member
  const deleteStaff = async (staffId: string) => {
    try {
      await deleteDoc(doc(db, 'staff', staffId));
    } catch (err) {
      console.error('Error deleting staff from Firestore:', err);
      throw err;
    }
  };

  return { staff, loading, error, addStaff, updateStaff, deleteStaff };
}
