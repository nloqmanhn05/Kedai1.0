import React from 'react';
import { Layout } from '../../components/Layout';
import { AdminStockView } from './AdminStockView';
import { StaffStockView } from './StaffStockView';
import { useStockFirestore } from '../../hooks/useStockFirestore';
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

  // Use the Firestore Hook
  const {
    stockList,
    loading,
    error,
    lastUpdatedTime,
    lastUpdatedBy,
    addItem,
    restockItem,
    updateItemDetails,
    deleteItem,
    seedFallbackData
  } = useStockFirestore();

  // If data is loading from the cloud, show a loading status
  if (loading) {
    return (
      <Layout title={userRole === 'admin' ? "Stock Inventory" : "Stock Update"}>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center space-y-2">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="text-xs text-outline font-semibold">Loading stock from Cloud Firestore...</p>
          </div>
        </div>
      </Layout>
    );
  }

  // Display error if one occurred
  if (error) {
    return (
      <Layout title="Stock Inventory">
        <div className="p-6 bg-error-container/10 border border-error/20 rounded-2xl text-center">
          <p className="text-error font-bold text-sm">Error connecting to Firestore</p>
          <p className="text-xs text-outline mt-1">{error.message}</p>
        </div>
      </Layout>
    );
  }

  // Seed Button if database is completely empty
  if (stockList.length === 0) {
    return (
      <Layout title="Stock Inventory">
        <div className="flex flex-col items-center justify-center min-h-[400px] text-center gap-4">
          <span className="material-symbols-outlined text-4xl text-outline">database</span>
          <div>
            <p className="font-bold text-on-surface text-sm">No Stock Cataloged</p>
            <p className="text-xs text-outline mt-1">Seed your database with default items to begin.</p>
          </div>
          <button
            onClick={() => seedFallbackData(initialStockFallback)}
            className="bg-primary text-white rounded-full px-6 py-2.5 font-bold text-xs shadow-sm hover:bg-primary-container transition-all active:scale-95 cursor-pointer"
          >
            Seed Initial Fallback Stock
          </button>
        </div>
      </Layout>
    );
  }

  // Adapter functions to map state operations to Firestore async updates
  const handleSetStockList = async (update: StockItem[] | ((prev: StockItem[]) => StockItem[])) => {
    // If update is callback, evaluate it against current local state
    const nextList = typeof update === 'function' ? update(stockList) : update;
    // In our live setup, we update individual Firestore documents directly from components (see below).
  };

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
          setStockList={handleSetStockList}
          lastUpdatedTime={lastUpdatedTime}
          setLastUpdatedTime={async (time) => { }} // Firestore handles this metadata automatically!
          lastUpdatedBy={lastUpdatedBy}
          setLastUpdatedBy={async (by) => { }}
          addItem={addItem}
          restockItem={restockItem}
          updateItemDetails={updateItemDetails}
          deleteItem={deleteItem}
        />
      )}
    </Layout>
  );
}
