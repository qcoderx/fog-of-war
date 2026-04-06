import { useEffect, useRef, useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { Connection, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { useGameStore } from '../store';
import { loginWithWallet, connectToGame } from '../socket';
import { v4 as uuidv4 } from 'uuid';
import WalletSelector from './WalletSelector';
import WalletDebug from './WalletDebug';
import './Landing.css';

export default function Landing() {
  const wallet = useWallet();
  const { publicKey, connected } = wallet;
  const { setWallet, setScreen, walletAddress } = useGameStore();
  const canvasRef = useRef(null);
  const [isEntering, setIsEntering] = useState(false);

  // fetch balance when wallet connects
  useEffect(() => {
    if (!connected || !publicKey) return;
    const conn = new Connection('https://api.devnet.solana.com');
    conn.getBalance(publicKey).then((lamports) => {
      setWallet(publicKey.toBase58(), (lamports / LAMPORTS_PER_SOL).toFixed(2));
    });
  }, [connected, publicKey]);

  // particle grid background
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let raf;
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();
    window.addEventListener('resize', resize);

    const COLS = 40, ROWS = 25;
    const cells = Array.from({ length: COLS * ROWS }, () => ({ v: Math.random(), speed: 0.002 + Math.random() * 0.004 }));

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const cw = canvas.width / COLS, ch = canvas.height / ROWS;
      cells.forEach((cell, i) => {
        cell.v = (cell.v + cell.speed) % 1;
        const x = (i % COLS) * cw, y = Math.floor(i / COLS) * ch;
        const alpha = cell.v < 0.5 ? cell.v * 0.15 : (1 - cell.v) * 0.15;
        ctx.fillStyle = `rgba(255,107,0,${alpha})`;
        ctx.fillRect(x + 1, y + 1, cw - 2, ch - 2);
      });
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize); };
  }, []);

  const handleEnter = async () => {
    if (!connected || !publicKey) {
      alert('Please connect your wallet first');
      return;
    }
    
    if (!wallet.signMessage) {
      alert('Your wallet does not support message signing. Please use Phantom wallet.');
      return;
    }
    
    setIsEntering(true);
    
    try {
      // Login with wallet signature
      await loginWithWallet(publicKey, wallet.signMessage);
      
      // Generate or retrieve game ID
      const gameId = uuidv4();
      localStorage.setItem('fog_game_id', gameId);
      
      // Connect to game stream
      connectToGame(gameId);
      
      setScreen('game'); // Skip lobby for MVP
    } catch (error) {
      console.error('Failed to enter arena:', error);
      alert(`Failed to connect: ${error.message || 'Please try again'}`);
      setIsEntering(false);
    }
  };

  return (
    <div className="landing">
      <canvas ref={canvasRef} className="landing__bg" />

      <div className="landing__content">
        <div className="landing__eyebrow">SOLANA DEVNET · ENTRY: 1 SOL</div>

        <h1 className="landing__title">
          <span className="landing__title-fog">FOG</span>
          <span className="landing__title-of"> OF </span>
          <span className="landing__title-war">WAR</span>
        </h1>

        <p className="landing__sub">
          Pay. Spawn. Hunt. Extract.<br />
          <span className="accent">90% of the pool</span> goes to the last one standing.
        </p>

        <div className="landing__stats">
          <div className="stat"><span className="stat__val">8</span><span className="stat__label">MAX PLAYERS</span></div>
          <div className="stat__divider" />
          <div className="stat"><span className="stat__val">1 SOL</span><span className="stat__label">ENTRY FEE</span></div>
          <div className="stat__divider" />
          <div className="stat"><span className="stat__val">7.2 SOL</span><span className="stat__label">PRIZE POOL</span></div>
        </div>

        <div className="landing__actions">
          <WalletSelector />
          {connected && (
            <button className="enter-btn" onClick={handleEnter} disabled={isEntering}>
              <span className="enter-btn__icon">⚔</span>
              {isEntering ? 'CONNECTING...' : 'ENTER ARENA'}
              <span className="enter-btn__cost">1 SOL</span>
            </button>
          )}
        </div>

        {connected && (
          <div className="landing__wallet-info">
            <span className="dot dot--green" />
            {walletAddress?.slice(0, 4)}...{walletAddress?.slice(-4)} · Devnet
          </div>
        )}
      </div>

      <div className="landing__footer">
        <span>BLOOD HUNT activates at 5 min remaining</span>
        <span>·</span>
        <span>10% house fee</span>
        <span>·</span>
        <span>Powered by Solana</span>
      </div>

      <WalletDebug />
    </div>
  );
}
