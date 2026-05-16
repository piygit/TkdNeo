import { useApp } from '../lib/store';
import { getWeightClass } from '../lib/tournamentLogic';
import { useState } from 'react';

export default function Registration() {
  const { state, dispatch } = useApp();
  const [form, setForm] = useState({ name: '', club: '', age: '', gender: '', weight: '' });
  const [scanning, setScanning] = useState(false);
  const [scanResult, setScanResult] = useState([]);

  const handleFileScan = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setScanning(true);
    
    try {
      let text = '';
      if (file.type === 'application/pdf') {
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await window.pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const content = await page.getTextContent();
          text += content.items.map(item => item.str).join(' ') + '\n';
        }
      } else {
        const res = await window.Tesseract.recognize(file, 'eng');
        text = res.data.text;
      }

      const lines = text.split('\n').filter(l => l.trim().length > 5);
      
      // Simple parser: Name, Club, Weight
      const found = lines.map(line => {
        // Try to be smarter about extracting names and weights
        const parts = line.trim().split(/\s+/);
        const weightPart = parts.find(p => !isNaN(parseFloat(p)) && parseFloat(p) > 10 && parseFloat(p) < 150);
        let nameParts = [];
        let clubParts = [];
        
        let foundWeight = false;
        parts.forEach(p => {
            if (p === weightPart || (weightPart && p.includes(weightPart))) {
                foundWeight = true;
            } else if (!foundWeight && isNaN(p)) {
                if (nameParts.length < 2) nameParts.push(p);
                else clubParts.push(p);
            }
        });

        return {
          name: nameParts.join(' ') || 'Unknown',
          club: clubParts.join(' ') || 'Club',
          weight: weightPart ? parseFloat(weightPart) : 50
        };
      });
      setScanResult(found);
    } catch (err) {
      alert("Error scanning file: " + err.message);
    }
    setScanning(false);
  };

  const addScannedAthletes = () => {
    scanResult.forEach(s => {
      const age = form.age || "Senior (18+)";
      const gender = form.gender || "Male";
      const wc = getWeightClass(age, gender, parseFloat(s.weight));
      const division = `${age} ${gender} ${wc}`;
      dispatch({ type: 'ADD_ATHLETE', athlete: {
        id: 'a_' + Date.now() + '_' + Math.random().toString(36).slice(2, 6),
        name: s.name, club: s.club, age, gender, weight: parseFloat(s.weight), weightClass: wc, division
      }});
    });
    setScanResult([]);
    alert(`Successfully added ${scanResult.length} athletes!`);
  };

  const handleSubmit = e => {
    e.preventDefault();
    if (!form.name || !form.club || !form.age || !form.gender || !form.weight) return;
    const wc = getWeightClass(form.age, form.gender, parseFloat(form.weight));
    const division = `${form.age} ${form.gender} ${wc}`;
    const athlete = {
      id: 'a_' + Date.now() + '_' + Math.random().toString(36).slice(2, 6),
      ...form, weight: parseFloat(form.weight), weightClass: wc, division,
    };
    dispatch({ type: 'ADD_ATHLETE', athlete });
    setForm({ name: '', club: '', age: '', gender: '', weight: '' });
  };

  return (
    <div>
      <h2 className="text-3xl font-black tracking-tight mb-1" style={{ fontFamily: 'var(--font-mono)' }}>REGISTRATION</h2>
      <p className="text-sm text-gray-500 mb-6">Register athletes for the tournament</p>

      <div className="brutal-card mb-8">
        <div className="p-4 border-b-3 border-black grad-amber flex justify-between items-center">
          <h3 className="font-bold text-sm uppercase tracking-wider">Photo AI Scanner</h3>
          {scanning && <span className="animate-pulse text-xs font-bold">SCANNING IMAGE...</span>}
        </div>
        <div className="p-6">
          <p className="text-xs mb-4">Upload a PDF or Photo of your list. The AI will extract names and weights.</p>
          <div className="flex gap-4">
            <label className="brutal-btn brutal-btn-white flex-1 text-center cursor-pointer">
              {scanning ? "Processing..." : "SELECT PDF OR PHOTO"}
              <input type="file" className="hidden" onChange={handleFileScan} accept="image/*,application/pdf" disabled={scanning} />
            </label>
          </div>

          {scanResult.length > 0 && (
            <div className="mt-6 border-t-2 border-black pt-4">
              <h4 className="font-bold text-sm mb-2">SCANNED RESULTS ({scanResult.length})</h4>
              <div className="max-h-60 overflow-y-auto mb-4 border-2 border-black">
                <table className="w-full text-left text-xs">
                  <thead className="bg-gray-100 border-b-2 border-black">
                    <tr><th className="p-2">Name</th><th className="p-2">Club</th><th className="p-2">Weight</th></tr>
                  </thead>
                  <tbody>
                    {scanResult.map((s, idx) => (
                      <tr key={idx} className="border-b border-gray-200">
                        <td className="p-2"><input className="w-full border-none p-0" value={s.name} onChange={e => {
                          const newRes = [...scanResult]; newRes[idx].name = e.target.value; setScanResult(newRes);
                        }} /></td>
                        <td className="p-2"><input className="w-full border-none p-0" value={s.club} onChange={e => {
                          const newRes = [...scanResult]; newRes[idx].club = e.target.value; setScanResult(newRes);
                        }} /></td>
                        <td className="p-2"><input className="w-full border-none p-0" value={s.weight} onChange={e => {
                          const newRes = [...scanResult]; newRes[idx].weight = e.target.value; setScanResult(newRes);
                        }} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="bg-blue-50 p-4 border-2 border-black mb-4">
                <p className="text-[10px] font-bold uppercase mb-2">Apply to all scanned athletes:</p>
                <div className="grid grid-cols-2 gap-2">
                  <select className="brutal-select text-xs" value={form.age} onChange={e => setForm({...form, age: e.target.value})}>
                    <option value="Senior (18+)">Senior (18+)</option>
                    <option value="Pee-Wee (Under 7)">Pee-Wee (Under 7)</option>
                    <option value="Sub-Junior (Under 12)">Sub-Junior (Under 12)</option>
                    <option value="Cadet (12-14)">Cadet (12-14)</option>
                    <option value="Junior (15-17)">Junior (15-17)</option>
                  </select>
                  <select className="brutal-select text-xs" value={form.gender} onChange={e => setForm({...form, gender: e.target.value})}>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>
              </div>
              <button onClick={addScannedAthletes} className="brutal-btn brutal-btn-green w-full">CONFIRM & ADD ALL ATHLETES</button>
            </div>
          )}
        </div>
      </div>

      <div className="brutal-card mb-8">
        <div className="p-4 border-b-3 border-black grad-blue text-white">
          <h3 className="font-bold text-sm uppercase tracking-wider">New Athlete</h3>
        </div>
        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider mb-2">Full Name *</label>
              <input className="brutal-input" placeholder="Athlete name" value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })} required />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider mb-2">Club / Team *</label>
              <input className="brutal-input" placeholder="Club name" value={form.club}
                onChange={e => setForm({ ...form, club: e.target.value })} required />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider mb-2">Age Category *</label>
              <select className="brutal-select" value={form.age}
                onChange={e => setForm({ ...form, age: e.target.value })} required>
                <option value="">Select</option>
                <option value="Pee-Wee (Under 7)">Pee-Wee (Under 7)</option>
                <option value="Sub-Junior (Under 12)">Sub-Junior (Under 12)</option>
                <option value="Cadet (12-14)">Cadet (12-14)</option>
                <option value="Junior (15-17)">Junior (15-17)</option>
                <option value="Senior (18+)">Senior (18+)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider mb-2">Gender *</label>
              <select className="brutal-select" value={form.gender}
                onChange={e => setForm({ ...form, gender: e.target.value })} required>
                <option value="">Select</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider mb-2">Weight (kg) *</label>
              <input type="number" step="0.1" className="brutal-input" placeholder="e.g. 68.5" value={form.weight}
                onChange={e => setForm({ ...form, weight: e.target.value })} required />
            </div>
            <div className="flex items-end">
              <button type="submit" className="brutal-btn brutal-btn-green w-full text-sm">+ REGISTER</button>
            </div>
          </div>
        </form>
      </div>

      <div className="brutal-card">
        <div className="p-4 border-b-3 border-black flex justify-between items-center">
          <h3 className="font-bold text-sm uppercase tracking-wider">Registered Athletes</h3>
          <span className="brutal-badge grad-dark text-white">{state.athletes.length} athletes</span>
        </div>
        <div className="overflow-x-auto">
          <table className="brutal-table">
            <thead><tr><th>#</th><th>Name</th><th>Club</th><th>Age</th><th>Gender</th><th>Weight</th><th>Division</th><th>Action</th></tr></thead>
            <tbody>
              {state.athletes.length === 0 ? (
                <tr><td colSpan="8" className="text-center py-8 text-gray-400">No athletes registered yet</td></tr>
              ) : state.athletes.map((a, i) => (
                <tr key={a.id}>
                  <td className="font-bold">{i + 1}</td>
                  <td className="font-bold">{a.name}</td>
                  <td>{a.club}</td>
                  <td>{a.age}</td>
                  <td>{a.gender}</td>
                  <td>{a.weight} kg</td>
                  <td><span className="brutal-badge bg-blue-100 text-[10px]">{a.division}</span></td>
                  <td>
                    <button onClick={() => dispatch({ type: 'DELETE_ATHLETE', id: a.id })}
                      className="brutal-btn brutal-btn-red text-xs py-1 px-3 border-2 shadow-[2px_2px_0_black]">DEL</button>
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
