import { auth, googleProvider } from '../lib/firebase';
import { signInWithPopup } from 'firebase/auth';

export default function AuthScreen() {
  const loginGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err) {
      console.error(err);
      alert('Login failed: ' + err.message);
    }
  };

  const loginPhone = () => {
    alert('Phone login is being upgraded to Firebase. Please use Google Login for now to enable Sync.');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 grad-hero relative overflow-hidden">
      {/* Animated gradient orbs */}
      <div className="absolute w-96 h-96 rounded-full opacity-20 blur-3xl" style={{ background: 'linear-gradient(135deg, #2563eb, #7c3aed)', top: '-10%', right: '-5%' }} />
      <div className="absolute w-72 h-72 rounded-full opacity-15 blur-3xl" style={{ background: 'linear-gradient(135deg, #ec4899, #f97316)', bottom: '-5%', left: '-3%' }} />

      <div className="brutal-card p-10 text-center max-w-md w-full relative z-10" style={{ background: '#fff' }}>
        {/* Logo mark */}
        <div className="w-20 h-20 mx-auto mb-5 grad-blue border-3 border-black flex items-center justify-center" style={{ borderRadius: '16px', transform: 'rotate(-6deg)' }}>
          <span className="text-white font-black text-2xl" style={{ fontFamily: 'var(--font-mono)', transform: 'rotate(6deg)' }}>TKD</span>
        </div>

        <h1 className="text-4xl font-bold tracking-tight mb-1" style={{ fontFamily: 'var(--font-mono)' }}>
          TKD NEO
        </h1>
        <div className="inline-block brutal-badge grad-blue text-white border-black mb-6">
          Cloud Powered Pro
        </div>
        <p className="text-sm text-gray-600 mb-8">
          Sign in to sync your tournaments across all devices
        </p>

        <button onClick={loginGoogle} className="brutal-btn brutal-btn-white w-full mb-4 text-sm">
          <svg width="18" height="18" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
          Sync with Google Account
        </button>

        <p className="text-xs text-gray-400 mt-8">Real-time sync enabled for 3+ devices</p>
      </div>
    </div>
  );
}
