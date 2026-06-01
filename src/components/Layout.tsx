import * as React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Bot,
  Settings as SettingsIcon,
  ReceiptText,
  ChevronsUpDown,
  LogOut,
  Bell,
  HelpCircle,
  User,
  PanelLeftClose,
  PanelLeftOpen
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useChatSessionsFirestore, ChatSession } from '../hooks/useChatSessionsFirestore';

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
  headerActions?: React.ReactNode;
  noPadding?: boolean;
}

export const AkiraIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    className={className}
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M7 2h10c1.105 0 2 .895 2 2v1h1c1.105 0 2 .895 2 2v8c0 1.105-.895 2-2 2h-1v1c0 1.105-.895 2-2 2h-5.586l-3.707 3.707A1 1 0 016 23v-4H5c-1.105 0-2-.895-2-2V7c0-1.105.895-2 2-2h1V4c0-1.105.895-2 2-2zm-1 4h12v10h-5.586L9 19.414V16H6V6z"
    />
    <rect x="8.5" y="9.5" width="2.2" height="2.2" rx="0.4" />
    <rect x="13.3" y="9.5" width="2.2" height="2.2" rx="0.4" />
  </svg>
);

export const AppIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    className={className}
    fill="none"
    stroke="currentColor"
    strokeLinecap="butt"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g transform="translate(12, 12) rotate(15)">
      <line x1="0" y1="-11" x2="0" y2="11" strokeWidth="3.5" />
      <line x1="-9" y1="0" x2="9" y2="0" strokeWidth="2.5" />
      <line x1="-6.5" y1="-6.5" x2="6.5" y2="6.5" strokeWidth="2.5" />
      <line x1="7" y1="-7" x2="-7" y2="7" strokeWidth="2.5" />
    </g>
  </svg>
);

const ReportIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    className={className}
    fill="none"
    stroke="currentColor"
    strokeWidth="2.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Top Filled Rhombus */}
    <path
      d="M12 3.5 L20.5 7.75 L12 12 L3.5 7.75 Z"
      fill="currentColor"
    />
    {/* Middle Layer V-Curve */}
    <path d="M3.5 12.25 L12 16.5 L20.5 12.25" />
    {/* Bottom Layer V-Curve */}
    <path d="M3.5 16.75 L12 21 L20.5 16.75" />
  </svg>
);

