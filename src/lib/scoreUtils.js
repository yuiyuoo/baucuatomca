export function computeBalances(session) {
  const players = Array.isArray(session?.players) ? session.players : [];
  const rounds = Array.isArray(session?.rounds) ? session.rounds : [];

  const balances = players.reduce((accumulator, player) => {
    accumulator[player.id] = 0;
    return accumulator;
  }, {});

  rounds.forEach((round) => {
    let bankerNet = 0;

    round.results?.forEach((result) => {
      const amount = Number(result.amount) || 0;
      balances[result.playerId] = (balances[result.playerId] ?? 0) + amount;
      bankerNet -= amount;
    });

    balances[round.bankerId] = (balances[round.bankerId] ?? 0) + bankerNet;
  });

  return balances;
}

export function rankBalances(balances, players = []) {
  return Object.entries(balances)
    .map(([playerId, balance]) => ({
      playerId,
      balance,
      playerName: players.find((player) => player.id === playerId)?.name ?? 'Unknown player',
    }))
    .sort((left, right) => right.balance - left.balance);
}

export function buildSettlementPlan(balances, players = []) {
  const creditors = rankBalances(balances, players)
    .filter(({ balance }) => balance > 0.0001)
    .map(({ playerId, playerName, balance }) => ({ playerId, playerName, amount: balance }));

  const debtors = rankBalances(balances, players)
    .filter(({ balance }) => balance < -0.0001)
    .map(({ playerId, playerName, balance }) => ({
      playerId,
      playerName,
      amount: Math.abs(balance),
    }));

  const transfers = [];
  let creditorIndex = 0;
  let debtorIndex = 0;

  while (creditorIndex < creditors.length && debtorIndex < debtors.length) {
    const creditor = creditors[creditorIndex];
    const debtor = debtors[debtorIndex];
    const amount = Math.min(creditor.amount, debtor.amount);

    transfers.push({
      fromId: debtor.playerId,
      fromName: debtor.playerName,
      toId: creditor.playerId,
      toName: creditor.playerName,
      amount,
    });

    creditor.amount -= amount;
    debtor.amount -= amount;

    if (creditor.amount <= 0.0001) creditorIndex += 1;
    if (debtor.amount <= 0.0001) debtorIndex += 1;
  }

  return transfers;
}
