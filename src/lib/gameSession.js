const GAME_SESSION_KEY = 'bau-cua-tom-ca:game-session';

export function loadGameSession() {
  const storedSession = localStorage.getItem(GAME_SESSION_KEY);
  if (!storedSession) return null;

  try {
    return JSON.parse(storedSession);
  } catch {
    localStorage.removeItem(GAME_SESSION_KEY);
    return null;
  }
}

export function saveGameSession(session) {
  localStorage.setItem(GAME_SESSION_KEY, JSON.stringify(session));
}

export function clearGameSession() {
  localStorage.removeItem(GAME_SESSION_KEY);
}
