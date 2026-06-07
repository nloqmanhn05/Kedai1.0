import React, { useState } from 'react';
import { Layout } from '../components/Layout';
import { motion, AnimatePresence } from 'framer-motion';
import { useTransactionsFirestore } from '../hooks/useTransactionsFirestore';

interface MenuItem {
  id: string;
  name: string;
  price: number;
  icon: string;
}

interface OrderItem {
  menuItemId: string;
  quantity: number;
}

interface StaffMember {
  id: string;
  name: string;
  shiftStatus?: string;
}

export default function Menu() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([
    { id: '1', name: 'Nasi Lemak Biasa', price: 4.50, icon: 'ramen_dining' },
    { id: '2', name: 'Mee Goreng', price: 5.00, icon: 'set_meal' },
    { id: '3', name: 'Kopi O Ais', price: 2.50, icon: 'local_cafe' },
    { id: '4', name: 'Teh Tarik', price: 2.00, icon: 'local_cafe' },
    { id: '5', name: 'Roti Canai', price: 1.50, icon: 'bakery_dining' },
  ]);

  const [orderItems, setOrderItems] = useState<OrderItem[]>([
    { menuItemId: '3', quantity: 2 },
    { menuItemId: '1', quantity: 1 }
  ]);

  const [orderId, setOrderId] = useState(() => `#HT-${Math.floor(1000 + Math.random() * 9000)}`);

  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'ewallet'>('cash');
  const [showCustomModal, setShowCustomModal] = useState(false);
  const [customName, setCustomName] = useState('');
  const [customPrice, setCustomPrice] = useState('');
  const [showSuccessOverlay, setShowSuccessOverlay] = useState(false);
  const [lastPaymentAmount, setLastPaymentAmount] = useState(0);

  const [isEditMode, setIsEditMode] = useState(false);
  const [isStaffDropdownOpen, setIsStaffDropdownOpen] = useState(false);
  
  const { addTransaction } = useTransactionsFirestore();

  // Get staff from localStorage to link with Settings/Profile clock-in status
  const staffOnShift = React.useMemo<StaffMember[]>(() => {
    const saved = localStorage.getItem('wise_staff_registry');
    if (saved) {
      try {
        const allStaff = JSON.parse(saved) as StaffMember[];
        return allStaff.filter((s) => s.shiftStatus === 'In Progress');
      } catch (e) {
        return [];
      }
    }
    return [];
  }, [isStaffDropdownOpen]); // Re-calculate when dropdown opens to get latest status

  const [activeStaff, setActiveStaff] = useState<StaffMember | null>(null);

  // Set default active staff if none selected
  React.useEffect(() => {
    if (!activeStaff && staffOnShift.length > 0) {
      setActiveStaff(staffOnShift[0]);
    }
  }, [staffOnShift, activeStaff]);

  // Delete menu item logic
  const handleDeleteMenuItem = (itemId: string) => {
    if (confirm('Are you sure you want to delete this item from the menu?')) {
      setMenuItems(prev => prev.filter(item => item.id !== itemId));
      // Cleanup cart
      setOrderItems(prev => prev.filter(item => item.menuItemId !== itemId));
    }
  };

  // Add item to cart
  const handleItemClick = (itemId: string) => {
    if (isEditMode) return;
    setOrderItems(prev => {
      const existing = prev.find(item => item.menuItemId === itemId);
      if (existing) {
        return prev.map(item => item.menuItemId === itemId ? { ...item, quantity: item.quantity + 1 } : item);
      } else {
        return [...prev, { menuItemId: itemId, quantity: 1 }];
      }
    });
  };

  // Adjust item quantity
  const handleQuantityChange = (itemId: string, delta: number) => {
    setOrderItems(prev => {
      return prev.map(item => {
        if (item.menuItemId === itemId) {
          const newQty = item.quantity + delta;
          return { ...item, quantity: newQty };
        }
        return item;
      }).filter(item => item.quantity > 0);
    });
  };

  // Calculations
  const subtotal = orderItems.reduce((acc, order) => {
    const item = menuItems.find(m => m.id === order.menuItemId);
    return acc + (item ? item.price * order.quantity : 0);
  }, 0);

  const tax = subtotal * 0.06;
  const total = subtotal + tax;

  // Add custom item
  const handleAddCustomItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customName.trim() || !customPrice.trim()) return;
    const priceNum = parseFloat(customPrice);
    if (isNaN(priceNum) || priceNum <= 0) {
      alert('Please enter a valid price');
      return;
    }

    const newId = String(Date.now());
    const newItem: MenuItem = {
      id: newId,
      name: customName,
      price: priceNum,
      icon: 'restaurant'
    };

    setMenuItems(prev => [...prev, newItem]);
    setCustomName('');
    setCustomPrice('');
    setShowCustomModal(false);
    
    // Automatically add to order
    handleItemClick(newId);
  };

  // Recipe mapping from MenuItem.id to StockItem.id & quantity
  const recipeMap: Record<string, { stockId: number; qty: number }[]> = {
    '1': [{ stockId: 6, qty: 1 }], // Nasi Lemak Biasa uses 1 Paper Straw (takeaway)
    '2': [{ stockId: 6, qty: 1 }], // Mee Goreng uses 1 Paper Straw
    '3': [ // Kopi O Ais
      { stockId: 2, qty: 1 }, // 1 Plastic Cup 16oz
      { stockId: 6, qty: 1 }, // 1 Paper Straw
      { stockId: 5, qty: 1 }  // 1 unit Sugar Syrup
    ],
    '4': [ // Teh Tarik
      { stockId: 1, qty: 1 }, // 1 Paper Cup 8oz
      { stockId: 3, qty: 1 }  // 1 unit Fresh Milk 1L
    ],
    '5': [{ stockId: 6, qty: 1 }]  // Roti Canai uses 1 Paper Straw
  };

  const initialStockFallback = [
    { id: 1, name: 'Paper Cup 8oz', emoji: '', category: 'Packaging', lastRecordedDate: '2026-05-20', totalInitial: 500, used: 120, lowStockThreshold: 100, unit: 'items' },
    { id: 2, name: 'Plastic Cup 16oz', emoji: '', category: 'Packaging', lastRecordedDate: '2026-05-19', totalInitial: 50, used: 45, lowStockThreshold: 10, unit: 'items' },
    { id: 3, name: 'Fresh Milk 1L', emoji: '', category: 'Ingredients', lastRecordedDate: '2026-05-20', totalInitial: 24, used: 8, lowStockThreshold: 5, unit: 'items' },
    { id: 4, name: 'Coffee Beans 1kg', emoji: '', category: 'Ingredients', lastRecordedDate: '2026-05-18', totalInitial: 10, used: 9, lowStockThreshold: 2, unit: 'bags' },
    { id: 5, name: 'Sugar Syrup 5L', emoji: '', category: 'Ingredients', lastRecordedDate: '2026-05-15', totalInitial: 5, used: 1, lowStockThreshold: 2, unit: 'bottles' },
    { id: 6, name: 'Paper Straws', emoji: '', category: 'Packaging', lastRecordedDate: '2026-05-17', totalInitial: 200, used: 195, lowStockThreshold: 50, unit: 'items' }
  ];

  const deductStockFromOrder = (orders: typeof orderItems) => {
    let currentStock = [...initialStockFallback];
    const saved = localStorage.getItem('wise_stock_inventory');
    if (saved) {
      try {
        currentStock = JSON.parse(saved);
      } catch (e) {}
    }

    orders.forEach(order => {
      const ingredients = recipeMap[order.menuItemId];
      if (ingredients) {
        ingredients.forEach(ing => {
          currentStock = currentStock.map(stockItem => {
            if (stockItem.id === ing.stockId) {
              const newUsed = Math.min(stockItem.totalInitial, stockItem.used + (order.quantity * ing.qty));
              return {
                ...stockItem,
                used: newUsed,
                lastRecordedDate: new Date().toISOString().split('T')[0]
              };
            }
            return stockItem;
          });
        });
      }
    });

    localStorage.setItem('wise_stock_inventory', JSON.stringify(currentStock));
    
    // Update metadata to show it was an automated system deduction
    const now = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
    localStorage.setItem('wise_stock_last_updated_time', now);
    localStorage.setItem('wise_stock_last_updated_by', 'POS System');

    window.dispatchEvent(new Event('stockInventoryUpdated'));
  };

  // Complete Payment Action
  const handleCompletePayment = async () => {
    if (orderItems.length === 0) return;
    
    // Deduct ingredients/packaging items from inventory
    deductStockFromOrder(orderItems);

    // Create a new transaction record for the Live Status Dashboard
    const now = new Date();
    const dateStr = now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });

    // Derive initials for staff
    const initials = activeStaff?.name
      ? activeStaff.name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)
      : '??';

    // Staff color mapping based on initials hash or just a random selection for consistency
    const colors = [
      'bg-primary-container text-on-primary-container',
      'bg-secondary-container text-on-secondary-container',
      'bg-tertiary-container text-on-tertiary-container',
      'bg-error-container text-on-error-container'
    ];
    const colorIndex = (initials.charCodeAt(0) + (initials.charCodeAt(1) || 0)) % colors.length;
    const staffColor = colors[colorIndex];

    try {
      await addTransaction({
        date: dateStr,
        time: timeStr,
        orderId,
        staffName: activeStaff?.name || 'Unknown Staff',
        staffId: activeStaff?.id || undefined,
        staffInitials: initials,
        staffColor: staffColor,
        amount: total,
        paymentMethod: paymentMethod,
      });
    } catch (e) {
      console.error("Failed to add transaction to Firestore", e);
      // We could optionally fallback to localStorage here if we wanted to
    }

    // Create a new ledger entry for the Admin Report/Ledger (keeping localStorage as requested)
    const ledgerEntry = {
      id: Date.now(),
      staff: [activeStaff?.name || 'Unknown Staff'],
      date: dateStr,
      description: `POS Order ${orderId}`,
      subtext: `Payment via ${paymentMethod === 'cash' ? 'Cash' : 'E-Wallet'}`,
      category: 'Sales',
      amount: `+${total.toFixed(2)}`,
      expenses: '',
      balance: 'Updating...', // Balance is calculated dynamically in full ledger systems
      type: 'income'
    };

    const savedLedger = localStorage.getItem('wise_ledger_registry');
    let ledger: any[] = [];
    if (savedLedger) {
      try {
        ledger = JSON.parse(savedLedger);
      } catch (e) {}
    }
    ledger = [ledgerEntry, ...ledger];
    localStorage.setItem('wise_ledger_registry', JSON.stringify(ledger));
    window.dispatchEvent(new Event('ledgerUpdated'));
    
    setLastPaymentAmount(total);
    setShowSuccessOverlay(true);
  };

  // Reset Cart after Success
  const handleResetOrder = () => {
    setOrderItems([]);
    setOrderId(`#HT-${Math.floor(1000 + Math.random() * 9000)}`);
    setShowSuccessOverlay(false);
  };

  return (
    <Layout title="Checkout Screen" noPadding>
      <div className="flex h-full min-h-0 bg-background overflow-hidden relative font-sans">
        
        {/* Center Main: Menu Grid (Left POS pane) */}
        <main className="flex-1 h-full overflow-y-auto px-8 py-4 flex flex-col gap-6">
          <div className="flex justify-between items-center shrink-0">
            <h3 className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest font-label-sm">Menu Catalog</h3>
            <div className="flex items-center gap-2">
              {/* Staff Selector Dropdown */}
              <div className="relative">
                <button 
                  onClick={() => setIsStaffDropdownOpen(!isStaffDropdownOpen)}
                  className="px-3 py-1 rounded-full bg-surface-container-high text-on-surface-variant hover:bg-surface-container border border-outline-variant/30 text-[10px] font-bold transition-all flex items-center gap-2 cursor-pointer select-none"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
                  <span>{activeStaff?.name || 'Select Staff'}</span>
                  <span className={`material-symbols-outlined text-[14px] transition-transform duration-200 ${isStaffDropdownOpen ? 'rotate-180' : ''}`}>
                    keyboard_arrow_down
                  </span>
                </button>

                <AnimatePresence>
                  {isStaffDropdownOpen && (
                    <>
                      <div 
                        className="fixed inset-0 z-30" 
                        onClick={() => setIsStaffDropdownOpen(false)}
                      ></div>
                      <motion.div 
                        initial={{ opacity: 0, y: 8, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.95 }}
                        className="absolute right-0 mt-2 w-48 bg-surface-container-lowest border border-outline-variant/30 rounded-xl shadow-lg z-40 overflow-hidden"
                      >
                        <div className="px-3 py-2 border-b border-outline-variant/20 bg-surface-container-low/50">
                          <span className="text-[9px] font-bold text-outline uppercase tracking-wider">Staff On Shift</span>
                        </div>
                        {staffOnShift.length === 0 ? (
                          <div className="px-3 py-4 text-center">
                            <p className="text-[10px] text-on-surface-variant font-medium">No staff currently clocked in.</p>
                          </div>
                        ) : (
                          staffOnShift.map((staff: StaffMember) => (
                            <button
                              key={staff.id}
                              onClick={() => {
                                setActiveStaff(staff);
                                setIsStaffDropdownOpen(false);
                              }}
                              className={`w-full px-3 py-2 text-left text-[11px] font-medium flex items-center justify-between transition-colors hover:bg-surface-container-low cursor-pointer ${activeStaff?.id === staff.id ? 'text-primary bg-primary/5' : 'text-on-surface'}`}
                            >
                              <span>{staff.name}</span>
                              {activeStaff?.id === staff.id && <span className="material-symbols-outlined text-[14px]">check</span>}
                            </button>
                          ))
                        )}
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>

              <button 
                onClick={() => setIsEditMode(!isEditMode)}
                className={`px-3 py-1 rounded-full text-[10px] font-bold transition-all flex items-center gap-2 cursor-pointer select-none ${
                  isEditMode 
                    ? 'bg-error text-on-error shadow-sm' 
                    : 'bg-surface-container-high text-on-surface-variant hover:bg-surface-container border border-outline-variant/30'
                }`}
              >
                <span className="material-symbols-outlined text-[14px]">{isEditMode ? 'close' : 'edit_square'}</span>
                {isEditMode ? 'Exit Edit Mode' : 'Edit Menu'}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5 auto-rows-[minmax(140px,auto)]">
            {menuItems.map((item) => {
              const orderItem = orderItems.find(o => o.menuItemId === item.id);
              const qty = orderItem ? orderItem.quantity : 0;
              return (
                <button
                  key={item.id}
                  onClick={() => handleItemClick(item.id)}
                  className={`bg-surface-container-lowest rounded-2xl p-5 flex flex-col items-center justify-center gap-3 border shadow-violet-soft hover:shadow-md transition-all group text-left relative overflow-hidden active:scale-98 cursor-pointer ${
                    isEditMode ? 'border-error/40 bg-error/5 ring-1 ring-error/10' :
                    qty > 0 ? 'border-primary ring-2 ring-primary/20' : 'border-outline-variant/60 hover:border-primary'
                  }`}
                >
                  <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                  
                  {/* Delete button visible only in Edit Mode */}
                  {isEditMode && (
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteMenuItem(item.id);
                      }}
                      className="absolute top-2 left-2 w-8 h-8 rounded-full bg-error text-on-error flex items-center justify-center shadow-lg hover:bg-error/90 transition-all z-10 active:scale-90"
                    >
                      <span className="material-symbols-outlined text-[18px]">delete</span>
                    </button>
                  )}

                  {/* Order quantity indicator badge */}
                  {qty > 0 && !isEditMode && (
                    <div className="absolute top-3 right-3 bg-primary text-on-primary w-6 h-6 rounded-full flex items-center justify-center font-label-sm text-[11px] font-bold font-data animate-bounce">
                      {qty}
                    </div>
                  )}

                  <div className="w-16 h-16 rounded-full bg-secondary-container flex items-center justify-center text-primary group-hover:scale-110 transition-transform shadow-sm">
                    <span className="material-symbols-outlined text-[32px]">{item.icon}</span>
                  </div>

                  <div className="w-full text-center">
                    <h3 className="font-title-md text-sm font-bold text-on-surface truncate px-1">{item.name}</h3>
                    <p className="font-body-md text-xs text-primary font-bold mt-1 font-data">RM {item.price.toFixed(2)}</p>
                  </div>
                </button>
              );
            })}

            {/* Custom Item Trigger Button */}
            <button
              onClick={() => setShowCustomModal(true)}
              className="bg-surface-container-low rounded-2xl p-5 flex flex-col items-center justify-center gap-3 border border-dashed border-outline-variant hover:border-primary hover:bg-primary/5 transition-all group text-left active:scale-98 cursor-pointer"
            >
              <div className="w-12 h-12 rounded-full border border-outline flex items-center justify-center text-outline group-hover:text-primary group-hover:border-primary transition-colors">
                <span className="material-symbols-outlined text-[24px]">add</span>
              </div>
              <div className="w-full text-center">
                <h3 className="font-title-md text-sm font-bold text-on-surface-variant group-hover:text-primary">Custom Item</h3>
              </div>
            </button>
          </div>
        </main>

        {/* Right Checkout: 30% (Standard sidebar) */}
        <aside className="w-96 h-full bg-surface-container-lowest border-l border-outline-variant/30 shadow-[-8px_0_30px_rgba(100,66,214,0.04)] flex flex-col z-20 shrink-0">
          <div className="h-10 px-6 border-b border-outline-variant/30 bg-surface flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-on-surface font-mono">{orderId}</h2>
            </div>
            <button 
              disabled={orderItems.length === 0}
              onClick={() => {
                if (confirm('Clear entire order?')) {
                  setOrderItems([]);
                }
              }}
              className="w-7 h-7 flex items-center justify-center text-on-surface-variant/80 hover:bg-surface-container hover:text-primary rounded-full transition-colors disabled:opacity-40"
              title="Clear Order"
            >
              <span className="material-symbols-outlined text-[18px]">delete_sweep</span>
            </button>
          </div>

          {/* List of ordered items */}
          <div className="flex-grow overflow-y-auto p-6 flex flex-col gap-4">
            <AnimatePresence initial={false}>
              {orderItems.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center opacity-60 py-16">
                  <span className="material-symbols-outlined text-[44px] text-outline mb-2">shopping_basket</span>
                  <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider font-label-sm">Cart is empty</p>
                  <p className="text-[11px] text-on-surface-variant/80 mt-1 max-w-[200px]">Click menu items on the left to start compiling the order.</p>
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  {orderItems.map((order) => {
                    const item = menuItems.find(m => m.id === order.menuItemId);
                    if (!item) return null;
                    const totalCost = item.price * order.quantity;
                    return (
                      <motion.div
                        key={order.menuItemId}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="flex flex-col gap-2"
                      >
                        <div className="flex items-start justify-between gap-4 py-1">
                          <div className="flex-1">
                            <h4 className="font-title-md text-sm font-bold text-on-surface">{item.name}</h4>
                            <p className="font-body-md text-xs text-on-surface-variant mt-0.5 font-data">RM {item.price.toFixed(2)} / ea</p>
                          </div>
                          
                          <div className="flex flex-col items-end gap-2">
                            <p className="font-title-md text-sm font-bold text-on-surface font-data">RM {totalCost.toFixed(2)}</p>
                            
                            {/* Stepper counters */}
                            <div className="flex items-center gap-3 bg-surface-container-high rounded-full px-2 py-0.5 border border-outline-variant/30 select-none">
                              <button 
                                onClick={() => handleQuantityChange(order.menuItemId, -1)}
                                className="w-6 h-6 flex items-center justify-center text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
                              >
                                <span className="material-symbols-outlined text-[16px] font-bold">remove</span>
                              </button>
                              
                              <span className="font-label-lg text-xs font-bold w-4 text-center font-data">{order.quantity}</span>
                              
                              <button 
                                onClick={() => handleQuantityChange(order.menuItemId, 1)}
                                className="w-6 h-6 flex items-center justify-center text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
                              >
                                <span className="material-symbols-outlined text-[16px] font-bold">add</span>
                              </button>
                            </div>
                          </div>
                        </div>
                        <hr className="border-outline-variant/20" />
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </AnimatePresence>
          </div>

          {/* Checkout pricing and payment options */}
          <div className="p-4 bg-surface-container-low border-t border-outline-variant/30 rounded-t-[24px] mt-auto shrink-0 space-y-2 font-sans">
            <div className="space-y-1">
              <div className="flex justify-between items-center text-xs">
                <span className="font-body-lg text-on-surface-variant font-medium">Subtotal</span>
                <span className="font-body-lg text-on-surface font-bold font-data">RM {subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="font-body-lg text-on-surface-variant font-medium">Tax (6%)</span>
                <span className="font-body-lg text-on-surface font-bold font-data">RM {tax.toFixed(2)}</span>
              </div>
            </div>

            <div className="flex flex-col items-start border-t border-outline-variant/30 pt-2">
              <span className="font-label-lg text-[10px] font-bold text-primary uppercase tracking-widest font-label-sm">Total Due</span>
              <div className="font-display-lg text-[28px] font-bold text-on-surface w-full flex justify-between items-baseline font-data">
                <span className="text-lg text-on-surface-variant font-medium font-sans">RM</span>
                <span>{total.toFixed(2)}</span>
              </div>
            </div>

            {/* Payment Methods */}
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setPaymentMethod('cash')}
                className={`border-2 rounded-xl p-2 flex flex-col items-center justify-center gap-1 text-on-surface-variant cursor-pointer transition-all active:scale-95 duration-100 ${
                  paymentMethod === 'cash'
                    ? 'border-primary bg-primary/5 text-primary shadow-sm'
                    : 'border-outline-variant/40 hover:border-outline-variant hover:bg-surface-container'
                }`}
              >
                <span className="material-symbols-outlined text-[20px]">payments</span>
                <span className="font-label-lg text-[11px] font-bold font-label-sm">Cash</span>
              </button>

              <button
                onClick={() => setPaymentMethod('ewallet')}
                className={`border-2 rounded-xl p-2 flex flex-col items-center justify-center gap-1 text-on-surface-variant cursor-pointer transition-all active:scale-95 duration-100 ${
                  paymentMethod === 'ewallet'
                    ? 'border-primary bg-primary/5 text-primary shadow-sm'
                    : 'border-outline-variant/40 hover:border-outline-variant hover:bg-surface-container'
                }`}
              >
                <span className="material-symbols-outlined text-[20px]">qr_code_scanner</span>
                <span className="font-label-lg text-[11px] font-bold font-label-sm">E-Wallet</span>
              </button>
            </div>

            {/* Pay Button */}
            <button
              onClick={handleCompletePayment}
              disabled={orderItems.length === 0}
              className="w-full bg-primary text-on-primary h-11 rounded-full font-headline-sm text-sm font-bold flex items-center justify-center gap-2 hover:bg-primary/95 transition-colors shadow-violet-soft active:scale-[0.98] duration-100 cursor-pointer disabled:opacity-40 disabled:pointer-events-none"
            >
              <span>Pay</span>
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </button>
          </div>
        </aside>

        {/* Custom Item Form Modal */}
        <AnimatePresence>
          {showCustomModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowCustomModal(false)}
                className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="bg-surface rounded-[32px] border border-outline-variant/40 shadow-xl overflow-hidden max-w-sm w-full z-10 p-8 space-y-6"
              >
                <div className="border-b border-outline-variant/30 pb-4">
                  <h3 className="font-title-lg text-lg font-bold text-on-surface">Add Custom Item</h3>
                  <p className="font-body-md text-xs text-on-surface-variant mt-1 font-medium">Add an unlisted customized dish to this order.</p>
                </div>

                <form onSubmit={handleAddCustomItem} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="font-label-lg text-xs font-bold text-on-surface">Item Label</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Apam Balik Double Cheese"
                      value={customName}
                      onChange={(e) => setCustomName(e.target.value)}
                      className="w-full bg-surface-container-low border border-outline-variant/45 rounded-2xl px-4 py-3 text-on-surface font-body-md text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-label-lg text-xs font-bold text-on-surface">Price (RM)</label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      placeholder="e.g. 5.50"
                      value={customPrice}
                      onChange={(e) => setCustomPrice(e.target.value)}
                      className="w-full bg-surface-container-low border border-outline-variant/45 rounded-2xl px-4 py-3 text-on-surface font-body-md text-sm font-mono focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                    />
                  </div>

                  <div className="flex items-center justify-end gap-3 pt-6 border-t border-outline-variant/20 mt-6">
                    <button
                      type="button"
                      onClick={() => setShowCustomModal(false)}
                      className="px-5 py-2.5 rounded-full border border-outline-variant/60 text-on-surface font-label-lg text-xs font-bold hover:bg-surface-container-low transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2.5 rounded-full bg-primary text-on-primary font-label-lg text-xs font-bold shadow-sm hover:bg-primary-container hover:text-on-primary-container transition-colors cursor-pointer active:scale-95 duration-100"
                    >
                      Add & Order
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Payment Successful Confetti Overlay */}
        <AnimatePresence>
          {showSuccessOverlay && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/60 backdrop-blur-md"
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.8, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: 30 }}
                className="bg-surface-container-lowest rounded-[36px] border border-primary/20 shadow-2xl p-8 max-w-sm w-full z-10 text-center space-y-6 relative overflow-hidden border-t-8 border-t-primary"
              >
                <div className="w-20 h-20 bg-primary-container/20 text-primary rounded-full flex items-center justify-center mx-auto mb-2 animate-bounce">
                  <span className="material-symbols-outlined text-[48px] filled">check_circle</span>
                </div>
                
                <div>
                  <h3 className="font-headline-sm text-xl font-bold text-on-surface font-title-lg">Payment Successful!</h3>
                  <p className="font-body-md text-xs text-on-surface-variant mt-1.5 font-medium leading-relaxed">
                    Order {orderId} has been fully finalized and recorded in the cashflow ledger.
                  </p>
                </div>

                <div className="bg-surface-container p-5 rounded-2xl border border-outline-variant/30 space-y-3 font-data text-xs">
                  <div className="flex justify-between items-center text-on-surface-variant">
                    <span>Payment Mode:</span>
                    <span className="font-bold text-on-surface uppercase font-sans flex items-center gap-1">
                      <span className="material-symbols-outlined text-[16px]">{paymentMethod === 'cash' ? 'payments' : 'qr_code_scanner'}</span>
                      {paymentMethod === 'cash' ? 'Cash' : 'E-Wallet'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-on-surface-variant">
                    <span>Transaction Total:</span>
                    <span className="font-bold text-primary text-sm">RM {lastPaymentAmount.toFixed(2)}</span>
                  </div>
                </div>

                <button
                  onClick={handleResetOrder}
                  className="w-full bg-primary text-on-primary h-14 rounded-full font-headline-sm text-sm font-bold flex items-center justify-center gap-2 hover:bg-primary-container hover:text-on-primary-container transition-colors shadow-sm cursor-pointer active:scale-95 duration-100"
                >
                  <span>Start New Order</span>
                  <span className="material-symbols-outlined text-[16px]">autorenew</span>
                </button>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </div>
    </Layout>
  );
}
