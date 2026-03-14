export function computeBalances(session) {
  const players = Array.isArray(session?.players) ? session.players : [];
  const rounds = Array.isArray(session?.rounds) ? session.rounds : [];

  const balances = players.reduce((accumulator, player) => {
    accumulator[player] = 0;
    return accumulator;
  }, {});

  rounds.forEach((round) => {
    let bankerNet = 0;

    round.results?.forEach((result) => {
      const amount = Number(result.amount) || 0;
      balances[result.player] = (balances[result.player] ?? 0) + amount;
      bankerNet -= amount;
    });

    balances[round.banker] = (balances[round.banker] ?? 0) + bankerNet;
  });

  return balances;
}

export function rankBalances(balances) {
  return Object.entries(balances)
    .map(([player, balance]) => ({ player, balance }))
    .sort((left, right) => right.balance - left.balance);
}

export function buildSettlementPlan(balances) {
  const creditors = rankBalances(balances)
    .filter(({ balance }) => balance > 0.0001)
    .map(({ player, balance }) => ({ player, amount: balance }));

  const debtors = rankBalances(balances)
    .filter(({ balance }) => balance < -0.0001)
    .map(({ player, balance }) => ({ player, amount: Math.abs(balance) }));

  const transfers = [];
  let creditorIndex = 0;
  let debtorIndex = 0;

  while (creditorIndex < creditors.length && debtorIndex < debtors.length) {
    const creditor = creditors[creditorIndex];
    const debtor = debtors[debtorIndex];
    const amount = Math.min(creditor.amount, debtor.amount);

    transfers.push({
      from: debtor.player,
      to: creditor.player,
      amount,
    });

    creditor.amount -= amount;
    debtor.amount -= amount;

    if (creditor.amount <= 0.0001) creditorIndex += 1;
    if (debtor.amount <= 0.0001) debtorIndex += 1;
  }

  return transfers;
}
