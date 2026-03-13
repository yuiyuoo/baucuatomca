import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router';
import { loadGameSession, saveGameSession } from '../lib/gameSession';

export function AddRound() {
    const navigate = useNavigate();
    const session = loadGameSession();

    if (!session || !Array.isArray(session.players) || session.players.length < 2) {
        return <Navigate to="/" replace />;
    }

    const [banker, setBanker] = useState(session.players[0]);
    const [amounts, setAmounts] = useState(() =>
        session.players.reduce((accumulator, player) => {
            accumulator[player] = '0';
            return accumulator;
        }, {})
    );

    const resultPlayers = session.players.filter((player) => player !== banker);

    const handleAmountChange = (player, value) => {
        setAmounts((currentAmounts) => ({
            ...currentAmounts,
            [player]: value,
        }));
    };

    const totalSum = resultPlayers.reduce((total, player) => {
        const amount = Number(amounts[player] || 0);
        return total + (Number.isNaN(amount) ? 0 : amount);
    }, 0);

    const handleSaveRound = () => {
        const nextRound = {
            id: crypto.randomUUID(),
            banker,
            results: resultPlayers.map((player) => ({
                player,
                amount: Number(amounts[player] || 0),
            })),
            total: totalSum,
            summary: `${banker} banked round with ${resultPlayers.length} player results`,
        };

        saveGameSession({
            ...session,
            rounds: [...(session.rounds ?? []), nextRound],
        });

        navigate('/rounds');
    };

    return (
        <div className="rounds-page">
            <div className="add-round-shell">
                <button
                    type="button"
                    className="back-link"
                    onClick={() => navigate('/rounds')}
                >
                    ← Back to Rounds
                </button>

                <section className="add-round-card">
                    <h1 className="add-round-title">Add New Round</h1>
                    <p className="add-round-subtitle">
                        Select a banker and enter amounts for each player
                    </p>

                    <div className="add-round-section">
                        <label className="add-round-label" htmlFor="banker-select">
                            Select Banker
                        </label>
                        <select
                            id="banker-select"
                            className="add-round-select"
                            value={banker}
                            onChange={(event) => setBanker(event.target.value)}
                        >
                            {session.players.map((player) => (
                                <option key={player} value={player}>
                                    {player}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="add-round-divider" />

                    <div className="add-round-section">
                        <h2 className="add-round-heading">Player Results</h2>
                        <p className="add-round-help">
                            Positive = banker pays player • Negative = player pays banker
                        </p>

                        <div className="round-player-grid">
                            {resultPlayers.map((player) => (
                                <div key={player} className="round-player-row">
                                    <span className="round-player-name">{player}</span>
                                    <input
                                        type="number"
                                        className="round-player-input"
                                        value={amounts[player]}
                                        onChange={(event) => handleAmountChange(player, event.target.value)}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="round-total-card">
                        <span className="round-total-label">Total Sum:</span>
                        <span className="round-total-value">{totalSum.toFixed(2)}</span>
                    </div>

                    <button
                        type="button"
                        className="save-round-btn"
                        onClick={handleSaveRound}
                    >
                        Save Round
                    </button>
                </section>
            </div>
        </div>
    );
}
