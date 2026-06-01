import React, { useState, useRef, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Layout, AkiraIcon } from '../components/Layout';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus } from 'lucide-react';
import { GoogleGenAI } from '@google/genai';
import ReactMarkdown from 'react-markdown';
import { useAuth } from '../contexts/AuthContext';
import { useTransactionsFirestore } from '../hooks/useTransactionsFirestore';
import { useStockFirestore } from '../hooks/useStockFirestore';

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

import { useChatSessionsFirestore, Message, Metric, Action, ChatSession } from '../hooks/useChatSessionsFirestore';

export default function AIAssistant() {
  const [inputValue, setInputValue] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Get real app data
  const { user } = useAuth();
  const { transactions = [] } = useTransactionsFirestore();
  const { stockList = [] } = useStockFirestore();

  // Chat sessions from Firestore
  const { chatSessions, loading: sessionsLoading, createChatSession, updateChatSessionMessages } = useChatSessionsFirestore();

  const activeChatId = searchParams.get('chatId') || (chatSessions[0]?.id || '');

  useEffect(() => {
    if (!searchParams.get('chatId') && chatSessions.length > 0) {
      setSearchParams({ chatId: chatSessions[0].id });
    }
  }, [chatSessions, searchParams, setSearchParams]);

  const currentSession = chatSessions.find(s => s.id === activeChatId) || chatSessions[0];
  const messages = currentSession?.messages || [];

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isThinking]);

  const handleNewChat = async () => {
    const initialMessages: Message[] = [
      {
        id: String(Date.now()),
        sender: 'ai',
        category: 'Akira',
        text: 'Hello! I am Akira, your AI Assistant. I can help you with your business ledgers, or answer any general questions you might have!'
      }
    ];
    try {
      const newId = await createChatSession('New Discussion', initialMessages);
      setSearchParams({ chatId: newId });
    } catch (err) {
      console.error('Error creating new chat session:', err);
    }
  };

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputValue;
    if (!text.trim()) return;

    const userMsg: Message = {
      id: String(Date.now()),
      sender: 'user',
      text: text
    };

    const targetedSessionId = activeChatId;
    if (!targetedSessionId) return;

    const currentSessionSnapshot = chatSessions.find(s => s.id === targetedSessionId);
    const previousMessages = currentSessionSnapshot ? currentSessionSnapshot.messages : [];

    const isDefaultTitle = currentSessionSnapshot?.title === 'New Discussion';
    const newTitle = isDefaultTitle ? (text.length > 25 ? text.substring(0, 25) + '...' : text) : undefined;
    
    const updatedMessagesWithUser = [...previousMessages, userMsg];

    if (!textToSend) {
      setInputValue('');
      if (textareaRef.current) {
        textareaRef.current.style.height = '32px';
      }
    }

    setIsThinking(true);

    try {
      // 1. Save user's message to Firestore
      await updateChatSessionMessages(targetedSessionId, updatedMessagesWithUser, newTitle);

      // 2. Generate AI response
      if (!ai) {
        throw new Error("AI Client not initialized. Missing API Key.");
      }

      // Get today's date in user's local timezone, formatted same as transaction dates
      const today = new Date();
      const todayDateStr = today.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

      const systemInstruction = `You are Akira, a highly intelligent AI assistant for FinTech, a business platform for Malaysian Hawkers and SMEs.

USER CONTEXT:
- Business Owner: ${user?.displayName || 'Hawker'}
- Email: ${user?.email || 'Not available'}
- Current Date: ${todayDateStr} (THIS IS TODAY - use this as reference for "today", "this week", etc.)
- Active Transactions: ${transactions?.length || 0}
- Stock Items Tracked: ${stockList?.length || 0}

RECENT BUSINESS DATA:
${transactions && transactions.length > 0 ? `Last 10 Transactions:\n${JSON.stringify(transactions.slice(-10), null, 2)}` : 'No transaction data available'}

${stockList && stockList.length > 0 ? `Stock Inventory:\n${JSON.stringify(stockList.slice(0, 5), null, 2)}` : 'No stock data available'}

YOUR ROLE:
- Help manage stalls, calculate financials, track daily earnings, and provide actionable insights
- Answer ANY general questions (cooking, programming, science, advice, culture, language, mathematics, etc.)
- Be friendly, intelligent, conversational, concise, and professional
- When asked about business metrics, reference the actual data above using the Current Date as reference
- When filtering transactions for "today", only include transactions with date matching "${todayDateStr}"
- Provide specific recommendations based on their actual transaction and stock data`;

      const contents = [
        ...previousMessages.map(msg => ({
          role: msg.sender === 'user' ? 'user' : 'model',
          parts: [{ text: msg.text }]
        })),
        {
          role: 'user',
          parts: [{ text: text }]
        }
      ];

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: contents,
        config: {
          systemInstruction: systemInstruction,
        }
      });

      const replyText = response.text || "Sorry, I could not process your query.";

      const aiResponse: Message = {
        id: String(Date.now() + 1),
        sender: 'ai',
        category: 'Akira Assistant',
        title: 'Akira Response',
        text: replyText
      };

      // 3. Save AI's response to Firestore
      await updateChatSessionMessages(targetedSessionId, [...updatedMessagesWithUser, aiResponse]);

    } catch (error) {
      console.error("Gemini API Call failed:", error);

      let fallbackText = "";
      let fallbackMetrics = undefined;
      let fallbackActions = undefined;

      if (text.toLowerCase().match(/(correlate|apac|tokyo|singapore)/)) {
        fallbackText = 'Our analytics map shows a **78% positive correlation coefficient** between the localized Tokyo & Singapore micro-campaigns and the surge in APAC expansion. Direct advertising spend of *RM 12,400* in Tokyo produced an estimated Customer Acquisition Cost (CAC) decrease of **14%** month-over-month.';
        fallbackMetrics = [
          { label: 'Ad Spend Correlation', value: '78%', colorClass: 'text-primary font-bold' },
          { label: 'Tokyo CAC Change', value: '-14%', colorClass: 'text-secondary' },
          { label: 'Singapore Conv.', value: '24.2%', colorClass: 'text-on-surface' },
          { label: 'ROAS', value: '4.8x', colorClass: 'text-on-surface' }
        ];
        fallbackActions = [
          { label: 'View Marketing Ledger', icon: 'receipt_long', variant: 'outline' as const },
          { label: 'Adjust Q4 Budget Allocation', icon: 'trending_up', variant: 'secondary' as const }
        ];
      } else {
        fallbackText = `I've analyzed your query regarding "${text}". Please check that your \`VITE_GEMINI_API_KEY\` setup inside your environment configurations file is passing active tokens.\n\n*(Error Context Trace: ${error instanceof Error ? error.message : String(error)})*`;
        fallbackActions = [
          { label: 'Ask Follow-Up', icon: 'forum', variant: 'secondary' as const }
        ];
      }

      const aiResponse: Message = {
        id: String(Date.now() + 1),
        sender: 'ai',
        category: 'Akira (Demo Mode)',
        title: 'System Fallback Response',
        text: fallbackText,
        metrics: fallbackMetrics,
        actions: fallbackActions
      };

      // 3. Save AI's fallback response to Firestore
      await updateChatSessionMessages(targetedSessionId, [...updatedMessagesWithUser, aiResponse]);
    } finally {
      setIsThinking(false);
    }
  };

  return (
    <Layout
      title="Akira"
      noPadding
      headerActions={
        <button
          onClick={handleNewChat}
          className="bg-primary text-on-primary text-xs font-bold px-4.5 py-2 rounded-full hover:bg-primary/95 transition-all shadow-sm flex items-center gap-1.5 cursor-pointer active:scale-95 duration-100"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Chat</span>
        </button>
      }
    >
      <div className="flex-1 flex flex-col h-full min-h-0 bg-surface overflow-hidden relative">
        <div className="flex-1 overflow-y-auto px-4 md:px-5 py-5 pb-40">
          <div className="max-w-5xl w-full mx-auto flex flex-col gap-6 text-left">
            <AnimatePresence initial={false}>
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className={`flex gap-4 items-start ${message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
                >
                  <div className={`shrink-0 w-9 h-9 rounded-xl flex items-center justify-center shadow-sm select-none ${message.sender === 'ai' ? 'bg-primary-container text-on-primary-container' : 'bg-[#1c1b1d] text-[#bbaaff]'
                    }`}>
                    <AkiraIcon className="w-5 h-5" />
                  </div>

                  {message.sender === 'ai' ? (
                    <div className="max-w-3xl bg-surface-container-lowest p-4 md:p-5 rounded-2xl border border-outline-variant/40 shadow-sm hover:shadow-md transition-shadow">
                      {message.category && (
                        <div className="mb-2">
                          <span className="text-[10px] font-bold text-primary uppercase tracking-wider font-label-sm">{message.category}</span>
                          {message.title && (
                            <h3 className="text-base font-semibold mt-0.5 text-on-surface leading-tight font-title-lg">{message.title}</h3>
                          )}
                        </div>
                      )}

                      <div className="prose max-w-none text-[13.5px] text-on-surface-variant leading-relaxed">
                        <ReactMarkdown>{message.text}</ReactMarkdown>
                      </div>

                      {message.metrics && message.metrics.length > 0 && (
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
                          {message.metrics.map((metric, idx) => (
                            <div key={idx} className="bg-surface-container-low p-3 rounded-xl border border-outline-variant/30 hover:border-outline-variant transition-colors">
                              <p className="text-[10px] font-bold text-on-surface-variant/80 font-label-sm mb-0.5">{metric.label}</p>
                              <p className={`text-base font-bold font-data ${metric.colorClass}`}>{metric.value}</p>
                            </div>
                          ))}
                        </div>
                      )}

                      {message.actions && message.actions.length > 0 && (
                        <div className="mt-4 flex flex-wrap gap-2">
                          {message.actions.map((act, idx) => (
                            <button
                              key={idx}
                              onClick={() => handleSendMessage(act.label)}
                              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl font-label-lg text-xs font-bold transition-all active:scale-95 duration-100 cursor-pointer ${act.variant === 'outline'
                                  ? 'border border-outline-variant text-on-surface-variant hover:bg-surface-container'
                                  : 'bg-secondary-container text-on-secondary-container hover:bg-secondary-container/80 shadow-sm'
                                }`}
                            >
                              <span className="material-symbols-outlined text-[16px]">{act.icon}</span>
                              <span>{act.label}</span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="bg-surface-container-high px-4.5 py-2.5 rounded-2xl rounded-tr-sm max-w-xl text-[13.5px] text-on-surface shadow-sm">
                      {message.text}
                    </div>
                  )}
                </motion.div>
              ))}

              {isThinking && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="flex gap-4 items-start"
                >
                  <div className="shrink-0 w-9 h-9 bg-primary-container text-on-primary-container rounded-xl flex items-center justify-center shadow-sm select-none animate-pulse">
                    <AkiraIcon className="w-5 h-5" />
                  </div>
                  <div className="bg-surface-container-lowest p-4 md:p-5 rounded-2xl border border-outline-variant/40 shadow-sm max-w-xs flex items-center gap-2">
                    <div className="flex gap-1 items-center">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                      <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                      <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce"></div>
                    </div>
                    <span className="text-[11px] text-outline font-bold uppercase tracking-wider font-label-sm animate-pulse ml-1.5">Akira is calculating...</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div ref={messagesEndRef} />
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-surface via-surface/80 to-transparent pt-16 pb-[4px] px-6 md:px-8 z-30 pointer-events-none">
          <div className="max-w-[680px] mx-auto w-full flex flex-col gap-0">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="relative bg-surface-container-low rounded-[12px] border border-outline-variant/60 p-3 flex flex-col gap-1 pointer-events-auto w-full"
            >
              <div className="w-full">
                <textarea
                  ref={textareaRef}
                  rows={1}
                  className="w-full bg-transparent border-none outline-none focus:ring-0 text-[15px] text-on-surface placeholder:text-on-surface-variant/60 px-1 py-0 resize-none min-h-[32px] max-h-[148px] overflow-y-auto"
                  placeholder="Ask follow-up or type a command..."
                  value={inputValue}
                  onChange={(e) => {
                    setInputValue(e.target.value);
                    e.target.style.height = '32px';
                    e.target.style.height = `${Math.min(e.target.scrollHeight, 148)}px`;
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      if (inputValue.trim()) {
                        handleSendMessage();
                      }
                    }
                  }}
                />
              </div>

              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => alert('Attachments features require subscription plan upgrade.')}
                  className="w-8 h-8 flex items-center justify-center text-on-surface-variant/80 hover:bg-surface-variant/40 rounded-full transition-colors cursor-pointer shrink-0"
                >
                  <span className="material-symbols-outlined text-[20px]">add</span>
                </button>

                <button
                  type="submit"
                  disabled={!inputValue.trim()}
                  className="w-8 h-8 flex items-center justify-center bg-primary text-on-primary rounded-full hover:bg-primary-container hover:text-on-primary-container disabled:opacity-40 transition-colors shadow-sm cursor-pointer active:scale-95 duration-100 shrink-0"
                >
                  <div className="relative w-5 h-5 flex items-center justify-center">
                    <span className={`material-symbols-outlined text-[18px] absolute transition-all duration-300 transform ${inputValue.trim() ? 'scale-0 opacity-0 rotate-90' : 'scale-100 opacity-100 rotate-0'
                      }`}>
                      graphic_eq
                    </span>
                    <span className={`material-symbols-outlined text-[18px] absolute transition-all duration-300 transform ${inputValue.trim() ? 'scale-100 opacity-100 rotate-0' : 'scale-0 opacity-0 -rotate-90'
                      }`}>
                      arrow_upward
                    </span>
                  </div>
                </button>
              </div>
            </form>

            <div className="text-center mt-[4px] select-none pointer-events-auto">
              <span className="text-[10px] font-bold text-on-surface-variant/60 uppercase tracking-wide">Akira can make mistakes. Please double check responses</span>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}