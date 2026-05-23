import { useApp } from '../lib/store';
import { generateBracket } from '../lib/tournamentLogic';
import { useState } from 'react';

export default function Fixtures() {
  const { state, dispatch } = useApp();
  const [selectedDiv, setSelectedDiv] = useState('');
  const [viewAll, setViewAll] = useState(false);
  const divNames = Object.keys(state.divisions).filter(d => state.divisions[d].length >= 1);

  const generateSingle = () => {
    if (!selectedDiv) { alert('Select a division'); return; }
    dispatch({ type: 'SET_BRACKET', division: selectedDiv, rounds: generateBracket(state.divisions[selectedDiv]) });
    setViewAll(false);
  };

  const generateAll = () => {
    divNames.forEach(div => {
      dispatch({ type: 'SET_BRACKET', division: div, rounds: generateBracket(state.divisions[div]) });
    });
    setViewAll(true);
  };

  const handlePrint = (title) => {
    const originalTitle = document.title;
    document.title = title;
    window.print();
    document.title = originalTitle;
  };

  const buildTree = (rounds) => {
    if (!rounds || rounds.length === 0) return null;
    const finalMatch = rounds[rounds.length - 1][0];
    const totalRounds = rounds.length;
    
    const buildNode = (match, roundIndex) => {
      if (!match) return null;
      const node = { match, children: [], roundIndex, totalRounds };
      if (match.parent1Id) {
        for (const round of rounds) {
          for (const m of round) {
            if (m.id === match.parent1Id) node.children.push(buildNode(m, roundIndex - 1));
            if (m.id === match.parent2Id) node.children.push(buildNode(m, roundIndex - 1));
          }
        }
      }
      return node;
    };
    return buildNode(finalMatch, totalRounds - 1);
  };

  const displayDivs = viewAll ? divNames.filter(d => state.brackets[d]) : (selectedDiv && state.brackets[selectedDiv] ? [selectedDiv] : []);
  const todayDate = new Date().toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute:'2-digit' });

  return (
    <div>
      <div className="no-print mb-8">
        <h2 className="text-3xl font-black tracking-tight mb-1" style={{ fontFamily: 'var(--font-mono)' }}>FIXTURES</h2>
        <p className="text-sm text-gray-500 mb-4">Professional draw sheets</p>
        <div className="flex flex-wrap gap-3 items-end">
          <div>
            <select className="brutal-select w-64" value={selectedDiv} onChange={e => { setSelectedDiv(e.target.value); setViewAll(false); }}>
              <option value="">Select Division</option>
              {divNames.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
          <button onClick={generateSingle} className="brutal-btn brutal-btn-blue text-sm h-[42px]">GENERATE BRACKET</button>
          <div className="w-1 h-8 border-l-2 border-gray-300 mx-2"></div>
          <button onClick={generateAll} className="brutal-btn grad-dark text-white text-sm h-[42px]">GENERATE ALL</button>
          
          {displayDivs.length > 0 && (
            <button onClick={() => handlePrint(viewAll ? 'All_Draws' : selectedDiv)} className="brutal-btn brutal-btn-white text-sm h-[42px] border-dashed border-2 ml-auto">
              ↓ DOWNLOAD PDF (KIHAPP STYLE)
            </button>
          )}
        </div>
      </div>

      {displayDivs.length === 0 ? (
        <div className="brutal-card p-12 text-center no-print">
          <div className="icon-circle w-16 h-16 text-xl grad-amber mx-auto mb-4">F</div>
          <p className="text-gray-400 font-medium">Select a division or generate all brackets to view fixtures</p>
        </div>
      ) : (
        <div className="flex flex-col w-full bg-gray-50 p-4 print:p-0 print:bg-white print:block">
          {displayDivs.map((div, index) => {
            const tree = buildTree(state.brackets[div]);
            const totalRounds = tree ? tree.totalRounds : 0;
            
            // Auto-scale large brackets so they fit on one A4 page
            let bracketScale = 1;
            if (totalRounds === 4) bracketScale = 0.85; // 16 players
            if (totalRounds === 5) bracketScale = 0.55; // 32 players
            if (totalRounds >= 6) bracketScale = 0.35;  // 64+ players

            return (
              <div key={div} className={`kihapp-page ${index !== 0 ? 'page-break' : ''} bg-white shadow-lg mb-8 mx-auto relative print:shadow-none print:mb-0 print:mx-0 overflow-hidden`}>
                
                {/* Header */}
                <div className="pt-8 px-10 pb-4">
                  <h1 className="text-2xl font-bold text-gray-900 tracking-tight" style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}>
                    {div}
                  </h1>
                </div>

                {/* Bracket Area with Dynamic Scaling */}
                <div className="px-10 pb-32 overflow-hidden min-h-[500px]">
                  <div className="bracket-wrapper pt-6" style={{ transform: `scale(${bracketScale})`, transformOrigin: 'left top' }}>
                    {tree ? <BracketNode node={tree} isRoot={true} /> : <p>No matches generated.</p>}
                  </div>
                </div>

                {/* 1st, 2nd, 3rd, 3rd Results Box */}
                <div className="absolute right-10 bottom-24 w-64 border border-gray-300 bg-white shadow-sm z-10">
                  <div className="flex border-b border-gray-300"><div className="w-12 border-r border-gray-300 p-2 text-xs text-gray-600 text-center">1st</div><div className="p-2 flex-1"></div></div>
                  <div className="flex border-b border-gray-300"><div className="w-12 border-r border-gray-300 p-2 text-xs text-gray-600 text-center">2nd</div><div className="p-2 flex-1"></div></div>
                  <div className="flex border-b border-gray-300"><div className="w-12 border-r border-gray-300 p-2 text-xs text-gray-600 text-center">3rd</div><div className="p-2 flex-1"></div></div>
                  <div className="flex"><div className="w-12 border-r border-gray-300 p-2 text-xs text-gray-600 text-center">3rd</div><div className="p-2 flex-1"></div></div>
                </div>

                {/* Print Footer */}
                <div className="absolute bottom-6 left-10 right-10 flex justify-between items-end border-t border-gray-200 pt-4">
                  <div className="flex items-center gap-4">
                    <div>
                      <div className="text-xs font-bold text-gray-800">{state.settings.name || 'Taekwondo Championship'}</div>
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-[10px] text-gray-500">Version 1</div>
                    <div className="text-[9px] text-gray-400 mt-1">Printed {todayDate}</div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="text-2xl font-black tracking-tighter text-blue-600">TKD <span className="text-red-500">NEO</span></div>
                  </div>
                </div>
                
              </div>
            );
          })}
        </div>
      )}

      <style>{kihappCSS}</style>
    </div>
  );
}

