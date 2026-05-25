import { Link } from 'react-router-dom';
import { AppIcon, AkiraIcon } from '../components/Layout';

export default function Landing() {
  return (
    <div className="bg-background text-on-background antialiased pt-16 font-sans">
      {/* TopNavBar */}
      <nav className="fixed top-0 w-full z-50 bg-surface/80 dark:bg-surface-dim/80 backdrop-blur-md border-b border-outline-variant/30 flat no shadows">
        <div className="flex justify-between items-center h-16 px-4 md:px-6 max-w-7xl mx-auto">
          <div className="flex items-center gap-2 text-title-lg font-bold text-primary dark:text-primary-fixed-dim" style={{ fontFamily: '"JetBrains Mono", monospace' }}>
            <AppIcon className="w-8 h-8" />
            FinTech
          </div>
          
          <div className="hidden md:flex gap-4 items-center">
            <Link to="/login" className="bg-primary text-on-primary font-label-lg px-6 py-2 rounded-full hover:bg-primary-container hover:text-on-primary-container transition-colors">Login</Link>
          </div>
          <button className="md:hidden text-primary">
            <span className="material-symbols-outlined">menu</span>
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="px-4 md:px-6 py-20 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-on-surface leading-tight">
              Empower Your Stall with <span className="text-primary">Smart Finance</span>
            </h1>
            <p className="text-xl text-on-surface-variant">
              Designed for Malaysian Hawkers and SMEs. Streamline operations, track daily earnings, and unlock growth with AI-powered insights.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/register" className="bg-primary text-on-primary font-bold text-sm px-8 py-4 rounded-full hover:bg-primary-container transition-colors shadow-sm inline-flex items-center justify-center">Sign Up</Link>
              <button className="bg-transparent border border-outline-variant text-on-surface font-bold text-sm px-8 py-4 rounded-full hover:bg-surface-container-highest transition-colors flex items-center gap-2 group">
                <span className="material-symbols-outlined group-hover:text-primary transition-colors">play_circle</span>
                See How It Works
              </button>
            </div>
          </div>
          
          {/* Dashboard Mockup */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 to-secondary/10 rounded-2xl -rotate-2 scale-105 blur-xl"></div>
            <div className="relative bg-surface-container-lowest border border-outline-variant/30 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] p-6 overflow-hidden">
              <div className="flex justify-between items-center mb-6">
                <div className="font-bold text-base">Today's Overview</div>
                <div className="bg-primary-fixed text-on-primary-fixed px-3 py-1 rounded-full font-bold text-[11px]">Live</div>
              </div>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-surface-container-low p-4 rounded-xl border border-outline-variant/30">
                  <div className="font-bold text-[11px] text-on-surface-variant mb-1">Gross Sales</div>
                  <div className="font-mono text-2xl font-bold">RM 1,245.00</div>
                  <div className="text-success-green font-bold text-[11px] mt-2 flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">trending_up</span> +12%
                  </div>
                </div>
                <div className="bg-surface-container-low p-4 rounded-xl border border-outline-variant/30">
                  <div className="font-bold text-[11px] text-on-surface-variant mb-1">Transactions</div>
                  <div className="font-mono text-2xl font-bold">142</div>
                  <div className="text-success-green font-bold text-[11px] mt-2 flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">trending_up</span> +5%
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <div className="font-bold text-sm mb-2">Recent Activity</div>
                <div className="flex items-center justify-between p-3 bg-surface rounded-lg border border-outline-variant/30">
                  <div className="flex items-center gap-3">
                    <div className="bg-secondary-container text-on-secondary-container w-8 h-8 rounded-full flex items-center justify-center">
                      <span className="material-symbols-outlined text-[16px]">qr_code_scanner</span>
                    </div>
                    <div>
                      <div className="font-bold text-sm">DuitNow Transfer</div>
                      <div className="text-sm text-on-surface-variant">Table 4</div>
                    </div>
                  </div>
                  <div className="font-mono text-sm font-bold">+RM 24.50</div>
                </div>
                <div className="flex items-center justify-between p-3 bg-surface rounded-lg border border-outline-variant/30">
                  <div className="flex items-center gap-3">
                    <div className="bg-surface-variant text-on-surface-variant w-8 h-8 rounded-full flex items-center justify-center">
                      <span className="material-symbols-outlined text-[16px]">payments</span>
                    </div>
                    <div>
                      <div className="font-bold text-sm">Cash Payment</div>
                      <div className="text-sm text-on-surface-variant">Takeaway</div>
                    </div>
                  </div>
                  <div className="font-mono text-sm font-bold">+RM 18.00</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Bar */}
      <section className="bg-surface-container border-y border-outline-variant/30 py-8">
        <div className="max-w-7xl mx-auto px-4 md:px-6 grid grid-cols-1 md:grid-cols-3 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-outline-variant/30">
          <div className="py-4 md:py-0">
            <div className="text-4xl font-bold text-primary mb-2">99.9%</div>
            <div className="font-bold text-sm text-on-surface-variant uppercase tracking-wider">System Uptime</div>
          </div>
          <div className="py-4 md:py-0">
            <div className="text-4xl font-bold text-primary mb-2">RM 12B+</div>
            <div className="font-bold text-sm text-on-surface-variant uppercase tracking-wider">Processed Annually</div>
          </div>
          <div className="py-4 md:py-0">
            <div className="text-4xl font-bold text-primary mb-2">5,000+</div>
            <div className="font-bold text-sm text-on-surface-variant uppercase tracking-wider">Malaysian SMEs</div>
          </div>
        </div>
      </section>

      {/* AI Spotlight */}
      <section className="py-20 px-4 md:px-6 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-primary-fixed px-4 py-2 rounded-full mb-6">
            <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 0C12 6.627 17.373 12 24 12C17.373 12 12 17.373 12 24C12 17.373 6.627 12 0 12C6.627 12 12 6.627 12 0Z" fill="url(#gemini-gradient)"/>
              <defs>
                <linearGradient id="gemini-gradient" x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#D96570" />
                  <stop offset="30%" stopColor="#F49C56" />
                  <stop offset="70%" stopColor="#34A853" />
                  <stop offset="100%" stopColor="#4285F4" />
                </linearGradient>
              </defs>
            </svg>
            <span className="font-bold text-[11px] text-on-primary-fixed uppercase tracking-wider">Powered by Google Gemini</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-on-surface mb-4">The Brain Behind Your Business</h2>
          <p className="text-lg text-on-surface-variant max-w-2xl mx-auto">
            Stop guessing. Our AI Assistant analyzes your daily sales, weather patterns, and local events to provide actionable insights tailored to your stall.
          </p>
        </div>
        
        <div className="grid md:grid-cols-12 gap-8 items-start">
          <div className="md:col-span-5 space-y-6">
            <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/30 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:border-primary/50 transition-colors cursor-pointer group">
              <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">Predictive Prep</h3>
              <p className="text-sm text-on-surface-variant">Know exactly how much raw material to prepare based on historical data and upcoming holidays.</p>
            </div>
            <div className="bg-surface-container-lowest p-6 rounded-2xl border-l-4 border-primary shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
              <h3 className="text-xl font-bold mb-2 text-primary">Anomaly Detection</h3>
              <p className="text-sm text-on-surface-variant">Instantly spots irregular spending or sudden spikes in specific menu items.</p>
            </div>
            <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/30 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:border-primary/50 transition-colors cursor-pointer group">
              <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">Smart Summaries</h3>
              <p className="text-sm text-on-surface-variant">Get a plain-English summary of your weekly performance delivered to your phone.</p>
            </div>
          </div>
          
          <div className="md:col-span-7 bg-surface-container-low rounded-3xl p-6 md:p-8 border border-outline-variant/30 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
            {/* Chat Window Mockup */}
            <div className="bg-surface-container-lowest rounded-2xl shadow-lg border border-outline-variant/20 flex flex-col h-[400px]">
              <div className="p-4 border-b border-outline-variant/20 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary-container flex items-center justify-center text-on-primary-container">
                  <AkiraIcon className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-base font-bold">Akira</div>
                  <div className="font-bold text-[11px] text-success-green flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-success-green"></span> Online
                  </div>
                </div>
              </div>
              <div className="flex-1 p-6 space-y-4 overflow-y-auto bg-background/50">
                {/* User Message */}
                <div className="flex justify-end">
                  <div className="bg-surface-variant text-on-surface p-3 rounded-2xl rounded-tr-sm max-w-[80%] text-sm">
                    How was the performance this week compared to last?
                  </div>
                </div>
                {/* AI Message */}
                <div className="flex justify-start">
                  <div className="bg-primary/5 border border-primary/20 p-4 rounded-2xl rounded-tl-sm max-w-[90%]">
                    <div className="text-sm text-on-surface mb-3">
                      Overall, a strong week! Gross sales are up <strong>8.5%</strong>. 
                    </div>
                    <div className="bg-surface-container-lowest p-3 rounded-xl border border-outline-variant/30 mb-3">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="material-symbols-outlined text-amber-500 text-[18px]">insights</span>
                        <span className="font-bold text-sm">Insight Detected</span>
                      </div>
                      <p className="text-sm text-on-surface-variant">I noticed an <strong>overtime spike</strong> on Thursday and Friday evenings. This correlates with the local night market festival.</p>
                    </div>
                    <div className="font-bold text-[11px] text-on-surface-variant uppercase tracking-wide mb-2">Actionable Recommendation</div>
                    <button className="bg-primary text-on-primary text-sm px-4 py-2 rounded-lg hover:bg-primary-container transition-colors w-full text-left flex justify-between items-center font-bold">
                      Increase weekend staff roster by 1
                      <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Unified Operations Platform (Bento Grid) */}
      <section className="bg-surface-container-low py-20">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-on-surface mb-4">Unified Operations Platform</h2>
            <p className="text-lg text-on-surface-variant max-w-2xl mx-auto">Everything you need to run your F&amp;B business, connected in one seamless dashboard.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[250px]">
            {/* Transaction Records */}
            <div className="md:col-span-2 bg-surface-container-lowest rounded-3xl p-8 border border-outline-variant/30 shadow-[0_4px_20px_rgba(0,0,0,0.03)] relative overflow-hidden group">
              <div className="relative z-10">
                <div className="w-12 h-12 rounded-xl bg-primary-fixed text-on-primary-fixed flex items-center justify-center mb-6">
                  <span className="material-symbols-outlined text-[24px]">receipt_long</span>
                </div>
                <h3 className="text-xl font-bold mb-2">Unified Transaction Ledger</h3>
                <p className="text-sm text-on-surface-variant max-w-md">Consolidate Cash, DuitNow, GrabPay, and card payments into a single, easily reconcilable view.</p>
              </div>
            </div>
            
            {/* Automated Payroll */}
            <div className="bg-surface-container-lowest rounded-3xl p-8 border border-outline-variant/30 shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex flex-col justify-between group">
              <div>
                <div className="w-12 h-12 rounded-xl bg-secondary-fixed text-on-secondary-fixed flex items-center justify-center mb-6">
                  <span className="material-symbols-outlined text-[24px]">payments</span>
                </div>
                <h3 className="text-xl font-bold mb-2">Automated Payroll</h3>
              </div>
              <p className="text-sm text-on-surface-variant">One-click salary disbursement with EPF/SOCSO calculations built-in.</p>
            </div>
            
            {/* Attendance Tracking */}
            <div className="bg-surface-container-lowest rounded-3xl p-8 border border-outline-variant/30 shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-tertiary-fixed text-on-tertiary-fixed flex items-center justify-center mb-6">
                  <span className="material-symbols-outlined text-[24px]">schedule</span>
                </div>
                <h3 className="text-xl font-bold mb-2">Smart Attendance</h3>
              </div>
              <p className="text-sm text-on-surface-variant">Geo-fenced clock-ins linked directly to timesheets.</p>
            </div>
            
            {/* Intelligent Partner */}
            <div className="md:col-span-2 bg-primary text-on-primary rounded-3xl p-8 border border-primary-container shadow-lg relative overflow-hidden">
              <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-white/10 to-transparent pointer-events-none"></div>
              <div className="relative z-10 h-full flex flex-col justify-center">
                <div className="flex items-center gap-3 mb-4">
                  <span className="material-symbols-outlined text-[32px]">hub</span>
                  <h3 className="text-2xl font-bold">Your Intelligent Partner</h3>
                </div>
                <p className="text-base text-primary-fixed-dim max-w-lg mb-6">Not just software. An active participant in your business growth, constantly analyzing and optimizing.</p>
                <div>
                  <button className="bg-on-primary text-primary font-bold text-sm px-6 py-3 rounded-full hover:bg-surface-container-highest transition-colors inline-flex items-center gap-2">
                    Explore AI Features <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial / Features */}
      <section className="py-24 px-4 md:px-6 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-on-surface mb-4">Why Choose FinTech?</h2>
          <p className="text-lg text-on-surface-variant max-w-2xl mx-auto">Smart tools designed to scale your business.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-surface-container-lowest p-8 rounded-3xl border border-outline-variant/30 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
              <span className="material-symbols-outlined text-primary text-[28px]">receipt_long</span>
            </div>
            <h3 className="text-xl font-bold mb-3 text-on-surface">Unified Sales Tracking</h3>
            <p className="text-sm text-on-surface-variant">Combine DuitNow, GrabPay, and Cash into one seamless ledger to eliminate manual reconciliation.</p>
          </div>
          <div className="bg-surface-container-lowest p-8 rounded-3xl border border-outline-variant/30 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
              <span className="material-symbols-outlined text-primary text-[28px]">smart_toy</span>
            </div>
            <h3 className="text-xl font-bold mb-3 text-on-surface">AI-Powered Insights</h3>
            <p className="text-sm text-on-surface-variant">Gemini-powered analytics that predict busy periods and help with stock preparation.</p>
          </div>
          <div className="bg-surface-container-lowest p-8 rounded-3xl border border-outline-variant/30 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
              <span className="material-symbols-outlined text-primary text-[28px]">payments</span>
            </div>
            <h3 className="text-xl font-bold mb-3 text-on-surface">Automated Payroll</h3>
            <p className="text-sm text-on-surface-variant">One-click salary disbursement with EPF and SOCSO calculations built-in.</p>
          </div>
          <div className="bg-surface-container-lowest p-8 rounded-3xl border border-outline-variant/30 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
              <span className="material-symbols-outlined text-primary text-[28px]">event_available</span>
            </div>
            <h3 className="text-xl font-bold mb-3 text-on-surface">Real-Time Attendance</h3>
            <p className="text-sm text-on-surface-variant">Geo-fenced clock-ins linked directly to timesheets for error-free management.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full py-12 bg-surface-container-lowest dark:bg-inverse-surface border-t border-outline-variant/30 flat no shadows mt-20">
        <div className="grid grid-cols-1 gap-4 px-4 md:px-6 max-w-7xl mx-auto">
          <div className="space-y-4">
            <div className="text-lg font-bold text-on-surface dark:text-inverse-on-surface">FinTech</div>
            <p className="text-sm text-on-surface-variant max-w-sm">
              2026 FinTech designed by buildprojectnexus. Empowering Malaysian SMEs with AI. Modernizing the operational backbone of local food and beverage heroes.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
