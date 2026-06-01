import { useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { collection, onSnapshot, query, where, doc, addDoc, updateDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';

export interface Metric {
  label: string;
  value: string;
  colorClass: string;
}

export interface Action {
  label: string;
  icon: string;
  variant: 'outline' | 'secondary';
}

export interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  category?: string;
  title?: string;
  metrics?: Metric[];
  actions?: Action[];
}

export interface ChatSession {
  id: string;
  userId: string;
  title: string;
  createdAt: any;
  updatedAt: any;
  messages: Message[];
}

export function useChatSessionsFirestore() {
  const { user } = useAuth();
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setChatSessions([]);
      setLoading(false);
      return;
    }

    const q = query(
      collection(db, 'chatSessions'),
      where('userId', '==', user.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const sessions = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          userId: data.userId,
          title: data.title,
          createdAt: data.createdAt,
          updatedAt: data.updatedAt?.toMillis() || Date.now(),
          messages: data.messages || []
        } as ChatSession;
      }).sort((a, b) => b.updatedAt - a.updatedAt);
      
      setChatSessions(sessions);
      setLoading(false);
    }, (err) => {
      console.error('Error fetching chat sessions:', err);
      setError(err.message);
      setLoading(false);
    });

    return unsubscribe;
  }, [user]);

  const createChatSession = async (title: string, initialMessages: Message[] = []) => {
    if (!user) throw new Error('User must be logged in to create a chat session');
    try {
      const docRef = await addDoc(collection(db, 'chatSessions'), {
        userId: user.uid,
        title,
        messages: initialMessages,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      return docRef.id;
    } catch (err) {
      console.error('Error creating chat session:', err);
      throw err;
    }
  };

  const updateChatSessionMessages = async (sessionId: string, messages: Message[], newTitle?: string) => {
    try {
      const fields: any = {
        messages,
        updatedAt: serverTimestamp()
      };
      if (newTitle) {
        fields.title = newTitle;
      }
      await updateDoc(doc(db, 'chatSessions', sessionId), fields);
    } catch (err) {
      console.error('Error updating chat session messages:', err);
      throw err;
    }
  };

  const deleteChatSession = async (sessionId: string) => {
    try {
      await deleteDoc(doc(db, 'chatSessions', sessionId));
    } catch (err) {
      console.error('Error deleting chat session:', err);
      throw err;
    }
  };

  return { chatSessions, loading, error, createChatSession, updateChatSessionMessages, deleteChatSession };
}