export function Layout({ children, title, headerActions, noPadding }: LayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const userRole = localStorage.getItem('userRole') || 'admin';
  const { user, logout } = useAuth();

  // Persistent sidebar fold state
  const [isSidebarFolded, setIsSidebarFolded] = React.useState(() => {
    return localStorage.getItem('sidebarFolded') === 'true';
  });

  const toggleSidebarFold = () => {
    setIsSidebarFolded(prev => {
      const newState = !prev;
      localStorage.setItem('sidebarFolded', String(newState));
      return newState;
    });
  };

  // State to manage collapsible dropdowns
  const [openMenus, setOpenMenus] = React.useState<Record<string, boolean>>({
    operations: true,
    administration: true,
    pos: true,
    settings: true,
    assistant: true,
  });

  const toggleMenu = (menuKey: string) => {
    setOpenMenus(prev => ({ ...prev, [menuKey]: !prev[menuKey] }));
  };

  const handleCollapsibleClick = (menuKey: string) => {
    if (isSidebarFolded) {
      setIsSidebarFolded(false);
      setOpenMenus(prev => ({ ...prev, [menuKey]: true }));
    } else {
      toggleMenu(menuKey);
    }
  };

  // Fetch chat sessions in real-time from Cloud Firestore
  const { chatSessions, deleteChatSession, createChatSession } = useChatSessionsFirestore();

  const handleNewChat = async () => {
    try {
      const initialMessages = [
        {
          id: String(Date.now()),
          sender: 'ai' as const,
          category: 'Akira',
          text: 'Hello! I am Akira, your AI Assistant. I can help you with your business ledgers, or answer any general questions you might have!'
        }
      ];
      const newId = await createChatSession('New Discussion', initialMessages);
      navigate(`/assistant?chatId=${newId}`);
    } catch (e) {
      console.error("Failed to create new chat session:", e);
    }
  };

  const handleDeleteSession = async (sessionId: string) => {
    try {
      await deleteChatSession(sessionId);

      // If the deleted session was the current active one, redirect
      const currentParams = new URLSearchParams(location.search);
      const activeId = currentParams.get('chatId');
      if (activeId === sessionId) {
        const remaining = chatSessions.filter(s => s.id !== sessionId);
        if (remaining.length > 0) {
          navigate(`/assistant?chatId=${remaining[0].id}`);
        } else {
          navigate(`/assistant`);
        }
      }
    } catch (e) {
      console.error("Failed to delete chat session from Firestore:", e);
    }
  };

  return (
    <React.Fragment>
      {/* 1. Mobile Viewport Check (Shows desktop-only message below 1024px) */}
      <div className="flex min-[1024px]:hidden fixed inset-0 z-[9999] bg-background flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 rounded-2xl bg-primary-container text-on-primary-container flex items-center justify-center mb-6 shadow-md animate-pulse">
          <span className="material-symbols-outlined text-[36px] filled">devices</span>
        </div>
        <h1 className="text-xl font-bold text-on-surface mb-2">Desktop Viewport Required</h1>
        <p className="text-sm text-on-surface-variant max-w-xs leading-relaxed">
          This application is optimized for large desktop viewports. Please resize your window or switch to a device with a screen width of 1024px or wider.
        </p>
      </div>

      {/* 2. Main Layout (Hidden below 1024px) */}
      <div className="hidden min-[1024px]:flex h-screen bg-background overflow-hidden font-sans text-on-surface">

        {/* Purple & White Sidebar - Styled in original theme colors with premium collapsing/folding layout */}
        <nav className={`${isSidebarFolded ? 'w-16' : 'w-[260px]'} fixed left-0 top-0 h-screen flex flex-col bg-surface-container-low border-r border-outline-variant/30 rounded-e-2xl shadow-sm z-50 shrink-0 text-on-surface select-none transition-all duration-300`}>

          {/* Header (Company / Workspace Selector) */}
          <div className="h-14 flex items-center px-3 border-b border-outline-variant/30 shrink-0">
            {isSidebarFolded ? (
              <div className="flex justify-center w-full">
                <button
                  onClick={toggleSidebarFold}
                  className="w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center shadow-sm hover:bg-primary-container transition-all duration-300 relative group overflow-hidden focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 cursor-pointer"
                  title="Expand Sidebar"
                >
                  <div className="relative w-5 h-5">
                    <AppIcon className="w-5 h-5 absolute inset-0 text-white transition-all duration-300 transform group-hover:scale-0 group-hover:opacity-0 group-hover:rotate-90" />
                    <PanelLeftOpen className="w-5 h-5 absolute inset-0 text-white transition-all duration-300 transform scale-0 opacity-0 -rotate-90 group-hover:scale-100 group-hover:opacity-100 group-hover:rotate-0" />
                  </div>
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-between w-full p-0.5 rounded-lg hover:bg-surface-container-high/60 transition-all duration-200 group">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-primary text-white flex items-center justify-center shadow-sm shrink-0">
                    <AppIcon className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="text-[13px] font-bold font-mono text-primary tracking-tight leading-tight">FinTech</span>
                    <span className="text-[9.5px] text-on-surface-variant font-medium mt-0.5 tracking-wider">KitaUntukKita</span>
                  </div>
                </div>
                <button
                  onClick={toggleSidebarFold}
                  className="w-7 h-7 rounded-md flex items-center justify-center border border-outline-variant/30 text-on-surface-variant hover:text-primary hover:border-primary hover:bg-primary/5 transition-all duration-200 group/btn shrink-0 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary active:bg-primary/10 active:border-primary cursor-pointer"
                  title="Collapse Sidebar"
                >
                  <PanelLeftClose className="w-3.5 h-3.5 transition-transform group-hover/btn:-translate-x-0.5" />
                </button>
              </div>
            )}
          </div>

          {/* Navigation Links and Categories */}
          <div className={`flex-1 overflow-y-auto ${isSidebarFolded ? 'px-0 py-3 flex flex-col items-center gap-3.5' : 'px-2 py-1.5 space-y-1.5'}`}>

            {/* Category: Platform */}
            <div className={isSidebarFolded ? 'w-full flex flex-col items-center gap-3.5' : ''}>
              {!isSidebarFolded && (
                <div className="px-3 mb-1 text-left">
                  <span className="text-[9.5px] font-bold text-primary uppercase tracking-wider block">
                    Platform
                  </span>
                </div>
              )}

              <div className={isSidebarFolded ? 'w-full flex flex-col items-center gap-3.5' : 'space-y-1'}>
                {/* General Dashboard link */}
                {isSidebarFolded ? (
                  <Link
                    to="/dashboard"
                    className="flex flex-col items-center justify-center w-full h-[52px] group focus:outline-none"
                    title="Dashboard"
                  >
                    <div className={`w-14 h-8 rounded-full flex items-center justify-center transition-all duration-200 ${location.pathname === '/dashboard' ? 'bg-primary/10 text-primary font-bold' : 'text-on-surface-variant hover:bg-surface-container-high/50 hover:text-primary'}`}>
                      <span className={`material-symbols-outlined text-[22px] leading-none transition-all duration-200 ${location.pathname === '/dashboard' ? 'filled text-primary' : 'text-on-surface-variant'}`}>space_dashboard</span>
                    </div>
                    <span className={`text-[10px] font-bold mt-1 tracking-tight leading-none text-center transition-all duration-200 ${location.pathname === '/dashboard' ? 'text-primary' : 'text-on-surface-variant group-hover:text-primary'}`}>Dashboard</span>
                  </Link>
                ) : (
                  <Link
                    to="/dashboard"
                    className={`flex items-center gap-4 px-4 h-12 rounded-full text-[14px] font-medium transition-all duration-200 ${location.pathname === '/dashboard'
                      ? 'bg-active-indicator text-primary scale-95 font-bold'
                      : 'text-on-surface-variant hover:bg-surface-container-high/60 hover:text-primary'
                      }`}
                  >
                    <div className="w-6 h-6 flex items-center justify-center shrink-0">
                      <span className={`material-symbols-outlined text-[22px] leading-none transition-all duration-200 ${location.pathname === '/dashboard' ? 'filled text-primary font-bold' : 'text-on-surface-variant font-normal'}`}>space_dashboard</span>
                    </div>
                    <span className="animate-fadeIn">Dashboard</span>
                  </Link>
                )}

                {/* Render menus based on userRole */}
                {userRole === 'admin' ? (
                  <React.Fragment>
                    {/* Report */}
                    {isSidebarFolded ? (
                      <Link
                        to="/ledger"
                        className="flex flex-col items-center justify-center w-full h-[52px] group focus:outline-none"
                        title="Report"
                      >
                        <div className={`w-14 h-8 rounded-full flex items-center justify-center transition-all duration-200 ${location.pathname === '/ledger' ? 'bg-primary/10 text-primary font-bold' : 'text-on-surface-variant hover:bg-surface-container-high/50 hover:text-primary'}`}>
                          <ReportIcon className="w-[20px] h-[20px] leading-none" />
                        </div>
                        <span className={`text-[10px] font-bold mt-1 tracking-tight leading-none text-center transition-all duration-200 ${location.pathname === '/ledger' ? 'text-primary' : 'text-on-surface-variant group-hover:text-primary'}`}>Report</span>
                      </Link>
                    ) : (
                      <Link
                        to="/ledger"
                        className={`flex items-center gap-4 px-4 h-12 rounded-full text-[14px] font-medium transition-all duration-200 ${location.pathname === '/ledger'
                          ? 'bg-active-indicator text-primary scale-95 font-bold'
                          : 'text-on-surface-variant hover:bg-surface-container-high/60 hover:text-primary'
                          }`}
                      >
                        <div className="w-6 h-6 flex items-center justify-center shrink-0">
                          <ReportIcon className="w-[20px] h-[20px] leading-none" />
                        </div>
                        <span className="animate-fadeIn">Report</span>
                      </Link>
                    )}

                    {/* MyStaff */}
                    {isSidebarFolded ? (
                      <Link
                        to="/staff"
                        className="flex flex-col items-center justify-center w-full h-[52px] group focus:outline-none"
                        title="MyStaff"
                      >
                        <div className={`w-14 h-8 rounded-full flex items-center justify-center transition-all duration-200 ${location.pathname === '/staff' ? 'bg-primary/10 text-primary font-bold' : 'text-on-surface-variant hover:bg-surface-container-high/50 hover:text-primary'}`}>
                          <span className={`material-symbols-outlined text-[22px] leading-none transition-all duration-200 ${location.pathname === '/staff' ? 'filled text-primary' : 'text-on-surface-variant'}`}>group</span>
                        </div>
                        <span className={`text-[10px] font-bold mt-1 tracking-tight leading-none text-center transition-all duration-200 ${location.pathname === '/staff' ? 'text-primary' : 'text-on-surface-variant group-hover:text-primary'}`}>MyStaff</span>
                      </Link>
                    ) : (
                      <Link
                        to="/staff"
                        className={`flex items-center gap-4 px-4 h-12 rounded-full text-[14px] font-medium transition-all duration-200 ${location.pathname === '/staff'
                          ? 'bg-active-indicator text-primary scale-95 font-bold'
                          : 'text-on-surface-variant hover:bg-surface-container-high/60 hover:text-primary'
                          }`}
                      >
                        <div className="w-6 h-6 flex items-center justify-center shrink-0">
                          <span className={`material-symbols-outlined text-[22px] leading-none transition-all duration-200 ${location.pathname === '/staff' ? 'filled text-primary' : 'text-on-surface-variant'}`}>group</span>
                        </div>
                        <span className="animate-fadeIn">MyStaff</span>
                      </Link>
                    )}

                    {/* Stock */}
                    {isSidebarFolded ? (
                      <Link
                        to="/stock"
                        className="flex flex-col items-center justify-center w-full h-[52px] group focus:outline-none"
                        title="Stock"
                      >
                        <div className={`w-14 h-8 rounded-full flex items-center justify-center transition-all duration-200 ${location.pathname === '/stock' ? 'bg-primary/10 text-primary font-bold' : 'text-on-surface-variant hover:bg-surface-container-high/50 hover:text-primary'}`}>
                          <span className={`material-symbols-outlined text-[22px] leading-none transition-all duration-200 ${location.pathname === '/stock' ? 'filled text-primary' : 'text-on-surface-variant'}`}>inventory_2</span>
                        </div>
                        <span className={`text-[10px] font-bold mt-1 tracking-tight leading-none text-center transition-all duration-200 ${location.pathname === '/stock' ? 'text-primary' : 'text-on-surface-variant group-hover:text-primary'}`}>Stock</span>
                      </Link>
                    ) : (
                      <Link
                        to="/stock"
                        className={`flex items-center gap-4 px-4 h-12 rounded-full text-[14px] font-medium transition-all duration-200 ${location.pathname === '/stock'
                          ? 'bg-active-indicator text-primary scale-95 font-bold'
                          : 'text-on-surface-variant hover:bg-surface-container-high/60 hover:text-primary'
                          }`}
                      >
                        <div className="w-6 h-6 flex items-center justify-center shrink-0">
                          <span className={`material-symbols-outlined text-[22px] leading-none transition-all duration-200 ${location.pathname === '/stock' ? 'filled text-primary' : 'text-on-surface-variant'}`}>inventory_2</span>
                        </div>
                        <span className="animate-fadeIn">Stock</span>
                      </Link>
                    )}

                    {/* Collapsible FinTech */}
                    <div>
                      {isSidebarFolded ? (
                        <button
                          onClick={() => handleCollapsibleClick('assistant')}
                          className="flex flex-col items-center justify-center w-full h-[52px] group focus:outline-none cursor-pointer"
                          title="Akira"
                        >
                          <div className={`w-14 h-8 rounded-full flex items-center justify-center transition-all duration-200 ${location.pathname === '/assistant' ? 'bg-primary/10 text-primary font-bold' : 'text-on-surface-variant hover:bg-surface-container-high/50 hover:text-primary'}`}>
                            <AkiraIcon className="w-[20px] h-[20px] leading-none" />
                          </div>
                          <span className={`text-[10px] font-bold mt-1 tracking-tight leading-none text-center transition-all duration-200 ${location.pathname === '/assistant' ? 'text-primary' : 'text-on-surface-variant group-hover:text-primary'}`}>Akira</span>
                        </button>
                      ) : (
                        <div className="w-full flex items-center justify-between pr-2 group">
                          <button
                            onClick={() => handleCollapsibleClick('assistant')}
                            className="flex-1 flex items-center gap-4 px-4 h-12 rounded-full text-[14px] font-medium text-on-surface-variant hover:bg-surface-container-high/60 hover:text-primary transition-all duration-200 cursor-pointer text-left"
                          >
                            <div className="w-6 h-6 flex items-center justify-center shrink-0">
                              <AkiraIcon className="w-[20px] h-[20px] leading-none" />
                            </div>
                            <span className="animate-fadeIn">Akira</span>
                          </button>
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              handleNewChat();
                            }}
                            className="w-8 h-8 flex items-center justify-center rounded-full text-on-surface-variant hover:text-primary hover:bg-primary/10 transition-all duration-200 cursor-pointer shrink-0"
                            title="New Chat"
                          >
                            <span className="material-symbols-outlined text-[20px]">add</span>
                          </button>
                        </div>
                      )}

                      {!isSidebarFolded && openMenus.assistant && (
                        <div className="ml-4 pl-3.5 border-l border-outline-variant/60 flex flex-col space-y-1 mt-1 mb-1.5 text-left animate-fadeIn">
                          {chatSessions.map((session: ChatSession) => {
                            const isActive = location.pathname === '/assistant' && new URLSearchParams(location.search).get('chatId') === session.id;
                            return (
                              <div
                                key={session.id}
                                className="group flex items-center justify-between w-full pr-2"
                              >
                                <Link
                                  to={`/assistant?chatId=${session.id}`}
                                  className={`text-[12.5px] block py-[3px] transition-colors font-medium truncate flex-1 ${isActive
                                    ? 'text-primary font-bold'
                                    : 'text-on-surface-variant hover:text-primary'
                                    }`}
                                  title={session.title}
                                >
                                  {session.title}
                                </Link>
                                <button
                                  onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    handleDeleteSession(session.id);
                                  }}
                                  className="opacity-0 group-hover:opacity-100 text-on-surface-variant/60 hover:text-error transition-all duration-200 cursor-pointer p-0.5 rounded hover:bg-surface-variant/40 shrink-0"
                                  title="Delete chat"
                                >
                                  <span className="material-symbols-outlined text-[15px]">delete</span>
                                </button>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>

                    {/* Settings */}
                    {isSidebarFolded ? (
                      <Link
                        to="/settings"
                        className="flex flex-col items-center justify-center w-full h-[52px] group focus:outline-none"
                        title="Settings"
                      >
                        <div className={`w-14 h-8 rounded-full flex items-center justify-center transition-all duration-200 ${location.pathname === '/settings' ? 'bg-primary/10 text-primary font-bold' : 'text-on-surface-variant hover:bg-surface-container-high/50 hover:text-primary'}`}>
                          <span className={`material-symbols-outlined text-[22px] leading-none transition-all duration-200 ${location.pathname === '/settings' ? 'filled text-primary' : 'text-on-surface-variant'}`}>settings</span>
                        </div>
                        <span className={`text-[10px] font-bold mt-1 tracking-tight leading-none text-center transition-all duration-200 ${location.pathname === '/settings' ? 'text-primary' : 'text-on-surface-variant group-hover:text-primary'}`}>Settings</span>
                      </Link>
                    ) : (
                      <Link
                        to="/settings"
                        className={`flex items-center gap-4 px-4 h-12 rounded-full text-[14px] font-medium transition-all duration-200 ${location.pathname === '/settings'
                          ? 'bg-active-indicator text-primary scale-95 font-bold'
                          : 'text-on-surface-variant hover:bg-surface-container-high/60 hover:text-primary'
                          }`}
                      >
                        <div className="w-6 h-6 flex items-center justify-center shrink-0">
                          <span className={`material-symbols-outlined text-[22px] leading-none transition-all duration-200 ${location.pathname === '/settings' ? 'filled text-primary' : 'text-on-surface-variant'}`}>settings</span>
                        </div>
                        <span className="animate-fadeIn">Settings</span>
                      </Link>
                    )}
                  </React.Fragment>
                ) : (
                  <React.Fragment>
                    {/* Flat POS Navigation */}
                    {isSidebarFolded ? (
                      <React.Fragment>
                        <Link
                          to="/menu"
                          className="flex flex-col items-center justify-center w-full h-[52px] group focus:outline-none"
                          title="Checkout"
                        >
                          <div className={`w-14 h-8 rounded-full flex items-center justify-center transition-all duration-200 ${location.pathname === '/menu' ? 'bg-primary/10 text-primary font-bold' : 'text-on-surface-variant hover:bg-surface-container-high/50 hover:text-primary'}`}>
                            <span className={`material-symbols-outlined text-[22px] leading-none ${location.pathname === '/menu' ? 'filled text-primary' : ''}`}>storefront</span>
                          </div>
                          <span className={`text-[10px] font-bold mt-1 ${location.pathname === '/menu' ? 'text-primary' : 'text-on-surface-variant'}`}>Checkout</span>
                        </Link>
                        <Link
                          to="/transactions"
                          className="flex flex-col items-center justify-center w-full h-[52px] group focus:outline-none"
                          title="Transactions"
                        >
                          <div className={`w-14 h-8 rounded-full flex items-center justify-center transition-all duration-200 ${location.pathname === '/transactions' ? 'bg-primary/10 text-primary font-bold' : 'text-on-surface-variant hover:bg-surface-container-high/50 hover:text-primary'}`}>
                            <span className={`material-symbols-outlined text-[22px] leading-none ${location.pathname === '/transactions' ? 'filled text-primary' : ''}`}>receipt_long</span>
                          </div>
                          <span className={`text-[10px] font-bold mt-1 ${location.pathname === '/transactions' ? 'text-primary' : 'text-on-surface-variant'}`}>Logs</span>
                        </Link>
                        <Link
                          to="/stock"
                          className="flex flex-col items-center justify-center w-full h-[52px] group focus:outline-none"
                          title="Stock"
                        >
                          <div className={`w-14 h-8 rounded-full flex items-center justify-center transition-all duration-200 ${location.pathname === '/stock' ? 'bg-primary/10 text-primary font-bold' : 'text-on-surface-variant hover:bg-surface-container-high/50 hover:text-primary'}`}>
                            <span className={`material-symbols-outlined text-[22px] leading-none ${location.pathname === '/stock' ? 'filled text-primary' : ''}`}>inventory_2</span>
                          </div>
                          <span className={`text-[10px] font-bold mt-1 ${location.pathname === '/stock' ? 'text-primary' : 'text-on-surface-variant'}`}>Stock</span>
                        </Link>
                      </React.Fragment>
                    ) : (
                      <React.Fragment>
                        <div className="px-3 mt-4 mb-1 text-left">
                          <span className="text-[10px] font-bold text-primary uppercase tracking-wider block">Hawker POS</span>
                        </div>
                        <Link
                          to="/menu"
                          className={`flex items-center gap-4 px-4 h-12 rounded-full text-[14px] font-medium transition-all duration-200 ${location.pathname === '/menu'
                            ? 'bg-active-indicator text-primary scale-95 font-bold'
                            : 'text-on-surface-variant hover:bg-surface-container-high/60 hover:text-primary'
                            }`}
                        >
                          <div className="w-6 h-6 flex items-center justify-center shrink-0">
                            <span className={`material-symbols-outlined text-[22px] leading-none ${location.pathname === '/menu' ? 'filled text-primary' : ''}`}>storefront</span>
                          </div>
                          <span className="animate-fadeIn">Checkout Screen</span>
                        </Link>
                        <Link
                          to="/transactions"
                          className={`flex items-center gap-4 px-4 h-12 rounded-full text-[14px] font-medium transition-all duration-200 ${location.pathname === '/transactions'
                            ? 'bg-active-indicator text-primary scale-95 font-bold'
                            : 'text-on-surface-variant hover:bg-surface-container-high/60 hover:text-primary'
                            }`}
                        >
                          <div className="w-6 h-6 flex items-center justify-center shrink-0">
                            <span className={`material-symbols-outlined text-[22px] leading-none ${location.pathname === '/transactions' ? 'filled text-primary' : ''}`}>receipt_long</span>
                          </div>
                          <span className="animate-fadeIn">Transactions Log</span>
                        </Link>
                        <Link
                          to="/stock"
                          className={`flex items-center gap-4 px-4 h-12 rounded-full text-[14px] font-medium transition-all duration-200 ${location.pathname === '/stock'
                            ? 'bg-active-indicator text-primary scale-95 font-bold'
                            : 'text-on-surface-variant hover:bg-surface-container-high/60 hover:text-primary'
                            }`}
                        >
                          <div className="w-6 h-6 flex items-center justify-center shrink-0">
                            <span className={`material-symbols-outlined text-[22px] leading-none ${location.pathname === '/stock' ? 'filled text-primary' : ''}`}>inventory_2</span>
                          </div>
                          <span className="animate-fadeIn">Stock Update</span>
                        </Link>
                      </React.Fragment>
                    )}

                    {/* My Profile Link */}
                    {isSidebarFolded ? (
                      <Link
                        to="/settings"
                        className="flex flex-col items-center justify-center w-full h-[52px] group focus:outline-none"
                        title="My Profile"
                      >
                        <div className={`w-14 h-8 rounded-full flex items-center justify-center transition-all duration-200 ${location.pathname === '/settings' ? 'bg-primary/10 text-primary font-bold' : 'text-on-surface-variant hover:bg-surface-container-high/50 hover:text-primary'}`}>
                          <span className={`material-symbols-outlined text-[22px] leading-none transition-all duration-200 ${location.pathname === '/settings' ? 'filled text-primary' : 'text-on-surface-variant'}`}>manage_accounts</span>
                        </div>
                        <span className={`text-[10px] font-bold mt-1 tracking-tight leading-none text-center transition-all duration-200 ${location.pathname === '/settings' ? 'text-primary' : 'text-on-surface-variant group-hover:text-primary'}`}>Profile</span>
                      </Link>
                    ) : (
                      <Link
                        to="/settings"
                        className={`flex items-center gap-4 px-4 h-12 rounded-full text-[14px] font-medium transition-all duration-200 ${location.pathname === '/settings'
                          ? 'bg-active-indicator text-primary scale-95 font-bold'
                          : 'text-on-surface-variant hover:bg-surface-container-high/60 hover:text-primary'
                          }`}
                      >
                        <div className="w-6 h-6 flex items-center justify-center shrink-0">
                          <span className={`material-symbols-outlined text-[22px] leading-none transition-all duration-200 ${location.pathname === '/settings' ? 'filled text-primary' : 'text-on-surface-variant'}`}>manage_accounts</span>
                        </div>
                        <span className="animate-fadeIn">My Profile</span>
                      </Link>
                    )}
                  </React.Fragment>
                )}

              </div>
            </div>

          </div>

          {/* User profile details at the bottom */}
          <div className={`p-3 border-t border-outline-variant/30 bg-surface-container-low/40 ${isSidebarFolded ? 'flex flex-col items-center gap-3' : ''}`}>
            {isSidebarFolded ? (
              <React.Fragment>
                <div className="w-8 h-8 rounded-full bg-primary-fixed text-on-primary-fixed border border-outline-variant/30 flex items-center justify-center shrink-0" title={userRole === 'admin' ? 'Administrator' : 'Hawker Staff'}>
                  <User className="w-4 h-4 text-primary" />
                </div>
                <Link
                  to="/landing"
                  onClick={async (e) => {
                    e.preventDefault();
                    await logout();
                    localStorage.removeItem('userRole');
                    window.location.href = '/landing';
                  }}
                  className="w-9 h-9 rounded-xl flex items-center justify-center hover:bg-surface-container-high/60 text-on-surface-variant hover:text-error transition-all duration-200 shrink-0"
                  title="Log Out"
                >
                  <LogOut className="w-4 h-4" />
                </Link>
              </React.Fragment>
            ) : (
              <div className="flex items-center justify-between transition-all duration-300 w-full px-1">
                <div className="flex items-center gap-2.5">
                  <div className="w-7.5 h-7.5 rounded-full bg-primary-fixed text-on-primary-fixed border border-outline-variant/30 flex items-center justify-center shrink-0" title={userRole === 'admin' ? 'Administrator' : 'Hawker Staff'}>
                    <User className="w-3.5 h-3.5 text-primary" />
                  </div>
                  <div className="flex flex-col text-left animate-fadeIn">
                    <span className="text-[11px] font-bold text-on-surface truncate max-w-[150px]">
                      {userRole === 'admin' ? 'Administrator' : 'Hawker Staff'}
                    </span>
                    <span className="text-[9.5px] text-on-surface-variant truncate max-w-[150px] font-medium">
                      {user?.email || (userRole === 'admin' ? 'admin@wise.my' : 'staff@wise.my')}
                    </span>
                  </div>
                </div>

                <Link
                  to="/landing"
                  onClick={async (e) => {
                    e.preventDefault();
                    await logout();
                    localStorage.removeItem('userRole');
                    window.location.href = '/landing';
                  }}
                  className="w-9 h-9 rounded-lg flex items-center justify-center hover:bg-surface-container-high/60 text-on-surface-variant hover:text-error transition-all duration-200 shrink-0"
                  title="Log Out"
                >
                  <LogOut className="w-4 h-4" />
                </Link>
              </div>
            )}
          </div>

        </nav>

        {/* Sidebar spacer to preserve layout flow */}
        <div className={`${isSidebarFolded ? 'w-16' : 'w-[260px]'} shrink-0 h-screen transition-all duration-300`}></div>

        {/* Main Content Wrapper */}
        <main className="flex-1 flex flex-col h-screen overflow-hidden bg-background">
          {/* TopAppBar */}
          <header className="h-14 sticky top-0 z-40 flex items-center justify-between px-6 flex-shrink-0 bg-background/80 backdrop-blur-sm border-b border-outline-variant/30">
            <div className="flex items-center gap-4">
              <h2 className="text-lg md:text-lg lg:text-xl font-bold text-on-surface">
                {title !== undefined ? title : "FinTech"}
              </h2>
              {location.pathname !== '/assistant' && headerActions && <div className="ml-4">{headerActions}</div>}
            </div>

            <div className="flex items-center gap-1.5 text-on-surface-variant">
              {location.pathname !== '/assistant' ? (
                <React.Fragment>
                  <button className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-surface-container-highest relative transition-colors" title="Notifications">
                    <span className="material-symbols-outlined text-[20px]">notifications</span>
                    <span className="absolute top-2.5 right-2.5 w-1.5 h-1.5 bg-error rounded-full border-2 border-background"></span>
                  </button>
                  <button className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-surface-container-highest transition-colors" title="Help">
                    <span className="material-symbols-outlined text-[20px]">help</span>
                  </button>
                </React.Fragment>
              ) : (
                headerActions
              )}
            </div>
          </header>

          {/* Scrollable Page Content Area */}
          <div className={`flex-1 overflow-y-auto ${noPadding ? 'p-0' : 'p-6'}`}>
            {children}
          </div>
        </main>

      </div>
    </React.Fragment>
  );
}
