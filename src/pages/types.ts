export interface StockItem {
  id: number;
  name: string;
  emoji: string;
  category: 'Packaging' | 'Ingredients' | 'Other';
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
}
