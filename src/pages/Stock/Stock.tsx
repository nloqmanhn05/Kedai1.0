import React, { useState, useEffect } from 'react';
import { Layout } from '../../components/Layout';
import { AdminStockView } from './AdminStockView';
import { StaffStockView } from './StaffStockView';
import { StockItem } from '../types';

const initialStockFallback: StockItem[] = [
  { id: 1, name: 'Paper Cup 8oz', emoji: '', category: 'Packaging', lastRecordedDate: '2026-05-20', totalInitial: 500, used: 120, lowStockThreshold: 100, unit: 'items' },
  { id: 2, name: 'Plastic Cup 16oz', emoji: '', category: 'Packaging', lastRecordedDate: '2026-05-19', totalInitial: 50, used: 45, lowStockThreshold: 10, unit: 'items' },
  { id: 3, name: 'Fresh Milk 1L', emoji: '', category: 'Ingredients', lastRecordedDate: '2026-05-20', totalInitial: 24, used: 8, lowStockThreshold: 5, unit: 'items' },
  { id: 4, name: 'Coffee Beans 1kg', emoji: '', category: 'Ingredients', lastRecordedDate: '2026-05-18', totalInitial: 10, used: 9, lowStockThreshold: 2, unit: 'bags' },
  { id: 5, name: 'Sugar Syrup 5L', emoji: '', category: 'Ingredients', lastRecordedDate: '2026-05-15', totalInitial: 5, used: 1, lowStockThreshold: 2, unit: 'bottles' },
  { id: 6, name: 'Paper Straws', emoji: '', category: 'Packaging', lastRecordedDate: '2026-05-17', totalInitial: 200, used: 195, lowStockThreshold: 50, unit: 'items' }
];

export default function Stock() {
  const userRole = localStorage.getItem('userRole') || 'admin';

  const [stockList, setStockListState] = useState<StockItem[]>(() => {
    const saved = localStorage.getItem('wise_stock_inventory');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    // Set fallback stock to localStorage so other pages can also see it
    localStorage.setItem('wise_stock_inventory', JSON.stringify(initialStockFallback));
    return initialStockFallback;
  });

  const [lastUpdatedTime, setLastUpdatedTimeState] = useState<string>(() => {
    return localStorage.getItem('wise_stock_last_updated_time') || '2026-05-23 10:00 AM';
  });

  const [lastUpdatedBy, setLastUpdatedByState] = useState<string>(() => {
    return localStorage.getItem('wise_stock_last_updated_by') || 'System';
  });

  // Keep state synced with localStorage
  const setStockList = (update: StockItem[] | ((prev: StockItem[]) => StockItem[])) => {
    setStockListState(prev => {
      const next = typeof update === 'function' ? update(prev) : update;
      localStorage.setItem('wise_stock_inventory', JSON.stringify(next));
      return next;
    });
  };

  const setLastUpdatedTime = (time: string) => {
    setLastUpdatedTimeState(time);
    localStorage.setItem('wise_stock_last_updated_time', time);
  };

  const setLastUpdatedBy = (by: string) => {
    setLastUpdatedByState(by);
    localStorage.setItem('wise_stock_last_updated_by', by);
  };

  // Listen to external stock changes (e.g. from POS order checkout)
  useEffect(() => {
    const handleStockUpdate = () => {
      const saved = localStorage.getItem('wise_stock_inventory');
      if (saved) {
        try {
          setStockListState(JSON.parse(saved));
        } catch (e) {
          console.error(e);
        }
      }
      const savedTime = localStorage.getItem('wise_stock_last_updated_time');
      if (savedTime) setLastUpdatedTimeState(savedTime);
      const savedBy = localStorage.getItem('wise_stock_last_updated_by');
      if (savedBy) setLastUpdatedByState(savedBy);
    };

    window.addEventListener('stockInventoryUpdated', handleStockUpdate);
    return () => {
      window.removeEventListener('stockInventoryUpdated', handleStockUpdate);
    };
  }, []);

  return (
    <Layout title={userRole === 'admin' ? "Stock Inventory" : "Stock Update"}>
      {userRole === 'admin' ? (
        <AdminStockView
          stockList={stockList}
          lastUpdatedTime={lastUpdatedTime}
          lastUpdatedBy={lastUpdatedBy}
        />
      ) : (
        <StaffStockView
          stockList={stockList}
          setStockList={setStockList}
          lastUpdatedTime={lastUpdatedTime}
          setLastUpdatedTime={setLastUpdatedTime}
          lastUpdatedBy={lastUpdatedBy}
          setLastUpdatedBy={setLastUpdatedBy}
        />
      )}
    </Layout>
  );
}
