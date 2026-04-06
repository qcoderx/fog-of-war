import { useEffect, useRef } from 'react';
import { useGameStore } from '../store';
import './Lobby.css';

const SLOTS = 8;

export default function Lobby() {
  const { playersInLobby, poolSize, walletAddress } = useGameStore();
  const timerRef = useRef(null);

  // simulate lobby fill for demo (remove when backend is live)
  useEffect(() => {
    // backend will push lobby:update events via socket
  }, []);

  const slots = Array.from({ length: SLOTS }, (_, i) => ({
    filled: i < playersInLobby,
    isMe: i === 0,
  }));

  return (
    <div className="lobby">
      <div className="lobby__header">
        <div className="lobby__eyebrow">MATCHMAKING</div>
        <h2 className="lobby__title">WAITING FOR SOLDIERS</h2>
        <p className="lobby__sub">Game starts when all {SLOTS} slots are filled</p>
      </div>

      <div className="lobby__grid">
        {slots.map((slot, i) => (
          <div key={i} className={`slot ${slot.filled ? 'slot--filled' : 'slot--empty'} ${slot.isMe ? 'slot--me' : ''}`}>
            {slot.filled ? (
              <>
                <div className="slot__avatar">{slot.isMe ? '★' : '◆'}</div>
                <div className="slot__addr">
                  {slot.isMe
                    ? `${walletAddress?.slice(0, 4)}...${walletAddress?.slice(-4)}`
                    : `0x${Math.random().toString(16).slice(2, 6)}...`}
                </div>
                {slot.isMe && <div className="slot__you">YOU</div>}
              </>
            ) : (
              <>
                <div className="slot__avatar slot__avatar--empty">?</div>
                <div className="slot__addr muted">WAITING...</div>
              </>
            )}
          </div>
        ))}
      </div>

      <div className="lobby__pool">
        <div className="pool__label">CURRENT PRIZE POOL</div>
        <div className="pool__value">{playersInLobby}.0 <span>SOL</span></div>
        <div className="pool__sub">Winner takes {(playersInLobby * 0.9).toFixed(1)} SOL · House: {(playersInLobby * 0.1).toFixed(1)} SOL</div>
      </div>

      <div className="lobby__status">
        <div className="lobby__progress">
          <div className="lobby__progress-fill" style={{ width: `${(playersInLobby / SLOTS) * 100}%` }} />
        </div>
        <div className="lobby__count">
          <span className="count-filled">{playersInLobby}</span>
          <span className="count-sep"> / </span>
          <span className="count-total">{SLOTS}</span>
          <span className="count-label"> PLAYERS READY</span>
        </div>
      </div>

      <div className="lobby__spinner">
        <div className="spinner-ring" />
        <span>SCANNING FOR OPPONENTS...</span>
      </div>
    </div>
  );
}
