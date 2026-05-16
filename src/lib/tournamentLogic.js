// Official Weight Categories for District Taekwondo Sports Association Moradabad
export function getWeightClass(age, gender, weight) {
  // 1. Pee-Wee (Under 7) - From previous request
  if (age === 'Pee-Wee (Under 7)') {
    if (weight <= 14) return 'U-14KG';
    if (weight <= 16) return 'U-16KG';
    if (weight <= 18) return 'U-18KG';
    if (weight <= 20) return 'U-20KG';
    if (weight <= 22) return 'U-22KG';
    if (weight <= 24) return 'U-24KG';
    if (weight <= 26) return 'U-26KG';
    if (weight <= 29) return 'U-29KG';
    if (weight <= 32) return 'U-32KG';
    if (weight <= 35) return 'U-35KG';
    return '+35KG';
  }

  // 2. Sub-Junior (Under 12)
  if (age === 'Sub-Junior (Under 12)') {
    if (gender === 'Male') {
      if (weight <= 18) return 'U-18 KG';
      if (weight <= 21) return 'U-21 KG';
      if (weight <= 23) return 'U-23 KG';
      if (weight <= 25) return 'U-25 KG';
      if (weight <= 27) return 'U-27 KG';
      if (weight <= 29) return 'U-29 KG';
      if (weight <= 32) return 'U-32 KG';
      if (weight <= 35) return 'U-35 KG';
      if (weight <= 38) return 'U-38 KG';
      if (weight <= 41) return 'U-41 KG';
      if (weight <= 44) return 'U-44 KG';
      if (weight <= 50) return 'U-50 KG';
      return 'O- 50 KG';
    } else {
      if (weight <= 16) return 'U-16 KG';
      if (weight <= 18) return 'U-18 KG';
      if (weight <= 20) return 'U-20 KG';
      if (weight <= 22) return 'U-22 KG';
      if (weight <= 24) return 'U-24 KG';
      if (weight <= 26) return 'U-26 KG';
      if (weight <= 29) return 'U-29 KG';
      if (weight <= 32) return 'U-32 KG';
      if (weight <= 35) return 'U-35 KG';
      if (weight <= 38) return 'U-38 KG';
      if (weight <= 41) return 'U-41 KG';
      if (weight <= 47) return 'U-47 KG';
      return 'O-47 KG';
    }
  }

  // 3. Cadet (12-14)
  if (age === 'Cadet (12-14)') {
    if (gender === 'Male') {
      if (weight <= 33) return 'U-33 KG';
      if (weight <= 37) return 'U-37 KG';
      if (weight <= 41) return 'U-41 KG';
      if (weight <= 45) return 'U-45 KG';
      if (weight <= 49) return 'U-49 KG';
      if (weight <= 53) return 'U-53 KG';
      if (weight <= 57) return 'U-57 KG';
      if (weight <= 61) return 'U-61 KG';
      if (weight <= 65) return 'U-65 KG';
      return 'OVER-65 KG';
    } else {
      if (weight <= 29) return 'U-29 KG';
      if (weight <= 33) return 'U-33 KG';
      if (weight <= 37) return 'U-37 KG';
      if (weight <= 41) return 'U-41 KG';
      if (weight <= 44) return 'U-44 KG';
      if (weight <= 47) return 'U-47 KG';
      if (weight <= 51) return 'U-51 KG';
      if (weight <= 55) return 'U-55 KG';
      if (weight <= 59) return 'U-59 KG';
      return 'OVER-59 KG';
    }
  }

  // 4. Junior (15-17)
  if (age === 'Junior (15-17)') {
    if (gender === 'Male') {
      if (weight <= 45) return 'U-45 KG';
      if (weight <= 48) return 'U-48 KG';
      if (weight <= 51) return 'U-51 KG';
      if (weight <= 55) return 'U-55 KG';
      if (weight <= 59) return 'U-59 KG';
      if (weight <= 63) return 'U-63 KG';
      if (weight <= 68) return 'U-68 KG';
      if (weight <= 73) return 'U-73 KG';
      if (weight <= 78) return 'U-78 KG';
      return 'OVER-78 KG';
    } else {
      if (weight <= 42) return 'U-42 KG';
      if (weight <= 44) return 'U-44 KG';
      if (weight <= 46) return 'U-46 KG';
      if (weight <= 49) return 'U-49 KG';
      if (weight <= 52) return 'U-52 KG';
      if (weight <= 55) return 'U-55 KG';
      if (weight <= 59) return 'U-59 KG';
      if (weight <= 63) return 'U-63 KG';
      if (weight <= 68) return 'U-68 KG';
      return 'OVER-68 KG';
    }
  }

  // 5. Senior (18+)
  if (age === 'Senior (18+)') {
    if (gender === 'Male') {
      if (weight <= 54) return 'U-54 KG';
      if (weight <= 58) return 'U-58 KG';
      if (weight <= 63) return 'U-63 KG';
      if (weight <= 68) return 'U-68 KG';
      if (weight <= 74) return 'U-74 KG';
      if (weight <= 80) return 'U-80 KG';
      if (weight <= 87) return 'U-87 KG';
      return 'OVER-87 KG';
    } else {
      if (weight <= 46) return 'U-46 KG';
      if (weight <= 49) return 'U-49 KG';
      if (weight <= 53) return 'U-53 KG';
      if (weight <= 57) return 'U-57 KG';
      if (weight <= 62) return 'U-62 KG';
      if (weight <= 67) return 'U-67 KG';
      if (weight <= 73) return 'U-73 KG';
      return 'OVER-73 KG';
    }
  }

  return 'General';
}

export function generateBracket(athletes) {
  if (!athletes || athletes.length < 2) return null;
  const shuffled = [...athletes].sort(() => 0.5 - Math.random());
  const numAthletes = shuffled.length;
  let power = 1;
  while (power < numAthletes) power *= 2;
  const byes = power - numAthletes;
  const numMatches = power / 2;
  const firstRound = [];
  let pIdx = 0;
  for (let i = 0; i < numMatches; i++) {
    const match = { id: `m_${Date.now()}_${i}`, nextMatchId: null, player1: null, player2: null, winner: null };
    if (i < byes) {
      match.player1 = shuffled[pIdx++];
      match.player2 = { id: 'BYE', name: 'BYE' };
      match.winner = match.player1;
    } else {
      match.player1 = shuffled[pIdx++];
      match.player2 = shuffled[pIdx++];
    }
    firstRound.push(match);
  }
  const rounds = [firstRound];
  let currentRoundMatches = firstRound;
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
      if (nextMatch.player1 && nextMatch.player2 && nextMatch.player2.id === 'BYE') nextMatch.winner = nextMatch.player1;
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
        if (nextMatch.parent1Id === targetMatch.id) nextMatch.player1 = targetMatch.winner;
        else nextMatch.player2 = targetMatch.winner;
        if (nextMatch.player1 && nextMatch.player2 && nextMatch.player2.id === 'BYE') nextMatch.winner = nextMatch.player1;
      }
    }
  }
  return rounds;
}
