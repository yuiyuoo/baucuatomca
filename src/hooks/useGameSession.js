import { useState } from 'react';
import {
  clearGameSession,
  loadGameSession,
  saveGameSession,
} from '../lib/gameSession';

export function useGameSession() {
  const [session, setSession] = useState(() => loadGameSession());

  const replaceSession = (nextSession) => {
    const savedSession = saveGameSession(nextSession);
    setSession(savedSession);
    return savedSession;
  };

  const updateSession = (updater) => {
    setSession((currentSession) => {
      const nextSession =
        typeof updater === 'function' ? updater(currentSession) : updater;
      return saveGameSession(nextSession);
    });
  };

  const resetSession = () => {
    clearGameSession();
    setSession(null);
  };

  return {
    session,
    replaceSession,
    updateSession,
    resetSession,
  };
}
