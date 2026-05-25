import React, { useState, useEffect, useMemo } from 'react';
import { Layout } from '../components/Layout';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

const transactions = [
  {
    staff: ['Ahmad', 'Siti'],
    date: 'Oct 24, 2023',
    description: 'Client Retainer – Alpha Corp',
    subtext: 'Invoice #INV-2023-089',
    category: 'Sales',
    amount: '+12500.00',
    expenses: '',
    balance: '0.00',
    type: 'income'
  },
  {
    staff: ['Razak', 'Mei'],
    date: 'Oct 22, 2023',
    description: 'Software Subscriptions',
    subtext: 'Adobe CC, Figma, AWS',
    category: 'Subscriptions',
    amount: '',
    expenses: '-85.00',
    balance: '0.00',
    type: 'expense'
  },
  {
    staff: ['Ahmad', 'Razak'],
    date: 'Oct 18, 2023',
    description: 'Project Milestone – Beta LLC',
    subtext: 'Design Phase Complete',
    category: 'Revenue',
    amount: '+8000.00',
    expenses: '',
    balance: '0.00',
    type: 'income'
  },
  {
    staff: ['Siti', 'Mei'],
    date: 'Oct 15, 2023',
    description: 'Office Equipment',
    subtext: 'Ergonomic Chair',
    category: 'Asset',
    amount: '',
    expenses: '-50.00',
    balance: '0.00',
    type: 'expense'
  }
];

