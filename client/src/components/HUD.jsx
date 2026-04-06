import { useGameStore } from '../store';
import './HUD.css';

function fmt(s) {
  const m = Math.floor(s / 60).toString().padStart(2, '0');
  const sec = (s % 60).toString().padStart(2, '0');
  return `${m}:${sec}`;
}

export default function HUD() {
  const { myHp, myTreasure, timeLeft, bloodHuntActive, leaderboard, walletAddress } = useGameStore();
  const isLow = myHp <= 25;
  const isCritical = timeLeft <= 60;

  return (
    <>
      {/* Top bar */}
      <div className="hud-top">
        <div className="hud-stat">
          <span className="hud-stat__label">HP</span>
          <div className="hud-hp-bar">
            <div
              className="hud-hp-fill"
              style={{
                width: `${myHp}%`,
                background: myHp > 50 ? 'var(--safe)' : myHp > 25 ? 'var(--accent2)' : 'var(--danger)',
              }}
            />
          </div>
          <span className={`hud-stat__val ${isLow ? 'hud-stat__val--danger' : ''}`}>{myHp}</span>
        </div>

        <div className={`hud-timer ${isCritical ? 'hud-timer--critical' : ''}`}>
          {fmt(timeLeft)}
        </div>

        <div className="hud-stat hud-stat--right">
          <span className="hud-stat__label">TREASURE</span>
          <span className="hud-stat__val hud-stat__val--gold">◆ {myTreasure}</span>
        </div>
      </div>

      {/* Blood Hunt Banner */}
      {bloodHuntActive && (
        <div className="hud-blood-hunt">
          <span className="blood-hunt__icon">🩸</span>
          BLOOD HUNT ACTIVE — RICHEST PLAYER REVEALED
          <span className="blood-hunt__icon">🩸</span>
        </div>
      )}

      {/* Leaderboard */}
      <div className="hud-leaderboard">
        <div className="hud-lb__title">LEADERBOARD</div>
        {(leaderboard.length ? leaderboard : [{ id: walletAddress, treasure: myTreasure, hp: myHp }])
          .slice(0, 5)
          .map((p, i) => (
            <div key={p.id} className={`hud-lb__row ${p.id === walletAddress ? 'hud-lb__row--me' : ''}`}>
              <span className="hud-lb__rank">#{i + 1}</span>
              <span className="hud-lb__addr">{p.id?.slice(0, 4)}...{p.id?.slice(-4)}</span>
              <span className="hud-lb__val">◆ {p.treasure ?? 0}</span>
            </div>
          ))}
      </div>

      {/* Wallet badge */}
      <div className="hud-wallet">
        <span className="dot dot--green" />
        {walletAddress?.slice(0, 4)}...{walletAddress?.slice(-4)}
      </div>
    </>
  );
}
