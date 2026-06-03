import React, { useState, useMemo } from 'react';
import { Layout } from '../components/Layout';
import { motion, AnimatePresence } from 'framer-motion';
import { useTransactionsFirestore } from '../hooks/useTransactionsFirestore';
import { SalesTransaction } from './types';

// The SalesTransaction interface is now imported from types.ts, but we'll use the hook's return type directly.
// (You could also import SalesTransaction if needed here)

const initialTransactions: SalesTransaction[] = [
  {
    id: 1,
    date: 'Oct 24, 2023',
    time: '08:30 AM',
    orderId: '#HT-1024',
    staffName: 'Siti Aminah',
    staffInitials: 'SA',
    staffColor: 'bg-tertiary-container text-on-tertiary-container',
    amount: 12.50
  },
  {
    id: 2,
    date: 'Oct 24, 2023',
    time: '08:45 AM',
    orderId: '#HT-1025',
    staffName: 'Ah Lian',
    staffInitials: 'AL',
    staffColor: 'bg-secondary-container text-on-secondary-container',
    amount: 8.00
  },
  {
    id: 3,
    date: 'Oct 24, 2023',
    time: '09:15 AM',
    orderId: '#HT-1026',
    staffName: 'Siti Aminah',
    staffInitials: 'SA',
    staffColor: 'bg-tertiary-container text-on-tertiary-container',
    amount: 24.50
  },
  {
    id: 4,
    date: 'Oct 24, 2023',
    time: '09:30 AM',
    orderId: '#HT-1027',
    staffName: 'Ah Lian',
    staffInitials: 'AL',
    staffColor: 'bg-secondary-container text-on-secondary-container',
    amount: 6.00
  },
  {
    id: 5,
    date: 'Oct 24, 2023',
    time: '10:05 AM',
    orderId: '#HT-1028',
    staffName: 'Siti Aminah',
    staffInitials: 'SA',
    staffColor: 'bg-tertiary-container text-on-tertiary-container',
    amount: 18.00
  },
  {
    id: 6,
    date: 'Oct 24, 2023',
    time: '11:15 AM',
    orderId: '#HT-1029',
    staffName: 'Uncle Lim',
    staffInitials: 'UL',
    staffColor: 'bg-primary-container text-on-primary-container',
    amount: 15.00
  },
  {
    id: 7,
    date: 'Oct 24, 2023',
    time: '12:30 PM',
    orderId: '#HT-1030',
    staffName: 'Ah Lian',
    staffInitials: 'AL',
    staffColor: 'bg-secondary-container text-on-secondary-container',
    amount: 32.50
  },
  {
    id: 8,
    date: 'Oct 24, 2023',
    time: '01:15 PM',
    orderId: '#HT-1031',
    staffName: 'Siti Aminah',
    staffInitials: 'SA',
    staffColor: 'bg-tertiary-container text-on-tertiary-container',
    amount: 10.50
  },
  {
    id: 9,
    date: 'Oct 24, 2023',
    time: '02:00 PM',
    orderId: '#HT-1032',
    staffName: 'Uncle Lim',
    staffInitials: 'UL',
    staffColor: 'bg-primary-container text-on-primary-container',
    amount: 22.00
  },
  {
    id: 10,
    date: 'Oct 24, 2023',
    time: '03:45 PM',
    orderId: '#HT-1033',
    staffName: 'Ah Lian',
    staffInitials: 'AL',
    staffColor: 'bg-secondary-container text-on-secondary-container',
    amount: 14.50
  }
];

