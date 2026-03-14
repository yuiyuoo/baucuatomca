import { Navigate, useNavigate } from 'react-router';
import { loadGameSession } from '../lib/gameSession';
import { computeBalances, rankBalances } from '../lib/scoreUtils';

export function Scores() {
    const navigate = useNavigate();
    const session = loadGameSession();

    if (!session || !Array.isArray(session.players) || session.players.length < 2) {
        return <Navigate to="/" replace />;
    }

    const rounds = Array.isArray(session.rounds) ? session.rounds : [];
    const balances = computeBalances(session);
    const rankedPlayers = rankBalances(balances, session.players);

    return (
        <div className="rounds-page">
            <div className="scores-shell">
                <button
                    type="button"
                    className="back-link"
                    onClick={() => navigate('/rounds')}
                >
                    ← Back to Rounds
                </button>

                <section className="scores-card">
                    <h1 className="scores-title">Player Scores</h1>
                    <p className="scores-subtitle">
                        Net balances after {rounds.length} {rounds.length === 1 ? 'round' : 'rounds'}
                    </p>

                    <div className="scores-list">
                        {rankedPlayers.map(({ playerId, playerName, balance }, index) => {
                            const positive = balance >= 0;

                            return (
                                <article
                                    key={playerId}
                                    className={`score-row ${positive ? 'score-row--positive' : 'score-row--negative'}`}
                                >
                                    <div className="score-row-left">
                                        <div className="score-rank">{index + 1}</div>
                                        <div>
                                            <h2 className="score-player-name">{playerName}</h2>
                                            <p className="score-player-status">
                                                {positive ? 'Should receive' : 'Should pay'}
                                            </p>
                                        </div>
                                    </div>

                                    <div className={`score-amount ${positive ? 'score-amount--positive' : 'score-amount--negative'}`}>
                                        {positive ? '↗' : '↘'} {positive ? '+' : '-'}{Math.abs(balance).toFixed(2)}
                                    </div>
                                </article>
                            );
                        })}
                    </div>

                    <div className="add-round-divider" />

                    <button
                        type="button"
                        className="save-round-btn"
                        onClick={() => navigate('/settlement')}
                    >
                        View Settlement Plan
                    </button>
                </section>
            </div>
        </div>
    );
}