function BracketNode({ node, isRoot }) {
  const { match, roundIndex, totalRounds } = node;
  const p1 = match.player1;
  const p2 = match.player2;
  const isBye = p2 && p2.id === 'BYE';

  const diff = totalRounds - 1 - roundIndex;
  let roundName = '';
  if (diff === 0) roundName = 'Final';
  else if (diff === 1) roundName = 'Semifinal';
  else if (diff === 2) roundName = 'Quarterfinal';
  else roundName = `Round of ${Math.pow(2, diff + 1)}`;

  return (
    <div className="bracket-node">
      {node.children.length > 0 && (
        <div className="bracket-children">
          {node.children.map((child, i) => (
            <BracketNode key={child.match.id} node={child} isRoot={false} />
          ))}
        </div>
      )}
      
      {node.children.length > 0 && <div className="bracket-connector" />}
      
      <div className="flex flex-col">
        <div className="text-xs text-gray-600 font-medium mb-1 pl-2">{roundName}</div>
        <div className="k-match-box">
          {/* Player 1 (RED) */}
          <div className="k-player k-red">
            <div className="k-p-info">
              <span className="k-name">{p1?.name || ''}</span>
              <span className="k-club">{p1?.club || ''}</span>
            </div>
            <div className="k-p-flag"></div>
          </div>
          {/* Player 2 (BLUE) */}
          <div className="k-player k-blue border-t border-gray-300">
            <div className="k-p-info">
              <span className="k-name">{isBye ? '' : (p2?.name || '')}</span>
              <span className="k-club">{!isBye && p2?.club ? p2.club : ''}</span>
            </div>
            <div className="k-p-flag"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

const kihappCSS = `
  .page-break {
    page-break-before: always;
  }

  .kihapp-page {
    width: 297mm;
    height: 210mm; /* A4 Landscape dimensions */
    position: relative;
    font-family: Helvetica, Arial, sans-serif;
  }

  .bracket-wrapper {
    display: flex;
    align-items: center;
  }

  .bracket-node {
    display: flex;
    align-items: center;
  }

  .bracket-children {
    display: flex;
    flex-direction: column;
    justify-content: center;
    position: relative;
  }

  .bracket-children::after {
    content: '';
    position: absolute;
    right: 0;
    top: 25%;
    bottom: 25%;
    width: 1px;
    background: #a3a3a3; /* Thin grey connecting line */
  }

  .bracket-children > .bracket-node:first-child { padding-bottom: 12px; }
  .bracket-children > .bracket-node:last-child { padding-top: 12px; }

  .bracket-connector {
    width: 24px;
    height: 1px;
    background: #a3a3a3;
    flex-shrink: 0;
  }

  .bracket-children > .bracket-node::after {
    content: '';
    width: 24px;
    height: 1px;
    background: #a3a3a3;
    flex-shrink: 0;
  }

  /* Kihapp Style Match Box */
  .k-match-box {
    width: 280px;
    border: 1px solid #d1d5db; /* Light grey border */
    background: #fff;
    flex-shrink: 0;
    box-sizing: border-box;
  }

  .k-player {
    display: flex;
    justify-content: space-between;
    height: 38px;
    padding: 4px 8px;
    box-sizing: border-box;
    background: #fff;
  }

  /* Thick corner colors */
  .k-red { border-left: 8px solid #ef4444; }
  .k-blue { border-left: 8px solid #3b82f6; }

  .k-p-info {
    display: flex;
    flex-direction: column;
    justify-content: center;
    overflow: hidden;
  }

  .k-name {
    font-size: 13px;
    font-weight: 700;
    color: #111827;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    line-height: 1.2;
  }

  .k-club {
    font-size: 10px;
    color: #6b7280;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    line-height: 1.2;
  }

  .k-p-flag {
    width: 32px;
    border-left: 1px solid #e5e7eb;
    margin: -4px -8px -4px 8px; /* Extend to fill height */
  }

  @media print {
    @page { size: A4 landscape; margin: 0; }
    body { -webkit-print-color-adjust: exact; print-color-adjust: exact; background: #fff; }
    .kihapp-page { width: 100%; height: 100vh; margin: 0; box-shadow: none; border: none; overflow: hidden; page-break-after: always; }
    .no-print { display: none !important; }
  }
`;
