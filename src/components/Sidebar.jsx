import { NavLink } from 'react-router-dom';
import { useAuth } from '../lib/store';
import { auth as fbAuth } from '../lib/firebase';
import { signOut } from 'firebase/auth';

const links = [
  { to: '/', label: 'Dashboard', icon: 'D', gradient: 'grad-blue' },
  { to: '/registration', label: 'Registration', icon: 'R', gradient: 'grad-green' },
  { to: '/divisions', label: 'Divisions', icon: 'G', gradient: 'grad-purple' },
  { to: '/fixtures', label: 'Fixtures', icon: 'F', gradient: 'grad-amber' },
  { to: '/matches', label: 'Run Matches', icon: 'M', gradient: 'grad-red' },
  { to: '/standings', label: 'Club Standings', icon: 'T', gradient: 'grad-purple' },
  { to: '/results', label: 'Results', icon: 'W', gradient: 'grad-gold' },
];

export default function Sidebar({ isOpen, onClose }) {
  const { auth } = useAuth();

  const handleLogout = () => {
    signOut(fbAuth);
  };

  return (
    <>
      {isOpen && <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={onClose} />}

      <aside className={`fixed top-0 left-0 bottom-0 w-64 grad-sidebar text-white flex flex-col z-50 transition-transform duration-300 no-print ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        {/* Brand */}
        <div className="p-5 border-b-3 border-white/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 grad-blue border-2 border-white flex items-center justify-center font-black text-sm" style={{ borderRadius: '10px' }}>
              TKD
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tight" style={{ fontFamily: 'var(--font-mono)' }}>TKD NEO</h1>
              <span className="text-[10px] font-bold uppercase tracking-[3px] text-blue-400">Cloud Sync</span>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {links.map(link => (
            <NavLink key={link.to} to={link.to} end={link.to === '/'}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 text-sm font-bold uppercase tracking-wide transition-all border-3 ${
                  isActive
                    ? 'bg-white/10 text-white border-white/30 shadow-[3px_3px_0_rgba(255,255,255,0.2)]'
                    : 'border-transparent text-gray-400 hover:text-white hover:bg-white/5 hover:border-white/10'
                }`
              }>
              <div className={`icon-circle w-7 h-7 text-xs ${link.gradient}`}>{link.icon}</div>
              {link.label}
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t-3 border-white/20 space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 grad-purple border-2 border-white rounded-full flex items-center justify-center text-xs font-bold">
              {auth.userName?.[0]?.toUpperCase() || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-bold truncate">{auth.userName || 'User'}</div>
              <div className="text-[10px] text-gray-400 truncate">{auth.email}</div>
            </div>
          </div>
          <button onClick={handleLogout}
            className="brutal-btn brutal-btn-white w-full text-xs py-2 border-2">
            SIGN OUT
          </button>
        </div>
      </aside>
    </>
  );
}
