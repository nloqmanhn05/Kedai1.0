import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { ComposedChart, Area, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';
import { Card } from '../components/Card';
import { Grid } from '../components/Grid';
import { useSalesSummaryFirestore } from '../hooks/useSalesSummaryFirestore';
import { useTransactionsFirestore } from '../hooks/useTransactionsFirestore';
import { useStaffFirestore } from '../hooks/useStaffFirestore';
import { useAuth } from '../contexts/AuthContext';



export default function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { staff: allStaff } = useStaffFirestore();
  const { transactions: liveTransactions, loading: transactionsLoading } = useTransactionsFirestore();
  const { summary, loading: summaryLoading, updateSummary } = useSalesSummaryFirestore();

  const userRole = localStorage.getItem('userRole') || 'admin';

  // Find the current staff member's name by matching login email
  const currentStaffName = useMemo(() => {
    if (userRole !== 'staff' || !user?.email) return null;
    const match = allStaff.find(
      s => (s as any).email?.toLowerCase() === user.email!.toLowerCase()
    );
    return match?.name || null;
  }, [allStaff, user, userRole]);

  const handleViewFullReport = () => {
    if (userRole === 'staff') {
      if (currentStaffName) {
        navigate(`/transactions?staff=${encodeURIComponent(currentStaffName)}`);
      } else {
        navigate('/transactions');
      }
    } else {
      navigate('/ledger');
    }
  };


  const todayStr = useMemo(() => new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }), []);
  
  const earnedToday = useMemo(() => {
    return liveTransactions
      .filter(tx => tx.date === todayStr)
      .reduce((sum, tx) => sum + tx.amount, 0);
  }, [liveTransactions, todayStr]);

  // Build last 7 days of chart data from real Firestore transactions
  const chartData = useMemo(() => {
    const days: { name: string; fullDate: string }[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const label = `${d.getDate()}/${d.getMonth() + 1}`;
      const fullDate = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
      days.push({ name: label, fullDate });
    }
    return days.map(({ name, fullDate }) => {
      const dayTxs = liveTransactions.filter(tx => tx.date === fullDate);
      const Value = parseFloat(dayTxs.reduce((sum, tx) => sum + tx.amount, 0).toFixed(2));
      const transaction = dayTxs.length;
      return { name, Value, transaction };
    });
  }, [liveTransactions]);

  const totalCashDisplay = summary.cashCollected + summary.eWalletCollected + earnedToday;
  const totalOrders = liveTransactions.length;

  const totalCollected = summary.cashCollected + summary.eWalletCollected || 1;
  const cashPercentage = (summary.cashCollected / totalCollected) * 100;
  const eWalletPercentage = (summary.eWalletCollected / totalCollected) * 100;

  return (
    <Layout title="Financial Overview">
      <div className="w-full max-w-[1600px] mx-auto">
        
        <Grid cols={12} gap="gap-4 md:gap-4 lg:gap-6">
          
          {/* Left Column (5/12 width on desktop, full width on tablet) */}
          <div className="space-y-4 md:space-y-4 lg:space-y-6 col-span-12 lg:col-span-5 flex flex-col">
            
            {/* Total Cash Card */}
            <Card className="bg-surface-container-lowest" padding="p-6">
              <div className="flex justify-between items-start mb-2">
                <span className="text-xs font-bold text-on-surface-variant tracking-wider uppercase">
                  Total Cash In Hand
                </span>
              </div>
              <div className="flex items-center justify-between mb-6 gap-4">
                <h2 className="text-3xl md:text-3xl lg:text-4xl font-bold text-on-surface tracking-tight font-mono">
                  <span className="text-2xl mr-1 font-sans">RM</span>{totalCashDisplay.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </h2>
                <div className="bg-primary-fixed text-on-primary-fixed py-1 rounded-full font-semibold flex items-center gap-1 font-mono px-2.5 text-xs">
                  <span className="material-symbols-outlined text-[14px]">arrow_upward</span>
                  12.4%
                </div>
              </div>
              
              <div className="pt-6 border-t border-outline-variant/30">
                <h3 className="text-xs font-bold text-outline tracking-wider uppercase mb-4">Today's Activity</h3>
                <div className="flex justify-between gap-4">
                  <div>
                    <p className="text-xs text-on-surface-variant mb-1">Earned Today</p>
                    <p className="text-base md:text-base lg:text-lg font-bold text-primary font-mono">+ RM {earnedToday.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-on-surface-variant mb-1">Spent Today</p>
                    <p className="text-base md:text-base lg:text-lg font-bold text-on-surface font-mono">- RM 2,140</p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Cash vs E-wallet Donut Card */}
            <Card className="bg-surface-container-low flex flex-col items-center" padding="p-6">
              <h3 className="text-base md:text-base lg:text-lg font-semibold text-on-surface mb-6 w-full text-left">
                Cash vs E-wallet
              </h3>
              
              <div className="relative w-44 h-44 mb-6">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <defs>
                    <linearGradient id="gradientCash" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#0ea5e9" />
                      <stop offset="100%" stopColor="#38bdf8" />
                    </linearGradient>
                    <linearGradient id="gradientEWallet" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#6366f1" />
                      <stop offset="100%" stopColor="#818cf8" />
                    </linearGradient>
                  </defs>
                  {/* Background Tracks */}
                  <circle cx="50" cy="50" fill="transparent" r="40" stroke="#f1edef" strokeWidth="8"></circle>
                  <circle cx="50" cy="50" fill="transparent" r="30" stroke="#f1edef" strokeWidth="8"></circle>
                  {/* Cash Ring (Outer) */}
                  <motion.circle
                    cx="50" cy="50" fill="transparent" r="40" stroke="url(#gradientCash)"
                    strokeDasharray="251.3"
                    initial={{ strokeDashoffset: 251.3 }}
                    animate={{ strokeDashoffset: 251.3 - (251.3 * cashPercentage / 100) }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    strokeLinecap="round" strokeWidth="8"
                  ></motion.circle>
                  {/* E-wallet Ring (Inner) */}
                  <motion.circle
                    cx="50" cy="50" fill="transparent" r="30" stroke="url(#gradientEWallet)"
                    strokeDasharray="188.5"
                    initial={{ strokeDashoffset: 188.5 }}
                    animate={{ strokeDashoffset: 188.5 - (188.5 * eWalletPercentage / 100) }}
                    transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
                    strokeLinecap="round" strokeWidth="8"
                  ></motion.circle>
                </svg>
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="bg-surface-container-lowest rounded-full p-2.5 shadow-sm flex items-center justify-center">
                    <span className="material-symbols-outlined text-primary text-2xl">account_balance_wallet</span>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-6 w-full justify-center">
                <div className="text-center">
                  <p className="text-sm font-bold text-on-surface font-mono">RM {summary.cashCollected.toLocaleString()}</p>
                  <div className="flex items-center justify-center gap-1.5 mt-1">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: '#0ea5e9' }}></span>
                    <span className="text-xs text-on-surface-variant">Cash ({cashPercentage.toFixed(0)}%)</span>
                  </div>
                </div>
                <div className="text-center">
                  <p className="text-sm font-bold text-on-surface font-mono">RM {summary.eWalletCollected.toLocaleString()}</p>
                  <div className="flex items-center justify-center gap-1.5 mt-1">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: '#6366f1' }}></span>
                    <span className="text-xs text-on-surface-variant">E-wallet ({eWalletPercentage.toFixed(0)}%)</span>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Right Column (7/12 width on desktop, full width on tablet) */}
          <div className="space-y-4 md:space-y-4 lg:space-y-6 col-span-12 lg:col-span-7 flex flex-col">
            
            {/* Monthly Chart Card */}
            <Card className="bg-surface-container-lowest" padding="p-6">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="w-full md:w-[30%] flex flex-col justify-between">
                  <div>
                    <h3 className="text-base md:text-base lg:text-lg font-semibold text-on-surface">{new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</h3>
                    <div className="mt-6 mb-6">
                      <span className="text-xs font-bold text-outline tracking-wider uppercase block mb-1">
                        Total Transactions
                      </span>
                      <span className="text-2xl md:text-2xl lg:text-3xl font-bold text-primary font-mono">{totalOrders}</span>
                      <span className="text-[10px] text-on-surface-variant font-medium mt-1">Last 7 days</span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 mt-auto pt-4 md:pt-0">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-[#0ea5e9] shrink-0"></span>
                      <span className="text-xs text-on-surface-variant font-medium">Sales (RM)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-[#6366f1] shrink-0"></span>
                      <span className="text-xs text-on-surface-variant font-medium">Transactions</span>
                    </div>
                  </div>
                </div>
                <div className="w-full md:w-[70%] flex flex-col justify-between">
                  <div className="flex justify-end mb-4">
                    <button
                      onClick={handleViewFullReport}
                      className="text-sm font-medium text-primary hover:text-primary-container transition-colors"
                    >
                      View Full Report
                    </button>
                  </div>
                  <div className="h-56 w-full relative">
                    <ResponsiveContainer width="100%" height="100%">
                      <ComposedChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                        <defs>
                          <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#0ea5e9" stopOpacity={0.3} />
                            <stop offset="100%" stopColor="#0ea5e9" stopOpacity={0.02} />
                          </linearGradient>
                        </defs>
                        <XAxis
                          dataKey="name"
                          axisLine={false}
                          tickLine={false}
                          tick={{ fill: '#79747E', fontSize: 10, fontFamily: 'JetBrains Mono' }}
                          dy={10}
                        />
                        <YAxis
                          yAxisId="left"
                          axisLine={false}
                          tickLine={false}
                          tick={{ fill: '#0ea5e9', fontSize: 9, fontFamily: 'JetBrains Mono' }}
                          tickFormatter={(v: number) => `RM${v}`}
                          domain={[0, 'auto']}
                          width={50}
                        />
                        <YAxis
                          yAxisId="right"
                          orientation="right"
                          axisLine={false}
                          tickLine={false}
                          tick={{ fill: '#a855f7', fontSize: 9, fontFamily: 'JetBrains Mono' }}
                          domain={[0, 'auto']}
                          allowDecimals={false}
                          width={30}
                        />
                        <RechartsTooltip
                          contentStyle={{
                            borderRadius: '12px',
                            border: 'none',
                            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                            fontFamily: 'JetBrains Mono'
                          }}
                        />
                        <Bar yAxisId="right" dataKey="transaction" fill="#a855f7" opacity={0.35} radius={[4, 4, 0, 0]} barSize={18} />
                        <Area yAxisId="left" type="monotone" dataKey="Value" stroke="#0ea5e9" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" dot={{ r: 3, fill: '#0ea5e9', strokeWidth: 0 }} />
                      </ComposedChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </Card>

            {/* Sales Summary Card */}
            <Card className="bg-surface-container-low" padding="p-6">
              <h3 className="text-base md:text-base lg:text-lg font-semibold text-on-surface mb-4">
                Sales Summary
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-outline-variant/30">
                  <span className="text-sm text-on-surface-variant">Starting Cash</span>
                  <div className="flex items-center font-mono font-bold text-sm text-on-surface">
                    <span className="mr-1">RM</span>
                    <input 
                      type="number" 
                      step="0.01" 
                      key={`startingCash-${summary.startingCash}`}
                      defaultValue={summary.startingCash}
                      onBlur={(e) => updateSummary({ startingCash: parseFloat(e.target.value) || 0 })}
                      className="bg-transparent text-right font-mono text-sm font-bold text-on-surface focus:outline-none border-b border-dashed border-outline-variant/45 focus:border-primary w-24"
                    />
                  </div>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-outline-variant/30">
                  <span className="text-sm text-on-surface-variant">Expected Cash</span>
                  <div className="flex items-center font-mono font-bold text-sm text-on-surface">
                    <span className="mr-1">RM</span>
                    <input 
                      type="number" 
                      step="0.01" 
                      key={`expectedCash-${summary.expectedCash}`}
                      defaultValue={summary.expectedCash}
                      onBlur={(e) => updateSummary({ expectedCash: parseFloat(e.target.value) || 0 })}
                      className="bg-transparent text-right font-mono text-sm font-bold text-on-surface focus:outline-none border-b border-dashed border-outline-variant/45 focus:border-primary w-24"
                    />
                  </div>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-outline-variant/30">
                  <span className="text-sm text-on-surface-variant">Gross Sales (Base)</span>
                  <div className="flex items-center font-mono font-bold text-sm text-on-surface">
                    <span className="mr-1">RM</span>
                    <input 
                      type="number" 
                      step="0.01" 
                      key={`grossSalesBaseline-${summary.grossSalesBaseline}`}
                      defaultValue={summary.grossSalesBaseline}
                      onBlur={(e) => updateSummary({ grossSalesBaseline: parseFloat(e.target.value) || 0 })}
                      className="bg-transparent text-right font-mono text-sm font-bold text-on-surface focus:outline-none border-b border-dashed border-outline-variant/45 focus:border-primary w-24"
                    />
                  </div>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-outline-variant/30">
                  <span className="text-sm text-on-surface-variant">Total Gross Sales</span>
                  <span className="text-sm font-bold text-primary font-mono">RM {(summary.grossSalesBaseline + earnedToday).toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-outline-variant/30">
                  <span className="text-sm text-on-surface-variant">Refund</span>
                  <div className="flex items-center font-mono font-bold text-sm text-error">
                    <span className="mr-1">RM</span>
                    <input 
                      type="number" 
                      step="0.01" 
                      key={`refund-${summary.refund}`}
                      defaultValue={summary.refund}
                      onBlur={(e) => updateSummary({ refund: parseFloat(e.target.value) || 0 })}
                      className="bg-transparent text-right font-mono text-sm font-bold text-error focus:outline-none border-b border-dashed border-outline-variant/45 focus:border-primary w-24"
                    />
                  </div>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-outline-variant/30">
                  <span className="text-sm text-on-surface-variant">Cash Collected</span>
                  <div className="flex items-center font-mono font-bold text-sm text-on-surface">
                    <span className="mr-1">RM</span>
                    <input 
                      type="number" 
                      step="0.01" 
                      key={`cashCollected-${summary.cashCollected}`}
                      defaultValue={summary.cashCollected}
                      onBlur={(e) => updateSummary({ cashCollected: parseFloat(e.target.value) || 0 })}
                      className="bg-transparent text-right font-mono text-sm font-bold text-on-surface focus:outline-none border-b border-dashed border-outline-variant/45 focus:border-primary w-24"
                    />
                  </div>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-outline-variant/30">
                  <span className="text-sm text-on-surface-variant">E-wallet Collected</span>
                  <div className="flex items-center font-mono font-bold text-sm text-on-surface">
                    <span className="mr-1">RM</span>
                    <input 
                      type="number" 
                      step="0.01" 
                      key={`eWalletCollected-${summary.eWalletCollected}`}
                      defaultValue={summary.eWalletCollected}
                      onBlur={(e) => updateSummary({ eWalletCollected: parseFloat(e.target.value) || 0 })}
                      className="bg-transparent text-right font-mono text-sm font-bold text-on-surface focus:outline-none border-b border-dashed border-outline-variant/45 focus:border-primary w-24"
                    />
                  </div>
                </div>
                <div className="flex justify-between items-center pt-2">
                  <span className="text-sm text-on-surface-variant font-bold">Total Cash In Hand</span>
                  <span className="text-sm font-bold text-primary font-mono">RM {totalCashDisplay.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>
              </div>
            </Card>

            {/* Recent Activity Card */}
            <Card className="bg-surface-container-lowest" padding="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-base md:text-base lg:text-lg font-semibold text-on-surface">
                  Recent Activity
                </h3>
                <a className="text-sm font-medium text-primary hover:text-primary-container transition-colors flex items-center gap-1" href="/ledger">
                  View Ledger
                  <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                </a>
              </div>
              <div className="space-y-4">
                {/* Live Activity Items */}
                {liveTransactions.slice(0, 3).map((tx) => (
                  <div key={tx.id} className="flex items-center gap-4 animate-fadeIn">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-[20px] text-primary">shopping_cart</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-on-surface truncate">Order {tx.orderId}</p>
                      <p className="text-xs text-on-surface-variant truncate mt-0.5">Staff: {tx.staffName}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-sm font-bold text-primary font-mono">+ RM {tx.amount.toFixed(2)}</p>
                      <p className="text-xs text-outline mt-0.5 font-mono">{tx.time}</p>
                    </div>
                  </div>
                ))}

                {/* Static Baseline Items (shown if no live logs) */}
                {liveTransactions.length < 3 && (
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-[20px] text-on-surface-variant">receipt</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-on-surface truncate">Invoice Paid #INV-2023-081</p>
                    <p className="text-xs text-on-surface-variant truncate mt-0.5">External Client Payment</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-bold text-primary font-mono">+ RM 12,450.00</p>
                    <p className="text-xs text-outline mt-0.5 font-mono">Today, 10:24 AM</p>
                  </div>
                </div>)}
                
                {liveTransactions.length < 2 && (
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-[20px] text-on-surface-variant">cloud</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-on-surface truncate">AWS Hosting Services</p>
                    <p className="text-xs text-on-surface-variant truncate mt-0.5">Monthly Cloud Infrastructure</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-bold text-on-surface font-mono">- RM 845.50</p>
                    <p className="text-xs text-outline mt-0.5 font-mono">Yesterday, 04:12 PM</p>
                  </div>
                </div>)}
                
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-[20px] text-on-surface-variant">sync_alt</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-on-surface truncate">Internal Transfer</p>
                    <p className="text-xs text-on-surface-variant truncate mt-0.5">Operating to Reserves</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-bold text-on-surface font-mono">RM 5,000.00</p>
                    <p className="text-xs text-outline mt-0.5 font-mono">12/10, 09:00 AM</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>

        </Grid>
      </div>
    </Layout>
  );
}
