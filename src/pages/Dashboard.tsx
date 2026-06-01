import React, { useState, useEffect, useMemo } from 'react';
import { Layout } from '../components/Layout';
import { AreaChart, Area, XAxis, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';
import { Card } from '../components/Card';
import { Grid } from '../components/Grid';

const chartData = [
  { name: '24/3', Value: 15, transaction: 10 },
  { name: '25/3', Value: 30, transaction: 15 },
  { name: '26/3', Value: 20, transaction: 8 },
  { name: '27/3', Value: 35, transaction: 20 },
  { name: '28/3', Value: 65, transaction: 30 },
  { name: '29/3', Value: 75, transaction: 45 },
  { name: '30/3', Value: 70, transaction: 25 },
];

export default function Dashboard() {
  const [liveTransactions, setLiveTransactions] = useState<any[]>([]);

  const loadLogs = () => {
    const saved = localStorage.getItem('wise_sales_log');
    if (saved) {
      try {
        setLiveTransactions(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse sales logs from localStorage", e);
      }
    }
  };

  // Load and listen for live sales updates
  useEffect(() => {
    loadLogs();
    window.addEventListener('salesLogUpdated', loadLogs);
    return () => window.removeEventListener('salesLogUpdated', loadLogs);
  }, []);

  const todayStr = useMemo(() => new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }), []);
  
  const earnedToday = useMemo(() => {
    return liveTransactions
      .filter(tx => tx.date === todayStr)
      .reduce((sum, tx) => sum + tx.amount, 0);
  }, [liveTransactions, todayStr]);

  // We combine a baseline (42,500) with live sales for the demo
  const totalCashDisplay = 42500 + earnedToday;
  const totalOrders = 142 + liveTransactions.length;

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
                  <span className="text-2xl mr-1 font-sans">RM</span>{totalCashDisplay.toLocaleString()}
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
                  {/* Cash Ring (Outer) - 75% */}
                  <motion.circle
                    cx="50" cy="50" fill="transparent" r="40" stroke="url(#gradientCash)"
                    strokeDasharray="188.5"
                    initial={{ strokeDashoffset: 188.5 }}
                    animate={{ strokeDashoffset: 47.1 }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    strokeLinecap="round" strokeWidth="8"
                  ></motion.circle>
                  {/* E-wallet Ring (Inner) - 25% */}
                  <motion.circle
                    cx="50" cy="50" fill="transparent" r="30" stroke="url(#gradientEWallet)"
                    strokeDasharray="188.5"
                    initial={{ strokeDashoffset: 188.5 }}
                    animate={{ strokeDashoffset: 141.4 }}
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
                  <p className="text-sm font-bold text-on-surface font-mono">RM 31,875</p>
                  <div className="flex items-center justify-center gap-1.5 mt-1">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: '#0ea5e9' }}></span>
                    <span className="text-xs text-on-surface-variant">Cash (75%)</span>
                  </div>
                </div>
                <div className="text-center">
                  <p className="text-sm font-bold text-on-surface font-mono">RM 10,625</p>
                  <div className="flex items-center justify-center gap-1.5 mt-1">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: '#6366f1' }}></span>
                    <span className="text-xs text-on-surface-variant">E-wallet (25%)</span>
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
                    <h3 className="text-base md:text-base lg:text-lg font-semibold text-on-surface">March 2026</h3>
                    <div className="mt-6 mb-6">
                      <span className="text-xs font-bold text-outline tracking-wider uppercase block mb-1">
                        Total Transactions
                      </span>
                      <span className="text-2xl md:text-2xl lg:text-3xl font-bold text-primary font-mono">{totalOrders}</span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 mt-auto pt-4 md:pt-0">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-[#0ea5e9] shrink-0"></span>
                      <span className="text-xs text-on-surface-variant font-medium">Value (RM x 100)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-[#6366f1] shrink-0"></span>
                      <span className="text-xs text-on-surface-variant font-medium">Transactions</span>
                    </div>
                  </div>
                </div>
                <div className="w-full md:w-[70%] flex flex-col justify-between">
                  <div className="flex justify-end mb-4">
                    <a className="text-sm font-medium text-primary hover:text-primary-container transition-colors" href="#">
                      View Full Report
                    </a>
                  </div>
                  <div className="h-44 w-full relative">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={chartData} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
                        <defs>
                          <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#0ea5e9" stopOpacity={0.25} />
                            <stop offset="100%" stopColor="#0ea5e9" stopOpacity={0} />
                          </linearGradient>
                          <linearGradient id="colorTransaction" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#6366f1" stopOpacity={0.15} />
                            <stop offset="100%" stopColor="#6366f1" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <XAxis
                          dataKey="name"
                          axisLine={false}
                          tickLine={false}
                          tick={{ fill: '#79747E', fontSize: 10, family: 'JetBrains Mono' }}
                          dy={10}
                        />
                        <RechartsTooltip
                          contentStyle={{
                            borderRadius: '12px',
                            border: 'none',
                            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                            fontFamily: 'JetBrains Mono'
                          }}
                        />
                        <Area type="monotone" dataKey="transaction" stroke="#6366f1" strokeWidth={2.5} fillOpacity={1} fill="url(#colorTransaction)" />
                        <Area type="monotone" dataKey="Value" stroke="#0ea5e9" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
                      </AreaChart>
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
                <div className="flex justify-between items-center py-2 border-b border-outline-variant/30 last:border-0">
                  <span className="text-sm text-on-surface-variant">Starting Cash</span>
                  <span className="text-sm font-bold text-on-surface font-mono">RM 5,420.00</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-outline-variant/30 last:border-0">
                  <span className="text-sm text-on-surface-variant">Expected Cash</span>
                  <span className="text-sm font-bold text-on-surface font-mono">RM 8,200.00</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-outline-variant/30 last:border-0">
                  <span className="text-sm text-on-surface-variant">Gross Sales</span>
                  <span className="text-sm font-bold text-primary font-mono">RM {(12450 + earnedToday).toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-outline-variant/30 last:border-0">
                  <span className="text-sm text-on-surface-variant">Refund</span>
                  <span className="text-sm font-bold text-error font-mono">RM 150.00</span>
                </div>
                <div className="flex justify-between items-center pt-2">
                  <span className="text-sm text-on-surface-variant">Discount</span>
                  <span className="text-sm font-bold text-on-surface font-mono">RM 200.00</span>
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
