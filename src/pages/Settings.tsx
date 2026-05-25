import React, { useState, useMemo, useEffect } from 'react';
import { Layout } from '../components/Layout';
import { motion, AnimatePresence } from 'framer-motion';

interface StaffProfile {
  id: string;
  verificationId: string;
  name: string;
  role: string;
  status: 'Active' | 'On Leave';
  statusColor: string;
  totalHours: number;
  otHours: number;
  attendanceDays: number;
  totalDays: number;
  completionRate: string;
  transactionsCount: number;
  totalEarned: number;
  cashEarned: number;
  ewalletEarned: number;
  masaMasuk: string;
  masaKeluar: string;
  jumlahJamKerja: number;
  overtimeApproved: boolean;
  shiftStatus: 'In Progress' | 'Ended';
}

interface StaffAccount {
  id: string;
  verificationId: string;
  name: string;
  position: string;
  email: string;
  ic: string;
  phone: string;
  joinDate: string;
  shift: string;
  rate: string;
  lastLogin: string;
  status: 'Active' | 'Inactive';
}

type TabId = 'business-profile' | 'payroll-rate' | 'shift-configuration' | 'staff-accounts' | 'notifications' | 'my-account' | 'danger-zone';

interface TabOption {
  id: TabId;
  label: string;
  isDanger?: boolean;
}

const tabs: TabOption[] = [
  { id: 'business-profile', label: 'Business Profile' },
  { id: 'payroll-rate', label: 'Payroll & Rate' },
  { id: 'shift-configuration', label: 'Shifts' },
  { id: 'staff-accounts', label: 'Staff Accounts' },
  { id: 'notifications', label: 'Notifications' },
  { id: 'my-account', label: 'My Account' },
  { id: 'danger-zone', label: 'Danger Zone', isDanger: true },
];

