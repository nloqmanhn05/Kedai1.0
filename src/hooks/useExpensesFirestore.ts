import { useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { collection, onSnapshot, query, addDoc, serverTimestamp, orderBy, doc, deleteDoc } from 'firebase/firestore';
import { Expense } from '../pages/types';

export function useExpensesFirestore() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Order by timestamp descending so the newest are first
    const q = query(collection(db, 'expenses'), orderBy('timestamp', 'desc'));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const expenseList = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          description: data.description,
          subtext: data.subtext,
          category: data.category,
          amount: data.amount,
          date: data.date,
          staff: data.staff || [],
          type: data.type,
          timestamp: data.timestamp?.toMillis() || Date.now(),
        } as Expense;
      });
      setExpenses(expenseList);
      setLoading(false);
    }, (err) => {
      console.error('Error fetching expenses from Firestore:', err);
      setError(err.message);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const addExpense = async (expense: Omit<Expense, 'id' | 'timestamp'>) => {
    try {
      await addDoc(collection(db, 'expenses'), {
        ...expense,
        timestamp: serverTimestamp()
      });
    } catch (err) {
      console.error('Error adding expense to Firestore:', err);
      throw err;
    }
  };

  const deleteExpense = async (id: string | number) => {
    try {
      const expenseRef = doc(db, 'expenses', String(id));
      await deleteDoc(expenseRef);
    } catch (err) {
      console.error('Error deleting expense from Firestore:', err);
      throw err;
    }
  };

  return { expenses, loading, error, addExpense, deleteExpense };
}
