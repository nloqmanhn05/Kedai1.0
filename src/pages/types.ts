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
  paymentMethod?: string;
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

export interface StaffMember {
  id: string | number;
  name: string;
  email: string;
  role: string;
  joinDate: string;
  phone?: string;
  clockInPin?: string;
  pin?: string;
  timestamp?: number;
  attendanceDays?: number;
  hoursWorked?: number;
  totalPay?: number;
  shiftStatus?: 'In Progress' | 'Ended';
  clockInTime?: string;
  clockOutTime?: string;
  workHours?: number;
  clockInTimestamp?: number;
  lastAttendanceDate?: string;
  status?: string;
}

