import React, { useState, useMemo, useEffect } from 'react';
import { Layout } from '../components/Layout';
import { motion, AnimatePresence } from 'framer-motion';
import { useStaffFirestore } from '../hooks/useStaffFirestore';
import { StaffMember } from './types';

// Extended interface for UI display (includes payroll/attendance data)
interface StaffDisplay extends StaffMember {
  attendance?: string;
  attendancePct?: number;
  hours?: number;
  rate?: number;
  totalPay?: number;
  status?: 'Paid' | 'Pending';
}



export default function Staff() {
  // Fetch staff from Firestore
  const { staff: firestoreStaff, loading, error, updateStaff, deleteStaff } = useStaffFirestore();
  
  // Enhanced staff list with UI data
  const [staffList, setStaffList] = useState<StaffDisplay[]>(() => {
    const saved = localStorage.getItem('wise_staff_accounts');
    if (saved) {
      try {
        const accounts = JSON.parse(saved);
        return accounts.map((acc: any) => ({
          id: acc.id,
          name: acc.name,
          email: acc.email,
          role: acc.position || 'Staff',
          joinDate: acc.joinDate || '01 Jan 2026',
          phone: acc.phone,
          clockInPin: acc.clockInPin || '',
          attendance: '22/22 days',
          attendancePct: 100,
          hours: 160,
          rate: 6.00,
          totalPay: 960.00,
          status: acc.status === 'Active' ? 'Pending' : 'Pending'
        }));
      } catch (e) {}
    }
    return [];
  });

  // Sync Firestore data with local state — new staff start at zero, accumulate as they clock in/out
  useEffect(() => {
    if (firestoreStaff.length > 0) {
      const enhancedStaff = firestoreStaff.map(staff => {
        const s = staff as any;
        // Read persisted payroll stats from Firestore (default to 0 for brand-new staff)
        const attendanceDays: number = s.attendanceDays ?? 0;
        const hoursWorked: number = s.hoursWorked ?? 0;
        const hourlyRate: number = parseFloat(s.rate) || 6.00;
        const totalPay: number = s.totalPay ?? (hoursWorked * hourlyRate);
        const totalWorkDays = 22; // current month work days
        const attendancePct = totalWorkDays > 0 ? Math.round((attendanceDays / totalWorkDays) * 100) : 0;

        return {
          ...staff,
          attendance: `${attendanceDays}/${totalWorkDays} days`,
          attendancePct,
          hours: hoursWorked,
          rate: hourlyRate,
          totalPay,
          status: 'Pending' as const
        };
      });
      setStaffList(enhancedStaff);
    }
  }, [firestoreStaff]);

  // Still listen for registry changes from Settings page (for backwards compatibility)
  // New staff from Settings start at zero
  useEffect(() => {
    const handleUpdate = () => {
      // Firestore real-time listener will pick up changes — no extra sync needed here
      // But if Firestore hasn't loaded yet, fall back to localStorage
      if (firestoreStaff.length === 0) {
        const saved = localStorage.getItem('wise_staff_accounts');
        if (saved) {
          try {
            const accounts = JSON.parse(saved);
            setStaffList(accounts.map((acc: any) => ({
              id: acc.id,
              name: acc.name,
              email: acc.email,
              role: acc.position || 'Staff',
              joinDate: acc.joinDate || '01 Jan 2026',
              phone: acc.phone,
              clockInPin: acc.verificationId || acc.clockInPin || '',
              // New staff always start at zero — no fake data
              attendance: '0/22 days',
              attendancePct: 0,
              hours: 0,
              rate: parseFloat(acc.rate) || 6.00,
              totalPay: 0,
              status: 'Pending' as const
            })));
          } catch (e) {}
        }
      }
    };
    window.addEventListener('staffAccountsUpdated', handleUpdate);
    return () => window.removeEventListener('staffAccountsUpdated', handleUpdate);
  }, [firestoreStaff]);

  const [searchQuery, setSearchQuery] = useState('');
  const [inactiveStaffCount, setInactiveStaffCount] = useState(2);

  // Filtered staff list
  const filteredStaff = useMemo(() => {
    if (!searchQuery) return staffList;
    const query = searchQuery.toLowerCase();
    return staffList.filter(
      (s) =>
        s.name.toLowerCase().includes(query) ||
        s.email.toLowerCase().includes(query) ||
        s.role.toLowerCase().includes(query)
    );
  }, [staffList, searchQuery]);

  // Aggregate metrics
  const totalStaffCount = staffList.length;
  const avgAttendance = useMemo(() => {
    if (staffList.length === 0) return 0;
    const sum = staffList.reduce((acc, curr) => acc + curr.attendancePct, 0);
    return Math.round(sum / staffList.length);
  }, [staffList]);

  const totalHoursWorked = useMemo(() => {
    return staffList.reduce((acc, curr) => acc + curr.hours, 0);
  }, [staffList]);

  const totalPayAmount = useMemo(() => {
    return staffList.reduce((acc, curr) => acc + curr.totalPay, 0);
  }, [staffList]);

  const handleRemoveStaff = async (id: string | number) => {
    if (confirm('Are you sure you want to remove this staff member?')) {
      setStaffList(staffList.filter(s => s.id !== id));
      
      // Clear from local storage
      const saved = localStorage.getItem('wise_staff_accounts');
      if (saved) {
        try {
          const accounts = JSON.parse(saved);
          const filteredAccounts = accounts.filter((acc: any) => acc.id !== id && String(acc.id) !== String(id));
          localStorage.setItem('wise_staff_accounts', JSON.stringify(filteredAccounts));
          window.dispatchEvent(new Event('staffAccountsUpdated'));
        } catch (e) {
          console.error(e);
        }
      }

      // Also delete from Firestore if it's a string ID (Firestore doc ID)
      if (typeof id === 'string') {
        try {
          await deleteStaff(id);
        } catch (err) {
          console.error('Error deleting staff from Firestore:', err);
          alert('Failed to delete staff member from database');
        }
      }
    }
  };

  return (
    <Layout title="MyStaff">
      <div className="w-full max-w-[1600px] mx-auto flex flex-col min-h-0 gap-6">
        


        {/* Summary Chips */}
        <div className="flex flex-wrap gap-2">
          <div className="bg-surface-container-high rounded-full px-3.5 py-1.5 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
            <span className="text-xs font-bold text-on-surface">{totalStaffCount} Active Staff</span>
          </div>
          <div className="bg-surface-container-high rounded-full px-3.5 py-1.5 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-outline"></span>
            <span className="text-xs font-bold text-on-surface">{inactiveStaffCount} Inactive Staff</span>
          </div>
          <div className="bg-primary text-white rounded-full px-3.5 py-1.5 flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[16px] text-white">payments</span>
            <span className="text-xs font-bold text-white">Base Rate: RM 6.00/hr</span>
          </div>
        </div>

        {/* Section 1: STAFF MANAGEMENT (High Density M3 Card) */}
        <section className="bg-surface-container-lowest rounded-3xl shadow-sm border border-outline-variant/30 overflow-hidden">
          
          {/* Header / Controls */}
          <div className="px-8 py-5 border-b border-outline-variant/20 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 bg-surface-container-low/30">
            <div>
              <h3 className="text-title-lg font-bold text-on-surface">Manage Staff</h3>
              <p className="text-xs text-outline font-medium mt-0.5">Perform edits, view attendance logs, and compile payroll totals.</p>
            </div>
            
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto">
              <div className="relative flex-1 sm:w-80">
                <input 
                  type="text" 
                  placeholder="Search staff..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-2.5 bg-surface-container border-none rounded-full text-sm text-on-surface focus:ring-2 focus:ring-primary focus:bg-surface transition-all placeholder:text-outline/80"
                />
              </div>
            </div>
          </div>

          {/* Main Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[1000px] table-fixed">
              <colgroup>
                <col className="w-[210px]" />
                <col className="w-[140px]" />
                <col className="w-[140px]" />
                <col className="w-[140px]" />
                <col className="w-[150px]" />
                <col className="w-[150px]" />
                <col className="w-[150px]" />
                <col className="w-[120px]" />
                <col className="w-[120px]" />
              </colgroup>
              <thead>
                <tr className="bg-surface-container-low border-b border-outline-variant/30 text-outline font-label-sm text-[11px] font-bold uppercase tracking-wider">
                  <th className="py-3 px-8 font-semibold">Staff</th>
                  <th className="py-3 px-4 font-semibold">Position</th>
                  <th className="py-3 px-4 font-semibold">Start Date</th>
                  <th className="py-3 px-4 font-semibold">Attendance</th>
                  <th className="py-3 px-4 font-semibold">Hours Worked</th>
                  <th className="py-3 px-4 font-semibold">Rate</th>
                  <th className="py-3 px-4 font-semibold bg-primary-fixed-dim/15">Total Pay</th>
                  <th className="py-3 px-4 font-semibold text-center">Status</th>
                  <th className="py-3 px-8 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              
              <tbody className="divide-y divide-outline-variant/10 bg-surface-container-lowest/40">
                <AnimatePresence mode="popLayout">
                  {filteredStaff.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="p-8 text-center text-outline font-medium">
                        No team members match your search criteria.
                      </td>
                    </tr>
                  ) : (
                    filteredStaff.map((staff) => (
                      <motion.tr 
                        layout
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        key={staff.id} 
                        className="hover:bg-surface-container-low/40 transition-colors group"
                      >
                        <td className="p-4 pl-6">
                          <div className="min-w-0">
                            <div className="font-title-md font-bold text-on-surface text-sm truncate">{staff.name}</div>
                            <div className="text-[11px] text-outline truncate font-medium">{staff.email}</div>
                          </div>
                        </td>
                        
                        <td className="p-4">
                          <span className="inline-flex items-center px-3 py-1 rounded-full border border-outline-variant/30 text-[11px] font-bold text-on-surface-variant bg-surface-container-low/30">
                            {staff.role}
                          </span>
                        </td>
                        
                        <td className="p-4">
                          <div className="font-body-md text-xs text-on-surface-variant font-mono">{staff.joinDate}</div>
                        </td>
                        
                        <td className="p-4">
                          <div className="font-body-md text-xs text-on-surface mb-1 font-semibold">{staff.attendance}</div>
                          <div className="w-24 h-1.5 bg-surface-container rounded-full overflow-hidden border border-outline-variant/10">
                            <div 
                              className="bg-primary h-full rounded-full transition-all duration-500" 
                              style={{ width: `${staff.attendancePct}%` }}
                            ></div>
                          </div>
                        </td>
                        
                        <td className="p-4">
                          <div className="font-title-md font-bold text-on-surface text-sm font-mono">{staff.hours} hrs</div>
                          <div className="text-[10px] text-outline font-semibold">avg 8 hrs/day</div>
                        </td>
                        
                        <td className="p-4">
                          <div className="font-body-md text-xs text-on-surface-variant font-mono">RM {staff.rate.toFixed(2)} / hr</div>
                        </td>
                        
                        <td className="p-4 bg-primary-fixed-dim/5 font-mono">
                          <div className="font-title-md text-primary font-extrabold text-[14px]">
                            RM {staff.totalPay.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </div>
                        </td>
                        
                        <td className="p-4 text-center">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-[11px] font-bold ${
                            staff.status === 'Paid' 
                              ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' 
                              : 'bg-surface-container-high text-on-surface-variant border border-outline-variant/40'
                          }`}>
                            {staff.status}
                          </span>
                        </td>
                        
                        <td className="p-4 pr-6 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button className="w-8 h-8 flex items-center justify-center text-outline hover:bg-surface-container hover:text-on-surface rounded-full transition-colors">
                              <span className="material-symbols-outlined text-[18px]">edit</span>
                            </button>
                            <button 
                              onClick={() => handleRemoveStaff(staff.id)}
                              className="w-8 h-8 flex items-center justify-center text-outline hover:bg-error-container hover:text-error rounded-full transition-colors"
                            >
                              <span className="material-symbols-outlined text-[18px]">delete</span>
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    ))
                  )}
                </AnimatePresence>
              </tbody>
              
              <tfoot>
                <tr className="bg-primary-container text-on-primary-container font-title-md text-sm border-t border-primary/20">
                  <td className="py-4 px-8 rounded-bl-3xl font-bold" colSpan={3}>
                    Total Summary ({filteredStaff.length} Staff Shown)
                  </td>
                  <td className="p-4 font-bold font-mono">Avg: {avgAttendance}%</td>
                  <td className="p-4 font-bold font-mono">{totalHoursWorked.toLocaleString()} hrs</td>
                  <td className="p-4">-</td>
                  <td className="p-4 font-extrabold font-mono" colSpan={3}>
                    RM {totalPayAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </section>

      </div>
    </Layout>
  );
}
