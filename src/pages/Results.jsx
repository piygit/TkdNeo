import { useApp } from '../lib/store';

export default function Results() {
  const { state } = useApp();
  const divNames = Object.keys(state.results);

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4 mb-6 no-print">
        <div>
          <h2 className="text-3xl font-black tracking-tight mb-1" style={{ fontFamily: 'var(--font-mono)' }}>RESULTS</h2>
          <p className="text-sm text-gray-500">Final standings for completed divisions</p>
        </div>
        {divNames.length > 0 && (
          <button onClick={() => window.print()} className="brutal-btn brutal-btn-white text-sm">DOWNLOAD RESULTS</button>
        )}
      </div>

      <div className="print-only items-center gap-4 pb-4 border-b-3 border-black mb-6">
        {state.settings.logo && <img src={state.settings.logo} alt="" className="h-16 border-3 border-black" />}
        <div>
          <h1 className="text-2xl font-black">{state.settings.name || 'Tournament'}</h1>
          <h2 className="text-lg font-bold text-gray-600">Final Results</h2>
        </div>
      </div>

      {divNames.length === 0 ? (
        <div className="brutal-card p-12 text-center">
          <div className="icon-circle w-16 h-16 text-xl grad-gold mx-auto mb-4">W</div>
          <p className="text-gray-400 font-medium">Complete all matches in a division to see results</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {divNames.map(name => {
            const r = state.results[name];
            return (
              <div key={name} className="brutal-card overflow-hidden">
                <div className="p-4 grad-blue text-white border-b-3 border-black">
                  <h4 className="font-bold text-sm uppercase tracking-wider">{name}</h4>
                </div>
                <div className="divide-y-2 divide-black">
                  {r.gold && <MedalRow name={r.gold.name} club={r.gold.club} label="GOLD" grad="grad-gold" letter="1" />}
                  {r.silver && <MedalRow name={r.silver.name} club={r.silver.club} label="SILVER" grad="grad-silver" letter="2" />}
                  {r.bronzes?.map((b, i) => (
                    <MedalRow key={i} name={b.name} club={b.club} label="BRONZE" grad="grad-bronze" letter="3" />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function MedalRow({ name, club, label, grad, letter }) {
  return (
    <div className="px-5 py-4 flex items-center gap-4">
      <div className={`icon-circle w-10 h-10 text-sm ${grad}`}>{letter}</div>
      <div className="flex-1">
        <div className="font-bold text-sm">{name}</div>
        <div className="text-xs text-gray-500">{club || ''}</div>
      </div>
      <span className="text-[10px] font-black uppercase tracking-widest text-gray-600">{label}</span>
    </div>
  );
}
