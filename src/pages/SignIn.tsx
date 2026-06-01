import { HelpCircle, User, Lock, EyeOff, Eye, ArrowRight, ArrowLeft } from 'lucide-react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { AppIcon } from '../components/Layout';
import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'framer-motion';

export default function SignIn() {
  const [searchParams] = useSearchParams();
  const [role, setRole] = useState<'admin' | 'staff'>(
    searchParams.get('role') === 'staff' ? 'staff' : 'admin'
  );
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setError('');
      setLoading(true);
      await signIn(email, password);
      localStorage.setItem('userRole', role);
      navigate('/dashboard');
    } catch (err: any) {
      setError('Failed to sign in. ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const urlRole = searchParams.get('role');
    if (urlRole === 'staff' || urlRole === 'admin') {
      setRole(urlRole);
    }
  }, [searchParams]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
      className="min-h-screen flex flex-col font-sans bg-surface-container-low text-on-surface"
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
      <main className="flex-grow flex items-center justify-center p-4 md:p-6 w-full relative overflow-hidden bg-surface-container-low">

        {/* Subtle decorative background element */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden flex justify-center items-center">
          <div className="w-[800px] h-[800px] bg-primary-container opacity-20 rounded-full blur-[120px] -translate-y-1/4"></div>
        </div>

        {/* Sign In Card */}
        <div className="w-full max-w-md bg-surface rounded-[24px] shadow-sm border border-outline-variant/30 p-8 z-10 flex flex-col items-center">

          {/* Logo & Header */}
          <div className="w-12 h-12 bg-primary-container rounded-full flex items-center justify-center mb-6">
            <AppIcon className="text-white w-6 h-6" />
          </div>
          <h1 className="text-2xl text-on-surface mb-2 font-normal">Sign In</h1>
          <p className="text-sm text-on-surface-variant mb-8 text-center">Welcome back to FinTech. Please enter your details.</p>

          {/* Segmented Control */}
          <div className="w-full bg-surface-container-highest rounded-full p-1 flex mb-8 relative">
            {/* Sliding background indicator */}
            <div
              className="absolute top-1 bottom-1 left-1 w-[calc(50%-4px)] bg-surface rounded-full shadow-sm transition-transform duration-300 ease-out pointer-events-none"
              style={{
                transform: role === 'admin' ? 'translateX(0)' : 'translateX(100%)',
              }}
            />
            <button
              onClick={() => setRole('admin')}
              className={`relative z-10 flex-1 py-2 px-4 rounded-full text-sm font-medium transition-all cursor-pointer bg-transparent ${role === 'admin'
                  ? 'text-on-surface'
                  : 'text-on-surface-variant hover:text-on-surface'
                }`}
            >Admin Login</button>
            <button
              onClick={() => setRole('staff')}
              className={`relative z-10 flex-1 py-2 px-4 rounded-full text-sm font-medium transition-all cursor-pointer bg-transparent ${role === 'staff'
                  ? 'text-on-surface'
                  : 'text-on-surface-variant hover:text-on-surface'
                }`}
            >Staff Login</button>
          </div>

          {error && <div className="mb-8 w-full p-3 bg-error/10 text-error text-sm rounded-lg border border-error/20">{error}</div>}

          {/* Form */}
          <form className="w-full space-y-6" onSubmit={handleSubmit}>
            {/* Email/Phone Field */}
            <div className="w-full flex flex-col">
              <div className="floating-group relative w-full">
                <User className="absolute left-[12px] top-1/2 -translate-y-1/2 text-on-surface-variant w-6 h-6 z-10 pointer-events-none" />
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder=" "
                  className="w-full bg-surface-container-low border border-outline-variant text-on-surface text-base rounded-[24px] pl-[52px] pr-4 text-left focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none"
                />
                <label htmlFor="identifier">Email / Phone Number</label>
              </div>
            </div>

            {/* Password Field */}
            <div className="w-full flex flex-col">
              <div className="floating-group relative w-full">
                <Lock className="absolute left-[12px] top-1/2 -translate-y-1/2 text-on-surface-variant w-6 h-6 z-10 pointer-events-none" />
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder=" "
                  className="w-full bg-surface-container-low border border-outline-variant text-on-surface text-base rounded-[24px] pl-[52px] pr-[52px] text-left focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none"
                />
                <label htmlFor="password">Password</label>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-[12px] top-1/2 -translate-y-1/2 text-on-surface-variant cursor-pointer hover:text-on-surface w-6 h-6 z-10 p-0 bg-transparent border-none flex items-center justify-center"
                >
                  {showPassword ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center pt-2">
              <input
                type="checkbox"
                id="remember"
                className="w-5 h-5 rounded-[4px] border-outline text-primary focus:ring-primary bg-surface-container-low"
              />
              <label htmlFor="remember" className="ml-2 text-sm text-on-surface-variant">Remember me for 30 days</label>
            </div>

            {/* Submit Button */}
            <div className="pt-4 w-full">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary text-on-primary text-sm font-medium py-4 rounded-full hover:bg-primary-container hover:text-on-primary-container transition-colors shadow-sm flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
              >
                {loading ? 'Logging in...' : 'Login'}
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </form>

          {/* Footer Links */}
          <div className="mt-8 text-center border-t border-outline-variant/30 pt-6 w-full flex flex-col items-center gap-4">
            <p className="text-sm text-on-surface-variant">
              Don't have an account?
              <Link to="/register" className="text-sm text-primary font-bold hover:underline ml-1">Sign Up</Link>
            </p>
            <a href="#" className="text-sm font-medium text-primary hover:underline transition-all">Forgot password?</a>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-surface-container-low border-t border-outline-variant full-width bottom-0 z-10 relative">
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
            © 2026 FinTech. All rights reserved to team buildprojectnexus. This is project is designed specially for project subject Software Engineering and Design
          </div>
        </div>
      </footer>
    </motion.div>
  );
}
