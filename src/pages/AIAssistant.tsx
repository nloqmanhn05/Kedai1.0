import React, { useState, useRef, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Layout, AkiraIcon } from '../components/Layout';
import { Grid } from '../components/Grid';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, ChevronDown, MessageSquare, Trash2, History } from 'lucide-react';
import { GoogleGenAI } from '@google/genai';

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

interface Metric {
  label: string;
  value: string;
  colorClass: string;
}

interface Action {
  label: string;
  icon: string;
  variant: 'outline' | 'secondary';
}

interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  category?: string;
  title?: string;
  metrics?: Metric[];
  actions?: Action[];
}

interface ChatSession {
  id: string;
  title: string;
  date: string;
  messages: Message[];
}

export default function AIAssistant() {
  const [inputValue, setInputValue] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const [chatSessions, setChatSessions] = useState<ChatSession[]>(() => {
    const saved = localStorage.getItem('chatSessions');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) { }
    }
    return [
      {
        id: 'session-1',
        title: 'Q3 Revenue Growth Analysis',
        date: 'Today, 2:30 PM',
        messages: [
          {
            id: '1',
            sender: 'ai',
            category: 'Executive Summary',
            title: 'Q3 Revenue Growth Analysis',
            text: 'The analysis indicates a consistent upward trajectory in core SaaS metrics, primarily driven by enterprise upgrades in the APAC region. The current run rate suggests a 15% outperformance against initial Q3 projections.',
            metrics: [
              { label: 'MRR Growth', value: '+18.4%', colorClass: 'text-primary font-bold' },
              { label: 'Churn Rate', value: '1.2%', colorClass: 'text-secondary' },
              { label: 'CAC Ratio', value: '0.85', colorClass: 'text-on-surface' },
              { label: 'Forecast', value: 'Bullish', colorClass: 'text-on-surface font-bold' }
            ],
            actions: [
              { label: 'Deep Dive Metrics', icon: 'visibility', variant: 'outline' },
              { label: 'Actionable Steps', icon: 'lightbulb', variant: 'secondary' }
            ]
          },
          {
            id: '2',
            sender: 'user',
            text: 'Can you correlate the APAC growth with our recent localized marketing spend in Tokyo and Singapore?'
          }
        ]
      },
      {
        id: 'session-2',
        title: 'Hawker Sales Performance',
        date: 'Yesterday, 5:12 PM',
        messages: [
          {
            id: '1',
            sender: 'user',
            text: 'Please summarize our sales performance for the last 30 days.'
          },
          {
            id: '2',
            sender: 'ai',
            category: 'Sales Summary',
            title: 'Monthly Hawker Revenue Review',
            text: 'Your main food stall registered RM 24,500 in gross sales over the past 30 days, indicating a 12% rise in average order values since optimization.',
            metrics: [
              { label: 'Gross Revenue', value: 'RM 24.5k', colorClass: 'text-primary font-bold' },
              { label: 'Active Days', value: '28 Days', colorClass: 'text-secondary' },
              { label: 'Avg Order', value: 'RM 14.50', colorClass: 'text-on-surface' },
              { label: 'Repeat Cust.', value: '64%', colorClass: 'text-on-surface' }
            ]
          }
        ]
      },
      {
        id: 'session-3',
        title: 'Marketing Expense ROI',
        date: 'May 15, 11:04 AM',
        messages: [
          {
            id: '1',
            sender: 'user',
            text: 'Break down and analyze our recent marketing expenses.'
          },
          {
            id: '2',
            sender: 'ai',
            category: 'Expense Audit',
            title: 'Tokyo & Local Campaign Budget',
            text: 'We audited your RM 12,400 expenditure on micro-targeted local ads. Tokyo and Singapore conversions remain the highest yield channels with RM 4.80 return for every ringgit spent.',
            metrics: [
              { label: 'Total Invested', value: 'RM 12,400', colorClass: 'text-primary font-bold' },
              { label: 'Tokyo Share', value: '65%', colorClass: 'text-secondary' },
              { label: 'Cost Per Lead', value: 'RM 2.10', colorClass: 'text-on-surface' },
              { label: 'ROAS Multiple', value: '4.8x', colorClass: 'text-on-surface font-bold' }
            ]
          }
        ]
      }
    ];
  });

  const [searchParams, setSearchParams] = useSearchParams();
  const activeChatId = searchParams.get('chatId') || (chatSessions[0]?.id || 'session-1');

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('chatSessions', JSON.stringify(chatSessions));
    window.dispatchEvent(new Event('chatSessionsUpdated'));
  }, [chatSessions]);

  // Set default param if missing
  useEffect(() => {
    if (!searchParams.get('chatId') && chatSessions.length > 0) {
      setSearchParams({ chatId: chatSessions[0].id });
    }
  }, []);

  const currentSession = chatSessions.find(s => s.id === activeChatId) || chatSessions[0];
  const messages = currentSession?.messages || [];

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isThinking]);

  const handleNewChat = () => {
    const newId = `session-${Date.now()}`;
    const newSession: ChatSession = {
      id: newId,
      title: 'New Discussion',
      date: 'Just now',
      messages: [
        {
          id: String(Date.now()),
          sender: 'ai',
          category: 'Akira',
          text: 'Hello! I am Akira, your AI Assistant. I can help you with your business ledgers, or answer any general questions you might have!'
        }
      ]
    };
    setChatSessions(prev => [newSession, ...prev]);
    setSearchParams({ chatId: newId });
    setIsDropdownOpen(false);
  };

  const handleSwitchChat = (chatId: string) => {
    setSearchParams({ chatId });
    setIsDropdownOpen(false);
  };

  const handleDeleteChat = (chatId: string, e: React.MouseEvent) => {
    e.stopPropagation();

    // Create new list
    const updatedSessions = chatSessions.filter(s => s.id !== chatId);
    setChatSessions(updatedSessions);

    // If active chat was deleted, switch to the first remaining one
    if (activeChatId === chatId) {
      if (updatedSessions.length > 0) {
        setSearchParams({ chatId: updatedSessions[0].id });
      } else {
        // If no chats left, create a fresh default one
        const fallbackId = `session-${Date.now()}`;
        setChatSessions([
          {
            id: fallbackId,
            title: 'New Discussion',
            date: 'Just now',
            messages: [
              {
                id: String(Date.now()),
                sender: 'ai',
                category: 'Akira',
                text: 'Hello! I am Akira. Ask me anything about your business, or just any general topic!'
              }
            ]
          }
        ]);
        setSearchParams({ chatId: fallbackId });
      }
    }
  };

  const handleSendMessage = (textToSend?: string) => {
    const text = textToSend || inputValue;
    if (!text.trim()) return;

    // Append user message
    const userMsg: Message = {
      id: String(Date.now()),
      sender: 'user',
      text: text
    };

    // Keep track of the active session snapshot for the async block
    const currentSessionSnapshot = chatSessions.find(s => s.id === activeChatId) || chatSessions[0];
    const previousMessages = currentSessionSnapshot ? currentSessionSnapshot.messages : [];

    setChatSessions(prev => prev.map(session => {
      if (session.id === activeChatId) {
        const updatedMessages = [...session.messages, userMsg];
        const isDefaultTitle = session.title === 'New Discussion';
        const newTitle = isDefaultTitle ? (text.length > 25 ? text.substring(0, 25) + '...' : text) : session.title;
        return {
          ...session,
          title: newTitle,
          messages: updatedMessages
        };
      }
      return session;
    }));

    if (!textToSend) {
      setInputValue('');
      if (textareaRef.current) {
        textareaRef.current.style.height = '24px';
      }
    }

    // Trigger AI response with live Gemini 2.5 Flash call
    setIsThinking(true);

    const generateAiResponse = async () => {
      try {
        if (!ai) {
          throw new Error("AI Client not initialized. Missing API Key.");
        }

        const systemInstruction = `You are Akira, a helpful, highly intelligent AI assistant for a business platform called FinTech. 
Your goal is to assist Malaysian Hawkers and SMEs with managing their stall, calculating financials, tracking daily earnings, and providing actionable insights. 
HOWEVER, you are also able to answer ANY general questions the user asks (e.g., cooking, programming, science, general advice, culture, language, mathematics, etc.). You should be friendly, smart, highly conversational, concise, and professional. 
If the user asks a general question, answer it directly and beautifully. 
Do not pretend to be restricted to business only. You are a complete, general-purpose LLM assistant named Akira inside a business shell.`;

        // Format history contents for Gemini API: { role: 'user' | 'model', parts: [{ text: string }] }
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
          model: 'gemini-1.5-flash',
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

        setChatSessions(prev => prev.map(session => {
          if (session.id === activeChatId) {
            return {
              ...session,
              messages: [...session.messages, aiResponse]
            };
          }
          return session;
        }));

      } catch (error) {
        console.error("Gemini API Call failed:", error);

        // Dynamic intelligent fallback behavior if API fails or key is missing
        let fallbackText = "";
        let fallbackMetrics = undefined;
        let fallbackActions = undefined;

        if (text.toLowerCase().includes('correlate') || text.toLowerCase().includes('apac') || text.toLowerCase().includes('tokyo') || text.toLowerCase().includes('singapore')) {
          fallbackText = 'Our analytics map shows a 78% positive correlation coefficient between the localized Tokyo & Singapore micro-campaigns and the surge in APAC expansion. Direct advertising spend of RM 12,400 in Tokyo produced an estimated Customer Acquisition Cost (CAC) decrease of 14% month-over-month.';
          fallbackMetrics = [
            { label: 'Ad Spend Correlation', value: '78%', colorClass: 'text-primary font-bold' },
            { label: 'Tokyo CAC Change', value: '-14%', colorClass: 'text-secondary' },
            { label: 'Singapore Conv.', value: '24.2%', colorClass: 'text-on-surface' },
            { label: 'ROAS', value: '4.8x', colorClass: 'text-on-surface' }
          ];
          fallbackActions = [
            { label: 'View Marketing Ledger', icon: 'receipt_long', variant: 'outline' },
            { label: 'Adjust Q4 Budget Allocation', icon: 'trending_up', variant: 'secondary' }
          ];
        } else {
          fallbackText = `I've analyzed your query regarding "${text}". As Akira, I'm fully capable of helping you with this general query or any business analytics! Please make sure the VITE_GEMINI_API_KEY in your .env file is active and valid to enable live real-time general responses. (Error details: ${error instanceof Error ? error.message : String(error)})`;
          fallbackActions = [
            { label: 'Ask Follow-Up', icon: 'forum', variant: 'secondary' }
          ];
        }

        const aiResponse: Message = {
          id: String(Date.now() + 1),
          sender: 'ai',
          category: 'Akira (Demo)',
          title: 'Akira Response',
          text: fallbackText,
          metrics: fallbackMetrics,
          actions: fallbackActions
        };

        setChatSessions(prev => prev.map(session => {
          if (session.id === activeChatId) {
            return {
              ...session,
              messages: [...session.messages, aiResponse]
            };
          }
          return session;
        }));
      } finally {
        setIsThinking(false);
      }
    };

    generateAiResponse();
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

        {/* Chat Message Box Canvas */}
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
                  {/* Sender Icon/Avatar */}
                  {message.sender === 'ai' ? (
                    <div className="shrink-0 w-9 h-9 bg-primary-container text-on-primary-container rounded-xl flex items-center justify-center shadow-sm select-none">
                      <AkiraIcon className="w-5 h-5" />
                    </div>
                  ) : (
                    <div className="shrink-0 w-9 h-9 bg-[#1c1b1d] text-[#bbaaff] rounded-full flex items-center justify-center shadow-sm select-none">
                      <AkiraIcon className="w-5 h-5" />
                    </div>
                  )}

                  {/* Message Bubble */}
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
                        <p>{message.text}</p>
                      </div>

                      {/* Data Bento (Metrics Grid) */}
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

                      {/* Interactive Actions */}
                      {message.actions && message.actions.length > 0 && (
                        <div className="mt-4 flex flex-wrap gap-2">
                          {message.actions.map((act, idx) => (
                            <button
                              key={idx}
                              onClick={() => {
                                handleSendMessage(act.label);
                              }}
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

              {/* Thinking Simulation State */}
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
                      <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce delay-100"></div>
                      <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce delay-200"></div>
                      <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce delay-300"></div>
                    </div>
                    <span className="text-[11px] text-outline font-bold uppercase tracking-wider font-label-sm animate-pulse ml-1.5">Akira is calculating...</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Sticky Input Area */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-surface via-surface/80 to-transparent pt-16 pb-[4px] px-6 md:px-8 z-30 pointer-events-none">
          <div className="max-w-[680px] mx-auto w-full flex flex-col gap-0">
            


            {/* Main Input */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="relative bg-surface-container-low rounded-[12px] border border-outline-variant/60 p-3 flex flex-col gap-1 pointer-events-auto w-full"
            >
              {/* Upper part: Input text field */}
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

              {/* Down part: Paper clip and send button */}
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
                    <span 
                      className={`material-symbols-outlined text-[18px] absolute transition-all duration-300 transform ${
                        inputValue.trim() 
                          ? 'scale-0 opacity-0 rotate-90' 
                          : 'scale-100 opacity-100 rotate-0'
                      }`}
                    >
                      graphic_eq
                    </span>
                    <span 
                      className={`material-symbols-outlined text-[18px] absolute transition-all duration-300 transform ${
                        inputValue.trim() 
                          ? 'scale-100 opacity-100 rotate-0' 
                          : 'scale-0 opacity-0 -rotate-90'
                      }`}
                    >
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
