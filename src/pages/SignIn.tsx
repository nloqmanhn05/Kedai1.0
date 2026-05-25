import { HelpCircle, User, Lock, EyeOff, ArrowRight } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import { AppIcon } from '../components/Layout';
import { useState, useEffect } from 'react';

export default function SignIn() {
  const [searchParams] = useSearchParams();
  const [role, setRole] = useState<'admin' | 'staff'>(
    searchParams.get('role') === 'staff' ? 'staff' : 'admin'
  );

  useEffect(() => {
    const urlRole = searchParams.get('role');
    if (urlRole === 'staff' || urlRole === 'admin') {
      setRole(urlRole);
    }
  }, [searchParams]);

  return (
    <div className="min-h-screen flex flex-col font-sans bg-surface-container-low text-on-surface">
      {/* TopAppBar */}
      <header className="full-width top-0 w-full z-50">
        <div className="flex justify-between items-center w-full px-4 md:px-6 py-4 max-w-[1200px] mx-auto">
          <Link to="/" className="flex items-center gap-2">
            <AppIcon className="text-primary w-6 h-6" />
            <span className="text-2xl font-bold font-mono text-primary">FinTech</span>
          </Link>
        </div>
      </header>

      {/* Main Content Canvas */}
      <main className="flex-grow flex items-center justify-center p-4 md:p-6 w-full relative overflow-hidden bg-surface-container-low">

        {/* Abstract Background Decoration */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none opacity-40">
          <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[40%] rounded-full bg-primary-fixed blur-[100px]"></div>
          <div className="absolute bottom-[-10%] right-[-5%] w-[50%] h-[50%] rounded-full bg-secondary-fixed blur-[120px]"></div>
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
          <div className="w-full bg-surface-container-highest rounded-full p-1 flex mb-8">
            <button
              onClick={() => setRole('admin')}
              className={`flex-1 py-2 px-4 rounded-full text-sm font-medium transition-all cursor-pointer ${role === 'admin'
                  ? 'bg-surface text-on-surface shadow-sm'
                  : 'text-on-surface-variant hover:text-on-surface'
                }`}
            >Admin Login</button>
            <button
              onClick={() => setRole('staff')}
              className={`flex-1 py-2 px-4 rounded-full text-sm font-medium transition-all cursor-pointer ${role === 'staff'
                  ? 'bg-surface text-on-surface shadow-sm'
                  : 'text-on-surface-variant hover:text-on-surface'
                }`}
            >Staff Login</button>
          </div>

          {/* Form */}
          <form className="w-full space-y-6">
            {/* Email/Phone Field */}
            <div className="w-full flex flex-col">
              <div className="floating-group relative w-full">
                <User className="absolute left-[12px] top-1/2 text-on-surface-variant w-6 h-6 z-10 pointer-events-none" />
                <input
                  type="text"
                  id="identifier"
                  name="identifier"
                  placeholder=" "
                  className="w-full bg-surface-container-low border border-outline-variant text-on-surface text-base rounded-[24px] pl-[52px] pr-4 text-left focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none"
                />
                <label htmlFor="identifier">Email / Phone Number</label>
              </div>
            </div>

            {/* Password Field */}
            <div className="w-full flex flex-col">
              <div className="floating-group relative w-full">
                <Lock className="absolute left-[12px] top-1/2 text-on-surface-variant w-6 h-6 z-10 pointer-events-none" />
                <input
                  type="password"
                  id="password"
                  name="password"
                  placeholder=" "
                  className="w-full bg-surface-container-low border border-outline-variant text-on-surface text-base rounded-[24px] pl-[52px] pr-[52px] text-left focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none"
                />
                <label htmlFor="password">Password</label>
                <EyeOff className="absolute right-[12px] top-1/2 text-on-surface-variant cursor-pointer hover:text-on-surface w-6 h-6 z-10" />
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
              <Link
                to="/dashboard"
                onClick={() => {
                  localStorage.setItem('userRole', role);
                }}
                className="w-full bg-primary text-on-primary text-sm font-medium py-4 rounded-full hover:bg-primary-container hover:text-on-primary-container transition-colors shadow-sm flex items-center justify-center gap-2"
              >
                Login
                <ArrowRight className="w-5 h-5" />
              </Link>
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
          <div className="text-base font-bold text-on-surface flex items-center gap-2">
            <AppIcon className="text-white w-5 h-5" />
            FinTech
          </div>
          <div className="flex gap-6">
            <a href="#" className="text-sm text-on-surface-variant hover:text-primary transition-colors">Privacy Policy</a>
            <a href="#" className="text-sm text-on-surface-variant hover:text-primary transition-colors">Terms of Service</a>
            <a href="#" className="text-sm text-on-surface-variant hover:text-primary transition-colors">Contact Support</a>
          </div>
          <div className="text-[11px] text-on-surface-variant">
            © 2024 FinTech. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
