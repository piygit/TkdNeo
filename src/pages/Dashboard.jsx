import { useApp } from '../lib/store';
import { useState, useRef } from 'react';

export default function Dashboard() {
  const { state, dispatch } = useApp();
  const [logoFile, setLogoFile] = useState(null);
  const [logoName, setLogoName] = useState('');
  const [saved, setSaved] = useState(false);
  const fileRef = useRef(null);

  const stats = [
    { label: 'Athletes', value: state.athletes.length, letter: 'A', grad: 'grad-blue' },
    { label: 'Divisions', value: Object.keys(state.divisions).length, letter: 'D', grad: 'grad-purple' },
    { label: 'Pending', value: countMatches(), letter: 'P', grad: 'grad-amber' },
    { label: 'Completed', value: Object.keys(state.results).length, letter: 'C', grad: 'grad-green' },
  ];

  function countMatches() {
    let count = 0;
    Object.values(state.brackets).forEach(rounds => {
      rounds.forEach(round => round.forEach(m => {
        if (m.player2?.id === 'BYE') return;
        if (!m.winner && m.player1 && m.player2) count++;
      }));
    });
    return count;
  }

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLogoFile(file);
      setLogoName(file.name);
    }
  };

  const saveSettings = () => {
    const name = document.getElementById('inp-name').value;
    if (logoFile) {
      const reader = new FileReader();
      reader.onload = e => {
        dispatch({ type: 'SET_SETTINGS', settings: { name, logo: e.target.result } });
        showSaved();
      };
      reader.readAsDataURL(logoFile);
    } else {
      dispatch({ type: 'SET_SETTINGS', settings: { ...state.settings, name } });
      showSaved();
    }
  };

  const seedTestData = () => {
    const clubs = ['Red Dragons', 'Blue Tigers', 'Golden Eagles', 'White Cobras', 'Iron Fists'];
    const divisions = [
      { age: 'Pee-Wee (Under 7)', gender: 'Male', weight: 18, wc: 'Under 20kg' },
      { age: 'Senior (18+)', gender: 'Male', weight: 54, wc: 'Under 54kg' },
      { age: 'Senior (18+)', gender: 'Male', weight: 58, wc: 'Under 58kg' },
      { age: 'Junior (15-17)', gender: 'Female', weight: 46, wc: 'Under 46kg' },
      { age: 'Cadet (12-14)', gender: 'Male', weight: 33, wc: 'Under 33kg' },
      { age: 'Sub-Junior (Under 12)', gender: 'Female', weight: 28, wc: 'Under 30kg' }
    ];

    const newAthletes = [];
    divisions.forEach(div => {
      for (let i = 1; i <= 10; i++) {
        const club = clubs[Math.floor(Math.random() * clubs.length)];
        newAthletes.push({
          id: `test_${div.wc}_${i}_${Math.random()}`,
          name: `${div.gender === 'Male' ? 'Mr.' : 'Ms.'} Athlete ${i} (${div.wc.split(' ')[1]})`,
          club: club,
          age: div.age,
          gender: div.gender,
          weight: div.weight,
          weightClass: div.wc,
          division: `${div.age} ${div.gender} ${div.wc}`
        });
      }
    });

    newAthletes.forEach(a => dispatch({ type: 'ADD_ATHLETE', athlete: a }));
    alert('50 Test Athletes seeded across 5 divisions!');
  };

  const showSaved = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const exportData = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(state));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "tkd_backup_" + Date.now() + ".json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6 no-print">
        <h2 className="text-3xl font-black tracking-tight" style={{ fontFamily: 'var(--font-mono)' }}>DASHBOARD</h2>
        <div className="flex gap-2">
          <button onClick={exportData} className="brutal-btn grad-amber text-[10px] py-2 px-4 border-2">
            EMERGENCY BACKUP (DOWNLOAD FILE)
          </button>
          <button onClick={() => window.location.reload()} className="brutal-btn brutal-btn-white text-[10px] py-2 px-4">
            FORCE CLOUD REFRESH
          </button>

          <button onClick={seedTestData} className="brutal-btn brutal-btn-black text-[10px] py-2 px-4">
            SEED TEST DATA (50 PLAYERS)
          </button>
        </div>
      </div>


      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map(s => (
          <div key={s.label} className="brutal-card p-5 flex items-center gap-4">
            <div className={`icon-circle w-14 h-14 text-lg ${s.grad}`}>{s.letter}</div>
            <div>
              <div className="text-3xl font-black" style={{ fontFamily: 'var(--font-mono)' }}>{s.value}</div>
              <div className="text-xs font-bold uppercase tracking-wider text-gray-500">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="brutal-card">
        <div className="p-4 border-b-3 border-black grad-dark text-white flex justify-between items-center">
          <h3 className="font-bold text-sm uppercase tracking-wider">Tournament Settings</h3>
          <span className="brutal-badge grad-blue text-white text-[10px]">PDF Header</span>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider mb-2">Tournament Name</label>
              <input id="inp-name" className="brutal-input" placeholder="e.g. National Championship 2026"
                defaultValue={state.settings.name} />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider mb-2">Tournament Logo</label>
              {/* Hidden file input */}
              <input type="file" accept="image/*" ref={fileRef} className="hidden"
                onChange={handleFileSelect} />
              {/* Styled button */}
              <div className="flex gap-2 items-center">
                <button onClick={() => fileRef.current.click()} className="brutal-btn brutal-btn-white text-sm flex-shrink-0">
                  CHOOSE FILE
                </button>
                <span className="text-sm text-gray-500 truncate">
                  {logoName || 'No file selected'}
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4 flex-wrap">
            <button onClick={saveSettings} className="brutal-btn brutal-btn-blue text-sm">SAVE SETTINGS</button>
            {saved && (
              <div className="brutal-badge grad-green text-white text-xs border-black animate-pulse">
                SETTINGS SAVED SUCCESSFULLY
              </div>
            )}
            {state.settings.logo && (
              <img src={state.settings.logo} alt="Logo" className="h-12 border-3 border-black" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
