import { useApp } from '../lib/store';

export default function Divisions() {
  const { state, dispatch } = useApp();

  const generate = () => {
    const divs = {};
    state.athletes.forEach(a => {
      if (!divs[a.division]) divs[a.division] = [];
      divs[a.division].push(a);
    });
    dispatch({ type: 'SET_DIVISIONS', divisions: divs });
  };

  const divNames = Object.keys(state.divisions);
  const gradients = ['grad-blue', 'grad-purple', 'grad-red', 'grad-green', 'grad-amber'];

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
        <div>
          <h2 className="text-3xl font-black tracking-tight mb-1" style={{ fontFamily: 'var(--font-mono)' }}>DIVISIONS</h2>
          <p className="text-sm text-gray-500">Auto-grouped by age, gender & weight</p>
        </div>
        <button onClick={generate} className="brutal-btn brutal-btn-purple text-sm">GENERATE DIVISIONS</button>
      </div>

      {divNames.length === 0 ? (
        <div className="brutal-card p-12 text-center">
          <div className="icon-circle w-16 h-16 text-xl grad-purple mx-auto mb-4">G</div>
          <p className="text-gray-400 font-medium">Register athletes first, then generate divisions</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {divNames.map((name, idx) => (
            <div key={name} className="brutal-card overflow-hidden">
              <div className={`p-4 ${gradients[idx % gradients.length]} text-white border-b-3 border-black`}>
                <h4 className="font-bold text-sm uppercase tracking-wide">{name}</h4>
                <span className="text-xs opacity-80">{state.divisions[name].length} athlete(s)</span>
              </div>
              <div className="divide-y-2 divide-black">
                {state.divisions[name].map(a => (
                  <div key={a.id} className="px-4 py-3 flex justify-between items-center text-sm">
                    <span className="font-bold">{a.name}</span>
                    <span className="text-xs text-gray-500">{a.club}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
