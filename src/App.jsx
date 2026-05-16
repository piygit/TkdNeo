import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from './lib/store';
import AuthScreen from './components/AuthScreen';
import PaywallScreen from './components/PaywallScreen';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Registration from './pages/Registration';
import Divisions from './pages/Divisions';
import Fixtures from './pages/Fixtures';
import Matches from './pages/Matches';
import ClubStandings from './pages/ClubStandings';
import Results from './pages/Results';

function AppRouter() {
  const { auth } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Auth gate
  if (!auth.isLoggedIn) return <AuthScreen />;
  if (!auth.hasPaid) return <PaywallScreen />;

  return (
    <BrowserRouter>
      <div className="flex min-h-screen">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        {/* Mobile header */}
        <div className="fixed top-0 left-0 right-0 h-14 bg-black text-white flex items-center gap-3 px-4 z-40 lg:hidden no-print">
          <button onClick={() => setSidebarOpen(true)} className="text-xl font-bold">MENU</button>
          <h1 className="text-lg font-black" style={{ fontFamily: 'var(--font-mono)' }}>TKD NEO</h1>
        </div>

        {/* Main content */}
        <main className="flex-1 lg:ml-64 p-6 lg:p-10 pt-18 lg:pt-10 min-h-screen">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/registration" element={<Registration />} />
            <Route path="/divisions" element={<Divisions />} />
            <Route path="/fixtures" element={<Fixtures />} />
            <Route path="/matches" element={<Matches />} />
            <Route path="/standings" element={<ClubStandings />} />
            <Route path="/results" element={<Results />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default AppRouter;
