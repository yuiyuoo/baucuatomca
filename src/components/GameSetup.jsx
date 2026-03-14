import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useGameSession } from '../hooks/useGameSession';

export function GameSetup() {
    const navigate = useNavigate();
    const { session, replaceSession } = useGameSession();
    const [gameName, setGameName] = useState(session?.gameName ?? '');
    const [playerName, setPlayerName] = useState('');
    const [players, setPlayers] = useState(session?.players ?? []);
    const [errors, setErrors] = useState({
        playerName: '',
        players: '',
    });
    const canStartGame = players.length >= 2;

    const handleAddPlayer = () => {
        const trimmedName = playerName.trim();
        if (!trimmedName) {
            setErrors((prev) => ({ ...prev, playerName: 'Player name is required' }));
            return;
        }

        const duplicate = players.some(
            (player) => player.name.toLowerCase() === trimmedName.toLowerCase()
        );

        if (duplicate) {
            setErrors((prev) => ({ ...prev, playerName: 'This player already exists.' }));
            return;
        }

        setPlayers((currentPlayers) => [
            ...currentPlayers,
            {
                id: `player-${crypto.randomUUID()}`,
                name: trimmedName,
            },
        ]);
        setPlayerName('');
        setErrors((prev) => ({ ...prev, playerName: '', players: '' }));
    };

    const handleStartGame = () => {
        if (!canStartGame) {
            setErrors((prev) => ({
                ...prev,
                players: 'Add at least 2 players before start'
            }));
            return;
        }
        replaceSession({
            ...(session ?? {}),
            gameName: gameName.trim(),
            players,
        });

        navigate('/rounds');
    };

    const handleDeletePlayer = (index) => {
        setPlayers((prev) => prev.filter((_, i) => i !== index));
    };
    return (
        <div className="game-setup-page">
            <div className="game-setup-card">
                <div className="game-setup-icon">👥</div>

                <h1 className="game-setup-title">Banker Score Tracker</h1>
                <p className="game-setup-subtitle">
                    Create a new game session and add players
                </p>

                <div className="game-setup-field">
                    <label>Game Name (Optional)</label>
                    <input
                        type="text"
                        placeholder="Enter game name"
                        value={gameName}
                        onChange={(event) => setGameName(event.target.value)}
                    />
                </div>

                <div className="game-setup-field">
                    <label>Add Players</label>
                    <div className="player-input-row">
                        <input
                            type="text"
                            placeholder="Enter player name"
                            value={playerName}
                            onChange={(event) => setPlayerName(event.target.value)}
                            onKeyDown={(event) => {
                                if (event.key === 'Enter') {
                                    handleAddPlayer();
                                }
                            }}
                        />
                        <button type="button" className="add-player-btn" onClick={handleAddPlayer}>+</button>
                    </div>
                    {errors.playerName && <p className="error-text">{errors.playerName}</p>}

                </div>

                {players.length > 0 && (
                    <div className="game-setup-field">
                        <label>Players</label>
                        <div className="player-list">
                            {players.map((player, index) => (
                                <span key={player.id} className="player-chip">
                                    <span>{player.name}</span>
                                    <button
                                        type="button"
                                        className="remove-player-btn"
                                        onClick={() => handleDeletePlayer(index)}
                                    >
                                        ×
                                    </button>
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                <button
                    type="button"
                    className={`start-game-btn ${canStartGame ? 'start-game-btn--ready' : ''}`}
                    onClick={handleStartGame}
                    disabled={!canStartGame}
                >
                    Start Game
                </button>

                <p className="game-setup-note">
                    {canStartGame
                        ? `${players.length} players added`
                        : 'Add at least 2 players to start the game'}
                </p>
            </div>
        </div>
    );
}
