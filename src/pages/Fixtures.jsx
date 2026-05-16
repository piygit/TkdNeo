import { useApp } from '../lib/store';
import { generateBracket } from '../lib/tournamentLogic';
import { useState } from 'react';

export default function Fixtures() {
  const { state, dispatch } = useApp();
  const [selectedDiv, setSelectedDiv] = useState('');
  const divNames = Object.keys(state.divisions);

  const generate = () => {
    if (!selectedDiv || !state.divisions[selectedDiv] || state.divisions[selectedDiv].length < 2) {
      alert('Select a division with at least 2 athletes'); return;
    }
    dispatch({ type: 'SET_BRACKET', division: selectedDiv, rounds: generateBracket(state.divisions[selectedDiv]) });
  };

  const rounds = selectedDiv ? state.brackets[selectedDiv] : null;

  // Build a tree structure for recursive rendering
  function buildTree(rounds) {
    if (!rounds || rounds.length === 0) return null;
    const finalMatch = rounds[rounds.length - 1][0];
    return buildNode(finalMatch, rounds);
  }

  function buildNode(match, rounds) {
    if (!match) return null;
    const node = { match, children: [] };
    // Find children in previous rounds
    if (match.parent1Id) {
      for (const round of rounds) {
        for (const m of round) {
          if (m.id === match.parent1Id) node.children.push(buildNode(m, rounds));
          if (m.id === match.parent2Id) node.children.push(buildNode(m, rounds));
        }
      }
    }
    return node;
  }

  const tree = rounds ? buildTree(rounds) : null;

  return (
    <div>
      <div className="no-print">
        <h2 className="text-3xl font-black tracking-tight mb-1" style={{ fontFamily: 'var(--font-mono)' }}>FIXTURES</h2>
        <p className="text-sm text-gray-500 mb-4">Single-elimination tournament brackets</p>
        <div className="flex flex-wrap gap-3 mb-6">
          <select className="brutal-select w-64" value={selectedDiv} onChange={e => setSelectedDiv(e.target.value)}>
            <option value="">Select Division</option>
            {divNames.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
          <button onClick={generate} className="brutal-btn brutal-btn-blue text-sm">GENERATE BRACKET</button>
          {rounds && <button onClick={() => window.print()} className="brutal-btn brutal-btn-white text-sm">DOWNLOAD PDF</button>}
        </div>
      </div>

      {/* Print header */}
      {rounds && (
        <div className="print-only items-center gap-4 pb-4 border-b-3 border-black mb-6">
          {state.settings.logo && <img src={state.settings.logo} alt="" className="h-16 border-3 border-black" />}
          <div>
            <h1 className="text-2xl font-black">{state.settings.name || 'Tournament'}</h1>
            <h2 className="text-lg font-bold text-gray-600">{selectedDiv}</h2>
          </div>
        </div>
      )}

      {!tree ? (
        <div className="brutal-card p-12 text-center">
          <div className="icon-circle w-16 h-16 text-xl grad-amber mx-auto mb-4">F</div>
          <p className="text-gray-400 font-medium">Select a division and generate a bracket</p>
        </div>
      ) : (
        <div className="overflow-x-auto pb-4">
          <div className="bracket-wrapper">
            <BracketNode node={tree} isRoot={true} />
          </div>
        </div>
      )}

      <style>{bracketCSS}</style>
    </div>
  );
}

function BracketNode({ node, isRoot }) {
  const { match } = node;
  const p1 = match.player1;
  const p2 = match.player2;
  const p1Win = match.winner && p1 && match.winner.id === p1.id;
  const p2Win = match.winner && p2 && match.winner.id === p2.id;
  const isBye = p2 && p2.id === 'BYE';

  return (
    <div className="bracket-node">
      {/* Children (left side, feeds into this match) */}
      {node.children.length > 0 && (
        <div className="bracket-children">
          {node.children.map((child, i) => (
            <BracketNode key={child.match.id} node={child} isRoot={false} />
          ))}
        </div>
      )}

      {/* Connector line from children to this match */}
      {node.children.length > 0 && <div className="bracket-connector" />}

      {/* Match box */}
      <div className={`bracket-match ${isRoot ? 'bracket-final' : ''}`}>
        {/* Player 1 */}
        <div className={`bracket-player bracket-p1 ${p1Win ? 'bracket-winner' : ''}`}>
          <div className="bracket-player-info">
            <span className="bracket-player-name">{p1?.name || 'TBD'}</span>
            {p1?.club && <span className="bracket-player-club">{p1.club}</span>}
          </div>
        </div>
        {/* Player 2 */}
        <div className={`bracket-player bracket-p2 ${isBye ? 'bracket-bye' : ''} ${p2Win ? 'bracket-winner' : ''}`}>
          <div className="bracket-player-info">
            <span className="bracket-player-name">{isBye ? 'BYE' : (p2?.name || 'TBD')}</span>
            {p2?.club && !isBye && <span className="bracket-player-club">{p2.club}</span>}
          </div>
        </div>
      </div>
    </div>
  );
}

const bracketCSS = `
  .bracket-wrapper {
    display: inline-block;
    padding: 24px 16px;
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

  /* Vertical line connecting two children */
  .bracket-children::after {
    content: '';
    position: absolute;
    right: 0;
    top: 50%;
    bottom: 50%;
    width: 3px;
    background: #000;
    z-index: 1;
  }

  /* Make vertical line span from first child center to second child center */
  .bracket-children > .bracket-node:first-child {
    padding-bottom: 8px;
  }
  .bracket-children > .bracket-node:last-child {
    padding-top: 8px;
  }

  /* Recalculate vertical bar: spans between the two children */
  .bracket-children {
    position: relative;
  }
  .bracket-children::after {
    top: 25%;
    bottom: 25%;
  }

  /* Horizontal connector from children's vertical bar to the match */
  .bracket-connector {
    width: 32px;
    height: 3px;
    background: #000;
    flex-shrink: 0;
  }

  /* Each child match has a horizontal line going right to the vertical bar */
  .bracket-children > .bracket-node::after {
    content: '';
    width: 32px;
    height: 3px;
    background: #000;
    flex-shrink: 0;
  }

  /* Match Box */
  .bracket-match {
    width: 230px;
    border: 3px solid #000;
    background: #fff;
    box-shadow: 4px 4px 0 #000;
    flex-shrink: 0;
    overflow: hidden;
  }

  .bracket-final {
    box-shadow: 4px 4px 0 #2563eb;
    border-color: #2563eb;
  }

  .bracket-player {
    padding: 10px 14px;
    display: flex;
    align-items: center;
    transition: background 0.15s;
  }

  .bracket-p1 {
    border-left: 6px solid #2563eb;
    border-bottom: 2px solid #000;
  }

  .bracket-p2 {
    border-left: 6px solid #dc2626;
  }

  .bracket-bye {
    border-left-color: #d1d5db;
    color: #9ca3af;
    font-style: italic;
  }

  .bracket-winner {
    background: linear-gradient(90deg, #dcfce7, #fff) !important;
    border-left-color: #16a34a !important;
  }

  .bracket-player-info {
    display: flex;
    align-items: center;
    gap: 8px;
    flex: 1;
    min-width: 0;
  }

  .bracket-player-name {
    font-weight: 700;
    font-size: 13px;
    flex: 1;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .bracket-player-club {
    font-size: 10px;
    color: #9ca3af;
    background: #f3f4f6;
    padding: 2px 8px;
    border: 1px solid #e5e7eb;
    white-space: nowrap;
    flex-shrink: 0;
  }

  @media print {
    .bracket-match {
      box-shadow: none !important;
    }
    .bracket-final {
      border-color: #000;
    }
  }
`;
