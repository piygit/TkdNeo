// Core mathematical logic ported from the legacy TaekwondoTournamentSoftware app.js

export function getWeightClass(gender, weight) {
  if (gender === 'Male') {
    if (weight <= 58) return '-58kg';
    if (weight <= 68) return '-68kg';
    if (weight <= 80) return '-80kg';
    return '+80kg';
  } else {
    if (weight <= 49) return '-49kg';
    if (weight <= 57) return '-57kg';
    if (weight <= 67) return '-67kg';
    return '+67kg';
  }
}

export function generateBracket(athletes) {
  if (!athletes || athletes.length < 2) return null;

  // Scramble athletes for random seeding
  const shuffled = [...athletes].sort(() => 0.5 - Math.random());
  
  const numAthletes = shuffled.length;
  // Find next power of 2
  let power = 1;
  while (power < numAthletes) power *= 2;
  
  const byes = power - numAthletes;
  const numMatches = power / 2;
  
  // Build First Round
  const firstRound = [];
  let pIdx = 0;
  
  for (let i = 0; i < numMatches; i++) {
    const match = {
      id: `m_${Date.now()}_${i}`,
      nextMatchId: null, // Will be linked in subsequent loops
      player1: null,
      player2: null,
      winner: null
    };
    
    if (i < byes) {
      match.player1 = shuffled[pIdx++];
      match.player2 = { id: 'BYE', name: 'BYE' };
      match.winner = match.player1; // Auto advance
    } else {
      match.player1 = shuffled[pIdx++];
      match.player2 = shuffled[pIdx++];
    }
    firstRound.push(match);
  }
  
  const rounds = [firstRound];
  let currentRoundMatches = firstRound;
  
  // Build subsequent rounds iteratively until 1 match remains (Finals)
  while (currentRoundMatches.length > 1) {
    const nextRound = [];
    const nextNumMatches = currentRoundMatches.length / 2;
    for (let i = 0; i < nextNumMatches; i++) {
      const parent1 = currentRoundMatches[i*2];
      const parent2 = currentRoundMatches[i*2 + 1];
      
      const nextMatch = {
        id: `m_${Date.now()}_r${rounds.length}_${i}`,
        player1: parent1.winner || null, 
        player2: parent2.winner || null,
        winner: null,
        parent1Id: parent1.id,
        parent2Id: parent2.id
      };
      
      if (nextMatch.player1 && nextMatch.player2 && nextMatch.player2.id === 'BYE') {
         nextMatch.winner = nextMatch.player1;
      }
      
      parent1.nextMatchId = nextMatch.id;
      parent2.nextMatchId = nextMatch.id;
      nextRound.push(nextMatch);
    }
    rounds.push(nextRound);
    currentRoundMatches = nextRound;
  }
  
  return rounds;
}

export function declareWinner(rounds, matchId, winnerId) {
  // Deep clone rounds or mutate state depending on React architecture
  let targetMatch = null;
  
  for (let r = 0; r < rounds.length; r++) {
    for (let m = 0; m < rounds[r].length; m++) {
      if (rounds[r][m].id === matchId) {
        targetMatch = rounds[r][m];
        break;
      }
    }
  }
  
  if (targetMatch) {
    targetMatch.winner = (targetMatch.player1.id === winnerId) ? targetMatch.player1 : targetMatch.player2;
    targetMatch.loser = (targetMatch.player1.id === winnerId) ? targetMatch.player2 : targetMatch.player1;
    
    if (targetMatch.nextMatchId) {
      let nextMatch = null;
      for (let r = 0; r < rounds.length; r++) {
        for (let m = 0; m < rounds[r].length; m++) {
          if (rounds[r][m].id === targetMatch.nextMatchId) {
            nextMatch = rounds[r][m];
            break;
          }
        }
      }
      if (nextMatch) {
        if (nextMatch.parent1Id === targetMatch.id) {
          nextMatch.player1 = targetMatch.winner;
        } else {
          nextMatch.player2 = targetMatch.winner;
        }
        
        if (nextMatch.player1 && nextMatch.player2 && nextMatch.player2.id === 'BYE') {
          nextMatch.winner = nextMatch.player1;
        }
      }
    }
  }
  
  return rounds;
}
