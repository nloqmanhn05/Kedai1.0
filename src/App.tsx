import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Landing from "./pages/Landing";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Ledger from "./pages/Ledger";
import AIAssistant from "./pages/AIAssistant";
import Settings from "./pages/Settings";
import Staff from "./pages/Staff";
import TransactionHistory from "./pages/TransactionHistory";
import Menu from "./pages/Menu";
import Stock from "./pages/Stock/Stock";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Default to Landing page on app launch */}
        <Route path="/" element={<Landing />} />
        
        {/* Auth Routes */}
        <Route path="/login" element={<SignIn />} />
        <Route path="/register" element={<SignUp />} />
        <Route path="/landing" element={<Landing />} />
        
        {/* Main App Routes */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/ledger" element={<Ledger />} />
        <Route path="/assistant" element={<AIAssistant />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/staff" element={<Staff />} />
        <Route path="/transactions" element={<TransactionHistory />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/stock" element={<Stock />} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
