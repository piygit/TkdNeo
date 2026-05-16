import { useAuth } from '../lib/store';
import { useState } from 'react';

export default function PaywallScreen() {
  const { authDispatch } = useAuth();
  const [paying, setPaying] = useState(false);

  const handlePay = () => {
    setPaying(true);
    setTimeout(() => {
      authDispatch({ type: 'PAY' });
      setPaying(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 grad-hero relative overflow-hidden">
      <div className="absolute w-96 h-96 rounded-full opacity-20 blur-3xl" style={{ background: 'linear-gradient(135deg, #7c3aed, #ec4899)', top: '-10%', left: '-5%' }} />

      <div className="brutal-card p-10 text-center max-w-lg w-full relative z-10" style={{ background: '#fff' }}>
        <div className="w-16 h-16 mx-auto mb-4 grad-purple border-3 border-black rounded-full flex items-center justify-center">
          <span className="text-white font-black text-xl">PRO</span>
        </div>
        <h1 className="text-3xl font-bold tracking-tight mb-2" style={{ fontFamily: 'var(--font-mono)' }}>
          UNLOCK TKD NEO
        </h1>
        <p className="text-sm text-gray-600 mb-6">One-time payment for lifetime access</p>

        <div className="brutal-card p-6 mb-6" style={{ boxShadow: '4px 4px 0 #7c3aed' }}>
          <div className="flex items-baseline justify-center gap-1 mb-4">
            <span className="text-2xl font-bold">₹</span>
            <span className="text-6xl font-black" style={{ fontFamily: 'var(--font-mono)' }}>999</span>
            <span className="text-sm text-gray-500 ml-2">/ LIFETIME</span>
          </div>
          <div className="text-left space-y-2 mb-6">
            {['Unlimited Tournaments', 'PDF Export & Print', 'Auto Bracket Generation', 'Cloud Synced Data'].map(f => (
              <div key={f} className="flex items-center gap-3 text-sm font-medium">
                <div className="w-5 h-5 grad-green rounded-full border-2 border-black flex items-center justify-center">
                  <span className="text-white text-xs font-bold">✓</span>
                </div>
                {f}
              </div>
            ))}
          </div>
          <div className="w-44 h-44 mx-auto mb-4 border-3 border-dashed border-black flex flex-col items-center justify-center bg-gray-50">
            <span className="text-sm font-bold">UPI QR CODE</span>
            <span className="text-xs text-gray-400 mt-1">GPay / PhonePe / Paytm</span>
          </div>
        </div>

        <button onClick={handlePay} disabled={paying}
          className={`brutal-btn w-full text-sm ${paying ? 'brutal-btn-black opacity-70' : 'brutal-btn-purple'}`}>
          {paying ? 'VERIFYING PAYMENT...' : 'SIMULATE UPI PAYMENT'}
        </button>

        <button onClick={() => authDispatch({ type: 'LOGOUT' })}
          className="brutal-btn brutal-btn-white w-full mt-3 text-xs">
          SIGN OUT
        </button>
      </div>
    </div>
  );
}
