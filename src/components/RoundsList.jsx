import { Navigate, useNavigate } from 'react-router';
import { clearGameSession, loadGameSession } from '../lib/gameSession';

export function RoundsList() {
    const navigate = useNavigate();
    const session = loadGameSession();
    const rounds = Array.isArray(session?.rounds) ? session.rounds : [];

    if (!session || !Array.isArray(session.players) || session.players.length < 2) {
        return <Navigate to="/" replace />;
    }

    const handleDeleteGame = () => {
        clearGameSession();
        navigate('/');
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

                    <div className="player-list">
                        {session.players.map((player, index) => (
                            <span key={`${player}-${index}`} className="player-chip player-chip--compact">
                                {player}
                            </span>
                        ))}
                    </div>
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
                                    <h3 className="round-card-title">Round {index + 1}</h3>
                                    <p className="round-card-text">{round?.summary ?? 'Round saved'}</p>
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
