import { useApp } from '../lib/store';
import { getWeightClass } from '../lib/tournamentLogic';
import { useState } from 'react';

export default function Registration() {
  const { state, dispatch } = useApp();
  const [form, setForm] = useState({ name: '', club: '', age: '', gender: '', weight: '' });

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
