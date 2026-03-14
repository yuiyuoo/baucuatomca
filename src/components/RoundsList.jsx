import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router';
import { useGameSession } from '../hooks/useGameSession';

export function RoundsList() {
    const navigate = useNavigate();
    const { session, resetSession, updateSession } = useGameSession();
    const rounds = Array.isArray(session?.rounds) ? session.rounds : [];
    const [playerName, setPlayerName] = useState('');
    const [showAddPlayer, setShowAddPlayer] = useState(false);
    const [playerError, setPlayerError] = useState('');

    if (!session || !Array.isArray(session.players) || session.players.length < 2) {
        return <Navigate to="/" replace />;
    }

    const handleDeleteGame = () => {
        resetSession();
        navigate('/');
    };

    const handleDeleteRound = (roundId) => {
        updateSession((currentSession) => ({
            ...currentSession,
            rounds: (currentSession?.rounds ?? []).filter((round) => round.id !== roundId),
        }));
    };

    const handleAddPlayer = () => {
        const trimmedName = playerName.trim();

        if (!trimmedName) {
            setPlayerError('Player name is required.');
            return;
        }

        const duplicate = session.players.some(
            (player) => player.name.toLowerCase() === trimmedName.toLowerCase()
        );

        if (duplicate) {
            setPlayerError('This player already exists.');
            return;
        }

        updateSession((currentSession) => ({
            ...currentSession,
            players: [
                ...(currentSession?.players ?? []),
                {
                    id: `player-${crypto.randomUUID()}`,
                    name: trimmedName,
                },
            ],
        }));

        setPlayerName('');
        setPlayerError('');
        setShowAddPlayer(false);
    };

    return (
        <div className="rounds-page">
            <div className="rounds-shell">
                <section className="rounds-summary-card">
                    <h1 className="rounds-page-title">
                        {session.gameName || 'Banker Game'}
                    </h1>
                    <p className="rounds-page-meta">
                        {session.players.length} players • {rounds.length} rounds
                    </p>

                    <div className="rounds-summary-footer">
                        <div className="player-list">
                            {session.players.map((player) => (
                                <span key={player.id} className="player-chip player-chip--compact">
                                    {player.name}
                                </span>
                            ))}
                        </div>

                        <button
                            type="button"
                            className="rounds-add-player-btn"
                            onClick={() => {
                                setShowAddPlayer((current) => !current);
                                setPlayerError('');
                            }}
                        >
                            + Add Player
                        </button>
                    </div>

                    {showAddPlayer && (
                        <div className="rounds-add-player-row">
                            <input
                                type="text"
                                className="rounds-add-player-input"
                                placeholder="Enter player name"
                                value={playerName}
                                onChange={(event) => setPlayerName(event.target.value)}
                                onKeyDown={(event) => {
                                    if (event.key === 'Enter') {
                                        handleAddPlayer();
                                    }
                                }}
                            />
                            <button
                                type="button"
                                className="rounds-add-player-save"
                                onClick={handleAddPlayer}
                            >
                                Save
                            </button>
                        </div>
                    )}

                    {playerError && <p className="error-text">{playerError}</p>}
                </section>

                <section className="rounds-actions-grid">
                    <button
                        type="button"
                        className="rounds-action-card rounds-action-card--primary"
                        onClick={() => navigate('/add-round')}
                    >
                        <span className="rounds-action-icon">+</span>
                        <span className="rounds-action-label">Add Round</span>
                    </button>

                    <button
                        type="button"
                        className="rounds-action-card"
                        onClick={() => navigate('/scores')}
                    >
                        <span className="rounds-action-icon">$</span>
                        <span className="rounds-action-label">View Scores</span>
                    </button>

                    <button
                        type="button"
                        className="rounds-action-card"
                        onClick={() => navigate('/settlement')}
                    >
                        <span className="rounds-action-icon">S</span>
                        <span className="rounds-action-label">Settle Game</span>
                    </button>
                </section>

                <section className="rounds-panel">
                    <h2 className="rounds-panel-title">Rounds</h2>
                    <p className="rounds-panel-subtitle">
                        {rounds.length === 0
                            ? 'No rounds yet. Add your first round!'
                            : `${rounds.length} rounds recorded`}
                    </p>

                    {rounds.length === 0 ? (
                        <div className="rounds-empty-state">
                            <div className="rounds-empty-icon">+</div>
                            <p className="rounds-empty-text">No rounds added yet</p>
                            <button
                                type="button"
                                className="rounds-empty-button"
                                onClick={() => navigate('/add-round')}
                            >
                                Add First Round
                            </button>
                        </div>
                    ) : (
                        <div className="rounds-list">
                            {rounds.map((round, index) => (
                                <article key={round.id ?? index} className="round-card">
                                    <div className="round-card-header">
                                        <div className="round-card-banker">
                                            <span className="round-index-badge">{index + 1}</span>
                                            <div>
                                                <p className="round-card-label">Banker</p>
                                                <h3 className="round-card-title">
                                                    {session.players.find((player) => player.id === round.bankerId)?.name ?? 'Unknown player'}
                                                </h3>
                                            </div>
                                        </div>

                                        <div className="round-card-actions">
                                            <button
                                                type="button"
                                                className="round-card-icon-btn"
                                                onClick={() => navigate(`/add-round/${round.id}`)}
                                                aria-label="Edit round"
                                                title="Edit round"
                                            >
                                                ✎
                                            </button>
                                            <button
                                                type="button"
                                                className="round-card-icon-btn round-card-icon-btn--danger"
                                                onClick={() => handleDeleteRound(round.id)}
                                                aria-label="Delete round"
                                                title="Delete round"
                                            >
                                                🗑
                                            </button>
                                        </div>
                                    </div>

                                    <div className="round-result-list">
                                        {round.results?.map((result) => {
                                            const amount = Number(result.amount) || 0;
                                            const positive = amount >= 0;

                                            return (
                                                <div key={`${round.id}-${result.playerId}`} className="round-result-row">
                                                    <span className="round-result-player">
                                                        {session.players.find((player) => player.id === result.playerId)?.name ?? 'Unknown player'}
                                                    </span>
                                                    <span
                                                        className={`round-result-amount ${positive ? 'round-result-amount--positive' : 'round-result-amount--negative'}`}
                                                    >
                                                        {positive ? '+' : ''}{amount}
                                                    </span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </article>
                            ))}
                        </div>
                    )}
                </section>

                <div className="rounds-footer">
                    <button
                        type="button"
                        className="delete-game-btn"
                        onClick={handleDeleteGame}
                    >
                        Delete Game
                    </button>
                </div>
            </div>
        </div>
    );
}