function StaffSettingsView() {
  const [selectedStaffId, setSelectedStaffId] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [currentTime, setCurrentTime] = useState(new Date());

  // Verification Modal States
  const [isIdVerifyModalOpen, setIsIdVerifyModalOpen] = useState(false);
  const [verifyMode, setVerifyMode] = useState<'in' | 'out'>('in');
  const [verifyIdInput, setVerifyIdInput] = useState('');

  // Real-time clock for the shift tracker
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const [staffData, setStaffData] = useState<StaffProfile[]>(() => {
    const savedAccounts = localStorage.getItem('wise_staff_accounts');
    const savedRegistry = localStorage.getItem('wise_staff_registry');
    
    let accounts = [];
    try { accounts = savedAccounts ? JSON.parse(savedAccounts) : []; } catch (e) {}

    let registry = [];
    try { registry = savedRegistry ? JSON.parse(savedRegistry) : []; } catch (e) {}

    if (accounts.length > 0) {
      return accounts.map((acc: any) => {
        const perf = registry.find((r: any) => r.id === acc.id);
        return {
          id: acc.id,
          verificationId: acc.verificationId || '2250000',
          name: acc.name,
          role: acc.position || 'Staff',
          status: acc.status === 'Active' ? 'Active' : 'On Leave',
          statusColor: acc.status === 'Active' ? 'bg-primary-container text-on-primary-container' : 'bg-surface-variant text-on-surface-variant',
          totalHours: perf?.totalHours || 0,
          otHours: perf?.otHours || 0,
          attendanceDays: perf?.attendanceDays || 0,
          totalDays: perf?.totalDays || 22,
          completionRate: perf?.completionRate || '0%',
          transactionsCount: perf?.transactionsCount || 0,
          totalEarned: perf?.totalEarned || 0,
          cashEarned: perf?.cashEarned || 0,
          ewalletEarned: perf?.ewalletEarned || 0,
          masaMasuk: perf?.masaMasuk || 'N/A',
          masaKeluar: perf?.masaKeluar || 'N/A',
          jumlahJamKerja: perf?.jumlahJamKerja || 0,
          overtimeApproved: perf?.overtimeApproved || false,
          shiftStatus: perf?.shiftStatus || 'Ended'
        };
      });
    }
    return [];
  });

  // Handle default selection when list changes
  useEffect(() => {
    if ((!selectedStaffId || !staffData.find(s => s.id === selectedStaffId)) && staffData.length > 0) {
      setSelectedStaffId(staffData[0].id);
    }
  }, [staffData, selectedStaffId]);

  // Sync with Admin Staff Accounts registry
  useEffect(() => {
    const handleAccountUpdate = () => {
      const savedAccounts = localStorage.getItem('wise_staff_accounts');
      const savedRegistry = localStorage.getItem('wise_staff_registry');
      
      let accounts = [];
      try { accounts = savedAccounts ? JSON.parse(savedAccounts) : []; } catch (e) {}

      let registry = [];
      try { registry = savedRegistry ? JSON.parse(savedRegistry) : []; } catch (e) {}

      const mappedData: StaffProfile[] = accounts.map((acc: any) => {
        const perf = registry.find((r: any) => r.id === acc.id);
        return {
          id: acc.id,
          verificationId: acc.verificationId || '2250000',
          name: acc.name,
          role: acc.position || 'Staff',
          status: (acc.status === 'Active' ? 'Active' : 'On Leave') as 'Active' | 'On Leave',
          statusColor: acc.status === 'Active' ? 'bg-primary-container text-on-primary-container' : 'bg-surface-variant text-on-surface-variant',
          totalHours: perf?.totalHours || 0,
          otHours: perf?.otHours || 0,
          attendanceDays: perf?.attendanceDays || 0,
          totalDays: perf?.totalDays || 22,
          completionRate: perf?.completionRate || '0%',
          transactionsCount: perf?.transactionsCount || 0,
          totalEarned: perf?.totalEarned || 0,
          cashEarned: perf?.cashEarned || 0,
          ewalletEarned: perf?.ewalletEarned || 0,
          masaMasuk: perf?.masaMasuk || 'N/A',
          masaKeluar: perf?.masaKeluar || 'N/A',
          jumlahJamKerja: perf?.jumlahJamKerja || 0,
          overtimeApproved: perf?.overtimeApproved || false,
          shiftStatus: perf?.shiftStatus || 'Ended'
        };
      });
      setStaffData(mappedData);
    };

    window.addEventListener('staffAccountsUpdated', handleAccountUpdate);
    return () => window.removeEventListener('staffAccountsUpdated', handleAccountUpdate);
  }, []);

  // Persist staff changes to localStorage so Menu.tsx can read them
  useEffect(() => {
    localStorage.setItem('wise_staff_registry', JSON.stringify(staffData));
  }, [staffData]);

  // Filter staff entries based on search input
  const filteredStaff = useMemo(() => {
    return staffData.filter(s =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.role.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [staffData, searchQuery]);

  // Retrieve current active staff details
  const activeStaff = useMemo(() => {
    return staffData.find(s => s.id === selectedStaffId) || staffData[0];
  }, [staffData, selectedStaffId]);

  const executeClockOut = (id: string) => {
    const now = new Date();
    const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
    
    setStaffData(prev => prev.map(s => {
      if (s.id === id) {
        return {
          ...s,
          shiftStatus: 'Ended',
          masaKeluar: timeStr
        };
      }
      return s;
    }));
    setToastMessage(`Syif berjaya ditutup untuk ${activeStaff.name}!`);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const executeClockIn = (id: string) => {
    const now = new Date();
    const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
    
    setStaffData(prev => prev.map(s => {
      if (s.id === id) {
        return {
          ...s,
          shiftStatus: 'In Progress',
          masaMasuk: timeStr,
          masaKeluar: 'N/A',
          jumlahJamKerja: 0.0
        };
      }
      return s;
    }));
    setToastMessage(`Clock In recorded for ${activeStaff.name}!`);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleTutupSyif = () => {
    setVerifyMode('out');
    setIsIdVerifyModalOpen(true);
  };

  const handleMulaSyif = () => {
    setVerifyMode('in');
    setIsIdVerifyModalOpen(true);
  };

  const handleConfirmVerification = (e: React.FormEvent) => {
    e.preventDefault();
    if (verifyIdInput === activeStaff.verificationId) {
      if (verifyMode === 'in') {
        executeClockIn(activeStaff.id);
      } else {
        executeClockOut(activeStaff.id);
      }
      setIsIdVerifyModalOpen(false);
      setVerifyIdInput('');
    } else {
      alert("Incorrect Pin. Please try again.");
    }
  };

  return (
    <Layout title="Staff Settings">
      <div className="w-full max-w-[1600px] mx-auto flex flex-col lg:flex-row gap-4 md:gap-4 lg:gap-6 pb-12">

        {/* Left Section: Staff Directory */}
        <section className="w-full lg:w-[35%] flex flex-col gap-6">
          <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-sm border border-outline-variant/30 flex flex-col h-[520px]">
            <div className="flex justify-between items-center mb-6">
              <h1 className="font-headline-sm text-lg font-bold text-on-surface">Staff Directory</h1>
              <div className="relative w-44">
                <span className="material-symbols-outlined absolute left-2 top-1/2 -translate-y-1/2 text-outline text-[18px]">
                  search
                </span>
                <input
                  type="text"
                  placeholder="Search staff..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 bg-surface-container rounded-full border border-outline-variant/30 text-xs text-on-surface focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
            </div>

            <div className="space-y-3 overflow-y-auto flex-1 pr-1">
              {filteredStaff.length === 0 ? (
                <p className="text-xs text-on-surface-variant text-center py-8">No staff profiles found.</p>
              ) : (
                filteredStaff.map((staff) => (
                  <div
                    key={staff.id}
                    onClick={() => setSelectedStaffId(staff.id)}
                    className={`p-4 rounded-xl border transition-all cursor-pointer group flex flex-col gap-1 ${selectedStaffId === staff.id
                        ? 'border-primary bg-primary-fixed/20 shadow-sm'
                        : 'border-outline-variant/30 hover:bg-surface-container-low'
                      }`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className={`font-title-md text-sm font-bold transition-colors ${selectedStaffId === staff.id ? 'text-primary' : 'text-on-surface group-hover:text-primary'
                          }`}>
                          {staff.name}
                        </h3>
                        <span className="font-mono text-xs text-on-surface-variant">{staff.id}</span>
                        <div className="mt-1">
                          <span className="font-label-sm text-[10px] text-on-surface-variant font-medium bg-surface-container-high px-2 py-0.5 rounded">
                            {staff.role}
                          </span>
                        </div>
                      </div>
                      <span className={`px-2.5 py-0.5 rounded-full font-label-sm text-[10px] font-bold ${staff.status === 'Active'
                          ? 'bg-success-container text-on-success-container'
                          : 'bg-surface-variant text-on-surface-variant'
                        }`}>
                        {staff.status}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>

        {/* Right Section: Shift Performance details */}
        <section className="w-full lg:w-[65%] flex flex-col gap-6 bg-surface-container-low/30 p-6 md:p-8 rounded-3xl border border-outline-variant/30">
          {!activeStaff ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-12 opacity-60">
              <span className="material-symbols-outlined text-[48px] text-outline mb-4">person_off</span>
              <h2 className="text-lg font-bold text-on-surface">No Staff Profiles Found</h2>
              <p className="text-xs text-on-surface-variant mt-1">Register new staff accounts in the Admin Settings to view performance metrics.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-6">
            <div>
            <h2 className="font-headline-lg text-xl font-bold text-on-surface mb-1">Shift Performance</h2>
            <p className="text-xs text-on-surface-variant">Analyze logged hours, transactions and shift close conditions.</p>
          </div>

          <div className="flex flex-col gap-6">

            {/* Active Staff profile banner */}
            <div className="mb-2 border-b border-outline-variant/20 pb-4">
              <h3 className="font-title-lg text-lg font-bold text-primary">{activeStaff.name}</h3>
              <p className="font-body-md text-xs text-on-surface-variant font-mono">{activeStaff.id} • {activeStaff.role}</p>
            </div>

            {/* Top grid metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Card 1: Hours */}
              <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-sm border border-outline-variant/20 flex flex-col gap-2">
                <span className="font-label-lg text-xs font-semibold text-on-surface-variant flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px]">schedule</span> Total Hours
                </span>
                <span className="font-mono text-3xl font-bold text-primary">{activeStaff.totalHours}</span>
                <span className="font-label-sm text-[10px] font-medium text-secondary">+{activeStaff.otHours} hrs OT included</span>
              </div>

              {/* Card 2: Attendance */}
              <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-sm border border-outline-variant/20 flex flex-col gap-2">
                <span className="font-label-lg text-xs font-semibold text-on-surface-variant flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px]">calendar_month</span> March Attendance
                </span>
                <div className="flex items-baseline gap-1">
                  <span className="font-mono text-3xl font-bold text-on-surface">{activeStaff.attendanceDays}</span>
                  <span className="font-mono text-lg text-on-surface-variant">/ {activeStaff.totalDays}</span>
                  <span className="font-label-lg text-xs text-on-surface-variant ml-2 font-medium">days</span>
                </div>
                <span className="font-label-sm text-[10px] font-medium text-secondary">{activeStaff.completionRate} completion rate</span>
              </div>
            </div>

            {/* Detailed Transaction metrics */}
            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Transactions Card */}
                <div className="bg-surface-container-low p-6 rounded-2xl border border-outline-variant/20 flex flex-col gap-2">
                  <span className="font-label-lg text-xs font-semibold text-on-surface-variant flex items-center gap-2">
                    <span className="material-symbols-outlined text-[18px]">receipt_long</span> No. of Transactions
                  </span>
                  <span className="font-mono text-3xl font-bold text-on-surface">{activeStaff.transactionsCount}</span>
                  <span className="font-label-sm text-[10px] font-medium text-secondary">Today</span>
                </div>

                {/* Total Earned Card */}
                <div className="bg-surface-container-low p-6 rounded-2xl border border-outline-variant/20 flex flex-col gap-2">
                  <span className="font-label-lg text-xs font-semibold text-on-surface-variant flex items-center gap-2">
                    <span className="material-symbols-outlined text-[18px]">payments</span> Total Earned
                  </span>
                  <span className="font-mono text-3xl font-bold text-primary font-data">RM {activeStaff.totalEarned.toLocaleString()}</span>
                  <span className="font-label-sm text-[10px] font-medium text-secondary">Combined total</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Cash Earned Card */}
                <div className="bg-surface-container-low p-6 rounded-2xl border border-outline-variant/20 flex flex-col gap-2">
                  <span className="font-label-lg text-xs font-semibold text-on-surface-variant flex items-center gap-2">
                    <span className="material-symbols-outlined text-[18px]">payments</span> Cash Earned
                  </span>
                  <span className="font-mono text-2xl font-bold text-on-surface font-data">RM {activeStaff.cashEarned.toLocaleString()}</span>
                  <span className="font-label-sm text-[10px] font-medium text-secondary">Manual entry</span>
                </div>

                {/* E-wallet Card */}
                <div className="bg-surface-container-low p-6 rounded-2xl border border-outline-variant/20 flex flex-col gap-2">
                  <span className="font-label-lg text-xs font-semibold text-on-surface-variant flex items-center gap-2">
                    <span className="material-symbols-outlined text-[18px]">qr_code_2</span> E-wallet Earned
                  </span>
                  <span className="font-mono text-2xl font-bold text-on-surface font-data">RM {activeStaff.ewalletEarned.toLocaleString()}</span>
                  <span className="font-label-sm text-[10px] font-medium text-secondary">Digital payments</span>
                </div>
              </div>
            </div>

            {/* Shift Tracker Bottom Bento Card */}
            <div className="bg-gradient-to-br from-surface-container-lowest to-surface-container-low rounded-2xl shadow-sm border border-outline-variant/20 overflow-hidden mt-2">
              <div className="p-6 md:p-8">

                <div className="flex justify-between items-start mb-8">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary-container flex items-center justify-center text-primary">
                      <span className="material-symbols-outlined filled text-2xl">calendar_today</span>
                    </div>
                    <div>
                      <h3 className="font-title-lg text-sm font-bold text-on-surface">Today's Shift</h3>
                      <p className="font-body-md text-xs text-on-surface-variant mt-0.5">
                        {currentTime.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })} • {currentTime.toLocaleTimeString('en-US', { hour12: true, hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                      </p>
                    </div>
                  </div>

                  <span className={`px-4 py-1.5 rounded-full font-label-sm text-[10px] font-bold flex items-center gap-2 ${activeStaff.shiftStatus === 'In Progress'
                      ? 'bg-success-container text-on-success-container'
                      : 'bg-surface-variant text-on-surface-variant'
                    }`}>
                    <span className={`w-2 h-2 rounded-full ${activeStaff.shiftStatus === 'In Progress' ? 'bg-[#166534]' : 'bg-outline'}`}></span>
                    {activeStaff.shiftStatus === 'In Progress' ? 'In Progress' : 'Ended'}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                  <div className="flex flex-col gap-2">
                    <span className="font-label-sm text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Masa Masuk</span>
                    <span className="font-mono font-bold text-xl text-on-surface">{activeStaff.masaMasuk}</span>
                  </div>
                  <div className="flex flex-col gap-2">
                    <span className="font-label-sm text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Masa Keluar</span>
                    <span className="font-mono font-bold text-xl text-on-surface">{activeStaff.masaKeluar}</span>
                  </div>
                  <div className="flex flex-col gap-2">
                    <span className="font-label-sm text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Jumlah Jam Kerja</span>
                    <span className="font-mono font-bold text-xl text-on-surface">
                      {activeStaff.jumlahJamKerja} <span className="text-sm font-normal text-on-surface-variant">hrs</span>
                    </span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row justify-between items-center pt-6 border-t border-outline-variant/20 gap-4">
                  <div></div>

                  {activeStaff.shiftStatus === 'In Progress' ? (
                    <button
                      onClick={handleTutupSyif}
                      className="w-full sm:w-auto bg-error text-on-error px-8 py-3 rounded-full font-label-lg text-xs font-bold hover:bg-error/95 transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer active:scale-95 duration-100"
                    >
                      <span className="material-symbols-outlined text-[18px]">timer_off</span> Clock Out
                    </button>
                  ) : (
                    <button
                      onClick={handleMulaSyif}
                      className="w-full sm:w-auto bg-primary text-on-primary px-8 py-3 rounded-full font-label-lg text-xs font-bold hover:bg-primary-container transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer active:scale-95 duration-100"
                    >
                      <span className="material-symbols-outlined text-[18px]">timer</span> Clock In
                    </button>
                  )}
                </div>

              </div>
            </div>

          </div>
          </div>
          )}
        </section>

      </div>

      {/* ID Verification Modal */}
      <AnimatePresence>
        {isIdVerifyModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsIdVerifyModalOpen(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-surface rounded-[32px] border border-outline-variant/40 shadow-xl overflow-hidden max-w-sm w-full z-10 p-8 space-y-6"
            >
              <div className="text-center">
                <div className={`w-16 h-16 rounded-2xl ${verifyMode === 'in' ? 'bg-primary/10 text-primary' : 'bg-error/10 text-error'} flex items-center justify-center mx-auto mb-4`}>
                  <span className="material-symbols-outlined text-3xl">
                    {verifyMode === 'in' ? 'timer' : 'timer_off'}
                  </span>
                </div>
                <h3 className="font-headline-sm text-xl font-bold text-on-surface">Confirm {verifyMode === 'in' ? 'Clock In' : 'Clock Out'}</h3>
                <p className="font-body-md text-xs text-on-surface-variant mt-1.5 font-medium">Please enter your Staff ID to verify this action.</p>
              </div>

              <form onSubmit={handleConfirmVerification} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="font-label-lg text-xs font-bold text-on-surface uppercase tracking-wider">Staff ID</label>
                  <input
                    autoFocus
                    type="text"
                    required
                    maxLength={7}
                    placeholder="2250***"
                    value={verifyIdInput}
                    onChange={(e) => setVerifyIdInput(e.target.value.replace(/\D/g, ''))}
                    className="w-full bg-surface-container-low border border-outline-variant/45 rounded-2xl px-4 py-3 text-on-surface font-body-md text-sm text-center font-mono focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                  />
                  {verifyIdInput.length > 0 && !/^2250\d{3}$/.test(verifyIdInput) && (
                    <p className="text-[10px] text-error font-bold mt-1.5 text-center uppercase tracking-wider animate-pulse">
                      invalid id
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIsIdVerifyModalOpen(false);
                      setVerifyIdInput('');
                    }}
                    className="flex-1 px-5 py-2.5 rounded-full border border-outline-variant/60 text-on-surface font-label-lg text-xs font-bold hover:bg-surface-container-low transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={!/^2250\d{3}$/.test(verifyIdInput)}
                    className={`flex-1 px-5 py-2.5 rounded-full ${verifyMode === 'in' ? 'bg-primary' : 'bg-error'} text-white font-label-lg text-xs font-bold shadow-sm transition-all cursor-pointer active:scale-95 disabled:opacity-30 disabled:grayscale disabled:cursor-not-allowed`}
                  >
                    Verify
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Floating Success Notification */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="fixed bottom-8 right-8 z-50 bg-primary-container text-on-primary-container border border-primary/20 rounded-2xl px-6 py-4 flex items-center gap-3 shadow-lg max-w-sm"
          >
            <span className="material-symbols-outlined text-primary text-[24px]">check_circle</span>
            <div>
              <div className="font-title-md font-bold text-xs">Action Recorded</div>
              <div className="text-[10px] opacity-80 mt-0.5">{toastMessage}</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Layout>
  );
}

export default function Settings() {
  const userRole = localStorage.getItem('userRole') || 'admin';

  if (userRole === 'staff') {
    return <StaffSettingsView />;
  }

  const [activeTab, setActiveTab] = useState<TabId>('business-profile');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('Settings saved successfully');

  // Business Profile States
  const [businessName, setBusinessName] = useState('Fintech SME Corp');
  const [registrationNo, setRegistrationNo] = useState('123456789-W');
  const [phoneNumber, setPhoneNumber] = useState('+60 12-345 6789');
  const [businessType, setBusinessType] = useState('Sdn Bhd (Private Limited)');
  const [registeredAddress, setRegisteredAddress] = useState('Level 12, Tech Tower, Jalan Cyber, 50000 Kuala Lumpur');
  const [supportEmail, setSupportEmail] = useState('support@fintechsme.com');
  const [logoUploaded, setLogoUploaded] = useState(false);

  // Payroll States
  const [baseHourlyRate, setBaseHourlyRate] = useState('6.00');
  const [overtimeMultiplier, setOvertimeMultiplier] = useState('1.5');
  const [epfContribution, setEpfContribution] = useState('13.00');
  const [socsoContribution, setSocsoContribution] = useState('0.50');
  const [workingHoursMonth, setWorkingHoursMonth] = useState('160');
  const [payrollCycle, setPayrollCycle] = useState('Monthly');

  // Shift Configuration States
  const [shifts, setShifts] = useState([
    { id: '1', name: 'Morning Shift', startTime: '08:00', endTime: '14:00', maxStaff: 3, isActive: true },
    { id: '2', name: 'Afternoon Shift', startTime: '14:00', endTime: '20:00', maxStaff: 3, isActive: true },
    { id: '3', name: 'Night Shift', startTime: '20:00', endTime: '02:00', maxStaff: 2, isActive: true }
  ]);

  const getAmPm = (timeStr: string) => {
    if (!timeStr) return 'AM';
    const parts = timeStr.split(':');
    if (parts.length < 2) return 'AM';
    const hours = parseInt(parts[0], 10);
    return hours >= 12 ? 'PM' : 'AM';
  };

  // Staff Account States
  const [allowStaffLogin, setAllowStaffLogin] = useState(true);
  const [requireICVerify, setRequireICVerify] = useState(true);
  const [permLedger, setPermLedger] = useState(false);
  const [permPayslip, setPermPayslip] = useState(true);
  const [permShifts, setPermShifts] = useState(false);

  // High-fidelity Staff Account Control States
  const [staffList, setStaffList] = useState<StaffAccount[]>(() => {
    const saved = localStorage.getItem('wise_staff_accounts');
    if (saved) {
      try {
        return JSON.parse(saved) as StaffAccount[];
      } catch (e) {}
    }
    return [
      { id: 'EMP-042', verificationId: '2250101', name: 'Siti Aminah', position: 'Cashier', email: 'siti.a@company.com', ic: '940512-14-5566', phone: '+60123456789', joinDate: '2024-02-10', shift: 'Morning', rate: '6.00', lastLogin: 'Today, 08:15 AM', status: 'Active' },
      { id: 'EMP-018', verificationId: '2250102', name: 'Hafiz Rahman', position: 'Supervisor', email: 'hafiz.r@company.com', ic: '880101-10-1234', phone: '+60172233445', joinDate: '2023-11-15', shift: 'Afternoon', rate: '8.00', lastLogin: 'Yesterday, 17:30 PM', status: 'Active' },
      { id: 'EMP-055', verificationId: '2250103', name: 'Ahmad Fauzi', position: 'Cashier', email: 'ahmad.f@company.com', ic: '921120-08-9988', phone: '+60198877665', joinDate: '2024-01-05', shift: 'Morning', rate: '6.00', lastLogin: 'Oct 24, 09:00 AM', status: 'Active' },
      { id: 'EMP-082', verificationId: '2250104', name: 'Nurul Baiti', position: 'Kitchen Staff', email: 'nurul.b@company.com', ic: '960824-14-3321', phone: '+60112233445', joinDate: '2023-09-12', shift: 'Morning', rate: '6.50', lastLogin: 'Sep 12, 14:20 PM', status: 'Inactive' },
      { id: 'EMP-091', verificationId: '2250105', name: 'Zulaikha Aziz', position: 'Cleaner', email: 'zulaikha.a@company.com', ic: '900101-14-5555', phone: '+60124455667', joinDate: '2024-03-01', shift: 'Morning', rate: '5.50', lastLogin: 'Today, 06:45 AM', status: 'Active' }
    ];
  });

  useEffect(() => {
    localStorage.setItem('wise_staff_accounts', JSON.stringify(staffList));
    window.dispatchEvent(new Event('staffAccountsUpdated'));
  }, [staffList]);

  const [staffSearchQuery, setStaffSearchQuery] = useState('');
  const [showAddStaffModal, setShowAddStaffModal] = useState(false);
  const [showEditStaffModal, setShowEditStaffModal] = useState(false);
  const [editingStaffId, setEditingStaffId] = useState<string | null>(null);

  const [newStaffName, setNewStaffName] = useState('');
  const [newStaffRole, setNewStaffRole] = useState('Cashier');
  const [newStaffEmail, setNewStaffEmail] = useState('');
  const [newStaffIC, setNewStaffIC] = useState('');
  const [newStaffPhone, setNewStaffPhone] = useState('');
  const [newStaffJoinDate, setNewStaffJoinDate] = useState('');
  const [newStaffShift, setNewStaffShift] = useState('Morning');
  const [newStaffRate, setNewStaffRate] = useState('6.00');
  const [newStaffVerifyId, setNewStaffVerifyId] = useState('2250000');
  const [activateAccount, setActivateAccount] = useState(true);

  const handleOpenEditModal = (staff: StaffAccount) => {
    setEditingStaffId(staff.id);
    setNewStaffName(staff.name);
    setNewStaffRole(staff.position);
    setNewStaffEmail(staff.email);
    setNewStaffIC(staff.ic || '');
    setNewStaffPhone(staff.phone || '');
    setNewStaffJoinDate(staff.joinDate || '');
    setNewStaffShift(staff.shift || 'Morning');
    setNewStaffRate(staff.rate || '6.00');
    setNewStaffVerifyId(staff.verificationId || '2250000');
    setActivateAccount(staff.status === 'Active');
    setShowEditStaffModal(true);
  };

  // Notifications States
  const [notifyThreshold, setNotifyThreshold] = useState(true);
  const [notifyDailySummary, setNotifyDailySummary] = useState(true);
  const [notifyPayrollReminder, setNotifyPayrollReminder] = useState(true);

  // My Account States
  const [ownerName, setOwnerName] = useState('Ahmad Haziq');
  const [ownerEmail, setOwnerEmail] = useState('ahmad.h@finsuite.pro');
  const [ownerPhone, setOwnerPhone] = useState('+1 (555) 123-4567');
  const [ownerLocation, setOwnerLocation] = useState('Kuala Lumpur, MY');
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);
  const [currPassword, setCurrPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSaveChanges = () => {
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 3000);
  };

  const handleDangerReset = (action: string) => {
    if (confirm(`CRITICAL WARNING: Are you sure you want to perform: [${action}]? This action CANNOT be undone.`)) {
      alert(`${action} successful. Workspace has been updated.`);
    }
  };

  return (
    <Layout title="Settings">
      {/* Top Navigation Tab Bar (Pill Style) */}
      <div className="bg-surface rounded-full border border-outline-variant/20 flex items-center px-4 py-2 gap-4 overflow-x-auto whitespace-nowrap mb-6 w-fit mx-auto">
        {/* Tabs Navigation */}
        <nav className="flex items-center gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`whitespace-nowrap py-1.5 px-3 transition-all text-xs font-semibold rounded-full cursor-pointer ${activeTab === tab.id
                ? tab.isDanger
                  ? 'bg-error text-on-error'
                  : 'bg-primary text-on-primary'
                : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Main Content Area */}
      <div className="w-full max-w-[1600px] mx-auto space-y-6 md:space-y-6 lg:space-y-8 pb-12">

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.2 }}
          >

            {/* TAB 1: BUSINESS PROFILE */}
            {activeTab === 'business-profile' && (
              <section id="section-business-profile">
                <h2 className="text-[32px] font-bold text-on-surface mb-8">Business Profile</h2>
                <div className="bg-surface rounded-3xl shadow-sm border border-outline-variant/30 p-6 md:p-8 bg-surface-container-lowest">
                  <div className="flex flex-col md:flex-row gap-8">

                    {/* Logo Section */}
                    <div className="flex flex-col items-center gap-4 w-full md:w-1/4">
                      <div
                        onClick={() => setLogoUploaded(prev => !prev)}
                        className="w-32 h-32 rounded-full bg-surface-container-high flex items-center justify-center border border-dashed border-outline/50 relative group cursor-pointer overflow-hidden shadow-inner"
                      >
                        {logoUploaded ? (
                          <div className="w-full h-full bg-primary-container text-on-primary-container flex flex-col items-center justify-center p-3 text-center">
                            <span className="material-symbols-outlined text-3xl">store</span>
                            <span className="text-[10px] font-bold mt-1 font-mono tracking-tight">Fintech SME</span>
                          </div>
                        ) : (
                          <>
                            <span className="material-symbols-outlined text-outline text-4xl group-hover:hidden">add_photo_alternate</span>
                            <div className="absolute inset-0 bg-black/50 hidden group-hover:flex items-center justify-center text-white text-xs font-bold font-label-sm">Upload</div>
                          </>
                        )}
                      </div>
                      <button
                        onClick={() => setLogoUploaded(prev => !prev)}
                        className="font-label-lg text-xs font-bold text-primary border border-outline-variant/50 rounded-full px-5 py-2 hover:bg-surface-container-high transition-colors active:scale-95 duration-150 cursor-pointer"
                      >
                        {logoUploaded ? 'Remove Logo' : 'Change Logo'}
                      </button>
                    </div>

                    {/* Form Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full md:w-3/4">
                      <div className="flex flex-col gap-2">
                        <label className="font-label-sm text-xs font-bold text-on-surface-variant uppercase tracking-wider">Business Name</label>
                        <input
                          type="text"
                          value={businessName}
                          onChange={(e) => setBusinessName(e.target.value)}
                          className="w-full bg-surface-container-low border border-outline-variant/40 p-3 rounded-2xl text-sm font-body-md focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-on-surface"
                        />
                      </div>

                      <div className="flex flex-col gap-2">
                        <label className="font-label-sm text-xs font-bold text-on-surface-variant uppercase tracking-wider">Registration No.</label>
                        <input
                          type="text"
                          value={registrationNo}
                          onChange={(e) => setRegistrationNo(e.target.value)}
                          className="w-full bg-surface-container-low border border-outline-variant/40 p-3 rounded-2xl text-sm font-body-md focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-on-surface"
                        />
                      </div>

                      <div className="flex flex-col gap-2">
                        <label className="font-label-sm text-xs font-bold text-on-surface-variant uppercase tracking-wider">Phone Number</label>
                        <input
                          type="tel"
                          value={phoneNumber}
                          onChange={(e) => setPhoneNumber(e.target.value)}
                          className="w-full bg-surface-container-low border border-outline-variant/40 p-3 rounded-2xl text-sm font-body-md focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-on-surface"
                        />
                      </div>

                      <div className="flex flex-col gap-2">
                        <label className="font-label-sm text-xs font-bold text-on-surface-variant uppercase tracking-wider">Business Type</label>
                        <select
                          value={businessType}
                          onChange={(e) => setBusinessType(e.target.value)}
                          className="w-full bg-surface-container-low border border-outline-variant/40 p-3 rounded-2xl text-sm font-body-md focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-on-surface cursor-pointer"
                        >
                          <option value="Sdn Bhd (Private Limited)">Sdn Bhd (Private Limited)</option>
                          <option value="Enterprise">Enterprise</option>
                          <option value="Partnership">Partnership</option>
                        </select>
                      </div>

                      <div className="md:col-span-2 flex flex-col gap-2">
                        <label className="font-label-sm text-xs font-bold text-on-surface-variant uppercase tracking-wider">Registered Address</label>
                        <textarea
                          rows={2}
                          value={registeredAddress}
                          onChange={(e) => setRegisteredAddress(e.target.value)}
                          className="w-full bg-surface-container-low border border-outline-variant/40 p-3 rounded-2xl text-sm font-body-md focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-on-surface resize-none"
                        />
                      </div>

                      <div className="md:col-span-2 flex flex-col gap-2">
                        <label className="font-label-sm text-xs font-bold text-on-surface-variant uppercase tracking-wider">Support Email</label>
                        <input
                          type="email"
                          value={supportEmail}
                          onChange={(e) => setSupportEmail(e.target.value)}
                          className="w-full bg-surface-container-low border border-outline-variant/40 p-3 rounded-2xl text-sm font-body-md focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-on-surface"
                        />
                      </div>
                    </div>

                  </div>
                </div>

                {/* Bottom Page Actions */}
                <div className="mt-8 flex items-center justify-end pt-4 border-t border-outline-variant/20">
                  <button
                    onClick={handleSaveChanges}
                    className="px-6 py-2.5 rounded-full bg-primary text-on-primary font-label-lg text-xs font-bold shadow-sm hover:bg-primary-container hover:text-on-primary-container transition-colors flex items-center gap-2 cursor-pointer active:scale-95 duration-100"
                  >
                    <span className="material-symbols-outlined text-[18px]">save</span>
                    <span>Save Changes</span>
                  </button>
                </div>
              </section>
            )}

            {/* TAB 2: PAYROLL & RATE */}
            {activeTab === 'payroll-rate' && (
              <section id="section-payroll-rate">
                <h2 className="text-[32px] font-bold text-on-surface mb-8">Payroll &amp; Rate Metrics</h2>
                <div className="bg-surface rounded-3xl shadow-sm border border-outline-variant/30 p-6 md:p-8 bg-surface-container-lowest space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                    <div className="flex flex-col gap-2">
                      <label className="font-label-sm text-xs font-bold text-on-surface-variant uppercase tracking-wider">Default Hourly Rate</label>
                      <div className="flex items-center bg-surface-container-low border border-outline-variant/40 rounded-2xl overflow-hidden focus-within:border-primary focus-within:ring-1 focus-within:ring-primary transition-all">
                        <span className="px-4 py-3 text-outline font-bold text-sm font-mono border-r border-outline-variant/30 shrink-0 select-none bg-surface-container-low">RM</span>
                        <input
                          type="text"
                          value={baseHourlyRate}
                          onChange={(e) => setBaseHourlyRate(e.target.value)}
                          className="flex-1 min-w-0 px-4 py-3 bg-transparent border-none outline-none text-sm text-on-surface font-mono focus:ring-0"
                        />
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      <label className="font-label-sm text-xs font-bold text-on-surface-variant uppercase tracking-wider">Overtime Multiplier</label>
                      <div className="relative">
                        <input
                          type="text"
                          value={overtimeMultiplier}
                          onChange={(e) => setOvertimeMultiplier(e.target.value)}
                          className="px-4 pr-24 py-3 w-full bg-surface-container-low border border-outline-variant/40 rounded-2xl focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-sm text-on-surface font-mono"
                        />
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-outline font-bold text-xs uppercase pointer-events-none">Multiplier</span>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      <label className="font-label-sm text-xs font-bold text-on-surface-variant uppercase tracking-wider">EPF Contribution (Employer)</label>
                      <div className="relative">
                        <input
                          type="text"
                          value={epfContribution}
                          onChange={(e) => setEpfContribution(e.target.value)}
                          className="px-4 pr-10 py-3 w-full bg-surface-container-low border border-outline-variant/40 rounded-2xl focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-sm text-on-surface font-mono"
                        />
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-outline font-bold text-sm pointer-events-none">%</span>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      <label className="font-label-sm text-xs font-bold text-on-surface-variant uppercase tracking-wider">SOCSO Contribution</label>
                      <div className="relative">
                        <input
                          type="text"
                          value={socsoContribution}
                          onChange={(e) => setSocsoContribution(e.target.value)}
                          className="px-4 pr-10 py-3 w-full bg-surface-container-low border border-outline-variant/40 rounded-2xl focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-sm text-on-surface font-mono"
                        />
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-outline font-bold text-sm pointer-events-none">%</span>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      <label className="font-label-sm text-xs font-bold text-on-surface-variant uppercase tracking-wider">Standard Working Hours / Month</label>
                      <input
                        type="text"
                        value={workingHoursMonth}
                        onChange={(e) => setWorkingHoursMonth(e.target.value)}
                        className="px-4 py-3 w-full bg-surface-container-low border border-outline-variant/40 rounded-2xl focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-sm text-on-surface font-mono"
                      />
                    </div>

                    <div className="flex flex-col gap-2">
                      <label className="font-label-sm text-xs font-bold text-on-surface-variant uppercase tracking-wider">Payroll Cycle</label>
                      <select
                        value={payrollCycle}
                        onChange={(e) => setPayrollCycle(e.target.value)}
                        className="px-4 py-3 w-full bg-surface-container-low border border-outline-variant/40 rounded-2xl focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-sm text-on-surface cursor-pointer"
                      >
                        <option value="Monthly">Monthly</option>
                        <option value="Weekly">Weekly</option>
                        <option value="Bi-weekly">Bi-weekly</option>
                      </select>
                    </div>

                  </div>
                </div>

                {/* Bottom Page Actions */}
                <div className="mt-8 flex items-center justify-end pt-4 border-t border-outline-variant/20">
                  <button
                    onClick={handleSaveChanges}
                    className="px-6 py-2.5 rounded-full bg-primary text-on-primary font-label-lg text-xs font-bold shadow-sm hover:bg-primary-container hover:text-on-primary-container transition-colors flex items-center gap-2 cursor-pointer active:scale-95 duration-100"
                  >
                    <span className="material-symbols-outlined text-[18px]">save</span>
                    <span>Save Changes</span>
                  </button>
                </div>
              </section>
            )}

            {/* TAB 3: SHIFT CONFIGURATION */}
            {activeTab === 'shift-configuration' && (
              <section id="section-shift-configuration" className="w-full space-y-6">

                {/* Page Header */}
                <div className="mb-6">
                  <h2 className="font-headline-lg text-[32px] font-bold text-on-surface mb-2">Shift Configuration</h2>
                </div>

                {/* Configuration Card (Bento Style) */}
                <div className="bg-surface-container-lowest rounded-3xl border border-outline-variant/60 shadow-sm overflow-hidden flex flex-col">

                  {/* List Header */}
                  <div className="bg-surface-container-low px-6 py-4 border-b border-outline-variant/40 flex justify-between items-center">
                    <h3 className="font-title-lg text-lg font-bold text-on-surface">Daily Shifts</h3>
                    <span className="bg-primary-container text-on-primary-container px-3 py-1 rounded-full font-label-sm text-[11px] font-bold">
                      {shifts.filter(s => s.isActive).length} Active
                    </span>
                  </div>

                  {/* Shift Items List */}
                  <div className="flex-1 divide-y divide-outline-variant/30">
                    {shifts.map((shift) => (
                      <div key={shift.id} className="group flex items-start sm:items-center gap-4 px-6 py-5 hover:bg-surface-container-low/20 transition-colors bg-surface-bright/40">
                        {/* Drag Handle */}
                        <div className="text-on-surface-variant/40 cursor-grab active:cursor-grabbing opacity-50 group-hover:opacity-100 transition-opacity mt-6 sm:mt-0 select-none">
                          <span className="material-symbols-outlined">drag_indicator</span>
                        </div>

                        {/* Shift Info */}
                        <div className="flex-1 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">

                          {/* Name Input */}
                          <div className="md:col-span-3 flex flex-col gap-1.5">
                            <label className="font-label-sm text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">Shift Name</label>
                            <input
                              className="bg-transparent border-none px-0 py-1 font-title-md text-sm font-bold text-on-surface w-full outline-none focus:outline-none"
                              type="text"
                              value={shift.name}
                              onChange={(e) => {
                                const newName = e.target.value;
                                setShifts(prev => prev.map(s => s.id === shift.id ? { ...s, name: newName } : s));
                              }}
                            />
                          </div>

                          {/* Time Range */}
                          <div className="md:col-span-5 flex items-center gap-3">
                            {/* Start Time */}
                            <div className="flex-1 min-w-0">
                              <label className="font-label-sm text-[11px] font-bold text-on-surface-variant mb-1.5 uppercase tracking-wider block">Start Time</label>
                              <div className="bg-surface-container-low pl-3 pr-3 py-2.5 rounded-2xl border border-outline-variant/40 focus-within:border-primary flex items-center gap-2 transition-all">
                                <span className="material-symbols-outlined text-on-surface-variant/80 text-[18px] shrink-0 select-none pointer-events-none">schedule</span>
                                <input
                                  className="bg-transparent border-none outline-none p-0 min-w-0 flex-1 font-body-md text-sm text-on-surface focus:ring-0"
                                  type="time"
                                  value={shift.startTime}
                                  onChange={(e) => {
                                    const val = e.target.value;
                                    setShifts(prev => prev.map(s => s.id === shift.id ? { ...s, startTime: val } : s));
                                  }}
                                />
                                <span className="font-label-sm text-[11px] text-on-surface-variant/80 font-bold select-none shrink-0">
                                  {getAmPm(shift.startTime)}
                                </span>
                              </div>
                            </div>

                            <span className="material-symbols-outlined text-on-surface-variant/60 shrink-0 self-center mt-5 select-none">arrow_forward</span>

                            {/* End Time */}
                            <div className="flex-1 min-w-0">
                              <label className="font-label-sm text-[11px] font-bold text-on-surface-variant mb-1.5 uppercase tracking-wider block">End Time</label>
                              <div className="bg-surface-container-low pl-3 pr-3 py-2.5 rounded-2xl border border-outline-variant/40 focus-within:border-primary flex items-center gap-2 transition-all">
                                <span className="material-symbols-outlined text-on-surface-variant/80 text-[18px] shrink-0 select-none pointer-events-none">schedule</span>
                                <input
                                  className="bg-transparent border-none outline-none p-0 min-w-0 flex-1 font-body-md text-sm text-on-surface focus:ring-0"
                                  type="time"
                                  value={shift.endTime}
                                  onChange={(e) => {
                                    const val = e.target.value;
                                    setShifts(prev => prev.map(s => s.id === shift.id ? { ...s, endTime: val } : s));
                                  }}
                                />
                                <span className="font-label-sm text-[11px] text-on-surface-variant/80 font-bold select-none shrink-0">
                                  {getAmPm(shift.endTime)}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Max Staff Stepper */}
                          <div className="md:col-span-3 flex flex-col justify-center gap-1">
                            <label className="font-label-sm text-[11px] font-bold text-on-surface-variant uppercase tracking-wider text-center">Max Staff</label>
                            <div className="flex items-center justify-center gap-2 bg-surface-container-high/60 rounded-full p-1 border border-outline-variant/40 w-fit mx-auto shadow-sm">
                              <button
                                onClick={() => {
                                  if (shift.maxStaff > 1) {
                                    setShifts(prev => prev.map(s => s.id === shift.id ? { ...s, maxStaff: s.maxStaff - 1 } : s));
                                  }
                                }}
                                aria-label="Decrease max staff"
                                className="w-8 h-8 rounded-full flex items-center justify-center text-on-surface hover:bg-surface-variant transition-colors cursor-pointer"
                              >
                                <span className="material-symbols-outlined text-[18px]">remove</span>
                              </button>
                              <span className="w-8 text-center font-title-md text-sm font-bold text-on-surface select-none">{shift.maxStaff}</span>
                              <button
                                onClick={() => {
                                  setShifts(prev => prev.map(s => s.id === shift.id ? { ...s, maxStaff: s.maxStaff + 1 } : s));
                                }}
                                aria-label="Increase max staff"
                                className="w-8 h-8 rounded-full flex items-center justify-center text-on-surface hover:bg-surface-variant transition-colors cursor-pointer"
                              >
                                <span className="material-symbols-outlined text-[18px]">add</span>
                              </button>
                            </div>
                          </div>

                          {/* Active Toggle & Delete */}
                          <div className="md:col-span-1 flex items-center justify-end gap-3">
                            {/* Toggle Switch */}
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                checked={shift.isActive}
                                onChange={(e) => {
                                  const val = e.target.checked;
                                  setShifts(prev => prev.map(s => s.id === shift.id ? { ...s, isActive: val } : s));
                                }}
                                className="sr-only peer text-primary cursor-pointer"
                              />
                              <div className="w-11 h-6 bg-outline/50 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-outline-variant after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                            </label>

                            {/* Delete Shift Button */}
                            <button
                              onClick={() => {
                                if (shifts.length <= 1) {
                                  alert('You must keep at least one operating shift configuration.');
                                  return;
                                }
                                if (confirm(`Are you sure you want to permanently delete the [${shift.name}]?`)) {
                                  setShifts(prev => prev.filter(s => s.id !== shift.id));
                                  setShowToast(true);
                                  setTimeout(() => setShowToast(false), 3000);
                                }
                              }}
                              aria-label="Delete Shift"
                              className="text-error hover:bg-error-container/20 p-2 rounded-full transition-colors sm:opacity-0 group-hover:opacity-100 cursor-pointer"
                            >
                              <span className="material-symbols-outlined text-[20px]">delete</span>
                            </button>
                          </div>

                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Add New Button Row */}
                  <div className="p-5 bg-surface-container-lowest flex justify-center border-t border-outline-variant/30">
                    <button
                      onClick={() => {
                        const nextId = String(shifts.length ? Math.max(...shifts.map(s => parseInt(s.id, 10))) + 1 : 1);
                        const newShift = {
                          id: nextId,
                          name: `Custom Shift ${nextId}`,
                          startTime: '09:00',
                          endTime: '17:00',
                          maxStaff: 3,
                          isActive: true
                        };
                        setShifts(prev => [...prev, newShift]);
                        setShowToast(true);
                        setTimeout(() => setShowToast(false), 3000);
                      }}
                      className="flex items-center gap-2 text-primary font-label-lg text-xs font-bold hover:bg-primary-fixed hover:text-on-primary-fixed px-6 py-3 rounded-full transition-colors border border-dashed border-primary bg-surface-bright/20 w-full max-w-sm justify-center cursor-pointer active:scale-95 duration-100"
                    >
                      <span className="material-symbols-outlined text-[20px]">add</span>
                      <span>Add New Shift</span>
                    </button>
                  </div>
                </div>

                {/* Bottom Page Actions */}
                <div className="mt-8 flex items-center justify-end gap-4 pt-4 border-t border-outline-variant/20">
                  <button
                    onClick={() => setActiveTab('business-profile')}
                    className="px-6 py-2.5 rounded-full border border-outline-variant/60 text-on-surface font-label-lg text-xs font-bold hover:bg-surface-container-low transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveChanges}
                    className="px-6 py-2.5 rounded-full bg-primary text-on-primary font-label-lg text-xs font-bold shadow-sm hover:bg-primary-container hover:text-on-primary-container transition-colors flex items-center gap-2 cursor-pointer active:scale-95 duration-100"
                  >
                    <span className="material-symbols-outlined text-[18px]">save</span>
                    <span>Save Changes</span>
                  </button>
                </div>

              </section>
            )}

            {/* TAB 4: STAFF ACCOUNTS */}
            {activeTab === 'staff-accounts' && (
              <section id="section-staff-accounts" className="w-full space-y-6">

                {/* Page Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h2 className="font-headline-lg text-[32px] font-bold text-on-surface">Staff Account Control</h2>
                  </div>
                  <button
                    onClick={() => setShowAddStaffModal(true)}
                    className="bg-primary text-on-primary hover:bg-primary/95 transition-colors font-label-lg text-xs font-bold px-6 py-2.5 rounded-full flex items-center gap-2 shadow-sm w-fit cursor-pointer active:scale-95 duration-100"
                  >
                    <span className="material-symbols-outlined text-[18px]">person_add</span>
                    <span>Add New Staff</span>
                  </button>
                </div>

                {/* Toolbar (Search & Filter) */}
                <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-surface-container-lowest p-4 rounded-2xl border border-outline-variant/60 shadow-sm">
                  <div className="relative flex items-center w-full max-w-sm h-10 rounded-xl bg-surface-container-low border border-outline-variant/40 focus-within:border-primary overflow-hidden transition-all">
                    <div className="grid place-items-center h-full w-10 text-on-surface-variant">
                      <span className="material-symbols-outlined text-[18px]">search</span>
                    </div>
                    <input
                      className="peer h-full w-full outline-none text-sm text-on-surface bg-transparent pr-3 font-body-md text-body-md placeholder-on-surface-variant/80 border-none focus:ring-0"
                      placeholder="Search staff name or role..."
                      type="text"
                      value={staffSearchQuery}
                      onChange={(e) => setStaffSearchQuery(e.target.value)}
                    />
                  </div>
                  <div className="flex gap-3 w-full sm:w-auto justify-end">
                    <button className="flex items-center gap-2 px-4 py-2 border border-outline-variant/50 rounded-full text-on-surface-variant hover:bg-surface-container font-label-lg text-xs font-bold transition-colors cursor-pointer">
                      <span className="material-symbols-outlined text-[18px]">filter_list</span>
                      <span>Filter</span>
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 border border-outline-variant/50 rounded-full text-on-surface-variant hover:bg-surface-container font-label-lg text-xs font-bold transition-colors cursor-pointer">
                      <span className="material-symbols-outlined text-[18px]">download</span>
                      <span>Export</span>
                    </button>
                  </div>
                </div>

                {/* Data Table */}
                <div className="bg-surface-container-lowest rounded-3xl border border-outline-variant/60 shadow-sm overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-surface-container-low/70 border-b border-outline-variant/40">
                          <th className="font-label-lg text-xs py-4 px-6 font-bold uppercase tracking-wider text-on-surface-variant">Staff</th>
                          <th className="font-label-lg text-xs py-4 px-6 font-bold uppercase tracking-wider text-on-surface-variant">Position</th>
                          <th className="font-label-lg text-xs py-4 px-6 font-bold uppercase tracking-wider text-on-surface-variant">Email</th>
                          <th className="font-label-lg text-xs py-4 px-6 font-bold uppercase tracking-wider text-on-surface-variant">Last Login</th>
                          <th className="font-label-lg text-xs py-4 px-6 font-bold uppercase tracking-wider text-on-surface-variant">Status</th>
                          <th className="font-label-lg text-xs py-4 px-6 font-bold uppercase tracking-wider text-on-surface-variant text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-outline-variant/30">
                        {staffList
                          .filter(staff =>
                            staff.name.toLowerCase().includes(staffSearchQuery.toLowerCase()) ||
                            staff.position.toLowerCase().includes(staffSearchQuery.toLowerCase()) ||
                            staff.email.toLowerCase().includes(staffSearchQuery.toLowerCase())
                          )
                          .map((staff) => {
                            const initials = staff.name
                              .split(' ')
                              .map(word => word[0])
                              .join('')
                              .slice(0, 2)
                              .toUpperCase();

                            const isInactive = staff.status === 'Inactive';

                            return (
                              <tr key={staff.id} className="hover:bg-surface-container-low/30 transition-colors group">
                                <td className="py-4 px-6">
                                  <div className="flex items-center gap-3">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-title-md text-sm font-bold shadow-sm ${isInactive
                                        ? 'bg-surface-variant text-on-surface-variant'
                                        : staff.position === 'Supervisor'
                                          ? 'bg-secondary-fixed text-on-secondary-fixed'
                                          : staff.position === 'Cleaner'
                                            ? 'bg-primary-fixed text-on-primary-fixed'
                                            : 'bg-primary-fixed text-on-primary-fixed'
                                      }`}>
                                      {initials}
                                    </div>
                                    <div>
                                      <p className={`font-title-md text-sm font-bold ${isInactive ? 'text-on-surface-variant' : 'text-on-surface'}`}>{staff.name}</p>
                                      <p className="font-body-sm text-[11px] font-bold text-on-surface-variant/70">ID: {staff.id}</p>
                                    </div>
                                  </div>
                                </td>
                                <td className={`py-4 px-6 font-body-md text-sm ${isInactive ? 'text-on-surface-variant/80' : 'text-on-surface font-semibold'}`}>{staff.position}</td>
                                <td className="py-4 px-6 font-body-md text-sm text-on-surface-variant">{staff.email}</td>
                                <td className="py-4 px-6 font-body-md text-sm text-on-surface-variant">{staff.lastLogin}</td>
                                <td className="py-4 px-6">
                                  <span className={`inline-flex items-center px-3 py-1 rounded-full font-label-sm text-[11px] font-bold ${isInactive
                                      ? 'bg-surface-variant text-on-surface-variant border border-outline-variant/40'
                                      : 'bg-primary-container text-on-primary-container'
                                    }`}>
                                    {staff.status}
                                  </span>
                                </td>
                                <td className="py-4 px-6 text-right">
                                  <div className="flex items-center justify-end gap-2 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                      onClick={() => handleOpenEditModal(staff)}
                                      className="p-2 text-on-surface-variant hover:text-primary hover:bg-primary/10 rounded-full transition-colors cursor-pointer"
                                      title="Edit Profile"
                                    >
                                      <span className="material-symbols-outlined text-[20px]">edit</span>
                                    </button>
                                    {isInactive ? (
                                      <button
                                        onClick={() => {
                                          if (confirm(`Activate access account for ${staff.name}?`)) {
                                            setStaffList(prev => prev.map(s => s.id === staff.id ? { ...s, status: 'Active' } : s));
                                            setShowToast(true);
                                            setTimeout(() => setShowToast(false), 3000);
                                          }
                                        }}
                                        className="p-2 text-primary hover:bg-primary-container/20 rounded-full transition-colors cursor-pointer"
                                        title="Activate Account"
                                      >
                                        <span className="material-symbols-outlined text-[20px]">person_check</span>
                                      </button>
                                    ) : (
                                      <button
                                        onClick={() => {
                                          if (confirm(`Deactivate access account for ${staff.name}?`)) {
                                            setStaffList(prev => prev.map(s => s.id === staff.id ? { ...s, status: 'Inactive' } : s));
                                            setShowToast(true);
                                            setTimeout(() => setShowToast(false), 3000);
                                          }
                                        }}
                                        className="p-2 text-on-surface-variant hover:text-error hover:bg-error-container/20 rounded-full transition-colors cursor-pointer"
                                        title="Deactivate Account"
                                      >
                                        <span className="material-symbols-outlined text-[20px]">more_vert</span>
                                      </button>
                                    )}
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                      </tbody>
                    </table>
                  </div>

                  {/* Pagination Footer */}
                  <div className="bg-surface-container-low px-6 py-4 border-t border-outline-variant/30 flex items-center justify-between">
                    <p className="font-body-md text-xs text-on-surface-variant font-medium">
                      Showing <span className="font-bold text-on-surface">1-{staffList.length}</span> of <span className="font-bold text-on-surface">{staffList.length}</span> staff members
                    </p>
                    <div className="flex items-center gap-2">
                      <button className="p-2 rounded-lg border border-outline-variant/40 text-on-surface-variant hover:bg-surface-container transition-colors disabled:opacity-40 cursor-not-allowed" disabled>
                        <span className="material-symbols-outlined text-[20px]">chevron_left</span>
                      </button>
                      <button className="w-8 h-8 rounded-lg bg-primary text-on-primary font-label-lg text-xs font-bold flex items-center justify-center shadow-sm select-none">1</button>
                      <button className="p-2 rounded-lg border border-outline-variant/40 text-on-surface-variant hover:bg-surface-container transition-colors disabled:opacity-40 cursor-not-allowed" disabled>
                        <span className="material-symbols-outlined text-[20px]">chevron_right</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Add New Staff Modal Overlay */}
                <AnimatePresence>
                  {showAddStaffModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                      {/* Backdrop */}
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setShowAddStaffModal(false)}
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                      />

                      {/* Modal Panel */}
                      <motion.div
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.95, opacity: 0 }}
                        className="relative bg-surface-container-lowest border border-outline-variant/60 w-full max-w-2xl rounded-3xl p-6 md:p-8 shadow-2xl z-10 space-y-6"
                      >
                        <div>
                          <h3 className="font-headline-sm text-2xl font-bold text-on-surface">Add New Staff</h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-4">
                            <div className="space-y-2">
                              <label className="font-label-lg text-xs font-bold text-on-surface uppercase tracking-wider">Full Name</label>
                              <input
                                type="text"
                                placeholder="e.g. Siti Aminah"
                                value={newStaffName}
                                onChange={(e) => setNewStaffName(e.target.value)}
                                className="w-full bg-surface-container-low border border-outline-variant/40 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all px-4 py-3 rounded-2xl text-sm"
                              />
                            </div>

                            <div className="space-y-2">
                              <label className="font-label-lg text-xs font-bold text-on-surface uppercase tracking-wider">IC Number</label>
                              <input 
                                type="text"
                                placeholder="900101-14-5555"
                                value={newStaffIC}
                                onChange={(e) => setNewStaffIC(e.target.value)}
                                className="w-full bg-surface-container-low border border-outline-variant/40 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all px-4 py-3 rounded-2xl text-sm"
                              />
                            </div>

                            <div className="space-y-2">
                              <label className="font-label-lg text-xs font-bold text-on-surface uppercase tracking-wider">Phone Number</label>
                              <input 
                                type="text"
                                placeholder="+60123456789"
                                value={newStaffPhone}
                                onChange={(e) => setNewStaffPhone(e.target.value)}
                                className="w-full bg-surface-container-low border border-outline-variant/40 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all px-4 py-3 rounded-2xl text-sm"
                              />
                            </div>

                            <div className="space-y-2">
                              <label className="font-label-lg text-xs font-bold text-on-surface uppercase tracking-wider">Position / Role</label>
                              <select
                                value={newStaffRole}
                                onChange={(e) => setNewStaffRole(e.target.value)}
                                className="w-full bg-surface-container-low border border-outline-variant/40 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all px-4 py-3 rounded-2xl text-sm cursor-pointer"
                              >
                                <option value="Cashier">Cashier</option>
                                <option value="Supervisor">Supervisor</option>
                                <option value="Kitchen Staff">Kitchen Staff</option>
                                <option value="Cleaner">Cleaner</option>
                                <option value="Other">Other</option>
                              </select>
                            </div>
                          </div>

                          <div className="space-y-4">
                            <div className="space-y-2">
                              <label className="font-label-lg text-xs font-bold text-on-surface uppercase tracking-wider">Email Address</label>
                              <input
                                type="email"
                                placeholder="name@company.com"
                                value={newStaffEmail}
                                onChange={(e) => setNewStaffEmail(e.target.value)}
                                className="w-full bg-surface-container-low border border-outline-variant/40 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all px-4 py-3 rounded-2xl text-sm"
                              />
                            </div>

                            <div className="space-y-2">
                              <label className="font-label-lg text-xs font-bold text-on-surface uppercase tracking-wider">Start Date</label>
                              <input 
                                type="date"
                                value={newStaffJoinDate}
                                onChange={(e) => setNewStaffJoinDate(e.target.value)}
                                className="w-full bg-surface-container-low border border-outline-variant/40 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all px-4 py-3 rounded-2xl text-sm"
                              />
                            </div>

                            <div className="space-y-2">
                              <label className="font-label-lg text-xs font-bold text-on-surface uppercase tracking-wider">Default Shift</label>
                              <select 
                                value={newStaffShift}
                                onChange={(e) => setNewStaffShift(e.target.value)}
                                className="w-full bg-surface-container-low border border-outline-variant/40 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all px-4 py-3 rounded-2xl text-sm cursor-pointer"
                              >
                                <option value="Morning">Morning</option>
                                <option value="Afternoon">Afternoon</option>
                                <option value="Night">Night</option>
                              </select>
                            </div>

                            <div className="space-y-2">
                              <label className="font-label-lg text-xs font-bold text-on-surface uppercase tracking-wider">Hourly Rate</label>
                              <div className="flex items-center bg-surface-container-low border border-outline-variant/40 rounded-2xl overflow-hidden focus-within:border-primary focus-within:ring-1 focus-within:ring-primary transition-all">
                                <span className="px-4 py-3 text-outline font-bold text-sm font-mono border-r border-outline-variant/30 shrink-0 select-none bg-surface-container-low">RM</span>
                                <input 
                                  type="text"
                                  value={newStaffRate}
                                  onChange={(e) => setNewStaffRate(e.target.value)}
                                  className="flex-1 min-w-0 px-4 py-3 bg-transparent border-none outline-none text-sm text-on-surface font-mono focus:ring-0"
                                />
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-4 py-4 border-t border-outline-variant/20 pt-6">
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input 
                              type="checkbox" 
                              checked={activateAccount}
                              onChange={(e) => setActivateAccount(e.target.checked)}
                              className="sr-only peer text-primary cursor-pointer"
                            />
                            <div className="w-11 h-6 bg-outline rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-outline-variant after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                          </label>
                          <span className="text-body-md text-on-surface font-semibold">Activate Staff Account (Allow Login)</span>
                        </div>

                        <div className="flex items-center justify-end gap-3 pt-2">
                          <button
                            onClick={() => {
                              setShowAddStaffModal(false);
                              setNewStaffName('');
                              setNewStaffEmail('');
                              setNewStaffIC('');
                              setNewStaffPhone('');
                              setNewStaffJoinDate('');
                            }}
                            className="px-5 py-2.5 rounded-full border border-outline-variant/50 text-on-surface hover:bg-surface-container-low text-xs font-bold cursor-pointer transition-colors"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => {
                              if (!newStaffName.trim() || !newStaffEmail.trim()) {
                                alert('Please complete all form fields.');
                                return;
                              }
                              const randomNum = Math.floor(100 + Math.random() * 900);
                              const newStaffObj: StaffAccount = {
                                id: `EMP-${randomNum}`,
                                verificationId: newStaffVerifyId,
                                name: newStaffName,
                                position: newStaffRole,
                                email: newStaffEmail,
                                ic: newStaffIC,
                                phone: newStaffPhone,
                                joinDate: newStaffJoinDate,
                                shift: newStaffShift,
                                rate: newStaffRate,
                                lastLogin: 'Never logged in',
                                status: activateAccount ? 'Active' : 'Inactive'
                              };
                              setStaffList(prev => [...prev, newStaffObj]);
                              setShowAddStaffModal(false);
                              setNewStaffName('');
                              setNewStaffEmail('');
                              setNewStaffIC('');
                              setNewStaffPhone('');
                              setNewStaffJoinDate('');

                              // Show success toast
                              setShowToast(true);
                              setTimeout(() => setShowToast(false), 3000);
                            }}
                            className="bg-primary text-on-primary hover:bg-surface-tint font-label-lg text-xs font-bold px-6 py-2.5 rounded-full transition-colors cursor-pointer active:scale-95 duration-100"
                          >
                            Create Account
                          </button>
                        </div>
                      </motion.div>
                    </div>
                  )}
                </AnimatePresence>

                {/* Edit Staff Modal Overlay */}
                <AnimatePresence>
                  {showEditStaffModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowEditStaffModal(false)} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
                      <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="relative bg-surface-container-lowest border border-outline-variant/60 w-full max-w-2xl rounded-3xl p-8 shadow-2xl z-10 space-y-6">
                        <div className="border-b border-outline-variant/20 pb-4">
                          <h3 className="font-headline-sm text-2xl font-bold text-on-surface">Edit Staff Profile</h3>
                          <p className="text-xs text-on-surface-variant font-medium mt-1 uppercase tracking-widest font-mono">Managing ID: {editingStaffId}</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-4">
                            <div className="space-y-1.5">
                              <label className="font-label-lg text-[10px] font-bold text-primary uppercase tracking-widest">Clock In/Out ID (PIN)</label>
                              <input type="text" maxLength={7} value={newStaffVerifyId} onChange={(e) => setNewStaffVerifyId(e.target.value.replace(/\D/g, ''))} className="w-full bg-primary/5 border border-primary/20 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all px-4 py-3 rounded-2xl text-sm font-mono font-bold text-primary" placeholder="2250***" />
                              <p className="text-[9px] text-outline font-medium px-1 italic">Used for verification at the terminal (7 digits starting with 2250).</p>
                            </div>
                            <div className="space-y-1.5">
                              <label className="font-label-lg text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Full Name</label>
                              <input type="text" value={newStaffName} onChange={(e) => setNewStaffName(e.target.value)} className="w-full bg-surface-container-low border border-outline-variant/40 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all px-4 py-3 rounded-2xl text-sm font-medium" />
                            </div>
                            <div className="space-y-1.5">
                              <label className="font-label-lg text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">IC Number</label>
                              <input type="text" value={newStaffIC} onChange={(e) => setNewStaffIC(e.target.value)} className="w-full bg-surface-container-low border border-outline-variant/40 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all px-4 py-3 rounded-2xl text-sm font-medium" />
                            </div>
                            <div className="space-y-1.5">
                              <label className="font-label-lg text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Phone Number</label>
                              <input type="text" value={newStaffPhone} onChange={(e) => setNewStaffPhone(e.target.value)} className="w-full bg-surface-container-low border border-outline-variant/40 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all px-4 py-3 rounded-2xl text-sm font-medium" />
                            </div>
                          </div>

                          <div className="space-y-4">
                            <div className="space-y-1.5">
                              <label className="font-label-lg text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Email Address</label>
                              <input type="email" value={newStaffEmail} onChange={(e) => setNewStaffEmail(e.target.value)} className="w-full bg-surface-container-low border border-outline-variant/40 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all px-4 py-3 rounded-2xl text-sm font-medium" />
                            </div>
                            <div className="space-y-1.5">
                              <label className="font-label-lg text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Position / Role</label>
                              <select value={newStaffRole} onChange={(e) => setNewStaffRole(e.target.value)} className="w-full bg-surface-container-low border border-outline-variant/40 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all px-4 py-3 rounded-2xl text-sm font-medium">
                                <option value="Cashier">Cashier</option>
                                <option value="Supervisor">Supervisor</option>
                                <option value="Kitchen Staff">Kitchen Staff</option>
                                <option value="Cleaner">Cleaner</option>
                                <option value="Other">Other</option>
                              </select>
                            </div>
                            <div className="space-y-1.5">
                              <label className="font-label-lg text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Default Shift</label>
                              <select value={newStaffShift} onChange={(e) => setNewStaffShift(e.target.value)} className="w-full bg-surface-container-low border border-outline-variant/40 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all px-4 py-3 rounded-2xl text-sm font-medium">
                                <option value="Morning">Morning</option>
                                <option value="Afternoon">Afternoon</option>
                                <option value="Night">Night</option>
                              </select>
                            </div>
                            <div className="space-y-1.5">
                              <label className="font-label-lg text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Hourly Rate</label>
                              <div className="flex items-center bg-surface-container-low border border-outline-variant/40 rounded-2xl overflow-hidden focus-within:border-primary focus-within:ring-1 focus-within:ring-primary transition-all">
                                <span className="px-4 py-3 text-outline font-bold text-xs font-mono border-r border-outline-variant/30 select-none">RM</span>
                                <input type="text" value={newStaffRate} onChange={(e) => setNewStaffRate(e.target.value)} className="flex-1 px-4 py-3 bg-transparent border-none outline-none text-sm font-mono font-bold" />
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-4 py-4 border-t border-outline-variant/20 pt-6">
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" checked={activateAccount} onChange={(e) => setActivateAccount(e.target.checked)} className="sr-only peer" />
                            <div className="w-11 h-6 bg-outline rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-outline-variant after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                          </label>
                          <span className="text-sm text-on-surface font-bold">Active Employment Status</span>
                        </div>

                        <div className="flex items-center justify-end gap-3 pt-2">
                          <button onClick={() => setShowEditStaffModal(false)} className="px-6 py-2.5 rounded-full border border-outline-variant/60 text-on-surface hover:bg-surface-container-low text-xs font-bold transition-colors">Cancel</button>
                          <button
                            onClick={() => {
                              setStaffList(prev => prev.map(s => s.id === editingStaffId ? {
                                ...s,
                                verificationId: newStaffVerifyId,
                                name: newStaffName,
                                position: newStaffRole,
                                email: newStaffEmail,
                                ic: newStaffIC,
                                phone: newStaffPhone,
                                joinDate: newStaffJoinDate,
                                shift: newStaffShift,
                                rate: newStaffRate,
                                status: activateAccount ? 'Active' : 'Inactive'
                              } : s));
                              setShowEditStaffModal(false);
                              setToastMessage(`Profile for ${newStaffName} updated successfully.`);
                              setShowToast(true);
                              setTimeout(() => setShowToast(false), 3000);
                            }}
                            className="bg-primary text-on-primary font-label-lg text-xs font-bold px-8 py-2.5 rounded-full shadow-sm hover:bg-primary/95 transition-all"
                          >
                            Save Changes
                          </button>
                        </div>
                      </motion.div>
                    </div>
                  )}
                </AnimatePresence>

              </section>
            )}

            {/* TAB 5: NOTIFICATIONS */}
            {activeTab === 'notifications' && (
              <section id="section-notifications">
                <h2 className="text-[32px] font-bold text-on-surface mb-8">Notification Configurations</h2>
                <div className="bg-surface rounded-3xl shadow-sm border border-outline-variant/30 p-6 md:p-8 bg-surface-container-lowest space-y-4">

                  <div className="flex items-center justify-between p-4 bg-surface-container-low/30 rounded-2xl border border-outline-variant/10">
                    <div>
                      <div className="font-body-lg font-bold text-on-surface">High Volume Transaction Alert</div>
                      <div className="text-xs text-outline font-medium mt-0.5">Send a real-time warning on phone and email for entries exceeding RM 1,000.</div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={notifyThreshold}
                        onChange={(e) => setNotifyThreshold(e.target.checked)}
                        className="sr-only peer text-primary cursor-pointer"
                      />
                      <div className="w-11 h-6 bg-outline rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-outline-variant after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-surface-container-low/30 rounded-2xl border border-outline-variant/10">
                    <div>
                      <div className="font-body-lg font-bold text-on-surface">Daily Cashflow Reports</div>
                      <div className="text-xs text-outline font-medium mt-0.5">Deliver a clean summary PDF at 10 PM daily containing today's totals.</div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={notifyDailySummary}
                        onChange={(e) => setNotifyDailySummary(e.target.checked)}
                        className="sr-only peer text-primary cursor-pointer"
                      />
                      <div className="w-11 h-6 bg-outline rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-outline-variant after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-surface-container-low/30 rounded-2xl border border-outline-variant/10">
                    <div>
                      <div className="font-body-lg font-bold text-on-surface">Payroll Payout Reminders</div>
                      <div className="text-xs text-outline font-medium mt-0.5">Notify 3 days before the end of monthly payroll cycle to confirm rates.</div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={notifyPayrollReminder}
                        onChange={(e) => setNotifyPayrollReminder(e.target.checked)}
                        className="sr-only peer text-primary cursor-pointer"
                      />
                      <div className="w-11 h-6 bg-outline rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-outline-variant after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                  </div>

                </div>

                {/* Bottom Page Actions */}
                <div className="mt-8 flex items-center justify-end pt-4 border-t border-outline-variant/20">
                  <button
                    onClick={handleSaveChanges}
                    className="px-6 py-2.5 rounded-full bg-primary text-on-primary font-label-lg text-xs font-bold shadow-sm hover:bg-primary-container hover:text-on-primary-container transition-colors flex items-center gap-2 cursor-pointer active:scale-95 duration-100"
                  >
                    <span className="material-symbols-outlined text-[18px]">save</span>
                    <span>Save Changes</span>
                  </button>
                </div>
              </section>
            )}

            {/* TAB 6: MY ACCOUNT */}
            {activeTab === 'my-account' && (
              <section id="section-my-account" className="w-full">
                <div className="mb-8">
                  <h2 className="font-headline-lg text-[32px] font-bold text-on-surface">My Account</h2>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Left Column: Profile Card */}
                  <div className="lg:col-span-1 space-y-8">
                    <div className="bg-surface-container-lowest rounded-[24px] p-6 border border-outline-variant/60 shadow-sm flex flex-col items-center text-center">

                      <h3 className="font-title-lg text-title-lg font-bold text-on-surface mb-1">{ownerName}</h3>
                      <p className="font-label-lg text-xs font-bold text-primary bg-primary-fixed px-3.5 py-1 rounded-full mb-6">Business Owner</p>

                      <div className="w-full border-t border-outline-variant/40 pt-6 mt-2 space-y-4 text-left">
                        <div className="flex items-center gap-4 text-on-surface-variant">
                          <span className="material-symbols-outlined text-lg shrink-0">mail</span>
                          <span className="font-body-md text-sm truncate">{ownerEmail}</span>
                        </div>
                        <div className="flex items-center gap-4 text-on-surface-variant">
                          <span className="material-symbols-outlined text-lg shrink-0">phone</span>
                          <span className="font-body-md text-sm truncate">{ownerPhone}</span>
                        </div>
                        <div className="flex items-center gap-4 text-on-surface-variant">
                          <span className="material-symbols-outlined text-lg shrink-0">location_on</span>
                          <span className="font-body-md text-sm truncate">{ownerLocation}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Forms */}
                  <div className="lg:col-span-2 space-y-8">

                    {/* Personal Information Form */}
                    <div className="bg-surface-container-lowest rounded-[24px] border border-outline-variant/60 shadow-sm overflow-hidden">
                      <div className="p-6 border-b border-outline-variant/40 bg-surface-container-low/50">
                        <h3 className="font-title-lg text-lg font-bold text-on-surface">Personal Information</h3>
                      </div>

                      <div className="p-6 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <label className="font-label-lg text-xs font-bold text-on-surface">Full Name</label>
                            <input
                              type="text"
                              value={ownerName}
                              onChange={(e) => setOwnerName(e.target.value)}
                              className="w-full bg-surface-container-low border border-outline-variant/45 rounded-2xl px-4 py-3 text-on-surface font-body-md text-sm focus:border-primary focus:ring-1 focus:ring-primary transition-all outline-none"
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="font-label-lg text-xs font-bold text-on-surface">Phone Number</label>
                            <input
                              type="tel"
                              value={ownerPhone}
                              onChange={(e) => setOwnerPhone(e.target.value)}
                              className="w-full bg-surface-container-low border border-outline-variant/45 rounded-2xl px-4 py-3 text-on-surface font-body-md text-sm focus:border-primary focus:ring-1 focus:ring-primary transition-all outline-none"
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <label className="font-label-lg text-xs font-bold text-on-surface">Email Address</label>
                          <input
                            type="email"
                            value={ownerEmail}
                            onChange={(e) => setOwnerEmail(e.target.value)}
                            className="w-full bg-surface-container-low border border-outline-variant/45 rounded-2xl px-4 py-3 text-on-surface font-body-md text-sm focus:border-primary focus:ring-1 focus:ring-primary transition-all outline-none"
                          />
                        </div>

                        <div className="flex justify-end pt-4">
                          <button
                            onClick={handleSaveChanges}
                            className="bg-primary text-on-primary font-label-lg text-xs font-bold py-2.5 px-6 rounded-full hover:bg-primary-container hover:text-on-primary-container transition-colors shadow-sm cursor-pointer active:scale-95 duration-100"
                          >
                            Save Changes
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Security Section */}
                    <div className="bg-surface-container-lowest rounded-[24px] border border-outline-variant/60 shadow-sm overflow-hidden">
                      <div className="p-6 border-b border-outline-variant/40 bg-surface-container-low/50">
                        <h3 className="font-title-lg text-lg font-bold text-on-surface">Security &amp; Password</h3>
                      </div>

                      <div className="p-6 space-y-8">
                        {/* Password Change */}
                        <div className="space-y-6">
                          <h4 className="font-title-md font-bold text-on-surface flex items-center gap-3">
                            <span className="material-symbols-outlined text-primary text-xl shrink-0">key</span>
                            <span>Change Password</span>
                          </h4>

                          <div className="space-y-4">
                            <div className="space-y-2">
                              <label className="font-label-lg text-xs font-bold text-on-surface">Current Password</label>
                              <input
                                type="password"
                                value={currPassword}
                                onChange={(e) => setCurrPassword(e.target.value)}
                                placeholder="Enter current password"
                                className="w-full bg-surface-container-low border border-outline-variant/45 rounded-2xl px-4 py-3 text-on-surface font-body-md text-sm focus:border-primary focus:ring-1 focus:ring-primary transition-all outline-none"
                              />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div className="space-y-2">
                                <label className="font-label-lg text-xs font-bold text-on-surface">New Password</label>
                                <input
                                  type="password"
                                  value={newPassword}
                                  onChange={(e) => setNewPassword(e.target.value)}
                                  placeholder="Create new password"
                                  className="w-full bg-surface-container-low border border-outline-variant/45 rounded-2xl px-4 py-3 text-on-surface font-body-md text-sm focus:border-primary focus:ring-1 focus:ring-primary transition-all outline-none"
                                />
                              </div>
                              <div className="space-y-2">
                                <label className="font-label-lg text-xs font-bold text-on-surface">Confirm Password</label>
                                <input
                                  type="password"
                                  value={confirmPassword}
                                  onChange={(e) => setConfirmPassword(e.target.value)}
                                  placeholder="Confirm new password"
                                  className="w-full bg-surface-container-low border border-outline-variant/45 rounded-2xl px-4 py-3 text-on-surface font-body-md text-sm focus:border-primary focus:ring-1 focus:ring-primary transition-all outline-none"
                                />
                              </div>
                            </div>
                          </div>

                          <div className="flex justify-end">
                            <button
                              onClick={handleSaveChanges}
                              className="bg-surface-container-high text-on-surface font-label-lg text-xs font-bold py-2.5 px-6 rounded-full hover:bg-surface-variant transition-colors cursor-pointer active:scale-95 duration-100"
                            >
                              Update Password
                            </button>
                          </div>
                        </div>

                        <hr className="border-outline-variant/40" />

                        {/* 2FA & Active Sessions */}
                        <div className="space-y-6">
                          <div className="flex items-center justify-between p-4 bg-surface-container-low rounded-2xl">
                            <div>
                              <h4 className="font-title-md font-bold text-on-surface mb-1">Two-Factor Authentication</h4>
                              <p className="font-body-md text-xs text-on-surface-variant font-medium">Add an extra layer of security to your account.</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                checked={twoFactorEnabled}
                                onChange={(e) => setTwoFactorEnabled(e.target.checked)}
                                className="sr-only peer text-primary cursor-pointer"
                              />
                              <div className="w-11 h-6 bg-outline rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-outline-variant after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                            </label>
                          </div>

                          <div>
                            <h4 className="font-title-md font-bold text-on-surface mb-4">Active Sessions</h4>
                            <div className="space-y-3">
                              <div className="flex items-center justify-between p-4 border border-outline-variant/40 rounded-2xl bg-surface-container-low/20">
                                <div className="flex items-center gap-4">
                                  <div className="w-10 h-10 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center shrink-0">
                                    <span className="material-symbols-outlined text-lg">computer</span>
                                  </div>
                                  <div className="min-w-0">
                                    <p className="font-title-md font-bold text-sm text-on-surface">Mac OS • Safari</p>
                                    <p className="font-body-md text-xs text-on-surface-variant font-medium">Kuala Lumpur, MY • Current Session</p>
                                  </div>
                                </div>
                                <span className="font-label-sm text-[10px] bg-primary-fixed text-on-primary-fixed font-bold px-2.5 py-1 rounded-lg">Active Now</span>
                              </div>
                            </div>
                          </div>

                          <div className="flex justify-end pt-2">
                            <button
                              onClick={() => {
                                if (confirm('Are you sure you want to invalidate all other active browser session keys?')) {
                                  alert('Successfully cleared active sessions.');
                                }
                              }}
                              className="border border-error text-error font-label-lg text-xs font-bold py-2.5 px-6 rounded-full hover:bg-error-container transition-colors flex items-center gap-2 cursor-pointer active:scale-95 duration-100"
                            >
                              <span className="material-symbols-outlined text-sm">logout</span>
                              <span>Logout All Devices</span>
                            </button>
                          </div>
                        </div>

                      </div>
                    </div>

                  </div>
                </div>

                {/* Bottom Page Actions */}
                <div className="mt-8 flex items-center justify-end pt-4 border-t border-outline-variant/20">
                  <button
                    onClick={handleSaveChanges}
                    className="px-6 py-2.5 rounded-full bg-primary text-on-primary font-label-lg text-xs font-bold shadow-sm hover:bg-primary-container hover:text-on-primary-container transition-colors flex items-center gap-2 cursor-pointer active:scale-95 duration-100"
                  >
                    <span className="material-symbols-outlined text-[18px]">save</span>
                    <span>Save Changes</span>
                  </button>
                </div>
              </section>
            )}

            {/* TAB 7: DANGER ZONE */}
            {activeTab === 'danger-zone' && (
              <section id="section-danger-zone">
                <div className="mb-8">
                  <h2 className="font-headline-lg text-[32px] font-bold text-on-surface mb-2">Danger Zone</h2>
                </div>

                {/* Warning Banner */}
                <div className="bg-error-container border border-error/20 rounded-2xl p-6 mb-8 flex items-start gap-4">
                  <span className="material-symbols-outlined text-error mt-1 filled" style={{ fontVariationSettings: "'FILL' 1" }}>warning</span>
                  <div>
                    <h3 className="font-title-lg text-title-lg font-bold text-on-error-container mb-2">These actions are permanent</h3>
                    <p className="font-body-md text-body-md text-on-error-container/80 leading-relaxed">
                      Proceed with extreme caution. Once you execute any of these commands, the data cannot be recovered. We strongly advise exporting your data before proceeding.
                    </p>
                  </div>
                </div>

                {/* Danger Action List */}
                <div className="bg-surface-container-lowest border border-outline-variant/60 rounded-2xl overflow-hidden shadow-sm">

                  {/* Action Row 1 */}
                  <div className="p-6 border-b border-outline-variant/40 flex items-center justify-between hover:bg-surface-container-low transition-colors duration-150">
                    <div>
                      <h4 className="font-title-md text-title-md font-bold text-on-surface mb-1">Reset All Payroll Data</h4>
                      <p className="font-body-md text-body-md text-on-surface-variant">Clear all historical payroll runs, employee compensation records, and tax filings.</p>
                    </div>
                    <button
                      onClick={() => handleDangerReset('Reset All Payroll Data')}
                      className="px-6 py-2 border border-error text-error hover:bg-error hover:text-on-error rounded-full font-label-lg text-label-lg transition-colors whitespace-nowrap ml-4 cursor-pointer active:scale-95 duration-100"
                    >
                      Reset Data
                    </button>
                  </div>

                  {/* Action Row 2 */}
                  <div className="p-6 border-b border-outline-variant/40 flex items-center justify-between hover:bg-surface-container-low transition-colors duration-150">
                    <div>
                      <h4 className="font-title-md text-title-md font-bold text-on-surface mb-1">Remove All Staff</h4>
                      <p className="font-body-md text-body-md text-on-surface-variant">Permanently delete all employee profiles, direct deposit information, and access credentials.</p>
                    </div>
                    <button
                      onClick={() => handleDangerReset('Remove All Staff')}
                      className="px-6 py-2 border border-error text-error hover:bg-error hover:text-on-error rounded-full font-label-lg text-label-lg transition-colors whitespace-nowrap ml-4 cursor-pointer active:scale-95 duration-100"
                    >
                      Remove Staff
                    </button>
                  </div>

                  {/* Action Row 3 */}
                  <div className="p-6 flex items-center justify-between bg-error-container/10 hover:bg-error-container/20 transition-colors duration-150">
                    <div>
                      <h4 className="font-title-md text-title-md font-bold text-error mb-1">Delete Business Account</h4>
                      <p className="font-body-md text-body-md text-on-surface-variant">Permanently erase your entire fintech account, all business ledgers, and terminate your subscription immediately.</p>
                    </div>
                    <button
                      onClick={() => handleDangerReset('Delete Business Account')}
                      className="px-6 py-2 bg-error text-on-error hover:bg-error/90 rounded-full font-label-lg text-label-lg transition-colors whitespace-nowrap shadow-sm ml-4 cursor-pointer active:scale-95 duration-100"
                    >
                      Delete Account
                    </button>
                  </div>

                </div>

                {/* Bottom Page Actions */}
                <div className="mt-8 flex items-center justify-end pt-4 border-t border-outline-variant/20">
                  <button
                    onClick={handleSaveChanges}
                    className="px-6 py-2.5 rounded-full bg-primary text-on-primary font-label-lg text-xs font-bold shadow-sm hover:bg-primary-container hover:text-on-primary-container transition-colors flex items-center gap-2 cursor-pointer active:scale-95 duration-100"
                  >
                    <span className="material-symbols-outlined text-[18px]">save</span>
                    <span>Save Changes</span>
                  </button>
                </div>
              </section>
            )}

          </motion.div>
        </AnimatePresence>

      </div>

      {/* Toast Alert popup feedback */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="fixed bottom-8 right-8 z-50 bg-primary-container text-on-primary-container border border-primary/20 rounded-2xl px-6 py-4 flex items-center gap-3 shadow-lg max-w-sm"
          >
            <span className="material-symbols-outlined text-white text-[24px]">check_circle</span>
            <div>
              <div className="font-title-md font-bold text-xs">Settings Saved Successfully</div>
              <div className="text-[10px] opacity-80 mt-0.5">{toastMessage}</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Layout>
  );
}
