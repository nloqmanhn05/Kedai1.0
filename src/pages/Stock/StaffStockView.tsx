import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { StockItem, StockViewProps } from '../types';

export function StaffStockView({
  stockList,
  setStockList,
  lastUpdatedTime,
  setLastUpdatedTime,
  lastUpdatedBy,
  setLastUpdatedBy,
  addItem,
  restockItem,
  updateItemDetails,
  deleteItem
}: StockViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'low' | 'normal'>('all');

  // Restock States
  const [selectedItem, setSelectedItem] = useState<StockItem | null>(null);
  const [restockAmount, setRestockAmount] = useState('100');
  const [isUpdatingRowId, setIsUpdatingRowId] = useState<string | number | null>(null);

  // Add Item States
  const [showAddForm, setShowAddForm] = useState(false);
  const [newItemName, setNewItemName] = useState('');
  const [newItemEmoji, setNewItemEmoji] = useState('📦');
  const [newItemCategory, setNewItemCategory] = useState<'Packaging' | 'Ingredients' | 'Other'>('Packaging');
  const [newItemInitial, setNewItemInitial] = useState('100');
  const [newItemThreshold, setNewItemThreshold] = useState('20');
  const [newItemUnit, setNewItemUnit] = useState('items');

  // Edit Item Details States
  const [editingItem, setEditingItem] = useState<StockItem | null>(null);
  const [editItemName, setEditItemName] = useState('');
  const [editItemCategory, setEditItemCategory] = useState<'Packaging' | 'Ingredients' | 'Other'>('Packaging');
  const [editItemInitial, setEditItemInitial] = useState('100');
  const [editItemUsed, setEditItemUsed] = useState('0');
  const [editItemThreshold, setEditItemThreshold] = useState('20');
  const [editItemUnit, setEditItemUnit] = useState('items');

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

  const handleRestock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItem) return;
    const amount = parseInt(restockAmount) || 0;
    if (amount <= 0) return alert('Please enter a valid positive number.');

    setIsUpdatingRowId(selectedItem.id);
    try {
      if (restockItem) {
        await restockItem(selectedItem.id, amount, 'Hawker Staff');
      }
      setSelectedItem(null);
      setIsUpdatingRowId(null);
      alert(`Successfully restocked ${amount} units for ${selectedItem.name}!`);
    } catch (err) {
      console.error(err);
      alert('Failed to restock. Try again.');
      setIsUpdatingRowId(null);
    }
  };

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName) return alert('Please enter an item name.');

    try {
      if (addItem) {
        await addItem({
          name: newItemName,
          emoji: newItemEmoji || '📦',
          category: newItemCategory,
          lastRecordedDate: new Date().toISOString().split('T')[0],
          totalInitial: parseInt(newItemInitial) || 0,
          used: 0,
          lowStockThreshold: parseInt(newItemThreshold) || 0,
          unit: newItemUnit
        }, 'Hawker Staff');
      }

      setNewItemName('');
      setShowAddForm(false);
      alert(`Successfully added ${newItemName} to stock inventory!`);
    } catch (err) {
      console.error(err);
      alert('Failed to add item to Firestore.');
    }
  };

  const handleStartEdit = (item: StockItem) => {
    setEditingItem(item);
    setEditItemName(item.name);
    setEditItemCategory(item.category as any);
    setEditItemInitial(item.totalInitial.toString());
    setEditItemUsed(item.used.toString());
    setEditItemThreshold(item.lowStockThreshold.toString());
    setEditItemUnit(item.unit);
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;
    if (!editItemName) return alert('Please enter an item name.');

    const initialNum = parseInt(editItemInitial) || 0;
    const usedNum = parseInt(editItemUsed) || 0;
    if (usedNum > initialNum) {
      return alert('Items Used cannot exceed Starting Stock.');
    }

    try {
      if (updateItemDetails) {
        await updateItemDetails(editingItem.id, {
          name: editItemName,
          category: editItemCategory,
          totalInitial: initialNum,
          used: usedNum,
          lowStockThreshold: parseInt(editItemThreshold) || 0,
          unit: editItemUnit
        }, 'Hawker Staff');
      }

      setEditingItem(null);
      alert('Item updated successfully!');
    } catch (err) {
      console.error(err);
      alert('Failed to save changes.');
    }
  };

  const handleDeleteItem = async (id: string | number, name: string) => {
    if (window.confirm(`Are you sure you want to delete "${name}" from the inventory? This action cannot be undone.`)) {
      try {
        if (deleteItem) {
          await deleteItem(id, 'Hawker Staff');
        }
        alert(`Successfully deleted "${name}".`);
      } catch (err) {
        console.error(err);
        alert('Failed to delete item.');
      }
    }
  };



  return (
    <div className="w-full max-w-[1600px] mx-auto flex flex-col min-h-0 gap-6">
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

      <div className="bg-surface-container-lowest rounded-2xl p-4 border border-outline-variant/30 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex gap-2 flex-wrap w-full md:w-auto">
          <button onClick={() => setActiveTab('all')} className={`px-4 py-2 rounded-full font-label-lg text-xs font-bold transition-all active:scale-95 duration-100 ${activeTab === 'all' ? 'bg-primary text-white shadow-sm' : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container border border-outline-variant/20'}`}>All Items</button>
          <button onClick={() => setActiveTab('low')} className={`px-4 py-2 rounded-full font-label-lg text-xs font-bold transition-all active:scale-95 duration-100 flex items-center gap-1.5 ${activeTab === 'low' ? 'bg-error text-white shadow-sm' : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container border border-outline-variant/20'}`}>Low Stock <span className={`material-symbols-outlined text-[15px] ${activeTab === 'low' ? 'text-white' : 'text-amber-500'}`}>warning</span></button>
          <button onClick={() => setActiveTab('normal')} className={`px-4 py-2 rounded-full font-label-lg text-xs font-bold transition-all active:scale-95 duration-100 ${activeTab === 'normal' ? 'bg-emerald-600 text-white shadow-sm' : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container border border-outline-variant/20'}`}>Normal</button>
        </div>
        <div className="w-full md:w-auto flex items-center gap-3">
          <div className="relative flex-1 md:w-64">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[18px]">search</span>
            <input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-10 pr-4 py-2 bg-surface-container-low border border-outline-variant/50 rounded-full text-xs font-medium text-on-surface placeholder:text-outline/80 focus:ring-2 focus:ring-primary focus:bg-surface transition-all outline-none" placeholder="Search items or categories..." type="text" />
          </div>
          <button onClick={() => setShowAddForm(prev => !prev)} className="bg-primary text-white rounded-full px-5 py-2 font-label-lg text-xs font-bold flex items-center justify-center gap-1.5 hover:bg-primary-container transition-all active:scale-95 shadow-sm cursor-pointer shrink-0"><span className="material-symbols-outlined text-[16px]">{showAddForm ? 'close' : 'add'}</span>{showAddForm ? 'Close' : 'Add Item'}</button>
        </div>
      </div>

      <AnimatePresence>
        {showAddForm && (
          <motion.section initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="bg-surface rounded-[24px] shadow-sm border border-outline-variant/30 overflow-hidden">
            <div className="p-6 border-b border-outline-variant/20 bg-surface-container-lowest bg-surface-container-lowest"><h3 className="text-sm font-bold text-on-surface">Register New Stock Item</h3><p className="text-[11px] text-outline font-medium mt-0.5">Catalog a new ingredient, packaging material, or inventory item.</p></div>
            <form onSubmit={handleAddItem} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex flex-col gap-1.5"><label className="font-label-lg font-bold text-on-surface-variant text-[11px] uppercase tracking-wider">Item Name</label><input type="text" placeholder="e.g. Cocoa Powder 1kg" value={newItemName} onChange={(e) => setNewItemName(e.target.value)} className="px-4 py-2.5 bg-surface-container-low border border-outline-variant/50 rounded-xl focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-xs font-medium text-on-surface" /></div>
                <div className="flex flex-col gap-1.5"><label className="font-label-lg font-bold text-on-surface-variant text-[11px] uppercase tracking-wider">Category</label><select value={newItemCategory} onChange={(e) => setNewItemCategory(e.target.value as any)} className="px-4 py-2.5 bg-surface-container-low border border-outline-variant/50 rounded-xl focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-xs font-medium text-on-surface cursor-pointer"><option value="Packaging">Packaging</option><option value="Ingredients">Ingredients</option><option value="Other">Other</option></select></div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex flex-col gap-1.5"><label className="font-label-lg font-bold text-on-surface-variant text-[11px] uppercase tracking-wider">Starting Stock</label><input type="number" placeholder="100" value={newItemInitial} onChange={(e) => setNewItemInitial(e.target.value)} className="px-4 py-2.5 bg-surface-container-low border border-outline-variant/50 rounded-xl focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-xs font-medium text-on-surface font-mono" /></div>
                <div className="flex flex-col gap-1.5"><label className="font-label-lg font-bold text-on-surface-variant text-[11px] uppercase tracking-wider">Low Stock Threshold</label><input type="number" placeholder="20" value={newItemThreshold} onChange={(e) => setNewItemThreshold(e.target.value)} className="px-4 py-2.5 bg-surface-container-low border border-outline-variant/50 rounded-xl focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-xs font-medium text-on-surface font-mono" /></div>
                <div className="flex flex-col gap-1.5"><label className="font-label-lg font-bold text-on-surface-variant text-[11px] uppercase tracking-wider">Unit</label><input type="text" placeholder="e.g. items, bags" value={newItemUnit} onChange={(e) => setNewItemUnit(e.target.value)} className="px-4 py-2.5 bg-surface-container-low border border-outline-variant/50 rounded-xl focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-xs font-medium text-on-surface" /></div>
              </div>
              <div className="flex justify-end gap-2.5 pt-4 border-t border-outline-variant/15"><button type="button" onClick={() => setShowAddForm(false)} className="px-4 py-2 rounded-full border border-outline-variant text-on-surface-variant font-bold text-xs hover:bg-surface-container-low transition-colors">Cancel</button><button type="submit" className="px-5 py-2 rounded-full bg-primary text-white font-bold text-xs hover:bg-primary-container shadow-sm transition-all">Save Item</button></div>
            </form>
          </motion.section>
        )}
      </AnimatePresence>

      <div className="bg-surface-container-lowest rounded-[24px] border border-outline-variant/30 shadow-sm overflow-hidden mt-2">
        <div className="overflow-x-auto w-full">
          <div className="w-full text-xs min-w-[850px]">
            {/* Grid Header */}
            <div className="grid grid-cols-5 bg-surface-container-low border-b border-outline-variant/30 text-outline font-label-sm text-[11px] font-bold uppercase tracking-wider py-4 px-6">
              <div>Item Name</div>
              <div>Last Recorded Date</div>
              <div className="text-center">Items Used</div>
              <div>Items Left</div>
              <div className="text-right">Actions</div>
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
                        className={`grid grid-cols-5 items-center py-4 px-6 transition-all duration-150 ${isLow ? 'bg-error-container/5 border-l-4 border-l-error/70' : 'hover:bg-surface-container-low/40'}`}
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
                          <div className="flex flex-col items-center justify-center">
                            <span className="font-mono font-extrabold text-sm text-on-surface leading-tight">{item.used}</span>
                            <span className="text-[9px] text-outline uppercase font-semibold tracking-wider font-label-sm">used</span>
                          </div>
                        </div>
                        <div>
                          {isLow ? (
                            <div className="flex items-center gap-1.5 text-error">
                              <span className="material-symbols-outlined text-[18px]">error</span>
                              <span className="font-mono font-extrabold text-sm">{left}</span>
                              <span className="px-1 py-0.5 bg-error text-white text-[8px] font-bold rounded">LOW</span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-1.5 text-emerald-600">
                              <span className="material-symbols-outlined text-[18px]">check_circle</span>
                              <span className="font-mono font-extrabold text-sm">{left}</span>
                            </div>
                          )}
                        </div>
                        <div className="text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button onClick={() => { setSelectedItem(item); setRestockAmount('100'); }} className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all shadow-sm active:scale-95 ${isUpdatingRowId === item.id ? 'bg-outline-variant text-outline cursor-wait' : isLow ? 'bg-error text-white hover:bg-error-container' : 'bg-primary/10 text-primary border border-primary/20'}`} disabled={isUpdatingRowId === item.id}>{isUpdatingRowId === item.id ? 'Updating...' : 'Update Stock'}</button>
                            <button onClick={() => handleStartEdit(item)} className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-surface-container text-on-surface-variant transition-colors" title="Edit Item Details"><span className="material-symbols-outlined text-[18px]">edit</span></button>
                            <button onClick={() => handleDeleteItem(item.id, item.name)} className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-error-container/20 text-error transition-colors animate-pulse-slow" title="Delete Item"><span className="material-symbols-outlined text-[18px]">delete</span></button>
                          </div>
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

      {/* Restock Modal */}
      <AnimatePresence>
        {selectedItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="w-full max-w-md bg-surface rounded-[28px] border border-outline-variant/30 shadow-lg overflow-hidden">
              <div className="p-6 border-b border-outline-variant/10 bg-surface-container-low flex justify-between items-center"><div><h3 className="font-bold text-on-surface text-sm">Restock Inventory</h3><p className="text-[10px] text-outline font-medium mt-0.5">Item: {selectedItem.name}</p></div><button onClick={() => setSelectedItem(null)} className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-surface-container text-on-surface-variant transition-colors"><span className="material-symbols-outlined text-[18px]">close</span></button></div>
              <form onSubmit={handleRestock} className="p-6 space-y-4">
                <div className="flex items-center justify-between p-3.5 bg-surface-container-low rounded-2xl border border-outline-variant/10"><div><p className="text-[10px] text-outline uppercase tracking-wider font-semibold">Initial Stock</p><p className="font-mono font-bold text-sm text-on-surface mt-0.5">{selectedItem.totalInitial} {selectedItem.unit}</p></div><div className="text-right"><p className="text-[10px] text-outline uppercase tracking-wider font-semibold">Stock Left</p><p className={`font-mono font-bold text-sm mt-0.5 ${selectedItem.totalInitial - selectedItem.used <= selectedItem.lowStockThreshold ? 'text-error' : 'text-emerald-600'}`}>{selectedItem.totalInitial - selectedItem.used} {selectedItem.unit}</p></div></div>
                <div className="flex flex-col gap-1.5"><label className="font-label-lg font-bold text-on-surface-variant text-[11px] uppercase tracking-wider">Restock Amount ({selectedItem.unit})</label><input type="number" required value={restockAmount} onChange={(e) => setRestockAmount(e.target.value)} className="w-full px-4 py-2.5 bg-surface-container-low border border-outline-variant/50 rounded-xl focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-xs font-semibold text-on-surface font-mono" placeholder="e.g. 100" min="1" /></div>
                <div className="flex justify-end gap-2.5 pt-4 border-t border-outline-variant/15"><button type="button" onClick={() => setSelectedItem(null)} className="px-4 py-2 rounded-full border border-outline-variant text-on-surface-variant font-bold text-xs hover:bg-surface-container-low transition-colors">Cancel</button><button type="submit" className="px-5 py-2 rounded-full bg-primary text-white font-bold text-xs hover:bg-primary-container shadow-sm transition-all flex items-center gap-1"><span className="material-symbols-outlined text-[15px]">inventory_2</span>Submit Restock</button></div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Edit Modal */}
      <AnimatePresence>
        {editingItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="w-full max-w-lg bg-surface rounded-[28px] border border-outline-variant/30 shadow-lg overflow-hidden">
              <div className="p-6 border-b border-outline-variant/10 bg-surface-container-low flex justify-between items-center">
                <div>
                  <h3 className="font-bold text-on-surface text-sm">Edit Item Details</h3>
                  <p className="text-[10px] text-outline font-medium mt-0.5">Modify properties for: {editingItem.name}</p>
                </div>
                <button onClick={() => setEditingItem(null)} className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-surface-container text-on-surface-variant transition-colors">
                  <span className="material-symbols-outlined text-[18px]">close</span>
                </button>
              </div>
              <form onSubmit={handleSaveEdit} className="p-6 space-y-4">
                <div className="flex flex-col gap-1.5">
                  <label className="font-label-lg font-bold text-on-surface-variant text-[11px] uppercase tracking-wider">Item Name</label>
                  <input type="text" required value={editItemName} onChange={(e) => setEditItemName(e.target.value)} className="px-4 py-2.5 bg-surface-container-low border border-outline-variant/50 rounded-xl focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-xs font-semibold text-on-surface" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="font-label-lg font-bold text-on-surface-variant text-[11px] uppercase tracking-wider">Category</label>
                    <select value={editItemCategory} onChange={(e) => setEditItemCategory(e.target.value as any)} className="px-4 py-2.5 bg-surface-container-low border border-outline-variant/50 rounded-xl focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-xs font-semibold text-on-surface cursor-pointer">
                      <option value="Packaging">Packaging</option>
                      <option value="Ingredients">Ingredients</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="font-label-lg font-bold text-on-surface-variant text-[11px] uppercase tracking-wider">Unit</label>
                    <input type="text" required value={editItemUnit} onChange={(e) => setEditItemUnit(e.target.value)} className="px-4 py-2.5 bg-surface-container-low border border-outline-variant/50 rounded-xl focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-xs font-semibold text-on-surface" />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="font-label-lg font-bold text-on-surface-variant text-[11px] uppercase tracking-wider">Starting Stock</label>
                    <input type="number" required value={editItemInitial} onChange={(e) => setEditItemInitial(e.target.value)} className="px-4 py-2.5 bg-surface-container-low border border-outline-variant/50 rounded-xl focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-xs font-semibold text-on-surface font-mono" />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="font-label-lg font-bold text-on-surface-variant text-[11px] uppercase tracking-wider">Items Used</label>
                    <input type="number" required value={editItemUsed} onChange={(e) => setEditItemUsed(e.target.value)} className="px-4 py-2.5 bg-surface-container-low border border-outline-variant/50 rounded-xl focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-xs font-semibold text-on-surface font-mono" />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="font-label-lg font-bold text-on-surface-variant text-[11px] uppercase tracking-wider">Low Stock Threshold</label>
                    <input type="number" required value={editItemThreshold} onChange={(e) => setEditItemThreshold(e.target.value)} className="px-4 py-2.5 bg-surface-container-low border border-outline-variant/50 rounded-xl focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-xs font-semibold text-on-surface font-mono" />
                  </div>
                </div>
                <div className="flex justify-end gap-2.5 pt-4 border-t border-outline-variant/15">
                  <button type="button" onClick={() => setEditingItem(null)} className="px-4 py-2 rounded-full border border-outline-variant text-on-surface-variant font-bold text-xs hover:bg-surface-container-low transition-colors">Cancel</button>
                  <button type="submit" className="px-5 py-2 rounded-full bg-primary text-white font-bold text-xs hover:bg-primary-container shadow-sm transition-all flex items-center gap-1">
                    <span className="material-symbols-outlined text-[15px]">save</span>Save Changes
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