export default function Ledger() {
  const userRole = localStorage.getItem('userRole') || 'admin';
  
  const staffRegistry = useMemo(() => {
    const saved = localStorage.getItem('wise_staff_registry');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return [];
      }
    }
    return [];
  }, []);

  const [ledgerTransactions, setLedgerTransactions] = useState(() => {
    const saved = localStorage.getItem('wise_ledger_registry');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return transactions;
  });

  // Listen for live updates from POS or other sources
  useEffect(() => {
    const handleUpdate = () => {
      const saved = localStorage.getItem('wise_ledger_registry');
      if (saved) {
        try {
          setLedgerTransactions(JSON.parse(saved));
        } catch (e) {}
      }
    };
    window.addEventListener('ledgerUpdated', handleUpdate);
    return () => window.removeEventListener('ledgerUpdated', handleUpdate);
  }, []);

  const [filterType, setFilterType] = useState<'all' | 'income' | 'expense'>('all');
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;

  // Reset page when filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [filterType]);

  // Calculate running balance dynamically
  const transactionsWithBalance = useMemo(() => {
    const sorted = [...ledgerTransactions].reverse(); // Sort oldest to newest
    let currentBalance = 40000; // Starting base balance for the ledger
    
    const withBalance = sorted.map(tx => {
      const inc = tx.amount ? parseFloat(tx.amount.replace(/[+,RM ]/g, '').replace(/,/g, '')) : 0;
      const exp = tx.expenses ? parseFloat(tx.expenses.replace(/[-,RM ]/g, '').replace(/,/g, '')) : 0;
      
      currentBalance = currentBalance + inc - exp;
      
      return { ...tx, calculatedBalance: currentBalance };
    });

    return withBalance.reverse(); // Return newest first for the table
  }, [ledgerTransactions]);

  // Filter transactions based on selected type
  const filteredDisplayTransactions = useMemo(() => {
    if (filterType === 'all') return transactionsWithBalance;
    return transactionsWithBalance.filter(tx => tx.type === filterType);
  }, [transactionsWithBalance, filterType]);

  // Pagination calculation
  const totalPages = Math.ceil(filteredDisplayTransactions.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedTransactions = filteredDisplayTransactions.slice(startIndex, startIndex + itemsPerPage);

  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [expenseName, setExpenseName] = useState('');
  const [expenseDescription, setExpenseDescription] = useState('');
  const [expenseAmount, setExpenseAmount] = useState('');
  const [expenseDate, setExpenseDate] = useState(new Date().toISOString().split('T')[0]);
  const [expenseCategory, setExpenseCategory] = useState('Ingredients');
  const [expenseStaff, setExpenseStaff] = useState('');

  const [showIncomeModal, setShowIncomeModal] = useState(false);
  const [incomeName, setIncomeName] = useState('');
  const [incomeDescription, setIncomeDescription] = useState('');
  const [incomeAmount, setIncomeAmount] = useState('');
  const [incomeDate, setIncomeDate] = useState(new Date().toISOString().split('T')[0]);
  const [incomeCategory, setIncomeCategory] = useState('Sales');
  const [incomeStaff, setIncomeStaff] = useState('');

  const handleAddIncome = (e: React.FormEvent) => {
    e.preventDefault();
    if (!incomeName || !incomeAmount || !incomeStaff) {
      alert('Please fill in the required fields.');
      return;
    }
    
    const amountFormatted = parseFloat(incomeAmount).toLocaleString('en-US', { minimumFractionDigits: 2 });
    const dateObj = new Date(incomeDate);
    const dateFormatted = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

    const newTransaction = {
      staff: [incomeStaff],
      date: dateFormatted,
      description: incomeName,
      subtext: incomeDescription || 'Manual Entry',
      category: incomeCategory,
      amount: `+${incomeAmount}`,
      expenses: '',
      balance: 'Updating...',
      type: 'income'
    };

    setLedgerTransactions([newTransaction, ...ledgerTransactions]);
    // Update storage
    localStorage.setItem('wise_ledger_registry', JSON.stringify([newTransaction, ...ledgerTransactions]));
    
    setIncomeName('');
    setIncomeDescription('');
    setIncomeAmount('');
    setIncomeStaff('');
    setIncomeDate(new Date().toISOString().split('T')[0]);
    setShowIncomeModal(false);
  };

  const handleAddExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!expenseName || !expenseAmount || !expenseStaff) {
      alert('Please fill in the required fields.');
      return;
    }
    
    // Create new transaction object
    const amountFormatted = parseFloat(expenseAmount).toLocaleString('en-US', { minimumFractionDigits: 2 });
    const dateObj = new Date(expenseDate);
    const dateFormatted = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

    const newTransaction = {
      staff: [expenseStaff],
      date: dateFormatted,
      description: expenseName,
      subtext: expenseDescription || 'Manual Entry',
      category: expenseCategory,
      amount: '',
      expenses: `-${expenseAmount}`,
      balance: 'Updating...', // Real-time balance calculation would follow ledger logic
      type: 'expense'
    };

    // Update local state to show in table
    setLedgerTransactions([newTransaction, ...ledgerTransactions]);
    // Update storage
    localStorage.setItem('wise_ledger_registry', JSON.stringify([newTransaction, ...ledgerTransactions]));
    
    // Reset and close
    setExpenseName('');
    setExpenseDescription('');
    setExpenseAmount('');
    setExpenseStaff('');
    setExpenseDate(new Date().toISOString().split('T')[0]);
    setShowExpenseModal(false);
  };

  return (
    <Layout title="Report">
      <div className="w-full max-w-[1600px] mx-auto flex flex-col min-h-0">
        {/* Page Header */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
          {/* Left Side: Filter Dropdown */}
          <div className="relative">
            <button 
              onClick={() => setIsFilterDropdownOpen(!isFilterDropdownOpen)}
              className="flex items-center gap-2 px-4 py-2 bg-surface-container-low border border-outline-variant/30 rounded-xl text-xs font-bold text-on-surface hover:bg-surface-container transition-all cursor-pointer select-none"
            >
              <span className="material-symbols-outlined text-[20px]">filter_list</span>
              <span className="capitalize">{filterType === 'all' ? 'All Transactions' : filterType === 'income' ? 'Income' : 'Expenses'}</span>
              <span className={`material-symbols-outlined text-[18px] transition-transform duration-200 ${isFilterDropdownOpen ? 'rotate-180' : ''}`}>keyboard_arrow_down</span>
            </button>

            <AnimatePresence>
              {isFilterDropdownOpen && (
                <>
                  <div className="fixed inset-0 z-30" onClick={() => setIsFilterDropdownOpen(false)}></div>
                  <motion.div 
                    initial={{ opacity: 0, y: 8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.95 }}
                    className="absolute left-0 mt-2 w-48 bg-surface-container-lowest border border-outline-variant/30 rounded-xl shadow-lg z-40 overflow-hidden"
                  >
                    <button onClick={() => { setFilterType('all'); setIsFilterDropdownOpen(false); }} className={`w-full px-4 py-2.5 text-left text-xs font-bold hover:bg-surface-container-low transition-colors ${filterType === 'all' ? 'text-primary bg-primary/5' : 'text-on-surface'}`}>All Transactions</button>
                    <button onClick={() => { setFilterType('income'); setIsFilterDropdownOpen(false); }} className={`w-full px-4 py-2.5 text-left text-xs font-bold hover:bg-surface-container-low transition-colors ${filterType === 'income' ? 'text-primary bg-primary/5' : 'text-on-surface'}`}>Income</button>
                    <button onClick={() => { setFilterType('expense'); setIsFilterDropdownOpen(false); }} className={`w-full px-4 py-2.5 text-left text-xs font-bold hover:bg-surface-container-low transition-colors ${filterType === 'expense' ? 'text-primary bg-primary/5' : 'text-on-surface'}`}>Expenses</button>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>

          {/* Right Side: Actions */}
          <div className="flex flex-col md:flex-row md:items-center gap-6">
            {userRole === 'admin' && (
              <div className="flex items-center gap-3">
                 <button 
                    onClick={() => setShowExpenseModal(true)}
                    className="bg-primary text-on-primary rounded-full px-6 py-2.5 flex items-center gap-2 font-label-lg text-xs font-bold shadow-sm hover:bg-primary/95 transition-all cursor-pointer active:scale-95 duration-100"
                  >
                    <span className="material-symbols-outlined text-[18px]">add</span>
                    <span>Add Expense</span>
                  </button>
              </div>
            )}
            <div className="flex items-center gap-3">
              <button className="w-10 h-10 flex items-center justify-center hover:bg-surface-container-high rounded-xl text-outline border border-outline-variant/30 transition-colors cursor-pointer">
                <span className="material-symbols-outlined text-[20px]">download</span>
              </button>
            </div>
          </div>
        </div>

        {/* Ledger Table Area */}
        <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-3xl flex flex-col min-h-0 mb-8 shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
          {/* Table Header Section */}
          <div className="px-8 py-5 border-b border-outline-variant/30 flex justify-between items-center bg-surface-container-low/30 rounded-t-3xl">
            <h2 className="text-title-md font-bold text-on-surface">Recent Transactions</h2>
          </div>
          
          {/* Table Column Headers */}
          <div className="grid grid-cols-7 gap-2 px-8 py-3 text-[10px] font-bold text-outline uppercase tracking-widest border-b border-outline-variant/30 bg-surface-container-low/10 font-mono">
            <div className="col-span-1">Staff</div>
            <div className="col-span-1">Date</div>
            <div className="col-span-1">Description</div>
            <div className="col-span-1">Category</div>
            <div className="col-span-1 text-right whitespace-nowrap">Income</div>
            <div className="col-span-1 text-right whitespace-nowrap">Expenses</div>
            <div className="col-span-1 text-right whitespace-nowrap">Balance</div>
          </div>

          {/* Transaction Rows */}
          <div className="overflow-y-auto flex-1 px-4 py-4 space-y-1">
            {paginatedTransactions.map((tx, idx) => (
              <div 
                key={idx}
                className="grid grid-cols-7 gap-2 items-center rounded-2xl px-4 py-4 transition hover:bg-surface-container-low/50 cursor-default bg-transparent"
              >
                <div className="col-span-1 text-[10px] text-on-surface-variant font-bold uppercase space-y-1 font-mono">
                  {tx.staff.map(s => <div key={s} className="flex items-center gap-1"><span className="w-1 h-1 rounded-full bg-primary/40"></span>{s}</div>)}
                </div>
                <div className="col-span-1 text-xs text-on-surface font-mono">
                  <div className="font-bold">{tx.date.split(',')[0]}</div>
                  <div className="text-[10px] text-outline mt-0.5">{tx.date.split(',')[1]}</div>
                </div>
                <div className="col-span-1">
                  <div className="font-bold text-on-surface text-sm">{tx.description}</div>
                  <div className="text-[11px] text-outline mt-1 font-mono">{tx.subtext}</div>
                </div>
                <div className="col-span-1">
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-[10px] font-bold bg-surface-container-high text-on-surface truncate max-w-full">
                    {tx.category}
                  </span>
                </div>
                <div className={`col-span-1 text-right font-bold text-sm font-mono whitespace-nowrap ${tx.type === 'income' ? 'text-primary' : 'text-on-surface'}`}>
                  {tx.type === 'income' ? tx.amount : '—'}
                </div>
                <div className="col-span-1 text-right font-bold text-error text-[13px] font-mono whitespace-nowrap">
                  {tx.type === 'expense' ? tx.expenses : '—'}
                </div>
                <div className={`col-span-1 text-right font-bold text-sm font-mono whitespace-nowrap ${tx.type === 'income' ? 'text-primary' : 'text-on-surface'}`}>
                  RM {tx.calculatedBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </div>
              </div>
            ))}
          </div>

          {/* Pagination Footer */}
          <div className="px-8 py-4 flex flex-col sm:flex-row gap-4 items-center justify-between border-t border-outline-variant/30 bg-surface-container-low/10 rounded-b-3xl">
            <span className="text-on-surface-variant text-[11px] font-medium">
              Showing <span className="font-bold text-on-surface">{filteredDisplayTransactions.length === 0 ? 0 : startIndex + 1}</span> to{' '}
              <span className="font-bold text-on-surface">{Math.min(startIndex + itemsPerPage, filteredDisplayTransactions.length)}</span> of{' '}
              <span className="font-bold text-on-surface">{filteredDisplayTransactions.length}</span> entries
            </span>
            
            <div className="flex items-center gap-1">
              <button 
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                className="w-8 h-8 rounded-full hover:bg-surface-container text-on-surface-variant disabled:opacity-40 cursor-pointer disabled:pointer-events-none transition-colors flex items-center justify-center"
              >
                <span className="material-symbols-outlined text-[18px] font-bold">chevron_left</span>
              </button>
              
              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  // Basic pagination logic to show current, first, and last pages
                  (page === 1 || page === totalPages || (page >= currentPage - 1 && page <= currentPage + 1)) && (
                    <button 
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`w-7 h-7 rounded-lg font-bold transition-all text-[11px] flex items-center justify-center cursor-pointer ${
                        currentPage === page 
                          ? 'bg-primary text-on-primary shadow-sm' 
                          : 'hover:bg-surface-container text-on-surface-variant'
                      }`}
                    >
                      {page}
                    </button>
                  )
                ))}
              </div>

              <button 
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                className="w-8 h-8 rounded-full hover:bg-surface-container text-on-surface-variant disabled:opacity-40 cursor-pointer disabled:pointer-events-none transition-colors flex items-center justify-center"
              >
                <span className="material-symbols-outlined text-[18px] font-bold">chevron_right</span>
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Widgets Area */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 h-auto">
          {/* Comparison Metrics Widget */}
          <div className="bg-surface-container-low/50 rounded-3xl p-8 border border-outline-variant/30 shadow-sm">
            <h2 className="text-[11px] font-bold text-outline uppercase tracking-widest mb-6 flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">query_stats</span> Comparison Metrics
            </h2>
            <div className="space-y-6">
              <div className="bg-surface-container-lowest rounded-2xl p-6 flex items-center justify-between border border-outline-variant/30 shadow-sm">
                <div className="relative w-24 h-24 flex-shrink-0">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    <defs>
                      <linearGradient id="gradientYesterday" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#6442d6" />
                        <stop offset="100%" stopColor="#8B5CF6" />
                      </linearGradient>
                      <linearGradient id="gradientToday" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#0EA5E9" />
                        <stop offset="100%" stopColor="#38BDF8" />
                      </linearGradient>
                    </defs>
                    <circle cx="50" cy="50" fill="none" r="40" stroke="#f1edef" strokeWidth="10"></circle>
                    <motion.circle 
                      cx="50" cy="50" fill="none" r="40" stroke="url(#gradientYesterday)" 
                      strokeDasharray="251.2" 
                      initial={{ strokeDashoffset: 251.2 }}
                      animate={{ strokeDashoffset: 251.2 - (251.2 * 180 / 251.2) }}
                      transition={{ duration: 1.5, ease: "easeOut" }}
                      strokeLinecap="round" strokeWidth="10"
                    ></motion.circle>
                    <circle cx="50" cy="50" fill="none" r="28" stroke="#f1edef" strokeWidth="8"></circle>
                    <motion.circle 
                      cx="50" cy="50" fill="none" r="28" stroke="url(#gradientToday)" 
                      strokeDasharray="175.9" 
                      initial={{ strokeDashoffset: 175.9 }}
                      animate={{ strokeDashoffset: 175.9 - (175.9 * 100 / 175.9) }}
                      transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
                      strokeLinecap="round" strokeWidth="8"
                    ></motion.circle>
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="material-symbols-outlined text-primary text-[20px]">payments</span>
                  </div>
                </div>
                <div className="ml-6 flex-1">
                  <h3 className="text-lg font-bold text-on-surface leading-tight mb-3">Spending Comparison</h3>
                  <div className="flex gap-6">
                    <div>
                      <div className="text-[10px] font-bold text-outline uppercase tracking-wider font-mono">Yesterday</div>
                      <div className="text-sm font-bold font-mono mt-0.5" style={{ color: '#6442d6' }}>RM 1,200</div>
                    </div>
                    <div>
                      <div className="text-[10px] font-bold text-outline uppercase tracking-wider font-mono flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: '#0EA5E9' }}></span> Today
                      </div>
                      <div className="text-sm font-bold font-mono mt-0.5" style={{ color: '#0EA5E9' }}>RM 850</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-surface-container-lowest rounded-2xl p-6 flex items-center justify-between border border-outline-variant/30 shadow-sm">
                <div className="relative w-24 h-24 flex-shrink-0">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    <defs>
                      <linearGradient id="gradientYesterdayInc" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#6442d6" />
                        <stop offset="100%" stopColor="#8B5CF6" />
                      </linearGradient>
                      <linearGradient id="gradientTodayInc" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#0EA5E9" />
                        <stop offset="100%" stopColor="#38BDF8" />
                      </linearGradient>
                    </defs>
                    <circle cx="50" cy="50" fill="none" r="40" stroke="#f1edef" strokeWidth="10"></circle>
                    <motion.circle 
                      cx="50" cy="50" fill="none" r="40" stroke="url(#gradientYesterdayInc)" 
                      strokeDasharray="251.2" 
                      initial={{ strokeDashoffset: 251.2 }}
                      animate={{ strokeDashoffset: 251.2 - (251.2 * 200 / 251.2) }}
                      transition={{ duration: 1.5, ease: "easeOut" }}
                      strokeLinecap="round" strokeWidth="10"
                    ></motion.circle>
                    <circle cx="50" cy="50" fill="none" r="28" stroke="#f1edef" strokeWidth="8"></circle>
                    <motion.circle 
                      cx="50" cy="50" fill="none" r="28" stroke="url(#gradientTodayInc)" 
                      strokeDasharray="175.9" 
                      initial={{ strokeDashoffset: 175.9 }}
                      animate={{ strokeDashoffset: 175.9 - (175.9 * 120 / 175.9) }}
                      transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
                      strokeLinecap="round" strokeWidth="8"
                    ></motion.circle>
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="material-symbols-outlined text-primary text-[20px]">savings</span>
                  </div>
                </div>
                <div className="ml-6 flex-1">
                  <h3 className="text-lg font-bold text-on-surface leading-tight mb-3">Income Comparison</h3>
                  <div className="flex gap-6">
                    <div>
                      <div className="text-[10px] font-bold text-outline uppercase tracking-wider font-mono">Yesterday</div>
                      <div className="text-sm font-bold font-mono mt-0.5" style={{ color: '#6442d6' }}>RM 1,850</div>
                    </div>
                    <div>
                      <div className="text-[10px] font-bold text-outline uppercase tracking-wider font-mono flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: '#0EA5E9' }}></span> Today
                      </div>
                      <div className="text-sm font-bold font-mono mt-0.5" style={{ color: '#0EA5E9' }}>RM 1,600</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Summary Widget */}
          <div className="bg-primary rounded-3xl p-8 flex flex-col justify-between text-on-primary shadow-lg relative overflow-hidden">
            <div className="absolute -top-10 -right-10 w-48 h-48 bg-white/10 rounded-full blur-3xl"></div>
            <div className="relative z-10 space-y-6">
              <div className="flex justify-between items-center pb-4 border-b border-white/20">
              <span className="text-sm font-medium text-white">Total Monthly Income</span>
                <span className="text-xl font-bold font-mono">RM 25,000.00</span>
              </div>
              <div className="flex justify-between items-center pb-4 border-b border-white/20">
              <span className="text-sm font-medium text-white">Total Monthly Expenses</span>
              <span className="text-xl font-bold font-mono text-white">RM 4,645.50</span>
              </div>
              <div className="flex justify-between items-center pb-4 border-b border-white/20">
                <span className="text-sm font-medium text-white">Total Transactions</span>
                <span className="text-xl font-bold font-mono text-white">{ledgerTransactions.length}</span>
              </div>
            </div>
            <div className="relative z-10 pt-8 mt-auto flex flex-col">
              <span className="text-[11px] font-bold uppercase tracking-widest opacity-80 mb-1">Net Profit</span>
              <div className="flex items-baseline gap-2">
                <span className="text-[32px] font-bold font-mono">RM 20,354.50</span>
                <span className="text-[12px] font-bold bg-white/20 px-2 py-0.5 rounded-full">+14.2%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Expense Modal Overlay */}
      <AnimatePresence>
        {showExpenseModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowExpenseModal(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-surface rounded-[32px] border border-outline-variant/40 shadow-xl overflow-hidden max-w-md w-full z-10 p-8 space-y-6"
            >
              <div className="border-b border-outline-variant/30 pb-4">
                <h3 className="font-title-lg text-lg font-bold text-on-surface">Record Expense</h3>
                <p className="font-body-md text-xs text-on-surface-variant mt-1 font-medium">Log a new business expenditure to the ledger.</p>
              </div>

              <form onSubmit={handleAddExpense} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="font-label-lg text-xs font-bold text-on-surface">Staff Name</label>
                  <select
                    required
                    value={expenseStaff}
                    onChange={(e) => setExpenseStaff(e.target.value)}
                    className="w-full bg-surface-container-low border border-outline-variant/45 rounded-2xl px-4 py-3 text-on-surface font-body-md text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all cursor-pointer"
                  >
                    <option value="" disabled>Select Staff Member</option>
                    {staffRegistry.map((staff: any) => (
                      <option key={staff.id} value={staff.name}>{staff.name}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="font-label-lg text-xs font-bold text-on-surface">Name of Purchase</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Weekly Raw Ingredients"
                    value={expenseName}
                    onChange={(e) => setExpenseName(e.target.value)}
                    className="w-full bg-surface-container-low border border-outline-variant/45 rounded-2xl px-4 py-3 text-on-surface font-body-md text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-label-lg text-xs font-bold text-on-surface">Description (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. Purchased from local market"
                    value={expenseDescription}
                    onChange={(e) => setExpenseDescription(e.target.value)}
                    className="w-full bg-surface-container-low border border-outline-variant/45 rounded-2xl px-4 py-3 text-on-surface font-body-md text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="font-label-lg text-xs font-bold text-on-surface">Amount (RM)</label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      placeholder="0.00"
                      value={expenseAmount}
                      onChange={(e) => setExpenseAmount(e.target.value)}
                      className="w-full bg-surface-container-low border border-outline-variant/45 rounded-2xl px-4 py-3 text-on-surface font-body-md text-sm font-mono focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="font-label-lg text-xs font-bold text-on-surface">Date</label>
                    <input
                      type="date"
                      required
                      value={expenseDate}
                      onChange={(e) => setExpenseDate(e.target.value)}
                      className="w-full bg-surface-container-low border border-outline-variant/45 rounded-2xl px-4 py-3 text-on-surface font-body-md text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="font-label-lg text-xs font-bold text-on-surface">Category</label>
                  <select
                    value={expenseCategory}
                    onChange={(e) => setExpenseCategory(e.target.value)}
                    className="w-full bg-surface-container-low border border-outline-variant/45 rounded-2xl px-4 py-3 text-on-surface font-body-md text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all cursor-pointer"
                  >
                    <option value="Ingredients">Ingredients</option>
                    <option value="Utilities">Utilities</option>
                    <option value="Salaries">Salaries</option>
                    <option value="Rent">Rent</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Others">Others</option>
                  </select>
                </div>

                <div className="flex items-center justify-end gap-3 pt-6 border-t border-outline-variant/20 mt-6">
                  <button
                    type="button"
                    onClick={() => {
                      setShowExpenseModal(false);
                      setExpenseName('');
                      setExpenseDescription('');
                      setExpenseStaff('');
                    }}
                    className="px-5 py-2.5 rounded-full border border-outline-variant/60 text-on-surface font-label-lg text-xs font-bold hover:bg-surface-container-low transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-full bg-primary text-on-primary font-label-lg text-xs font-bold shadow-sm hover:bg-primary-container hover:text-on-primary-container transition-colors cursor-pointer active:scale-95 duration-100"
                  >
                    Add Expense
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </Layout>
  );
}
