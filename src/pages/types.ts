export interface StockItem {
  id: string | number;
  name: string;
  emoji: string;
  category: 'Packaging' | 'Ingredients' | 'Other' | string;
  lastRecordedDate: string;
  totalInitial: number;
  used: number;
  lowStockThreshold: number;
  unit: string;
}

export interface StockViewProps {
  stockList: StockItem[];
  setStockList: (list: StockItem[] | ((prev: StockItem[]) => StockItem[])) => void;
  lastUpdatedTime: string;
  setLastUpdatedTime: (time: string) => void;
  lastUpdatedBy: string;
  setLastUpdatedBy: (by: string) => void;
  
  // Firestore integration operations
  addItem?: (item: Omit<StockItem, 'id'>, by?: string) => Promise<void>;
  restockItem?: (itemId: string | number, amount: number, by?: string) => Promise<void>;
  updateItemDetails?: (itemId: string | number, updatedFields: Partial<StockItem>, by?: string) => Promise<void>;
  deleteItem?: (itemId: string | number, by?: string) => Promise<void>;
}

export interface SalesTransaction {
  id: string | number;
  date: string;
  time: string;
  orderId: string;
  staffName: string;
  staffInitials: string;
  staffColor: string;
  amount: number;
  timestamp?: number; // Added to help with sorting
}

export interface Expense {
  id: string | number;
  description: string;
  subtext: string;
  category: string;
  amount: number;
  date: string;
  staff: string[];
  type: 'expense' | 'income';
  timestamp?: number;
}

