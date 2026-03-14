import { useState } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router';
import { useGameSession } from '../hooks/useGameSession';

export function AddRound() {
    const { roundId } = useParams();
    const navigate = useNavigate();
    const { session, updateSession } = useGameSession();
    const players = Array.isArray(session?.players) ? session.players : [];
    const rounds = Array.isArray(session?.rounds) ? session.rounds : [];
    const editingRound = rounds.find((round) => round.id === roundId) ?? null;
    const [bankerId, setBankerId] = useState(editingRound?.bankerId ?? players[0]?.id ?? '');
    const [amounts, setAmounts] = useState(() =>
        players.reduce((accumulator, player) => {
            const existingAmount = editingRound?.results?.find(
                (result) => result.playerId === player.id
            )?.amount;

            accumulator[player.id] = existingAmount !== undefined
                ? String(existingAmount)
                : '0';
            return accumulator;
        }, {})
    );

    if (!session || players.length < 2) {
        return <Navigate to="/" replace />;
    }

    const resultPlayers = players.filter((player) => player.id !== bankerId);

    const handleAmountChange = (player, value) => {
        setAmounts((currentAmounts) => ({
            ...currentAmounts,
            [player.id]: value,
        }));
    };

    const totalSum = resultPlayers.reduce((total, player) => {
        const amount = Number(amounts[player.id] || 0);
        return total + (Number.isNaN(amount) ? 0 : amount);
    }, 0);

    const handleSaveRound = () => {
        const nextRound = {
            id: editingRound?.id ?? crypto.randomUUID(),
            bankerId,
            results: resultPlayers.map((player) => ({
                playerId: player.id,
                amount: Number(amounts[player.id] || 0),
            })),
            total: totalSum,
        };

        updateSession((currentSession) => ({
            ...currentSession,
            rounds: editingRound
                ? (currentSession?.rounds ?? []).map((round) =>
                    round.id === editingRound.id ? nextRound : round
                )
                : [...(currentSession?.rounds ?? []), nextRound],
        }));

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
                    <h1 className="add-round-title">
                        {editingRound ? 'Edit Round' : 'Add New Round'}
                    </h1>
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
                            value={bankerId}
                            onChange={(event) => setBankerId(event.target.value)}
                        >
                            {players.map((player) => (
                                <option key={player.id} value={player.id}>
                                    {player.name}
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
                                <div key={player.id} className="round-player-row">
                                    <span className="round-player-name">{player.name}</span>
                                    <input
                                        type="number"
                                        className="round-player-input"
                                        value={amounts[player.id]}
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
                        {editingRound ? 'Update Round' : 'Save Round'}
                    </button>
                </section>
            </div>
        </div>
    );
}
