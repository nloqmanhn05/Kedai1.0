import { Link } from 'react-router-dom';
import { AppIcon, AkiraIcon } from '../components/Layout';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

const fadeInUp = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 1.2, ease: [0.16, 1, 0.3, 1] as const } }
};

const fadeInLeft = {
  hidden: { opacity: 0, x: -50 },
  visible: { opacity: 1, x: 0, transition: { duration: 1.2, ease: [0.16, 1, 0.3, 1] as const } }
};

const fadeInRight = {
  hidden: { opacity: 0, x: 50 },
  visible: { opacity: 1, x: 0, transition: { duration: 1.2, ease: [0.16, 1, 0.3, 1] as const } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1
    }
  }
};

const staggerItem = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 1.0, ease: [0.16, 1, 0.3, 1] as const } }
};

const scaleHover = {
  initial: { scale: 1 },
  hover: {
    scale: 1.02,
    transition: { type: "spring", stiffness: 300, damping: 10 }
  }
};

const floatingAnimation = {
  initial: { y: 0 },
  animate: {
    y: [-10, 10, -10],
    transition: {
      duration: 4,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

const pulseGlow = {
  animate: {
    boxShadow: [
      "0 0 20px rgba(76, 34, 189, 0.3)",
      "0 0 40px rgba(76, 34, 189, 0.5)",
      "0 0 20px rgba(76, 34, 189, 0.3)"
    ],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

const rotateHover = {
  initial: { rotateZ: 0 },
  hover: {
    rotateZ: 5,
    transition: { type: "spring", stiffness: 400 }
  }
};

// Counter animation component
const AnimatedCounter = ({ value, prefix = '', suffix = '' }: { value: number; prefix?: string; suffix?: string }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const increment = value / 60;
    const interval = setInterval(() => {
      start += increment;
      if (start >= value) {
        setCount(value);
        clearInterval(interval);
      } else {
        setCount(Math.floor(start));
      }
    }, 30);
    return () => clearInterval(interval);
  }, [value]);

  return (
    <span>
      {prefix}
      {typeof value === 'number' && value > 100 ? count.toLocaleString() : count}
      {suffix}
    </span>
  );
};

export default function Landing() {
  return (
    <div className="bg-background text-on-background antialiased pt-16 font-sans overflow-x-hidden">
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
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.2 }}
            variants={fadeInLeft}
            className="space-y-8"
          >
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-on-surface leading-tight">
              Empower Your Stall with <span className="text-primary">Smart Finance</span>
            </h1>
            <p className="text-xl text-on-surface-variant">
              Designed for Malaysian Hawkers and SMEs. Streamline operations, track daily earnings, and unlock growth with AI-powered insights.
            </p>
            <div className="flex flex-wrap gap-4">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link to="/register" className="bg-primary text-on-primary font-bold text-sm px-8 py-4 rounded-full hover:bg-primary-container transition-colors shadow-sm inline-flex items-center justify-center">Sign Up</Link>
              </motion.div>
              <motion.a
                href="https://drive.google.com/drive/folders/1IldzWvlt31ShgkOXSa5vXJ8CGA-qXvUx?usp=drive_link"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-transparent border border-outline-variant text-on-surface font-bold text-sm px-8 py-4 rounded-full hover:bg-surface-container-highest transition-colors flex items-center gap-2 group cursor-pointer decoration-none"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <motion.span
                  className="material-symbols-outlined group-hover:text-primary transition-colors"
                  animate={{ x: [0, 4, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  play_circle
                </motion.span>
                See How It Works
              </motion.a>
            </div>
          </motion.div>

          {/* Dashboard Mockup */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.2 }}
            variants={fadeInRight}
            className="relative"
          >
            <motion.div
              className="absolute inset-2 bg-gradient-to-tr from-primary/10 to-secondary/10 rounded-2xl -rotate-2 blur-xl"
              animate={{
                scale: [1.02, 1.06, 1.02],
                rotate: [-2, -1, -2]
              }}
              transition={{ duration: 4, repeat: Infinity }}
            ></motion.div>
            <motion.div
              className="relative bg-surface-container-lowest border border-outline-variant/30 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] p-6 overflow-hidden"
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: false }}
              transition={{ delay: 0.2 }}
              whileHover={{
                boxShadow: "0 20px 40px rgba(0,0,0,0.08)",
                border: "1px solid #4c22bd"
              }}
            >
              <div className="flex justify-between items-center mb-6">
                <div className="font-bold text-base">Today's Overview</div>
                <motion.div
                  className="bg-primary-fixed text-on-primary-fixed px-3 py-1 rounded-full font-bold text-[11px]"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  Live
                </motion.div>
              </div>
              <motion.div
                className="grid grid-cols-2 gap-4 mb-6"
                variants={staggerContainer}
                initial="hidden"
                whileInView="visible"
              >
                <motion.div
                  variants={staggerItem}
                  className="bg-surface-container-low p-4 rounded-xl border border-outline-variant/30 hover:border-primary/50 transition-colors"
                  whileHover={{ scale: 1.03, y: -5 }}
                >
                  <div className="font-bold text-[11px] text-on-surface-variant mb-1">Gross Sales</div>
                  <div className="font-mono text-2xl font-bold">RM 1,245.00</div>
                  <motion.div
                    className="text-success-green font-bold text-[11px] mt-2 flex items-center gap-1"
                    animate={{ y: [0, -2, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <span className="material-symbols-outlined text-[14px]">trending_up</span> +12%
                  </motion.div>
                </motion.div>
                <motion.div
                  variants={staggerItem}
                  className="bg-surface-container-low p-4 rounded-xl border border-outline-variant/30 hover:border-primary/50 transition-colors"
                  whileHover={{ scale: 1.03, y: -5 }}
                >
                  <div className="font-bold text-[11px] text-on-surface-variant mb-1">Transactions</div>
                  <div className="font-mono text-2xl font-bold">142</div>
                  <motion.div
                    className="text-success-green font-bold text-[11px] mt-2 flex items-center gap-1"
                    animate={{ y: [0, -2, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
                  >
                    <span className="material-symbols-outlined text-[14px]">trending_up</span> +5%
                  </motion.div>
                </motion.div>
              </motion.div>
              <motion.div
                className="space-y-3"
                variants={staggerContainer}
                initial="hidden"
                whileInView="visible"
              >
                <div className="font-bold text-sm mb-2">Recent Activity</div>
                <motion.div
                  variants={staggerItem}
                  className="flex items-center justify-between p-3 bg-surface rounded-lg border border-outline-variant/30 hover:bg-surface-container-low transition-colors"
                  whileHover={{ x: 4 }}
                >
                  <div className="flex items-center gap-3">
                    <motion.div
                      className="bg-secondary-container text-on-secondary-container w-8 h-8 rounded-full flex items-center justify-center"
                      whileHover={{ scale: 1.2, rotate: 360 }}
                      transition={{ type: "spring" }}
                    >
                      <span className="material-symbols-outlined text-[16px]">qr_code_scanner</span>
                    </motion.div>
                    <div>
                      <div className="font-bold text-sm">DuitNow Transfer</div>
                      <div className="text-sm text-on-surface-variant">Table 4</div>
                    </div>
                  </div>
                  <div className="font-mono text-sm font-bold">+RM 24.50</div>
                </motion.div>
                <motion.div
                  variants={staggerItem}
                  className="flex items-center justify-between p-3 bg-surface rounded-lg border border-outline-variant/30 hover:bg-surface-container-low transition-colors"
                  whileHover={{ x: 4 }}
                >
                  <div className="flex items-center gap-3">
                    <motion.div
                      className="bg-surface-variant text-on-surface-variant w-8 h-8 rounded-full flex items-center justify-center"
                      whileHover={{ scale: 1.2, rotate: 360 }}
                      transition={{ type: "spring" }}
                    >
                      <span className="material-symbols-outlined text-[16px]">payments</span>
                    </motion.div>
                    <div>
                      <div className="font-bold text-sm">Cash Payment</div>
                      <div className="text-sm text-on-surface-variant">Takeaway</div>
                    </div>
                  </div>
                  <div className="font-mono text-sm font-bold">+RM 18.00</div>
                </motion.div>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Trust Bar */}
      <section className="bg-surface-container border-y border-outline-variant/30 py-8 overflow-hidden">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.2 }}
          variants={staggerContainer}
          className="max-w-7xl mx-auto px-4 md:px-6 grid grid-cols-1 md:grid-cols-3 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-outline-variant/30"
        >
          <motion.div variants={staggerItem} className="py-4 md:py-0">
            <motion.div
              className="text-4xl font-bold text-primary mb-2"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              99.9%
            </motion.div>
            <div className="font-bold text-sm text-on-surface-variant uppercase tracking-wider">System Uptime</div>
          </motion.div>
          <motion.div variants={staggerItem} className="py-4 md:py-0">
            <motion.div
              className="text-4xl font-bold text-primary mb-2"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity, delay: 0.2 }}
            >
              RM 12B+
            </motion.div>
            <div className="font-bold text-sm text-on-surface-variant uppercase tracking-wider">Processed Annually</div>
          </motion.div>
          <motion.div variants={staggerItem} className="py-4 md:py-0">
            <motion.div
              className="text-4xl font-bold text-primary mb-2"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity, delay: 0.4 }}
            >
              5,000+
            </motion.div>
            <div className="font-bold text-sm text-on-surface-variant uppercase tracking-wider">Malaysian SMEs</div>
          </motion.div>
        </motion.div>
      </section>

      {/* AI Spotlight */}
      <section className="py-20 px-4 md:px-6 max-w-7xl mx-auto overflow-hidden">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.15 }}
          variants={fadeInUp}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 bg-primary-fixed px-4 py-2 rounded-full mb-6">
            <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="gemini-sparkle" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#1a73e8" />
                  <stop offset="50%" stopColor="#4285f4" />
                  <stop offset="100%" stopColor="#9b51e0" />
                </linearGradient>
              </defs>
              <path d="M12 2C12 7.5 16.5 12 22 12C16.5 12 12 16.5 12 22C12 16.5 7.5 12 2 12C7.5 12 12 7.5 12 2Z" fill="url(#gemini-sparkle)" />
            </svg>
            <span className="font-bold text-[11px] text-on-primary-fixed uppercase tracking-wider">Powered by Google Gemini</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-on-surface mb-4">The Brain Behind Your Business</h2>
          <p className="text-lg text-on-surface-variant max-w-2xl mx-auto">
            Stop guessing. Our AI Assistant analyzes your daily sales, weather patterns, and local events to provide actionable insights tailored to your stall.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-12 gap-8 items-start">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.15 }}
            variants={staggerContainer}
            className="md:col-span-5 space-y-6"
          >
            <motion.div
              variants={staggerItem}
              className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/30 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:border-primary/50 transition-colors cursor-pointer group"
              whileHover={{ scale: 1.02, y: -5, boxShadow: "0 12px 24px rgba(76, 34, 189, 0.1)" }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">Predictive Prep</h3>
              <p className="text-sm text-on-surface-variant">Know exactly how much raw material to prepare based on historical data and upcoming holidays.</p>
            </motion.div>
            <motion.div
              variants={staggerItem}
              className="bg-surface-container-lowest p-6 rounded-2xl border-l-4 border-primary shadow-[0_4px_20px_rgba(0,0,0,0.03)]"
              whileHover={{ scale: 1.02, y: -5, boxShadow: "0 12px 24px rgba(76, 34, 189, 0.15)" }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <motion.div
                animate={{ x: [0, 4, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="h-0"
              />
              <h3 className="text-xl font-bold mb-2 text-primary">Anomaly Detection</h3>
              <p className="text-sm text-on-surface-variant">Instantly spots irregular spending or sudden spikes in specific menu items.</p>
            </motion.div>
            <motion.div
              variants={staggerItem}
              className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/30 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:border-primary/50 transition-colors cursor-pointer group"
              whileHover={{ scale: 1.02, y: -5, boxShadow: "0 12px 24px rgba(76, 34, 189, 0.1)" }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">Smart Summaries</h3>
              <p className="text-sm text-on-surface-variant">Get a plain-English summary of your weekly performance delivered to your phone.</p>
            </motion.div>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.15 }}
            variants={fadeInRight}
            className="md:col-span-7 bg-surface-container-low rounded-3xl p-6 md:p-8 border border-outline-variant/30 relative overflow-hidden"
          >
            <motion.div
              className="absolute top-0 right-0 w-64 h-64 bg-secondary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.5, 0.8, 0.5]
              }}
              transition={{ duration: 4, repeat: Infinity }}
            ></motion.div>
            {/* Chat Window Mockup */}
            <motion.div
              className="bg-surface-container-lowest rounded-2xl shadow-lg border border-outline-variant/20 flex flex-col h-[400px]"
              whileHover={{ boxShadow: "0 20px 40px rgba(0,0,0,0.12)" }}
            >
              <div className="p-4 border-b border-outline-variant/20 flex items-center gap-3">
                <motion.div
                  className="w-10 h-10 rounded-full bg-primary-container flex items-center justify-center text-on-primary-container"
                  animate={{ scale: [1, 1.15, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <AkiraIcon className="w-6 h-6" />
                </motion.div>
                <div>
                  <div className="text-base font-bold">Akira</div>
                  <motion.div
                    className="font-bold text-[11px] text-success-green flex items-center gap-1"
                    animate={{ opacity: [1, 0.5, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <span className="w-2 h-2 rounded-full bg-success-green"></span> Online
                  </motion.div>
                </div>
              </div>
              <div className="flex-1 p-6 space-y-4 overflow-y-auto bg-background/50">
                {/* User Message */}
                <motion.div
                  className="flex justify-end"
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <motion.div
                    className="bg-surface-variant text-on-surface p-3 rounded-2xl rounded-tr-sm max-w-[80%] text-sm"
                    whileHover={{ scale: 1.02 }}
                  >
                    How was the performance this week compared to last?
                  </motion.div>
                </motion.div>
                {/* AI Message */}
                <motion.div
                  className="flex justify-start"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <motion.div
                    className="bg-primary/5 border border-primary/20 p-4 rounded-2xl rounded-tl-sm max-w-[90%]"
                    whileHover={{ boxShadow: "0 8px 16px rgba(76, 34, 189, 0.1)" }}
                  >
                    <motion.div
                      className="text-sm text-on-surface mb-3"
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      transition={{ delay: 0.6 }}
                    >
                      Overall, a strong week! Gross sales are up <strong>8.5%</strong>.
                    </motion.div>
                    <motion.div
                      className="bg-surface-container-lowest p-3 rounded-xl border border-outline-variant/30 mb-3"
                      initial={{ scale: 0.9, opacity: 0 }}
                      whileInView={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.7 }}
                      whileHover={{ scale: 1.02 }}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <motion.span
                          className="material-symbols-outlined text-amber-500 text-[18px]"
                          animate={{ rotate: [0, 10, -10, 0] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        >
                          insights
                        </motion.span>
                        <span className="font-bold text-sm">Insight Detected</span>
                      </div>
                      <p className="text-sm text-on-surface-variant">I noticed an <strong>overtime spike</strong> on Thursday and Friday evenings. This correlates with the local night market festival.</p>
                    </motion.div>
                    <div className="font-bold text-[11px] text-on-surface-variant uppercase tracking-wide mb-2">Actionable Recommendation</div>
                    <motion.button
                      className="bg-primary text-on-primary text-sm px-4 py-2 rounded-lg hover:bg-primary-container transition-colors w-full text-left flex justify-between items-center font-bold"
                      whileHover={{ scale: 1.05, boxShadow: "0 6px 12px rgba(76, 34, 189, 0.3)" }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Increase weekend staff roster by 1
                      <motion.span
                        className="material-symbols-outlined text-[16px]"
                        animate={{ x: [0, 4, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      >
                        arrow_forward
                      </motion.span>
                    </motion.button>
                  </motion.div>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Unified Operations Platform (Bento Grid) */}
      <section className="bg-surface-container-low py-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.2 }}
            variants={fadeInUp}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-on-surface mb-4">Unified Operations Platform</h2>
            <p className="text-lg text-on-surface-variant max-w-2xl mx-auto">Everything you need to run your F&amp;B business, connected in one seamless dashboard.</p>
          </motion.div>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.15 }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[250px]"
          >
            {/* Transaction Records */}
            <motion.div
              variants={staggerItem}
              className="md:col-span-2 bg-surface-container-lowest rounded-3xl p-8 border border-outline-variant/30 shadow-[0_4px_20px_rgba(0,0,0,0.03)] relative overflow-hidden group"
              whileHover={{
                scale: 1.02,
                boxShadow: "0 12px 24px rgba(76, 34, 189, 0.1)",
                borderColor: "rgba(76, 34, 189, 0.5)"
              }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-3xl"
              ></motion.div>
              <div className="relative z-10">
                <motion.div
                  className="w-12 h-12 rounded-xl bg-primary-fixed text-on-primary-fixed flex items-center justify-center mb-6"
                  whileHover={{ rotate: 180 }}
                  transition={{ type: "spring" }}
                >
                  <span className="material-symbols-outlined text-[24px]">receipt_long</span>
                </motion.div>
                <h3 className="text-xl font-bold mb-2">Unified Transaction Ledger</h3>
                <p className="text-sm text-on-surface-variant max-w-md">Consolidate Cash, DuitNow, GrabPay, and card payments into a single, easily reconcilable view.</p>
              </div>
            </motion.div>

            {/* Automated Payroll */}
            <motion.div
              variants={staggerItem}
              className="bg-surface-container-lowest rounded-3xl p-8 border border-outline-variant/30 shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex flex-col justify-between group"
              whileHover={{
                scale: 1.02,
                boxShadow: "0 12px 24px rgba(76, 34, 189, 0.1)",
                borderColor: "rgba(76, 34, 189, 0.5)"
              }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div>
                <motion.div
                  className="w-12 h-12 rounded-xl bg-secondary-fixed text-on-secondary-fixed flex items-center justify-center mb-6"
                  whileHover={{ rotate: 180 }}
                  transition={{ type: "spring" }}
                >
                  <span className="material-symbols-outlined text-[24px]">payments</span>
                </motion.div>
                <h3 className="text-xl font-bold mb-2">Automated Payroll</h3>
              </div>
              <p className="text-sm text-on-surface-variant">One-click salary disbursement with EPF/SOCSO calculations built-in.</p>
            </motion.div>

            {/* Attendance Tracking */}
            <motion.div
              variants={staggerItem}
              className="bg-surface-container-lowest rounded-3xl p-8 border border-outline-variant/30 shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex flex-col justify-between"
              whileHover={{
                scale: 1.02,
                boxShadow: "0 12px 24px rgba(76, 34, 189, 0.1)",
                borderColor: "rgba(76, 34, 189, 0.5)"
              }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div>
                <motion.div
                  className="w-12 h-12 rounded-xl bg-tertiary-fixed text-on-tertiary-fixed flex items-center justify-center mb-6"
                  whileHover={{ rotate: 180 }}
                  transition={{ type: "spring" }}
                >
                  <span className="material-symbols-outlined text-[24px]">schedule</span>
                </motion.div>
                <h3 className="text-xl font-bold mb-2">Smart Attendance</h3>
              </div>
              <p className="text-sm text-on-surface-variant">Geo-fenced clock-ins linked directly to timesheets.</p>
            </motion.div>

            {/* Intelligent Partner */}
            <motion.div
              variants={staggerItem}
              className="md:col-span-2 bg-primary text-on-primary rounded-3xl p-8 border border-primary-container shadow-lg relative overflow-hidden"
              whileHover={{
                scale: 1.02,
                boxShadow: "0 20px 40px rgba(76, 34, 189, 0.3)"
              }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <motion.div
                className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-white/10 to-transparent pointer-events-none"
                animate={{
                  opacity: [0.5, 0.8, 0.5]
                }}
                transition={{ duration: 3, repeat: Infinity }}
              ></motion.div>
              <div className="relative z-10 h-full flex flex-col justify-center">
                <div className="flex items-center gap-3 mb-4">
                  <motion.div
                    className="text-[32px]"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <AkiraIcon className="w-8 h-8" />
                  </motion.div>
                  <h3 className="text-2xl font-bold">Your Intelligent Partner</h3>
                </div>
                <p className="text-base text-primary-fixed-dim max-w-lg mb-6">Not just software. An active participant in your business growth, constantly analyzing and optimizing.</p>
                <div>
                  <motion.button
                    className="bg-on-primary text-primary font-bold text-sm px-6 py-3 rounded-full hover:bg-surface-container-highest transition-colors inline-flex items-center gap-2"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Explore AI Features
                    <motion.span
                      className="material-symbols-outlined text-[18px]"
                      animate={{ x: [0, 4, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      arrow_forward
                    </motion.span>
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Testimonial / Features */}
      <section className="py-24 px-4 md:px-6 max-w-7xl mx-auto overflow-hidden">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.2 }}
          variants={fadeInUp}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-on-surface mb-4">Why Choose FinTech?</h2>
          <p className="text-lg text-on-surface-variant max-w-2xl mx-auto">Smart tools designed to scale your business.</p>
        </motion.div>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.15 }}
          variants={staggerContainer}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          <motion.div
            variants={staggerItem}
            className="bg-surface-container-lowest p-8 rounded-3xl border border-outline-variant/30 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-md transition-shadow"
            whileHover={{
              scale: 1.04,
              y: -8,
              boxShadow: "0 20px 40px rgba(76, 34, 189, 0.15)"
            }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <motion.div
              className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-6"
              whileHover={{
                rotate: 360,
                scale: 1.1,
                background: "linear-gradient(135deg, #4c22bd, #6442d6)"
              }}
              transition={{ duration: 0.6 }}
            >
              <motion.span
                className="material-symbols-outlined text-primary text-[28px]"
                animate={{ opacity: [1, 0.6, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                receipt_long
              </motion.span>
            </motion.div>
            <h3 className="text-xl font-bold mb-3 text-on-surface">Unified Sales Tracking</h3>
            <p className="text-sm text-on-surface-variant">Combine DuitNow, GrabPay, and Cash into one seamless ledger to eliminate manual reconciliation.</p>
          </motion.div>
          <motion.div
            variants={staggerItem}
            className="bg-surface-container-lowest p-8 rounded-3xl border border-outline-variant/30 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-md transition-shadow"
            whileHover={{
              scale: 1.04,
              y: -8,
              boxShadow: "0 20px 40px rgba(76, 34, 189, 0.15)"
            }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <motion.div
              className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-6"
              whileHover={{
                rotate: 360,
                scale: 1.1,
                background: "linear-gradient(135deg, #4c22bd, #6442d6)"
              }}
              transition={{ duration: 0.6 }}
            >
              <motion.div
                animate={{ opacity: [1, 0.6, 1] }}
                transition={{ duration: 2, repeat: Infinity, delay: 0.3 }}
              >
                <AkiraIcon className="w-7 h-7 text-primary" />
              </motion.div>
            </motion.div>
            <h3 className="text-xl font-bold mb-3 text-on-surface">AI-Powered Insights</h3>
            <p className="text-sm text-on-surface-variant">Gemini-powered analytics that predict busy periods and help with stock preparation.</p>
          </motion.div>
          <motion.div
            variants={staggerItem}
            className="bg-surface-container-lowest p-8 rounded-3xl border border-outline-variant/30 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-md transition-shadow"
            whileHover={{
              scale: 1.04,
              y: -8,
              boxShadow: "0 20px 40px rgba(76, 34, 189, 0.15)"
            }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <motion.div
              className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-6"
              whileHover={{
                rotate: 360,
                scale: 1.1,
                background: "linear-gradient(135deg, #4c22bd, #6442d6)"
              }}
              transition={{ duration: 0.6 }}
            >
              <motion.span
                className="material-symbols-outlined text-primary text-[28px]"
                animate={{ opacity: [1, 0.6, 1] }}
                transition={{ duration: 2, repeat: Infinity, delay: 0.6 }}
              >
                payments
              </motion.span>
            </motion.div>
            <h3 className="text-xl font-bold mb-3 text-on-surface">Automated Payroll</h3>
            <p className="text-sm text-on-surface-variant">One-click salary disbursement with EPF and SOCSO calculations built-in.</p>
          </motion.div>
          <motion.div
            variants={staggerItem}
            className="bg-surface-container-lowest p-8 rounded-3xl border border-outline-variant/30 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-md transition-shadow"
            whileHover={{
              scale: 1.04,
              y: -8,
              boxShadow: "0 20px 40px rgba(76, 34, 189, 0.15)"
            }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <motion.div
              className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-6"
              whileHover={{
                rotate: 360,
                scale: 1.1,
                background: "linear-gradient(135deg, #4c22bd, #6442d6)"
              }}
              transition={{ duration: 0.6 }}
            >
              <motion.span
                className="material-symbols-outlined text-primary text-[28px]"
                animate={{ opacity: [1, 0.6, 1] }}
                transition={{ duration: 2, repeat: Infinity, delay: 0.9 }}
              >
                event_available
              </motion.span>
            </motion.div>
            <h3 className="text-xl font-bold mb-3 text-on-surface">Real-Time Attendance</h3>
            <p className="text-sm text-on-surface-variant">Geo-fenced clock-ins linked directly to timesheets for error-free management.</p>
          </motion.div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="bg-surface-container-low border-t border-outline-variant full-width bottom-0 z-10 relative mt-20">
        <div className="w-full py-8 px-4 md:px-6 mt-auto flex flex-col md:flex-row justify-between items-center gap-4 max-w-[1200px] mx-auto">
          <div className="text-base font-bold text-on-surface flex items-center gap-2 font-mono">
            <svg viewBox="0 0 24 24" className="text-primary w-5 h-5" fill="none" stroke="currentColor" strokeLinecap="butt" xmlns="http://www.w3.org/2000/svg">
              <g transform="translate(12, 12) rotate(15)">
                <line x1="0" y1="-11" x2="0" y2="11" strokeWidth="3.5"></line>
                <line x1="-9" y1="0" x2="9" y2="0" strokeWidth="2.5"></line>
                <line x1="-6.5" y1="-6.5" x2="6.5" y2="6.5" strokeWidth="2.5"></line>
                <line x1="7" y1="-7" x2="-7" y2="7" strokeWidth="2.5"></line>
              </g>
            </svg>
            FinTech
          </div>
          <div className="flex gap-6">
            <a href="#" className="text-sm text-on-surface-variant hover:text-primary transition-colors">Privacy Policy</a>
            <a href="#" className="text-sm text-on-surface-variant hover:text-primary transition-colors">Terms of Service</a>
            <a href="#" className="text-sm text-on-surface-variant hover:text-primary transition-colors">Contact Support</a>
          </div>
          <div className="text-[11px] text-on-surface-variant text-center md:text-right max-w-md">
            © 2026 FinTech. All rights reserved to team  buildprojectnexus. This is project is designed specially for project subject Software Engineering and Design
          </div>
        </div>
      </footer>
    </div>
  );
}
