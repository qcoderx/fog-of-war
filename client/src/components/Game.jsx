import { useEffect, useRef, useCallback } from 'react';
import { useGameStore } from '../store';
import { sendMove } from '../socket';
import HUD from './HUD';
import './Game.css';

const TILE = 8; // Smaller tiles for 128x128 grid
const GRID_W = 128;
const GRID_H = 128;
const FOG_RADIUS = 5; // tiles visible (backend constant)

// footprint color by age (seconds)
function footprintColor(age) {
  if (age < 2)  return 'rgba(255,100,0,0.75)';   // hot orange
  if (age < 6)  return 'rgba(255,200,0,0.5)';    // warm yellow
  return             'rgba(68,136,255,0.35)';     // cold blue
}

export default function Game() {
  const canvasRef = useRef(null);
  const stateRef = useRef({});
  const store = useGameStore();

  // keep a ref in sync so the render loop reads fresh state without re-subscribing
  useEffect(() => {
    stateRef.current = {
      players: store.players,
      myId: store.myId,
      myPos: store.myPos,
      footprints: store.footprints,
      treasures: store.treasures,
      bloodHuntActive: store.bloodHuntActive,
      bloodHuntTarget: store.bloodHuntTarget,
    };
  });

  // keyboard movement
  useEffect(() => {
    const map = { ArrowUp: 'up', ArrowDown: 'down', ArrowLeft: 'left', ArrowRight: 'right',
                  w: 'up', s: 'down', a: 'left', d: 'right' };
    const onKey = (e) => {
      const dir = map[e.key];
      if (dir) { e.preventDefault(); sendMove(dir); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // render loop
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    canvas.width = GRID_W * TILE;
    canvas.height = GRID_H * TILE;
    let raf;
    let frame = 0;

    const render = () => {
      frame++;
      const { players, myId, myPos, footprints, treasures, bloodHuntActive, bloodHuntTarget } = stateRef.current;
      const cx = myPos.x, cy = myPos.y;

      // --- background grid ---
      ctx.fillStyle = '#050508';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // grid lines
      ctx.strokeStyle = 'rgba(26,26,46,0.6)';
      ctx.lineWidth = 0.5;
      for (let x = 0; x <= GRID_W; x++) {
        ctx.beginPath(); ctx.moveTo(x * TILE, 0); ctx.lineTo(x * TILE, canvas.height); ctx.stroke();
      }
      for (let y = 0; y <= GRID_H; y++) {
        ctx.beginPath(); ctx.moveTo(0, y * TILE); ctx.lineTo(canvas.width, y * TILE); ctx.stroke();
      }

      // --- footprints ---
      footprints?.forEach(({ x, y, age }) => {
        ctx.fillStyle = footprintColor(age);
        ctx.fillRect(x * TILE + 2, y * TILE + 2, TILE - 4, TILE - 4);
      });

      // --- treasures ---
      treasures?.forEach(({ x, y }) => {
        const pulse = 0.7 + 0.3 * Math.sin(frame * 0.08);
        ctx.fillStyle = `rgba(255,215,0,${pulse})`;
        ctx.beginPath();
        ctx.arc(x * TILE + TILE / 2, y * TILE + TILE / 2, 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = 'rgba(255,215,0,0.4)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(x * TILE + TILE / 2, y * TILE + TILE / 2, 8 * pulse, 0, Math.PI * 2);
        ctx.stroke();
      });

      // --- other players ---
      Object.entries(players || {}).forEach(([id, p]) => {
        if (id === myId) return;
        const isBloodTarget = bloodHuntActive && bloodHuntTarget === id;
        const px = p.pos.x * TILE, py = p.pos.y * TILE;

        if (isBloodTarget) {
          // pulsing gold ring
          const r = 0.6 + 0.4 * Math.sin(frame * 0.15);
          ctx.strokeStyle = `rgba(255,215,0,${r})`;
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(px + TILE / 2, py + TILE / 2, TILE * 0.8 * r, 0, Math.PI * 2);
          ctx.stroke();
          ctx.fillStyle = '#ffd700';
        } else {
          ctx.fillStyle = '#ff2244';
        }

        ctx.fillRect(px + 4, py + 4, TILE - 8, TILE - 8);

        // hp bar
        const hpW = ((p.hp ?? 100) / 100) * (TILE - 4);
        ctx.fillStyle = 'rgba(0,0,0,0.6)';
        ctx.fillRect(px + 2, py - 5, TILE - 4, 3);
        ctx.fillStyle = p.hp > 50 ? '#00ff88' : p.hp > 25 ? '#ffaa00' : '#ff2244';
        ctx.fillRect(px + 2, py - 5, hpW, 3);
      });

      // --- my player ---
      const mx = cx * TILE, my = cy * TILE;
      ctx.fillStyle = '#00ff88';
      ctx.shadowColor = '#00ff88';
      ctx.shadowBlur = 12;
      ctx.fillRect(mx + 3, my + 3, TILE - 6, TILE - 6);
      ctx.shadowBlur = 0;

      // --- FOG OF WAR ---
      // radial gradient mask from player center
      const fogCanvas = document.createElement('canvas');
      fogCanvas.width = canvas.width;
      fogCanvas.height = canvas.height;
      const fctx = fogCanvas.getContext('2d');

      fctx.fillStyle = 'rgba(5,5,8,0.94)';
      fctx.fillRect(0, 0, fogCanvas.width, fogCanvas.height);

      const grad = fctx.createRadialGradient(
        mx + TILE / 2, my + TILE / 2, 0,
        mx + TILE / 2, my + TILE / 2, FOG_RADIUS * TILE
      );
      grad.addColorStop(0, 'rgba(0,0,0,1)');
      grad.addColorStop(0.6, 'rgba(0,0,0,0.9)');
      grad.addColorStop(1, 'rgba(0,0,0,0)');

      fctx.globalCompositeOperation = 'destination-out';
      fctx.fillStyle = grad;
      fctx.fillRect(0, 0, fogCanvas.width, fogCanvas.height);

      ctx.drawImage(fogCanvas, 0, 0);

      raf = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div className="game">
      <HUD />
      <div className="game__canvas-wrap">
        <canvas ref={canvasRef} className="game__canvas" />
      </div>
      <div className="game__controls-hint">
        WASD / ARROW KEYS TO MOVE
      </div>
    </div>
  );
}
