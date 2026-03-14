import { Navigate, useNavigate } from 'react-router';
import { loadGameSession } from '../lib/gameSession';
import { buildSettlementPlan, computeBalances, rankBalances } from '../lib/scoreUtils';

export function Settlement() {
    const navigate = useNavigate();
    const session = loadGameSession();

    if (!session || !Array.isArray(session.players) || session.players.length < 2) {
        return <Navigate to="/" replace />;
    }

    const rounds = Array.isArray(session.rounds) ? session.rounds : [];
    const balances = computeBalances(session);
    const rankedPlayers = rankBalances(balances, session.players);
    const settlementPlan = buildSettlementPlan(balances, session.players);
    const unsettledPlayers = rankedPlayers.filter(({ balance }) => Math.abs(balance) > 0.0001);

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
                    <h1 className="scores-title">Settlement Plan</h1>
                    <p className="scores-subtitle">
                        Final payouts after {rounds.length} {rounds.length === 1 ? 'round' : 'rounds'}
                    </p>

                    {settlementPlan.length === 0 ? (
                        <div className="settlement-empty">
                            <div className="settlement-empty-icon">=</div>
                            <p className="settlement-empty-title">Everything is balanced</p>
                            <p className="settlement-empty-text">
                                No settlement transfers are needed right now.
                            </p>
                        </div>
                    ) : (
                        <div className="settlement-plan-list">
                            {settlementPlan.map((transfer, index) => (
                                <article key={`${transfer.fromId}-${transfer.toId}-${index}`} className="settlement-plan-card">
                                    <div className="settlement-plan-step">{index + 1}</div>
                                    <div className="settlement-plan-details">
                                        <h2 className="settlement-plan-title">
                                            {transfer.fromName} pays {transfer.toName}
                                        </h2>
                                        <p className="settlement-plan-subtitle">
                                            Settle the balance with one transfer
                                        </p>
                                    </div>
                                    <div className="settlement-plan-amount">
                                        {transfer.amount.toFixed(2)}
                                    </div>
                                </article>
                            ))}
                        </div>
                    )}

                    <div className="add-round-divider" />

                    <section className="settlement-summary">
                        <h2 className="settlement-summary-title">Net Balances</h2>
                        <div className="settlement-summary-list">
                            {unsettledPlayers.map(({ playerId, playerName, balance }) => {
                                const positive = balance >= 0;

                                return (
                                    <div key={playerId} className="settlement-summary-row">
                                        <span className="settlement-summary-player">{playerName}</span>
                                        <span
                                            className={`settlement-summary-amount ${positive ? 'score-amount--positive' : 'score-amount--negative'}`}
                                        >
                                            {positive ? '+' : '-'}{Math.abs(balance).toFixed(2)}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </section>
                </section>
            </div>
        </div>
    );
}
