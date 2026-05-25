import { Store, HelpCircle, BadgeInfo, EyeOff, Eye, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { AppIcon } from '../components/Layout';
import { useState } from 'react';

export default function SignUp() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-brand-bg text-on-surface font-sans antialiased selection:bg-primary-container selection:text-on-primary-container">
      {/* TopAppBar */}
      <header className="full-width top-0 z-50 flat no shadows">
        <div className="flex justify-between items-center w-full px-4 md:px-8 py-4 max-w-[1200px] mx-auto">
          <Link to="/" className="flex items-center gap-2">
            <AppIcon className="text-primary w-8 h-8" />
            <span className="text-2xl font-bold font-mono text-primary">FinTech</span>
          </Link>
          <div className="flex items-center gap-4">
            <button className="text-on-surface-variant hover:bg-surface-container-low transition-colors rounded-full p-2 flex items-center justify-center">
              <HelpCircle className="w-6 h-6" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Canvas */}
      <main className="flex-1 flex items-center justify-center p-4 md:p-8 w-full relative z-10 overflow-hidden">
        {/* Subtle decorative background element */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden flex justify-center items-center">
          <div className="w-[800px] h-[800px] bg-primary-container opacity-20 rounded-full blur-[120px] -translate-y-1/4"></div>
        </div>

        {/* Sign Up Card */}
        <div className="w-full max-w-[480px] bg-surface-container-lowest rounded-[28px] p-8 md:p-10 z-10 border border-outline-variant shadow-sm relative overflow-hidden">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary-container text-on-primary-container mb-6">
              <AppIcon className="text-white w-8 h-8" />
            </div>
            <h1 className="text-3xl font-bold text-on-surface mb-2 tracking-tight">Create Account</h1>
            <p className="text-base text-on-surface-variant">Join FinTech to manage your stall efficiently</p>
          </div>

          <form className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <div className="floating-group relative w-full">
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    placeholder=" "
                    className="w-full bg-surface-container-low border border-outline-variant rounded-[24px] px-4 text-base text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all focus:bg-surface-container-lowest"
                  />
                  <label htmlFor="fullName">Full Name</label>
                </div>
              </div>
              <div className="space-y-1.5">
                <div className="floating-group relative w-full">
                  <input
                    type="text"
                    id="stallName"
                    name="stallName"
                    placeholder=" "
                    className="w-full bg-surface-container-low border border-outline-variant rounded-[24px] px-4 text-base text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all focus:bg-surface-container-lowest"
                  />
                  <label htmlFor="stallName">Stall Name</label>
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="floating-group relative w-full">
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder=" "
                  className="w-full bg-surface-container-low border border-outline-variant rounded-[24px] px-4 text-base text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all focus:bg-surface-container-lowest"
                />
                <label htmlFor="email">Email Address</label>
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="floating-group relative w-full">
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  placeholder=" "
                  className="w-full bg-surface-container-low border border-outline-variant rounded-[24px] px-4 text-base text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all focus:bg-surface-container-lowest"
                />
                <label htmlFor="phone">Phone Number</label>
              </div>
            </div>

            {/* Multi-line text field for long responses (MD3 Guideline) */}
            <div className="space-y-1.5">
              <div className="floating-group relative w-full">
                <textarea
                  id="stallDescription"
                  name="stallDescription"
                  placeholder=" "
                  className="w-full bg-surface-container-low border border-outline-variant rounded-[24px] px-4 text-base text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all focus:bg-surface-container-lowest"
                ></textarea>
                <label htmlFor="stallDescription">Stall Description (Optional)</label>
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="floating-group relative w-full">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  placeholder=" "
                  className="w-full bg-surface-container-low border border-outline-variant rounded-[24px] pl-4 pr-[52px] text-base text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all focus:bg-surface-container-lowest"
                />
                <label htmlFor="password">Password</label>
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-[12px] top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-primary transition-colors p-1 flex items-center justify-center z-10 cursor-pointer"
                >
                  {showPassword ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="flex items-start gap-3 pt-2">
              <div className="flex items-center h-5 mt-0.5">
                <input
                  type="checkbox"
                  id="terms"
                  name="terms"
                  className="w-5 h-5 rounded-[4px] border-outline-variant text-primary focus:ring-primary focus:ring-offset-background bg-surface-container-lowest"
                />
              </div>
              <label htmlFor="terms" className="text-sm text-on-surface-variant leading-tight">
                I agree to the <a href="#" className="text-primary font-medium hover:underline">Terms and Conditions</a> and <a href="#" className="text-primary font-medium hover:underline">Privacy Policy</a>
              </label>
            </div>

            <div className="pt-6">
              <Link to="/dashboard" className="w-full bg-primary hover:bg-primary/90 text-on-primary text-sm font-medium rounded-full py-4 transition-all active:scale-[0.98] shadow-sm flex items-center justify-center gap-2">
                Create Account
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </form>

          <div className="mt-8 text-center border-t border-outline-variant/30 pt-6">
            <p className="text-sm text-on-surface-variant">
              Already have an account?
              <Link to="/login" className="text-sm text-primary font-bold hover:underline ml-1">Login</Link>
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-surface-container-low full-width bottom-0 border-t border-outline-variant flat no shadows mt-auto">
        <div className="w-full py-8 px-4 md:px-8 flex flex-col md:flex-row justify-between items-center gap-4 max-w-[1200px] mx-auto">
          <div className="flex flex-col items-center md:items-start gap-1">
            <span className="text-base font-bold text-on-surface">FinTech</span>
            <p className="text-sm text-on-surface-variant">© 2024 FinTech. All rights reserved.</p>
          </div>
          <nav className="flex flex-wrap justify-center gap-6">
            <a href="#" className="text-[11px] font-medium text-on-surface-variant hover:text-primary transition-colors">Privacy Policy</a>
            <a href="#" className="text-[11px] font-medium text-on-surface-variant hover:text-primary transition-colors">Terms of Service</a>
            <a href="#" className="text-[11px] font-medium text-on-surface-variant hover:text-primary transition-colors">Contact Support</a>
          </nav>
        </div>
      </footer>
    </div>
  );
}