export default function TransactionHistory() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStaff, setSelectedStaff] = useState('All Staff');
  const [selectedDate, setSelectedDate] = useState('All Dates');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Get live data from Firestore instead of localStorage
  const { transactions: allTransactions, loading, deleteTransaction } = useTransactionsFirestore();

  const handleDeleteTransaction = async (id: string | number, orderId: string) => {
    if (window.confirm(`Are you sure you want to delete transaction ${orderId}?`)) {
      try {
        await deleteTransaction(id);
      } catch (err) {
        alert("Failed to delete transaction. Please try again.");
      }
    }
  };

  // Extract unique staff and dates for dynamic filters
  const availableStaff = useMemo(() => {
    const staffSet = new Set(allTransactions.map(tx => tx.staffName));
    return ['All Staff', ...Array.from(staffSet)].sort();
  }, [allTransactions]);

  const availableDates = useMemo(() => {
    const dateSet = new Set(allTransactions.map(tx => tx.date));
    return ['All Dates', ...Array.from(dateSet)];
  }, [allTransactions]);

  // Filter transactions dynamically
  const filteredTransactions = useMemo(() => {
    return allTransactions.filter((tx) => {
      // Staff filter
      if (selectedStaff !== 'All Staff' && tx.staffName !== selectedStaff) {
        return false;
      }
      
      // Date filter
      if (selectedDate !== 'All Dates' && tx.date !== selectedDate) {
        return false;
      }

      // Search query filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          tx.orderId.toLowerCase().includes(query) ||
          tx.staffName.toLowerCase().includes(query) ||
          tx.time.toLowerCase().includes(query) ||
          tx.date.toLowerCase().includes(query)
        );
      }

      return true;
    });
  }, [selectedStaff, selectedDate, searchQuery, allTransactions]);

  // Pagination calculation
  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage) || 1;

  // Live Stats for the Bento Cards (calculated from all transactions)
  const liveStats = useMemo(() => {
    const revenue = allTransactions.reduce((sum, tx) => sum + tx.amount, 0);
    const orders = allTransactions.length;
    
    // Calculate peak hour based on frequency of transaction times
    const hourCounts: Record<string, number> = {};
    allTransactions.forEach(tx => {
      const hourPart = tx.time.split(':')[0];
      const ampm = tx.time.split(' ')[1];
      const hourKey = `${hourPart}:00 ${ampm}`;
      hourCounts[hourKey] = (hourCounts[hourKey] || 0) + 1;
    });
    
    let peak = 'N/A';
    let max = 0;
    Object.entries(hourCounts).forEach(([hour, count]) => {
      if (count > max) {
        max = count;
        peak = hour;
      }
    });

    return { revenue, orders, peak };
  }, [allTransactions]);

  // Calculate total amount for displayed (filtered) transactions
  const totalAmount = useMemo(() => filteredTransactions.reduce((sum, tx) => sum + tx.amount, 0), [filteredTransactions]);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedTransactions = filteredTransactions.slice(startIndex, startIndex + itemsPerPage);

  const handleExport = () => {
    alert(`Exporting ${filteredTransactions.length} sales logs as CSV report...`);
  };

  return (
    <Layout title="Sales Log">
      <div className="pb-12 flex-grow overflow-y-auto w-full max-w-[1600px] mx-auto flex flex-col gap-6 font-sans text-on-surface">

        {/* Bento Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="bg-secondary-container rounded-2xl p-6 flex flex-col justify-between border border-outline-variant/20 shadow-sm relative overflow-hidden">
            <div className="flex justify-between items-start mb-4">
              <span className="material-symbols-outlined text-primary bg-surface p-2 rounded-xl shadow-sm filled">payments</span>
              <span className="text-[10px] font-bold text-on-secondary-container bg-surface/50 px-2.5 py-1 rounded-full font-data">
                +12% vs yesterday
              </span>
            </div>
            <div>
              <p className="font-body-md text-xs text-on-secondary-container/90 font-medium mb-1">Total Revenue Today</p>
              <p className="font-headline-lg text-2xl font-bold text-on-surface font-data">RM {liveStats.revenue.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-surface-container rounded-2xl p-6 flex flex-col justify-between border border-outline-variant/20 shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <span className="material-symbols-outlined text-secondary bg-surface p-2 rounded-xl shadow-sm">receipt_long</span>
            </div>
            <div>
              <p className="font-body-md text-xs text-on-surface-variant mb-1 font-medium">Total Orders</p>
              <p className="font-headline-lg text-2xl font-bold text-on-surface font-data">{liveStats.orders}</p>
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-surface-container rounded-2xl p-6 flex flex-col justify-between border border-outline-variant/20 shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <span className="material-symbols-outlined text-secondary bg-surface p-2 rounded-xl shadow-sm">schedule</span>
            </div>
            <div>
              <p className="font-body-md text-xs text-on-surface-variant mb-1 font-medium">Peak Hour</p>
              <p className="font-headline-lg text-2xl font-bold text-on-surface font-data">{liveStats.peak}</p>
            </div>
          </div>
        </div>

        {/* Transaction Table Container */}
        <div className="bg-surface-container-lowest rounded-3xl border border-outline-variant/40 shadow-sm overflow-hidden flex flex-col">
          {/* Total Amount Summary */}
          <div className="px-6 py-2 bg-surface-container-high rounded-t-lg border-b border-outline-variant/30">
            <p className="font-headline-sm font-bold text-on-surface">Total Amount: RM {totalAmount.toFixed(2)}</p>
          </div>
          
          {/* Table Filters / Toolbar */}
          <div className="px-6 py-2 border-b border-outline-variant/30 flex flex-col sm:flex-row gap-4 items-center justify-between bg-surface-container-low/50">
            <div className="flex flex-wrap items-center gap-3">
              {/* Date Filter */}
              <select 
                value={selectedDate}
                onChange={(e) => { setSelectedDate(e.target.value); setCurrentPage(1); }}
                className="bg-surface-container border border-outline-variant/30 text-xs font-bold rounded-3xl py-1 !h-9 pr-10 pl-4 focus:ring-1 focus:ring-primary cursor-pointer text-on-surface appearance-none"
                style={{ backgroundImage: `url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%2379747E' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3E%3C/svg%3E")`, backgroundPosition: 'right 0.75rem center', backgroundSize: '1.2em 1.2em', backgroundRepeat: 'no-repeat' }}
              >
                {availableDates.map(date => <option key={date} value={date}>{date}</option>)}
              </select>

              {/* Staff Filter */}
              <select 
                value={selectedStaff}
                onChange={(e) => { setSelectedStaff(e.target.value); setCurrentPage(1); }}
                className="bg-surface-container border border-outline-variant/30 text-xs font-bold rounded-3xl py-1 !h-9 pr-10 pl-4 focus:ring-1 focus:ring-primary cursor-pointer text-on-surface appearance-none"
                style={{ backgroundImage: `url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%2379747E' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3E%3C/svg%3E")`, backgroundPosition: 'right 0.75rem center', backgroundSize: '1.2em 1.2em', backgroundRepeat: 'no-repeat' }}
              >
                {availableStaff.map(staff => <option key={staff} value={staff}>{staff}</option>)}
              </select>
            </div>

            {/* Live Search */}
            <div className="relative w-full sm:w-64 shrink-0 text-xs">
              <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant/80 text-[18px]">
                search
              </span>
              <input 
                type="text" 
                placeholder="Search logs..."
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                className="w-full pl-10 pr-4 py-1 !h-9 bg-surface-container rounded-3xl border border-outline-variant/30 text-xs text-on-surface focus:ring-1 focus:ring-primary outline-none"
              />
            </div>
          </div>

          {/* Table */}
          <div className="w-full text-xs">
            {/* Grid Header */}
            <div className="grid grid-cols-6 bg-surface-container-low/30 border-b border-outline-variant/20 text-outline uppercase tracking-wider py-4 px-6 font-bold">
              <div>Date</div>
              <div>Time</div>
              <div>Order ID</div>
              <div>Staff Name</div>
              <div className="text-center">Amount (RM)</div>
              <div className="text-right">Action</div>
            </div>

            {/* Grid Body */}
            <div className="divide-y divide-outline-variant/10 bg-surface min-h-[300px] relative">
              <AnimatePresence mode="popLayout">
                {loading ? (
                  <motion.div 
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="py-12 text-center text-outline font-bold text-sm"
                  >
                    Loading transactions...
                  </motion.div>
                ) : paginatedTransactions.length === 0 ? (
                  <motion.div 
                    key="empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="py-12 text-center text-outline font-bold text-sm"
                  >
                    No transactions match the active filters or search terms.
                  </motion.div>
                ) : (
                  paginatedTransactions.map((tx) => (
                    <motion.div 
                      key={tx.id}
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.98 }}
                      className="grid grid-cols-6 items-center hover:bg-surface-container-low/20 transition-colors group cursor-default py-4 px-6 w-full"
                    >
                      <div className="font-medium whitespace-nowrap">{tx.date}</div>
                      <div className="font-data whitespace-nowrap">{tx.time}</div>
                      <div className="whitespace-nowrap">
                        <span className="inline-flex items-center font-bold text-primary bg-primary-fixed-dim/40 px-2.5 py-0.5 rounded font-data">
                          {tx.orderId}
                        </span>
                      </div>
                      <div className="whitespace-nowrap flex items-center gap-2.5">
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-[10px] shadow-sm shrink-0 ${tx.staffColor}`}>
                          {tx.staffInitials}
                        </div>
                        <span className="font-bold text-on-surface">{tx.staffName}</span>
                      </div>
                      <div className="font-bold text-primary whitespace-nowrap font-data text-center">
                        RM {tx.amount.toFixed(2)}
                      </div>
                      <div className="text-right">
                        <button
                          onClick={() => handleDeleteTransaction(tx.id, tx.orderId)}
                          className="text-error hover:bg-error/10 p-1.5 rounded-full transition-colors cursor-pointer"
                          title="Delete Transaction"
                        >
                          <span className="material-symbols-outlined text-[18px]">delete</span>
                        </button>
                      </div>
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Table Pagination/Footer */}
          <div className="px-6 py-4 flex flex-col sm:flex-row gap-4 items-center justify-between bg-surface-container-low/10">
            <span className="text-on-surface-variant font-medium">
              Showing <span className="font-data">{filteredTransactions.length === 0 ? 0 : startIndex + 1}</span> to{' '}
              <span className="font-data">{Math.min(startIndex + itemsPerPage, filteredTransactions.length)}</span> of{' '}
              <span className="font-data">{filteredTransactions.length}</span> entries
            </span>
            
            <div className="flex items-center gap-1">
              <button 
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                className="p-1.5 rounded hover:bg-surface-container text-on-surface-variant disabled:opacity-40 cursor-pointer disabled:pointer-events-none transition-colors"
              >
                <span className="material-symbols-outlined text-[18px] font-bold">chevron_left</span>
              </button>
              
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button 
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-7 h-7 rounded font-bold transition-all text-xs flex items-center justify-center cursor-pointer ${
                    currentPage === page 
                      ? 'bg-primary text-on-primary shadow-sm' 
                      : 'hover:bg-surface-container text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  {page}
                </button>
              ))}

              <button 
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                className="p-1.5 rounded hover:bg-surface-container text-on-surface-variant disabled:opacity-40 cursor-pointer disabled:pointer-events-none transition-colors"
              >
                <span className="material-symbols-outlined text-[18px] font-bold">chevron_right</span>
              </button>
            </div>
          </div>

        </div>

        {/* Bottom Page Actions */}
        <div className="flex justify-end pt-2">
          <button 
            onClick={handleExport}
            className="bg-primary text-on-primary rounded-full px-6 py-2.5 flex items-center gap-2 font-label-lg text-xs font-bold shadow-sm hover:shadow-md hover:bg-primary/95 transition-all cursor-pointer active:scale-95 duration-100"
          >
            <span className="material-symbols-outlined text-[18px]">file_download</span>
            <span>Export Records</span>
          </button>
        </div>

      </div>
    </Layout>
  );
}
