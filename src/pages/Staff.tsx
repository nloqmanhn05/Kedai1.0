import React, { useState, useMemo, useEffect } from 'react';
import { Layout } from '../components/Layout';
import { motion, AnimatePresence } from 'framer-motion';

interface StaffMember {
  id: string | number;
  name: string;
  email: string;
  role: string;
  joinDate: string;
  attendance: string;
  attendancePct: number;
  hours: number;
  rate: number;
  totalPay: number;
  status: 'Paid' | 'Pending';
}

const initialStaff: StaffMember[] = [
  {
    id: 1,
    name: 'Ahmad Razali',
    email: 'ahmad.r@example.com',
    role: 'Cashier',
    joinDate: '01 Jan 2026',
    attendance: '20/22 days',
    attendancePct: 90,
    hours: 160,
    rate: 6.00,
    totalPay: 960.00,
    status: 'Paid'
  },
  {
    id: 2,
    name: 'Sarah Lee',
    email: 'sarah.l@example.com',
    role: 'Supervisor',
    joinDate: '15 Mar 2025',
    attendance: '22/22 days',
    attendancePct: 100,
    hours: 176,
    rate: 8.00,
    totalPay: 1408.00,
    status: 'Pending'
  },
  {
    id: 3,
    name: 'Siti Aminah',
    email: 'siti.a@example.com',
    role: 'Kitchen Staff',
    joinDate: '10 Feb 2024',
    attendance: '21/22 days',
    attendancePct: 95,
    hours: 168,
    rate: 6.00,
    totalPay: 1008.00,
    status: 'Paid'
  },
  {
    id: 4,
    name: 'Lim Wei Kang',
    email: 'lim.w@example.com',
    role: 'Service Staff',
    joinDate: '01 Mar 2024',
    attendance: '19/22 days',
    attendancePct: 86,
    hours: 152,
    rate: 6.00,
    totalPay: 912.00,
    status: 'Paid'
  },
  {
    id: 5,
    name: 'Sarah Tan',
    email: 'sarah.t@example.com',
    role: 'Service Staff',
    joinDate: '12 Apr 2024',
    attendance: '18/22 days',
    attendancePct: 82,
    hours: 144,
    rate: 6.00,
    totalPay: 864.00,
    status: 'Paid'
  },
  {
    id: 6,
    name: 'Ahmad Faiz',
    email: 'ahmad.f@example.com',
    role: 'Head Chef',
    joinDate: '15 Jan 2024',
    attendance: '22/22 days',
    attendancePct: 100,
    hours: 176,
    rate: 10.00,
    totalPay: 1760.00,
    status: 'Paid'
  },
  {
    id: 7,
    name: 'Mei Ling',
    email: 'mei.l@example.com',
    role: 'Kitchen Staff',
    joinDate: '20 May 2024',
    attendance: '20/22 days',
    attendancePct: 90,
    hours: 160,
    rate: 6.00,
    totalPay: 960.00,
    status: 'Paid'
  },
  {
    id: 8,
    name: 'Mohd Razak',
    email: 'razak.m@example.com',
    role: 'Supervisor',
    joinDate: '01 Jun 2024',
    attendance: '21/22 days',
    attendancePct: 95,
    hours: 168,
    rate: 8.00,
    totalPay: 1344.00,
    status: 'Pending'
  },
  {
    id: 9,
    name: 'Jane Doe',
    email: 'jane.d@example.com',
    role: 'Cleaner',
    joinDate: '10 Jul 2024',
    attendance: '20/22 days',
    attendancePct: 90,
    hours: 160,
    rate: 5.50,
    totalPay: 880.00,
    status: 'Paid'
  },
  {
    id: 10,
    name: 'John Smith',
    email: 'john.s@example.com',
    role: 'Kitchen Staff',
    joinDate: '01 Aug 2024',
    attendance: '18/22 days',
    attendancePct: 82,
    hours: 144,
    rate: 6.00,
    totalPay: 864.00,
    status: 'Paid'
  },
  {
    id: 11,
    name: 'Alex Wong',
    email: 'alex.w@example.com',
    role: 'Cashier',
    joinDate: '15 Sep 2024',
    attendance: '21/22 days',
    attendancePct: 95,
    hours: 168,
    rate: 6.00,
    totalPay: 1008.00,
    status: 'Paid'
  },
  {
    id: 12,
    name: 'Fatimah Ali',
    email: 'fatimah.a@example.com',
    role: 'Cleaner',
    joinDate: '01 Oct 2024',
    attendance: '22/22 days',
    attendancePct: 100,
    hours: 176,
    rate: 5.50,
    totalPay: 968.00,
    status: 'Paid'
  }
];

export default function Staff() {
  const [staffList, setStaffList] = useState<StaffMember[]>(() => {
    const saved = localStorage.getItem('wise_staff_accounts');
    if (saved) {
      try {
        const accounts = JSON.parse(saved);
        // Map registered accounts to include management metrics
        return accounts.map((acc: any) => ({
          id: acc.id,
          name: acc.name,
          email: acc.email,
          role: acc.position || 'Staff',
          joinDate: acc.joinDate || '01 Jan 2026',
          attendance: '22/22 days',
          attendancePct: 100,
          hours: 160,
          rate: 6.00,
          totalPay: 960.00,
          status: acc.status === 'Active' ? 'Pending' : 'Pending' // Standard mapping
        }));
      } catch (e) {}
    }
    return initialStaff;
  });

  // Listen for registry changes from Settings page
  useEffect(() => {
    const handleUpdate = () => {
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
            attendance: '22/22 days',
            attendancePct: 100,
            hours: 160,
            rate: 6.00,
            totalPay: 960.00,
            status: 'Pending'
          })));
        } catch (e) {}
      }
    };
    window.addEventListener('staffAccountsUpdated', handleUpdate);
    return () => window.removeEventListener('staffAccountsUpdated', handleUpdate);
  }, []);

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

  const handleRemoveStaff = (id: string | number) => {
    if (confirm('Are you sure you want to remove this staff member?')) {
      setStaffList(staffList.filter(s => s.id !== id));
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
                          <div className="flex items-center justify-end gap-1.5 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
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
