const GAME_SESSION_KEY = 'bau-cua-tom-ca:game-session';

function createId(prefix) {
  return `${prefix}-${crypto.randomUUID()}`;
}

function normalizePlayers(rawPlayers = []) {
  return rawPlayers
    .map((player) => {
      if (typeof player === 'string') {
        return {
          id: createId('player'),
          name: player,
        };
      }

      if (player && typeof player === 'object') {
        return {
          id: player.id ?? createId('player'),
          name: player.name ?? '',
        };
      }

      return null;
    })
    .filter((player) => player && player.name.trim());
}

function resolvePlayerId(players, rawValue) {
  if (!rawValue) return null;

  const byId = players.find((player) => player.id === rawValue);
  if (byId) return byId.id;

  const byName = players.find((player) => player.name === rawValue);
  return byName?.id ?? null;
}

function normalizeRounds(rawRounds = [], players = []) {
  return rawRounds
    .map((round) => {
      if (!round || typeof round !== 'object') return null;

      const bankerId = resolvePlayerId(players, round.bankerId ?? round.banker);
      if (!bankerId) return null;

      const results = Array.isArray(round.results)
        ? round.results
            .map((result) => {
              const playerId = resolvePlayerId(players, result.playerId ?? result.player);
              if (!playerId || playerId === bankerId) return null;

              return {
                playerId,
                amount: Number(result.amount) || 0,
              };
            })
            .filter(Boolean)
        : [];

      return {
        id: round.id ?? createId('round'),
        bankerId,
        results,
        total:
          round.total ??
          results.reduce((sum, result) => sum + result.amount, 0),
      };
    })
    .filter(Boolean);
}

export function normalizeGameSession(rawSession) {
  if (!rawSession || typeof rawSession !== 'object') return null;

  const players = normalizePlayers(rawSession.players);

  return {
    gameName: rawSession.gameName ?? '',
    players,
    rounds: normalizeRounds(rawSession.rounds, players),
  };
}

export function loadGameSession() {
  const storedSession = localStorage.getItem(GAME_SESSION_KEY);
  if (!storedSession) return null;

  try {
    return normalizeGameSession(JSON.parse(storedSession));
  } catch {
    localStorage.removeItem(GAME_SESSION_KEY);
    return null;
  }
}

export function saveGameSession(session) {
  const normalizedSession = normalizeGameSession(session);
  localStorage.setItem(GAME_SESSION_KEY, JSON.stringify(normalizedSession));
  return normalizedSession;
}

export function clearGameSession() {
  localStorage.removeItem(GAME_SESSION_KEY);
}
