import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { StockItem, StockViewProps } from '../types';

export function AdminStockView({ 
  stockList, 
  lastUpdatedTime, 
  lastUpdatedBy
}: Omit<StockViewProps, 'setStockList' | 'setLastUpdatedTime' | 'setLastUpdatedBy'>) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'low' | 'normal'>('all');

  const filteredStock = useMemo(() => {
    return stockList.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || item.category.toLowerCase().includes(searchQuery.toLowerCase());
      const left = item.totalInitial - item.used;
      const isLow = left <= item.lowStockThreshold;
      if (!matchesSearch) return false;
      if (activeTab === 'low') return isLow;
      if (activeTab === 'normal') return !isLow;
      return true;
    });
  }, [stockList, searchQuery, activeTab]);

  const totalItems = stockList.length;
  const lowStockCount = useMemo(() => stockList.filter(item => (item.totalInitial - item.used) <= item.lowStockThreshold).length, [stockList]);

  return (
    <div className="w-full max-w-[1600px] mx-auto flex flex-col min-h-0 gap-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-surface-container-lowest rounded-[24px] p-6 border border-outline-variant/30 shadow-sm flex flex-col gap-2 relative overflow-hidden">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-primary/10 rounded-xl text-primary"><span className="material-symbols-outlined flex items-center justify-center text-[22px]">inventory</span></div>
            <p className="text-on-surface-variant font-label-lg font-bold text-xs uppercase tracking-wider">Total Items</p>
          </div>
          <p className="text-on-surface text-4xl font-extrabold font-mono mt-2">{totalItems}</p>
          <p className="text-xs text-outline font-medium">Distinct categories cataloged</p>
        </div>
        <div className="rounded-[24px] p-6 border shadow-sm flex flex-col gap-2 relative overflow-hidden bg-error-container/10 border-error/20">
          <div className="absolute -top-3 -right-3 w-16 h-16 bg-error/5 rounded-bl-[100%] flex items-center justify-center"><span className="material-symbols-outlined text-error/30 text-3xl select-none">warning</span></div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-error-container rounded-xl text-error"><span className="material-symbols-outlined flex items-center justify-center text-[22px]">warning</span></div>
            <p className="text-error font-label-lg font-bold text-xs uppercase tracking-wider">Low Stock</p>
          </div>
          <p className="text-error text-4xl font-extrabold font-mono mt-2">{lowStockCount}</p>
          <p className="text-xs text-error/80 font-medium">Require immediate restocking</p>
        </div>
        <div className="bg-surface-container-lowest rounded-[24px] p-6 border border-outline-variant/30 shadow-sm flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-primary/10 rounded-xl text-primary"><span className="material-symbols-outlined flex items-center justify-center text-[22px]">schedule</span></div>
            <p className="text-on-surface-variant font-label-lg font-bold text-xs uppercase tracking-wider">Last Updated</p>
          </div>
          <p className="text-on-surface text-lg font-extrabold font-mono mt-2 truncate">{lastUpdatedTime}</p>
          <p className="text-[11px] text-on-surface-variant font-semibold">by {lastUpdatedBy}</p>
        </div>
      </div>

      {/* Tabs and Search Bar */}
      <div className="bg-surface-container-lowest rounded-2xl p-4 border border-outline-variant/30 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex gap-2 flex-wrap w-full md:w-auto">
          <button onClick={() => setActiveTab('all')} className={`px-4 py-2 rounded-full font-label-lg text-xs font-bold transition-all active:scale-95 duration-100 ${activeTab === 'all' ? 'bg-primary text-white shadow-sm' : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container border border-outline-variant/20'}`}>All Items</button>
          <button onClick={() => setActiveTab('low')} className={`px-4 py-2 rounded-full font-label-lg text-xs font-bold transition-all active:scale-95 duration-100 flex items-center gap-1.5 ${activeTab === 'low' ? 'bg-error text-white shadow-sm' : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container border border-outline-variant/20'}`}>Low Stock <span className={`material-symbols-outlined text-[15px] ${activeTab === 'low' ? 'text-white' : 'text-amber-500'}`}>warning</span></button>
          <button onClick={() => setActiveTab('normal')} className={`px-4 py-2 rounded-full font-label-lg text-xs font-bold transition-all active:scale-95 duration-100 ${activeTab === 'normal' ? 'bg-emerald-600 text-white shadow-sm' : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container border border-outline-variant/20'}`}>Normal</button>
        </div>
        <div className="w-full md:w-auto flex items-center gap-3">
          <div className="relative flex-1 md:w-64">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[18px]">search</span>
            <input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-10 pr-4 py-2 bg-surface-container-low border border-outline-variant/50 rounded-full text-xs font-medium text-on-surface placeholder:text-outline/80 focus:ring-2 focus:ring-primary focus:bg-surface transition-all outline-none" placeholder="Search items or categories..." type="text"/>
          </div>
        </div>
      </div>

      {/* Stock Table */}
      <div className="bg-surface-container-lowest rounded-[24px] border border-outline-variant/30 shadow-sm overflow-hidden mt-2">
        <div className="overflow-x-auto w-full">
          <div className="w-full text-xs min-w-[800px]">
            {/* Grid Header */}
            <div className="grid grid-cols-4 bg-surface-container-low border-b border-outline-variant/30 text-outline font-label-sm text-[11px] font-bold uppercase tracking-wider py-4 px-6">
              <div>Item Name</div>
              <div>Last Recorded Date</div>
              <div className="text-center">Items Used</div>
              <div className="text-right">Items Left</div>
            </div>

            {/* Grid Body */}
            <div className="divide-y divide-outline-variant/10 relative">
              <AnimatePresence mode="popLayout">
                {filteredStock.length === 0 ? (
                  <motion.div 
                    key="empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="p-8 text-center text-outline font-medium text-xs"
                  >
                    No stock items match your filter.
                  </motion.div>
                ) : (
                  filteredStock.map((item) => {
                    const left = item.totalInitial - item.used;
                    const isLow = left <= item.lowStockThreshold;
                    return (
                      <motion.div 
                        layout 
                        initial={{ opacity: 0, y: 4 }} 
                        animate={{ opacity: 1, y: 0 }} 
                        exit={{ opacity: 0, scale: 0.98 }} 
                        key={item.id} 
                        className={`grid grid-cols-4 items-center py-4 px-6 transition-all duration-150 ${isLow ? 'bg-error-container/5 border-l-4 border-l-error/70' : 'hover:bg-surface-container-low/40'}`}
                      >
                        <div className={isLow ? 'pl-1' : ''}>
                          <p className="font-bold text-on-surface text-xs leading-none">{item.name}</p>
                          <span className="inline-block mt-1.5 px-2 py-0.5 bg-surface-container-high rounded text-[9px] font-bold text-on-surface-variant tracking-wider uppercase">{item.category}</span>
                        </div>
                        <div>
                          <p className="font-mono text-xs text-on-surface mb-0.5">{item.lastRecordedDate}</p>
                          <span className="px-1.5 py-0.5 bg-surface-container rounded text-[10px] font-mono text-outline font-semibold">{item.totalInitial} {item.unit}</span>
                        </div>
                        <div className="text-center">
                          <div className="flex flex-col items-center">
                            <span className="font-mono font-extrabold text-sm text-on-surface leading-tight">{item.used}</span>
                            <span className="text-[9px] text-outline uppercase font-semibold tracking-wider font-label-sm">used</span>
                          </div>
                        </div>
                        <div className="text-right">
                          {isLow ? (
                            <div className="flex items-center justify-end gap-1.5 text-error">
                              <span className="material-symbols-outlined text-[18px]">error</span>
                              <span className="font-mono font-extrabold text-sm">{left}</span>
                              <span className="px-1 py-0.5 bg-error text-white text-[8px] font-bold rounded">LOW</span>
                            </div>
                          ) : (
                            <div className="flex items-center justify-end gap-1.5 text-emerald-600">
                              <span className="material-symbols-outlined text-[18px]">check_circle</span>
                              <span className="font-mono font-extrabold text-sm">{left}</span>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    );
                  })
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
