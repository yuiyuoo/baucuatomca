import { useState } from 'react';
import { useNavigate } from 'react-router';
import { loadGameSession, saveGameSession } from '../lib/gameSession';

export function GameSetup() {
    const existingSession = loadGameSession();
    const navigate = useNavigate();
    const [gameName, setGameName] = useState(existingSession?.gameName ?? '');
    const [playerName, setPlayerName] = useState('');
    const [players, setPlayers] = useState(existingSession?.players ?? []);
    const [errors, setErrors] = useState({
        playerName: '',
        players: '',
    });
    const handleAddPlayer = () => {
        const trimmedName = playerName.trim();
        if (!trimmedName) {
            setErrors((prev) => ({ ...prev, playerName: 'Player name is required' }));
            return;
        }

        const duplicate = players.some(
            (player) => player.toLowerCase() === trimmedName.toLowerCase()
        );

        if (duplicate) {
            setErrors((prev) => ({ ...prev, playerName: 'This player already exists.' }));
            return;
        }

        setPlayers((currentPlayers) => [...currentPlayers, trimmedName]);
        setPlayerName('');
        setErrors((prev) => ({ ...prev, playerName: '', players: '' }));
    };

    const handleStartGame = () => {
        if (players.length < 2) {
            setErrors((prev) => ({
                ...prev,
                players: 'Add at least 2 players before start'
            }));
            return;
        }
        saveGameSession({
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
                                <span key={`${player}-${index}`} className="player-chip">
                                    <span>{player}</span>
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
                    className="start-game-btn"
                    onClick={handleStartGame}
                    disabled={players.length < 2}
                >
                    Start Game
                </button>

                <p className="game-setup-note">
                    {players.length < 2
                        ? 'Add at least 2 players to start the game'
                        : `${players.length} players added`}
                </p>
            </div>
        </div>
    );
}
