import { useEffect } from 'react';
import { useGameStore } from '../store';
import { startGame } from '../socket';
import './Lobby.css';

function fmtDuration(s) {
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
}

export default function Lobby() {
  const {
    sessionId, isHost,
    lobbyPlayers, lobbyStatus, lobbyFee, lobbyMax, lobbyDuration,
    myId, setScreen,
  } = useGameStore();

  // Fallback: socket.js already calls setScreen('game') when status flips,
  // but cover any edge-case race here too.
  useEffect(() => {
    if (lobbyStatus === 'in_progress') setScreen('game');
  }, [lobbyStatus]);

  const handleStart = async () => {
    try {
      const res = await startGame(sessionId);
      if (!res.success) alert(res.error || 'Failed to start');
    } catch (err) {
      alert(err.message);
    }
  };

  const prize = (lobbyPlayers.length * lobbyFee * 0.9).toFixed(2);

  return (
    <div className="lobby">
      <div className="lobby__header">
        <div className="lobby__eyebrow">GAME LOBBY</div>
        <div className="lobby__session-id">
          SESSION {sessionId?.slice(0, 8).toUpperCase()}...
        </div>
      </div>

      <div className="lobby__card">
        {/* Stats */}
        <div className="lobby__stats">
          <div className="lstat">
            <span className="lstat__val">{lobbyPlayers.length}/{lobbyMax || '?'}</span>
            <span className="lstat__label">PLAYERS</span>
          </div>
          <div className="lstat__divider" />
          <div className="lstat">
            <span className="lstat__val">{lobbyFee} SOL</span>
            <span className="lstat__label">ENTRY FEE</span>
          </div>
          <div className="lstat__divider" />
          <div className="lstat">
            <span className="lstat__val">{fmtDuration(lobbyDuration)}</span>
            <span className="lstat__label">DURATION</span>
          </div>
          <div className="lstat__divider" />
          <div className="lstat">
            <span className="lstat__val lstat__val--gold">{prize} SOL</span>
            <span className="lstat__label">PRIZE POOL</span>
          </div>
        </div>

        {/* Player list */}
        <div className="lobby__players">
          <div className="lobby__players-label">WAITING ROOM</div>
          <div className="lobby__players-list">
            {lobbyPlayers.length === 0 && (
              <div className="lobby__players-empty">Waiting for players...</div>
            )}
            {lobbyPlayers.map(p => (
              <div
                key={p.player_id}
                className={`lobby__player ${p.player_id === myId ? 'lobby__player--me' : ''}`}
              >
                <span
                  className="lobby__player-dot"
                  style={{ background: p.is_host ? 'var(--accent)' : 'var(--safe)' }}
                />
                <span className="lobby__player-addr">
                  {p.player_id?.slice(0, 6)}...{p.player_id?.slice(-4)}
                </span>
                {p.is_host && <span className="lobby__badge lobby__badge--host">HOST</span>}
                {p.player_id === myId && <span className="lobby__badge lobby__badge--you">YOU</span>}
              </div>
            ))}
          </div>
        </div>

        {/* Action */}
        {isHost ? (
          <div className="lobby__host-area">
            <p className="lobby__host-hint">You are the host — start when ready.</p>
            <button className="lobby__start-btn" onClick={handleStart}>
              START GAME &mdash; {lobbyPlayers.length} PLAYER{lobbyPlayers.length !== 1 ? 'S' : ''}
            </button>
          </div>
        ) : (
          <div className="lobby__waiting">
            <span className="lobby__pulse" />
            WAITING FOR HOST TO START...
          </div>
        )}
      </div>

      <button className="lobby__leave" onClick={() => setScreen('landing')}>
        LEAVE LOBBY
      </button>
    </div>
  );
}
