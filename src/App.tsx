import { BrowserRouter, Routes, Route, Navigate, NavLink, useLocation } from 'react-router-dom';
import { Users, QrCode, Settings, PenLine } from 'lucide-react';
import LeadDashboard from './features/lead-capture/components/LeadDashboard';
import LeadDetail from './features/lead-capture/components/LeadDetail';
import QRScanner from './features/lead-capture/components/QRScanner';
import ManualEntryForm from './features/lead-capture/components/ManualEntryForm';
import SettingsPage from './features/lead-capture/components/SettingsPage';
import ToastContainer from './features/lead-capture/components/Toast';

function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const isScanner = location.pathname === '/lead-capture/scan';

  if (isScanner) return <>{children}</>;

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:w-56 bg-white border-r border-border flex-col shrink-0">
        <div className="p-4 border-b border-border">
          <div className="h-1 w-full rounded-full bg-gradient-to-r from-accent to-warm mb-3" />
          <h1 className="font-bold text-text-primary text-sm">CINDE Admin</h1>
          <p className="text-xs text-text-light">Life Sciences Forum</p>
        </div>
        <nav className="flex-1 p-2 space-y-0.5">
          <SidebarLink to="/lead-capture" icon={Users} label="Leads" end />
          <SidebarLink to="/lead-capture/scan" icon={QrCode} label="Scanner" />
          <SidebarLink to="/lead-capture/manual" icon={PenLine} label="Manual Entry" />
          <SidebarLink to="/lead-capture/settings" icon={Settings} label="Settings" />
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 min-h-screen bg-bg">{children}</main>

      {/* Mobile Bottom Nav */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-border flex z-30">
        <MobileNavLink to="/lead-capture" icon={Users} label="Leads" end />
        <MobileNavLink to="/lead-capture/scan" icon={QrCode} label="Scan" />
        <MobileNavLink to="/lead-capture/manual" icon={PenLine} label="Manual" />
        <MobileNavLink to="/lead-capture/settings" icon={Settings} label="Settings" />
      </nav>
    </div>
  );
}

function SidebarLink({ to, icon: Icon, label, end }: { to: string; icon: React.ElementType; label: string; end?: boolean }) {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        `flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
          isActive ? 'bg-primary/10 text-primary' : 'text-text-light hover:bg-bg hover:text-text-primary'
        }`
      }
    >
      <Icon size={18} />
      {label}
    </NavLink>
  );
}

function MobileNavLink({ to, icon: Icon, label, end }: { to: string; icon: React.ElementType; label: string; end?: boolean }) {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        `flex-1 flex flex-col items-center gap-0.5 py-2 text-[10px] font-medium transition-colors ${
          isActive ? 'text-primary' : 'text-text-light'
        }`
      }
    >
      <Icon size={20} />
      {label}
    </NavLink>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/lead-capture" element={<LeadDashboard />} />
          <Route path="/lead-capture/leads/:id" element={<LeadDetail />} />
          <Route path="/lead-capture/scan" element={<QRScanner />} />
          <Route path="/lead-capture/manual" element={<ManualEntryForm />} />
          <Route path="/lead-capture/settings" element={<SettingsPage />} />
          <Route path="*" element={<Navigate to="/lead-capture" replace />} />
        </Routes>
      </Layout>
      <ToastContainer />
    </BrowserRouter>
  );
}
