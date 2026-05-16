import { useApp } from '../lib/store';
import { useState } from 'react';

export default function ClubStandings() {
  const { state, dispatch } = useApp();
  const [pts, setPts] = useState(state.settings.points || { gold: 5, silver: 3, bronze: 1 });
  const [printing, setPrinting] = useState(false);

  // Calculate stats
  const clubStats = {};
  Object.values(state.results).forEach(res => {
    if (res.gold?.club) {
      if (!clubStats[res.gold.club]) clubStats[res.gold.club] = { gold: 0, silver: 0, bronze: 0, points: 0 };
      clubStats[res.gold.club].gold += 1;
    }
    if (res.silver?.club) {
      if (!clubStats[res.silver.club]) clubStats[res.silver.club] = { gold: 0, silver: 0, bronze: 0, points: 0 };
      clubStats[res.silver.club].silver += 1;
    }
    res.bronzes?.forEach(b => {
      if (b?.club) {
        if (!clubStats[b.club]) clubStats[b.club] = { gold: 0, silver: 0, bronze: 0, points: 0 };
        clubStats[b.club].bronze += 1;
      }
    });
  });

  const sortedClubs = Object.entries(clubStats).map(([name, stats]) => {
    const totalPoints = (stats.gold * pts.gold) + (stats.silver * pts.silver) + (stats.bronze * pts.bronze);
    return { name, ...stats, totalPoints };
  }).sort((a, b) => b.totalPoints - a.totalPoints || b.gold - a.gold);

  const savePoints = () => {
    dispatch({ type: 'SET_SETTINGS', settings: { points: pts } });
    alert('Points updated and saved!');
  };

  const handlePrint = () => {
    setPrinting(true);
    setTimeout(() => {
      window.print();
      setPrinting(false);
    }, 100);
  };

  return (
    <div>
      {/* ── PRINTABLE SHEET (Hidden on screen) ── */}
      {printing && (
        <div className="print-sheet">
          <style>{`
            @media print {
              body * { visibility: hidden !important; }
              .print-sheet, .print-sheet * { visibility: visible !important; }
              .print-sheet {
                position: fixed !important;
                top: 0; left: 0; right: 0;
                background: white !important;
                z-index: 99999;
                padding: 40px;
              }
            }
          `}</style>

          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '24px', paddingBottom: '20px', borderBottom: '4px solid #000', marginBottom: '40px' }}>
            {state.settings.logo && <img src={state.settings.logo} alt="" style={{ height: '80px', border: '3px solid #000' }} />}
            <div>
              <h1 style={{ fontSize: '32px', fontWeight: 900, margin: 0, fontFamily: '"Space Mono", monospace', textTransform: 'uppercase' }}>
                {state.settings.name || 'TOURNAMENT CHAMPIONSHIP'}
              </h1>
              <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#333', margin: '4px 0 0' }}>
                OVERALL TEAM STANDINGS & CLUB TROPHY RESULTS
              </h2>
            </div>
          </div>

          {/* Standings Table */}
          <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: '"Space Grotesk", sans-serif' }}>
            <thead>
              <tr>
                <th style={thStyle}>RANK</th>
                <th style={thStyle}>CLUB / TEAM NAME</th>
                <th style={{ ...thStyle, textAlign: 'center' }}>GOLD</th>
                <th style={{ ...thStyle, textAlign: 'center' }}>SILVER</th>
                <th style={{ ...thStyle, textAlign: 'center' }}>BRONZE</th>
                <th style={{ ...thStyle, textAlign: 'center', background: '#2563eb' }}>TOTAL SCORE</th>
              </tr>
            </thead>
            <tbody>
              {sortedClubs.map((club, i) => (
                <tr key={club.name}>
                  <td style={{ ...tdStyle, fontWeight: 900, fontSize: '18px' }}>{i + 1}</td>
                  <td style={{ ...tdStyle, fontWeight: 700, fontSize: '16px', textTransform: 'uppercase' }}>{club.name}</td>
                  <td style={{ ...tdStyle, textAlign: 'center' }}>{club.gold}</td>
                  <td style={{ ...tdStyle, textAlign: 'center' }}>{club.silver}</td>
                  <td style={{ ...tdStyle, textAlign: 'center' }}>{club.bronze}</td>
                  <td style={{ ...tdStyle, textAlign: 'center', fontWeight: 900, fontSize: '20px', background: '#f8fafc' }}>{club.totalPoints}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Official Signatures */}
          <div style={{ marginTop: '80px', display: 'flex', justifyContent: 'space-between' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ width: '200px', borderBottom: '2px solid #000', marginBottom: '8px' }}></div>
              <p style={{ fontSize: '12px', fontWeight: 800, textTransform: 'uppercase' }}>Secretary</p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ width: '200px', borderBottom: '2px solid #000', marginBottom: '8px' }}></div>
              <p style={{ fontSize: '12px', fontWeight: 800, textTransform: 'uppercase' }}>Technial Official</p>
            </div>
          </div>

          {/* Footer Timestamp */}
          <div style={{ marginTop: '40px', fontSize: '10px', color: '#999', textAlign: 'right' }}>
            Generated by TKD Neo Pro — {new Date().toLocaleString()}
          </div>
        </div>
      )}

      {/* ── SCREEN UI (Normal Dashboard View) ── */}
      <div className="flex flex-wrap items-end justify-between gap-4 mb-6 no-print">
        <div>
          <h2 className="text-3xl font-black tracking-tight mb-1" style={{ fontFamily: 'var(--font-mono)' }}>CLUB STANDINGS</h2>
          <p className="text-sm text-gray-500">Overall team championship leaderboard</p>
        </div>
        <button onClick={handlePrint} className="brutal-btn brutal-btn-white text-sm">DOWNLOAD TROPHY RESULTS</button>
      </div>

      <div className="brutal-card mb-8 no-print">
        <div className="p-4 border-b-3 border-black grad-dark text-white">
          <h3 className="font-bold text-sm uppercase tracking-wider">Configure Point System</h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider mb-2">Gold Points</label>
              <input type="number" className="brutal-input" value={pts.gold}
                onChange={e => setPts({ ...pts, gold: parseInt(e.target.value) || 0 })} />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider mb-2">Silver Points</label>
              <input type="number" className="brutal-input" value={pts.silver}
                onChange={e => setPts({ ...pts, silver: parseInt(e.target.value) || 0 })} />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider mb-2">Bronze Points</label>
              <input type="number" className="brutal-input" value={pts.bronze}
                onChange={e => setPts({ ...pts, bronze: parseInt(e.target.value) || 0 })} />
            </div>
          </div>
          <button onClick={savePoints} className="brutal-btn brutal-btn-blue text-sm">SAVE POINT SYSTEM</button>
        </div>
      </div>

      <div className="brutal-card overflow-hidden no-print">
        <div className="p-4 border-b-3 border-black grad-dark text-white flex justify-between items-center">
          <h3 className="font-bold text-sm uppercase tracking-wider">Team Leaderboard</h3>
          <span className="brutal-badge grad-blue text-white">{sortedClubs.length} CLUBS</span>
        </div>
        <div className="overflow-x-auto">
          <table className="brutal-table w-full">
            <thead>
              <tr>
                <th>RANK</th>
                <th>CLUB NAME</th>
                <th className="text-center">GOLD</th>
                <th className="text-center">SILVER</th>
                <th className="text-center">BRONZE</th>
                <th className="text-center">POINTS</th>
              </tr>
            </thead>
            <tbody>
              {sortedClubs.length === 0 ? (
                <tr><td colSpan="6" className="text-center py-12 text-gray-400 font-bold">No results available yet</td></tr>
              ) : sortedClubs.map((club, i) => (
                <tr key={club.name}>
                  <td className="font-black">#{i + 1}</td>
                  <td className="font-bold">{club.name}</td>
                  <td className="text-center">{club.gold}</td>
                  <td className="text-center">{club.silver}</td>
                  <td className="text-center">{club.bronze}</td>
                  <td className="text-center">
                    <span className="brutal-badge grad-blue text-white font-black px-4">{club.totalPoints}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

const thStyle = {
  textAlign: 'left',
  padding: '14px 16px',
  fontSize: '11px',
  fontWeight: 800,
  textTransform: 'uppercase',
  letterSpacing: '1.5px',
  background: '#000',
  color: '#fff',
  border: '2px solid #000',
};

const tdStyle = {
  padding: '14px 16px',
  fontSize: '14px',
  border: '2px solid #000',
};
