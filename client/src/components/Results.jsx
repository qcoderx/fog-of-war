import { useGameStore } from '../store';
import './Results.css';

export default function Results() {
  const { winner, payout, walletAddress, setScreen } = useGameStore();
  const isWinner = winner === walletAddress;

  return (
    <div className="results">
      <div className="results__bg" />

      <div className="results__content">
        {isWinner ? (
          <>
            <div className="results__crown">👑</div>
            <div className="results__eyebrow winner">VICTORY</div>
            <h2 className="results__title results__title--win">YOU EXTRACTED</h2>
          </>
        ) : (
          <>
            <div className="results__crown">💀</div>
            <div className="results__eyebrow loser">ELIMINATED</div>
            <h2 className="results__title results__title--lose">YOU FELL IN THE FOG</h2>
          </>
        )}

        <div className="results__winner-card">
          <div className="results__winner-label">WINNER</div>
          <div className="results__winner-addr">
            {winner?.slice(0, 6)}...{winner?.slice(-6)}
          </div>
          <div className="results__payout">
            <span className="payout__val">{payout ?? '7.2'}</span>
            <span className="payout__unit">SOL</span>
          </div>
          <div className="results__payout-sub">Transferred to winner's wallet on Devnet</div>
        </div>

        <div className="results__actions">
          <button className="results__btn results__btn--primary" onClick={() => setScreen('lobby')}>
            ⚔ ENTER AGAIN
          </button>
          <button className="results__btn results__btn--secondary" onClick={() => setScreen('landing')}>
            BACK TO LOBBY
          </button>
        </div>

        <div className="results__tx">
          <span className="dot dot--green" />
          Settlement TX: <span className="tx-hash">Ax7f...3kPq</span> · Devnet
        </div>
      </div>
    </div>
  );
}
