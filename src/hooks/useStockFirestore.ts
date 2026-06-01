import { useState, useEffect } from 'react';
import {
  collection,
  onSnapshot,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  writeBatch,
  Timestamp,
  increment
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { StockItem } from '../pages/types';

export function useStockFirestore() {
  const [stockList, setStockList] = useState<StockItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const [lastUpdatedTime, setLastUpdatedTime] = useState<string>('Never');
  const [lastUpdatedBy, setLastUpdatedBy] = useState<string>('System');

  // Helper to format Firestore Timestamp to YYYY-MM-DD string for client-side state
  const formatTimestampToDateString = (timestamp: Timestamp): string => {
    return timestamp.toDate().toISOString().split('T')[0];
  };

  // Real-time listener for stock inventory
  useEffect(() => {
    // Reference to 'stocks' collection, ordered by name for consistent display
    const q = query(collection(db, 'stocks'), orderBy('name', 'asc'));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const items: StockItem[] = [];
        snapshot.forEach((doc) => {
          const data = doc.data();

          // Determine the correct format for lastRecordedDate.
          // If it's a Firestore Timestamp, convert it. Otherwise, use existing string or default.
          const lastRecordedDateFormatted = data.lastRecordedDate instanceof Timestamp
            ? formatTimestampToDateString(data.lastRecordedDate)
            : (data.lastRecordedDate || new Date().toISOString().split('T')[0]); // Fallback for existing string dates or if missing

          items.push({
            id: doc.id, // Use document ID as the unique string/number ID
            name: data.name || '',
            emoji: data.emoji || '',
            category: data.category || 'Other',
            lastRecordedDate: lastRecordedDateFormatted,
            totalInitial: data.totalInitial || 0,
            used: data.used || 0,
            lowStockThreshold: data.lowStockThreshold || 0,
            unit: data.unit || 'items',
          });
        });
        setStockList(items);
        setLoading(false);
      },
      (err) => {
        console.error('Error fetching real-time stock data from Firestore:', err);
        setError(err);
        setLoading(false);
      }
    );

    // Also listen to the metadata document for last updated stats
    const metaUnsubscribe = onSnapshot(
      doc(db, 'metadata', 'stock_status'), // Assumes a document 'stock_status' in 'metadata' collection
      (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          if (data.lastUpdatedTime) setLastUpdatedTime(data.lastUpdatedTime);
          if (data.lastUpdatedBy) setLastUpdatedBy(data.lastUpdatedBy);
        }
      },
      (err) => {
        console.error('Error fetching stock metadata:', err);
      }
    );

    // Cleanup function for the effect
    return () => {
      unsubscribe();
      metaUnsubscribe();
    };
  }, []); // Empty dependency array means this effect runs once on mount

  // Helper function to update the metadata document
  const updateMetadata = async (by: string) => {
    const formattedTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' Today';
    await setDoc(doc(db, 'metadata', 'stock_status'), {
      lastUpdatedTime: formattedTime,
      lastUpdatedBy: by,
      updatedAt: Timestamp.now() // Store actual Firestore Timestamp for better querying/sorting
    }, { merge: true }); // Use merge: true to avoid overwriting other metadata fields
  };

  // Add new item to Firestore
  const addItem = async (item: Omit<StockItem, 'id'>, by: string = 'Staff') => {
    // Let Firestore generate a unique document ID. This is best practice.
    const newItemRef = doc(collection(db, 'stocks'));

    await setDoc(newItemRef, {
      name: item.name,
      emoji: item.emoji || '',
      category: item.category,
      lastRecordedDate: Timestamp.now(), // Store date as Firestore Timestamp
      totalInitial: item.totalInitial,
      used: item.used,
      lowStockThreshold: item.lowStockThreshold,
      unit: item.unit
    });

    await updateMetadata(by);
  };

  // Restock an item by its ID
  const restockItem = async (itemId: string | number, amount: number, by: string = 'Staff') => {
    const itemRef = doc(db, 'stocks', String(itemId));

    // CRUCIAL: Use increment for atomic updates to prevent race conditions.
    await updateDoc(itemRef, {
      totalInitial: increment(amount), // Atomically increment totalInitial
      lastRecordedDate: Timestamp.now() // Update last recorded date
    });

    await updateMetadata(by);
  };

  // Edit/Update entire item details by its ID
  const updateItemDetails = async (itemId: string | number, updatedFields: Partial<StockItem>, by: string = 'Staff') => {
    const itemRef = doc(db, 'stocks', String(itemId));

    // Prepare fields for update.
    // We always update `lastRecordedDate` to the current time when details change.
    const fieldsToUpdate: any = { ...updatedFields };
    fieldsToUpdate.lastRecordedDate = Timestamp.now(); // Ensure it's a Timestamp

    await updateDoc(itemRef, fieldsToUpdate);

    await updateMetadata(by);
  };

  // Delete an item by its ID
  const deleteItem = async (itemId: string | number, by: string = 'Staff') => {
    await deleteDoc(doc(db, 'stocks', String(itemId)));
    await updateMetadata(by);
  };

  // Seed default fallback data preserving original IDs if Firestore is empty
  const seedFallbackData = async (fallbackItems: StockItem[]) => {
    const batch = writeBatch(db);
    fallbackItems.forEach((item) => {
      const itemRef = doc(db, 'stocks', String(item.id));
      batch.set(itemRef, {
        name: item.name,
        emoji: item.emoji || '',
        category: item.category,
        lastRecordedDate: Timestamp.now(), // Store as Firestore Timestamp
        totalInitial: item.totalInitial,
        used: item.used,
        lowStockThreshold: item.lowStockThreshold,
        unit: item.unit
      });
    });

    await batch.commit();
    await updateMetadata('System (Seed)');
  };

  return {
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
  };
}
