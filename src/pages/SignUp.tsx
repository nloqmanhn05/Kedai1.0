import { HelpCircle, EyeOff, Eye, ArrowRight, ArrowLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { AppIcon } from '../components/Layout';
import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'framer-motion';
import { db } from '../lib/firebase';
import { doc, setDoc } from 'firebase/firestore';

export default function SignUp() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'admin' | 'staff'>('admin');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setError('');
      setLoading(true);
      
      const userCredential = await signUp(email, password);
      const user = userCredential.user;

      // Save role inside Firestore immediately
      await setDoc(doc(db, 'users', user.uid), {
        email: email,
        role: role,
        createdAt: new Date().toISOString()
      });

      // Save role according to user's selection in localStorage
      localStorage.setItem('userRole', role);
      navigate('/dashboard');
    } catch (err: any) {
      if (err.code === 'auth/email-already-in-use') {
        setError('you are not allowed');
      } else {
        setError('Failed to create an account. ' + err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
      className="min-h-screen flex flex-col bg-brand-bg text-on-surface font-sans antialiased selection:bg-primary-container selection:text-on-primary-container"
    >
      {/* Back Button */}
      <div className="fixed top-4 left-4 z-50">
        <Link
          to="/landing"
          className="flex items-center justify-center gap-2 px-3 py-2 rounded-full bg-primary/10 hover:bg-primary/20 text-primary transition-colors text-sm font-medium"
          title="Go back to landing page"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </Link>
      </div>

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
            <p className="text-base text-on-surface-variant mb-6">Join FinTech to manage your stall efficiently</p>
          </div>

          {/* Segmented Control */}
          <div className="w-full bg-surface-container-highest rounded-full p-1 flex mb-6 relative">
            {/* Sliding background indicator */}
            <div
              className="absolute top-1 bottom-1 left-1 w-[calc(50%-4px)] bg-surface-container-lowest rounded-full shadow-sm transition-transform duration-300 ease-out pointer-events-none"
              style={{
                transform: role === 'admin' ? 'translateX(0)' : 'translateX(100%)',
              }}
            />
            <button
              type="button"
              onClick={() => setRole('admin')}
              className={`relative z-10 flex-1 py-2 px-4 rounded-full text-sm font-medium transition-all cursor-pointer bg-transparent ${
                role === 'admin'
                  ? 'text-on-surface'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              Admin Sign Up
            </button>
            <button
              type="button"
              onClick={() => setRole('staff')}
              className={`relative z-10 flex-1 py-2 px-4 rounded-full text-sm font-medium transition-all cursor-pointer bg-transparent ${
                role === 'staff'
                  ? 'text-on-surface'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              Staff Sign Up
            </button>
          </div>

          {error && <div className="mb-4 p-3 bg-error/10 text-error text-sm rounded-lg border border-error/20">{error}</div>}

          <form className="space-y-5" onSubmit={handleSubmit}>
            {/* Email Field */}
            <div className="space-y-1.5">
              <div className="floating-group relative w-full">
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder=" "
                  className="w-full bg-surface-container-low border border-outline-variant rounded-[24px] px-4 text-base text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all focus:bg-surface-container-lowest"
                />
                <label htmlFor="email">Email Address</label>
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <div className="floating-group relative w-full">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
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

            {/* Terms and Conditions */}
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

            {/* Submit Button */}
            <div className="pt-6">
              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-primary hover:bg-primary/90 text-on-primary text-sm font-medium rounded-full py-4 transition-all active:scale-[0.98] shadow-sm flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? 'Creating...' : 'Create Account'}
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </form>

          {/* Footer Link */}
          <div className="mt-8 text-center border-t border-outline-variant/30 pt-6">
            <p className="text-sm text-on-surface-variant">
              Already have an account?
              <Link to="/login" className="text-sm text-primary font-bold hover:underline ml-1">Login</Link>
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-surface-container-low border-t border-outline-variant full-width bottom-0 z-10 relative">
        <div className="w-full py-8 px-4 md:px-6 mt-auto flex flex-col md:flex-row justify-between items-center gap-4 max-w-[1200px] mx-auto">
          <div className="text-base font-bold font-mono text-on-surface flex items-center gap-2">
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
            © 2026 FinTech. All rights reserved to team buildprojectnexus. This is project is designed specially for project subject Software Engineering and Design
          </div>
        </div>
      </footer>
    </motion.div>
  );
}