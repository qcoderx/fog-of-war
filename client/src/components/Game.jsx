import { useEffect, useRef, useState } from 'react';
import { useGameStore } from '../store';
import { sendMove, sendAttack, collectLoot } from '../socket';
import HUD from './HUD';
import './Game.css';

const TILE        = 16;   // 16 px/tile → 128×128 = 2048×2048 canvas
const GRID_W      = 128;
const GRID_H      = 128;
const FOG_RADIUS  = 5;    // tiles visible around player
const SPAWN_X     = 64;
const SPAWN_Y     = 64;
const BOT_COUNT   = 7;
const BOT_TICK_MS = 500;  // bot AI runs at 2 Hz
const MOVE_SPEED  = 0.15; // Smooth interpolation speed (0-1, higher = faster)
const TREASURE_DESPAWN_DIST = 20; // tiles away before treasure can despawn
const TREASURE_DESPAWN_TIME = 5000; // ms player must be away
const BOT_DESPAWN_TIME = 15000; // ms without combat before bot respawns

// PRD heatmap colors
function footprintColor(age) {
  if (age < 2) return 'rgba(255,100,0,0.75)';
  if (age < 6) return 'rgba(255,200,0,0.5)';
  return            'rgba(68,136,255,0.35)';
}

// Draw player sprite from character sheet
// charIndex: 0-7 (0-3 top row, 4-7 bottom row)
function drawPlayerSprite(ctx, spriteImg, x, y, size, charIndex = 0) {
  if (!spriteImg || !spriteImg.complete) return false;
  
  // Character sheet is 4 columns × 2 rows
  const row = Math.floor(charIndex / 4);
  const col = charIndex % 4;
  
  // Source dimensions (assuming each character is 1/4 width, 1/2 height)
  const srcW = spriteImg.width / 4;
  const srcH = spriteImg.height / 2;
  const srcX = col * srcW;
  const srcY = row * srcH;
  
  // Draw scaled sprite
  ctx.drawImage(
    spriteImg,
    srcX, srcY, srcW, srcH,  // source
    x, y, size, size         // destination
  );
  
  return true;
}

// Treasures: cluster some near spawn so player sees them immediately
function genLocalTreasures() {
  const out = [];
  // 15 near spawn (within 10 tiles)
  for (let i = 0; i < 15; i++) {
    out.push({
      id: `tn${i}`,
      x: Math.max(1, Math.min(GRID_W - 2, SPAWN_X + Math.round((Math.random() - 0.5) * 20))),
      y: Math.max(1, Math.min(GRID_H - 2, SPAWN_Y + Math.round((Math.random() - 0.5) * 20))),
    });
  }
  // 35 scattered across map
  for (let i = 0; i < 35; i++) {
    out.push({
      id: `tr${i}`,
      x: 4 + Math.floor(Math.random() * (GRID_W - 8)),
      y: 4 + Math.floor(Math.random() * (GRID_H - 8)),
    });
  }
  return out;
}

function makeBot(i) {
  return {
    id: `bot_${i}`,
    x:  40 + Math.floor(Math.random() * 50),
    y:  40 + Math.floor(Math.random() * 50),
    hp: 100,
    status: 'alive',
    killCount: 0,
  };
}

function respawnBot(bot) {
  return {
    ...bot,
    x: 40 + Math.floor(Math.random() * 50),
    y: 40 + Math.floor(Math.random() * 50),
    hp: 100,
    status: 'alive',
  };
}

function respawnTreasure() {
  return {
    id: `tr_${Date.now()}_${Math.random()}`,
    x: 4 + Math.floor(Math.random() * (GRID_W - 8)),
    y: 4 + Math.floor(Math.random() * (GRID_H - 8)),
  };
}

export default function Game() {
  const canvasRef   = useRef(null);
  const stateRef    = useRef({});
  const trailRef    = useRef([]);
  const treasureRef = useRef(genLocalTreasures());
  const treasureTimerRef = useRef({}); // track time player is away from each treasure
  const botsRef     = useRef([]);          // local-mode AI bots
  const botCombatTimerRef = useRef({}); // track last combat time for each bot
  const flashRef    = useRef(0);           // combat hit flash timestamp
  const store       = useGameStore();

  // Smooth interpolation refs
  const displayPosRef = useRef({ x: SPAWN_X, y: SPAWN_Y }); // Rendered position
  const targetPosRef = useRef({ x: SPAWN_X, y: SPAWN_Y });  // Target position
  const botDisplayPosRef = useRef([]);     // Bot smooth positions
  const playerDisplayPosRef = useRef({});  // Other players smooth positions

  // Load sprite images
  const treasureImgRef = useRef(null);
  const playerSpriteRef = useRef(null);

  useEffect(() => {
    const treasureImg = new Image();
    treasureImg.src = '/bgcharac.png';
    treasureImgRef.current = treasureImg;

    const playerSprite = new Image();
    playerSprite.src = '/bgcharac1.png';
    playerSpriteRef.current = playerSprite;
  }, []);

  // Movement prompt: shown until player makes their first move (non-solo only)
  const [showSpawnPrompt, setShowSpawnPrompt] = useState(!store.localMode);
  const hasMoved = useRef(false);

  // ── Reload lock: warn user if they try to leave mid-game ────────────────
  useEffect(() => {
    const onBeforeUnload = (e) => {
      e.preventDefault();
      e.returnValue = 'Game in progress — leaving will forfeit your entry fee!';
      return e.returnValue;
    };
    window.addEventListener('beforeunload', onBeforeUnload);
    return () => window.removeEventListener('beforeunload', onBeforeUnload);
  }, []);

  // sync store → ref every render so the render loop reads fresh state
  useEffect(() => {
    stateRef.current = {
      players:         store.players,
      npcs:            store.npcs,
      myId:            store.myId,
      myPos:           store.myPos,
      myHp:            store.myHp,
      footprints:      store.footprints,
      treasures:       store.localMode ? treasureRef.current : store.treasures,
      bloodHuntActive: store.bloodHuntActive,
      bloodHuntTarget: store.bloodHuntTarget,
      localMode:       store.localMode,
      sessionId:       store.sessionId,
    };
  });

  // local countdown
  useEffect(() => {
    if (!store.localMode) return;
    const id = setInterval(() => {
      store.setTimeLeft(Math.max(0, useGameStore.getState().timeLeft - 1));
    }, 1000);
    return () => clearInterval(id);
  }, [store.localMode]);

  // ── Local-mode bot AI ───────────────────────────────────────────────────
  useEffect(() => {
    if (!store.localMode) return;

    // spawn bots
    botsRef.current = Array.from({ length: BOT_COUNT }, (_, i) => makeBot(i));
    const now = Date.now();
    botsRef.current.forEach(bot => {
      botCombatTimerRef.current[bot.id] = now;
    });

    const id = setInterval(() => {
      const { myPos } = useGameStore.getState();
      if (!myPos) return;

      let myHp = useGameStore.getState().myHp;
      let myTreasure = useGameStore.getState().myTreasure;
      let hitThisTick = false;
      const now = Date.now();

      botsRef.current = botsRef.current.map(bot => {
        if (bot.status !== 'alive') return bot;

        // simple chase AI with occasional random wander
        const dx = myPos.x - bot.x;
        const dy = myPos.y - bot.y;
        let nx = bot.x;
        let ny = bot.y;

        if (Math.random() < 0.85) {
          // move towards player (more aggressive)
          if (Math.abs(dx) >= Math.abs(dy)) {
            nx += Math.sign(dx);
          } else {
            ny += Math.sign(dy);
          }
        } else {
          // random wander
          const dirs = [[1,0],[-1,0],[0,1],[0,-1]];
          const [rdx, rdy] = dirs[Math.floor(Math.random() * 4)];
          nx += rdx; ny += rdy;
        }
        nx = Math.max(0, Math.min(GRID_W - 1, nx));
        ny = Math.max(0, Math.min(GRID_H - 1, ny));

        // combat: player adjacent?
        const dist = Math.abs(nx - myPos.x) + Math.abs(ny - myPos.y);
        let botHp = bot.hp;
        if (dist <= 1) {
          // mutual damage (5 hp per hit, PRD spec)
          myHp       = Math.max(0, myHp - 5);
          botHp      = Math.max(0, botHp - 5);
          hitThisTick = true;
          botCombatTimerRef.current[bot.id] = now; // reset combat timer
          // loot bot's treasure if it dies
          if (botHp <= 0) myTreasure += 1;
        }

        // Despawn & respawn if no combat for too long
        const timeSinceCombat = now - (botCombatTimerRef.current[bot.id] || now);
        if (timeSinceCombat > BOT_DESPAWN_TIME) {
          botCombatTimerRef.current[bot.id] = now;
          return respawnBot(bot);
        }

        return {
          ...bot,
          x: nx, y: ny,
          hp: botHp,
          status: botHp <= 0 ? 'eliminated' : 'alive',
        };
      });

      // write back damage
      if (hitThisTick) {
        flashRef.current = Date.now();
        useGameStore.setState({ myHp, myTreasure });
        if (myHp <= 0) useGameStore.setState({ screen: 'results' });
      }
    }, BOT_TICK_MS);

    return () => {
      clearInterval(id);
      botsRef.current = [];
      botCombatTimerRef.current = {};
    };
  }, [store.localMode]);

  // keyboard movement + attack
  useEffect(() => {
    const DELTA = {
      ArrowUp:[0,-1], ArrowDown:[0,1], ArrowLeft:[-1,0], ArrowRight:[1,0],
      w:[0,-1], s:[0,1], a:[-1,0], d:[1,0],
    };
    const DIR = {
      ArrowUp:'up', ArrowDown:'down', ArrowLeft:'left', ArrowRight:'right',
      w:'up', s:'down', a:'left', d:'right',
    };

    const onKey = (e) => {
      // ── Attack: Space or F key (multiplayer only) ──
      if ((e.key === ' ' || e.key === 'f' || e.key === 'F') && !stateRef.current.localMode) {
        e.preventDefault();
        const { players, myId, myPos } = stateRef.current;
        if (!myPos || !players) return;
        // Find nearest alive player within attack range
        let nearest = null;
        let nearestDist = Infinity;
        Object.entries(players).forEach(([id, p]) => {
          if (id === myId || p.status === 'eliminated') return;
          const d = Math.abs(p.pos.x - myPos.x) + Math.abs(p.pos.y - myPos.y);
          if (d <= 2 && d < nearestDist) { nearest = id; nearestDist = d; }
        });
        if (nearest) {
          flashRef.current = Date.now();
          sendAttack(nearest);
        }
        return;
      }

      if (!DELTA[e.key]) return;
      e.preventDefault();
      const { localMode, myPos } = stateRef.current;
      if (!myPos) return;

      // Dismiss spawn prompt on first move
      if (!hasMoved.current) {
        hasMoved.current = true;
        setShowSpawnPrompt(false);
      }

      const [dx, dy] = DELTA[e.key];
      const nx = Math.max(0, Math.min(GRID_W - 1, myPos.x + dx));
      const ny = Math.max(0, Math.min(GRID_H - 1, myPos.y + dy));

      trailRef.current.push({ x: myPos.x, y: myPos.y, ts: Date.now() });
      store.setMyPos({ x: nx, y: ny });

      if (localMode) {
        const picked = treasureRef.current.find(t => t.x === nx && t.y === ny);
        if (picked) {
          treasureRef.current = treasureRef.current.filter(t => t.id !== picked.id);
          delete treasureTimerRef.current[picked.id];
          useGameStore.setState({ myTreasure: useGameStore.getState().myTreasure + 1 });
        }
      } else {
        sendMove(nx, ny);
        // Walk-over loot collection: check new position against known treasures
        const nearby = useGameStore.getState().treasures?.filter(
          t => Math.abs(t.x - nx) + Math.abs(t.y - ny) <= 1
        );
        if (nearby?.length) {
          nearby.forEach(t => collectLoot(t.id));
        }
      }
    };

    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // ── Treasure despawn/respawn logic ──────────────────────────────────────
  useEffect(() => {
    if (!store.localMode) return;

    const id = setInterval(() => {
      const { myPos } = useGameStore.getState();
      if (!myPos) return;

      const now = Date.now();
      const toRespawn = [];

      treasureRef.current.forEach(treasure => {
        const dist = Math.abs(treasure.x - myPos.x) + Math.abs(treasure.y - myPos.y);
        
        if (dist > TREASURE_DESPAWN_DIST) {
          // Start or continue timer
          if (!treasureTimerRef.current[treasure.id]) {
            treasureTimerRef.current[treasure.id] = now;
          } else {
            const elapsed = now - treasureTimerRef.current[treasure.id];
            if (elapsed > TREASURE_DESPAWN_TIME) {
              toRespawn.push(treasure.id);
            }
          }
        } else {
          // Player is close, reset timer
          delete treasureTimerRef.current[treasure.id];
        }
      });

      // Despawn old treasures and spawn new ones
      if (toRespawn.length > 0) {
        treasureRef.current = treasureRef.current.filter(t => !toRespawn.includes(t.id));
        toRespawn.forEach(id => {
          delete treasureTimerRef.current[id];
          treasureRef.current.push(respawnTreasure());
        });
      }
    }, 1000); // Check every second

    return () => {
      clearInterval(id);
      treasureTimerRef.current = {};
    };
  }, [store.localMode]);

  // ── render loop ──────────────────────────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx    = canvas.getContext('2d', { alpha: false });
    
    // Enable image smoothing for better sprite quality
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    
    canvas.width  = GRID_W * TILE;
    canvas.height = GRID_H * TILE;
    let raf;
    let frame = 0;

    // fog canvas — created once, reused every frame
    const fogCanvas = document.createElement('canvas');
    fogCanvas.width  = canvas.width;
    fogCanvas.height = canvas.height;
    const fctx = fogCanvas.getContext('2d');

    const render = () => {
      frame++;
      const now = Date.now();
      const {
        players, npcs, myId, myPos, myHp,
        footprints, treasures,
        bloodHuntActive, bloodHuntTarget,
        localMode,
      } = stateRef.current;

      const cx = myPos?.x ?? SPAWN_X;
      const cy = myPos?.y ?? SPAWN_Y;
      
      // Smooth interpolation for player position
      targetPosRef.current = { x: cx, y: cy };
      displayPosRef.current.x += (targetPosRef.current.x - displayPosRef.current.x) * MOVE_SPEED;
      displayPosRef.current.y += (targetPosRef.current.y - displayPosRef.current.y) * MOVE_SPEED;
      
      const renderX = displayPosRef.current.x;
      const renderY = displayPosRef.current.y;

      // ── 1. Background ────────────────────────────────────────────
      ctx.fillStyle = '#050508';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // ── 2. Grid lines ────────────────────────────────────────────
      ctx.strokeStyle = 'rgba(26,26,46,0.6)';
      ctx.lineWidth   = 0.5;
      for (let x = 0; x <= GRID_W; x++) {
        ctx.beginPath();
        ctx.moveTo(x * TILE, 0);
        ctx.lineTo(x * TILE, canvas.height);
        ctx.stroke();
      }
      for (let y = 0; y <= GRID_H; y++) {
        ctx.beginPath();
        ctx.moveTo(0, y * TILE);
        ctx.lineTo(canvas.width, y * TILE);
        ctx.stroke();
      }

      // ── 3. Footprint heatmap ─────────────────────────────────────
      const trail = localMode ? trailRef.current : (footprints || []);
      trail.forEach(fp => {
        const age = localMode ? (now - fp.ts) / 1000 : fp.age;
        if (age > 10) return;
        ctx.fillStyle = footprintColor(age);
        ctx.fillRect(fp.x * TILE + 1, fp.y * TILE + 1, TILE - 2, TILE - 2);
      });
      if (localMode) {
        trailRef.current = trailRef.current.filter(fp => (now - fp.ts) / 1000 < 10);
      }

      // ── 4. Treasures ─────────────────────────────────────────────
      const treasureImg = treasureImgRef.current;
      (treasures || []).forEach(({ x, y }) => {
        const px = x * TILE;
        const py = y * TILE;
        
        if (treasureImg && treasureImg.complete) {
          // Draw treasure chest image (scaled to fit tile)
          const size = TILE * 2; // Bigger chest
          const offsetX = px - (size - TILE) / 2;
          const offsetY = py - (size - TILE) / 2;
          ctx.drawImage(treasureImg, offsetX, offsetY, size, size);
          
          // Add subtle glow effect
          const pulse = 0.7 + 0.3 * Math.sin(frame * 0.08);
          ctx.shadowColor = `rgba(255,215,0,${pulse * 0.5})`;
          ctx.shadowBlur = 8;
          ctx.strokeStyle = `rgba(255,215,0,${pulse * 0.3})`;
          ctx.lineWidth = 1;
          ctx.strokeRect(px, py, TILE, TILE);
          ctx.shadowBlur = 0;
        } else {
          // Fallback if image not loaded
          const pulse = 0.7 + 0.3 * Math.sin(frame * 0.08);
          ctx.fillStyle = `rgba(255,215,0,${pulse})`;
          ctx.beginPath();
          ctx.arc(px + TILE / 2, py + TILE / 2, 3, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      // ── 5. Other players (online) ─────────────────────────────────
      const playerSprite = playerSpriteRef.current;
      Object.entries(players || {}).forEach(([id, p], idx) => {
        if (id === myId) return;
        if (p.status === 'eliminated') return;
        
        // Initialize smooth position for this player
        if (!playerDisplayPosRef.current[id]) {
          playerDisplayPosRef.current[id] = { x: p.pos.x, y: p.pos.y };
        }
        
        // Smooth interpolation
        playerDisplayPosRef.current[id].x += (p.pos.x - playerDisplayPosRef.current[id].x) * MOVE_SPEED;
        playerDisplayPosRef.current[id].y += (p.pos.y - playerDisplayPosRef.current[id].y) * MOVE_SPEED;
        
        const px = playerDisplayPosRef.current[id].x * TILE;
        const py = playerDisplayPosRef.current[id].y * TILE;

        const charIndex = (idx + 1) % 8;
        const spriteSize = TILE * 2.5;
        const spriteX = px - (spriteSize - TILE) / 2;
        const spriteY = py - (spriteSize - TILE) / 2;
        
        const drawn = drawPlayerSprite(ctx, playerSprite, spriteX, spriteY, spriteSize, charIndex);
        
        if (!drawn) {
          ctx.fillStyle = '#ff2244';
          ctx.fillRect(px + 1, py + 1, TILE - 2, TILE - 2);
        }

        const hpW = ((p.hp ?? 100) / 100) * (TILE - 2);
        ctx.fillStyle = 'rgba(0,0,0,0.6)';
        ctx.fillRect(px + 1, py - 3, TILE - 2, 2);
        ctx.fillStyle = p.hp > 50 ? '#00ff88' : p.hp > 25 ? '#ffaa00' : '#ff2244';
        ctx.fillRect(px + 1, py - 3, hpW, 2);
      });

      // ── 5b. Local-mode bots ───────────────────────────────────────
      if (localMode) {
        // Initialize bot display positions if needed
        if (botDisplayPosRef.current.length !== botsRef.current.length) {
          botDisplayPosRef.current = botsRef.current.map(b => ({ x: b.x, y: b.y }));
        }
        
        botsRef.current.forEach((bot, idx) => {
          if (bot.status !== 'alive') return;
          
          // Smooth interpolation for bot movement
          if (!botDisplayPosRef.current[idx]) {
            botDisplayPosRef.current[idx] = { x: bot.x, y: bot.y };
          }
          botDisplayPosRef.current[idx].x += (bot.x - botDisplayPosRef.current[idx].x) * MOVE_SPEED;
          botDisplayPosRef.current[idx].y += (bot.y - botDisplayPosRef.current[idx].y) * MOVE_SPEED;
          
          const px = botDisplayPosRef.current[idx].x * TILE;
          const py = botDisplayPosRef.current[idx].y * TILE;
          const dist = Math.abs(bot.x - cx) + Math.abs(bot.y - cy);

          const charIndex = (idx + 2) % 8;
          const spriteSize = TILE * 2.5;
          const spriteX = px - (spriteSize - TILE) / 2;
          const spriteY = py - (spriteSize - TILE) / 2;
          
          const drawn = drawPlayerSprite(ctx, playerSprite, spriteX, spriteY, spriteSize, charIndex);
          
          if (!drawn) {
            if (dist <= 1) {
              ctx.fillStyle = `rgba(255,80,0,${0.7 + 0.3 * Math.sin(frame * 0.4)})`;
            } else {
              ctx.fillStyle = '#ff2244';
            }
            ctx.fillRect(px + 1, py + 1, TILE - 2, TILE - 2);
          } else if (dist <= 1) {
            ctx.shadowColor = 'rgba(255,80,0,0.8)';
            ctx.shadowBlur = 12;
            ctx.strokeStyle = `rgba(255,80,0,${0.7 + 0.3 * Math.sin(frame * 0.4)})`;
            ctx.lineWidth = 2;
            ctx.strokeRect(px, py, TILE, TILE);
            ctx.shadowBlur = 0;
          }

          const hpW = (bot.hp / 100) * (TILE - 2);
          ctx.fillStyle = 'rgba(0,0,0,0.6)';
          ctx.fillRect(px + 1, py - 3, TILE - 2, 2);
          ctx.fillStyle = bot.hp > 50 ? '#00ff88' : bot.hp > 25 ? '#ffaa00' : '#ff2244';
          ctx.fillRect(px + 1, py - 3, hpW, 2);
        });
      }

      // ── 5c. Server-side NPCs (multiplayer) ───────────────────────
      if (!localMode && npcs) {
        npcs.forEach(npc => {
          const px = npc.x * TILE;
          const py = npc.y * TILE;
          const dist = Math.abs(npc.x - cx) + Math.abs(npc.y - cy);
          if (dist <= 1) {
            ctx.fillStyle = `rgba(255,80,0,${0.7 + 0.3 * Math.sin(frame * 0.4)})`;
          } else {
            ctx.fillStyle = '#cc3300';
          }
          // Draw NPC as a diamond shape to distinguish from players
          ctx.beginPath();
          ctx.moveTo(px + TILE / 2, py + 1);
          ctx.lineTo(px + TILE - 1, py + TILE / 2);
          ctx.lineTo(px + TILE / 2, py + TILE - 1);
          ctx.lineTo(px + 1,        py + TILE / 2);
          ctx.closePath();
          ctx.fill();
          const hpW = ((npc.hp ?? 100) / 100) * (TILE - 2);
          ctx.fillStyle = 'rgba(0,0,0,0.6)';
          ctx.fillRect(px + 1, py - 3, TILE - 2, 2);
          ctx.fillStyle = '#ff6600';
          ctx.fillRect(px + 1, py - 3, hpW, 2);
        });
      }

      // ── 6. My player ─────────────────────────────────────────────
      const mx = renderX * TILE;
      const my = renderY * TILE;
      const hitFlash = (now - flashRef.current) < 200;
      
      // Draw player sprite (character 0 - knight)
      const myCharIndex = 0;
      const mySpriteSize = TILE * 2.5; // Bigger sprite
      const mySpriteX = mx - (mySpriteSize - TILE) / 2;
      const mySpriteY = my - (mySpriteSize - TILE) / 2;
      
      const myDrawn = drawPlayerSprite(ctx, playerSprite, mySpriteX, mySpriteY, mySpriteSize, myCharIndex);
      
      if (!myDrawn) {
        // Fallback to colored square
        ctx.fillStyle   = hitFlash ? '#ff4444' : '#00ff88';
        ctx.shadowColor = hitFlash ? '#ff0000' : '#00ff88';
        ctx.shadowBlur  = hitFlash ? 20 : 12;
        ctx.fillRect(mx + 1, my + 1, TILE - 2, TILE - 2);
        ctx.shadowBlur  = 0;
      } else {
        // Add glow effect to sprite
        if (hitFlash) {
          ctx.shadowColor = '#ff0000';
          ctx.shadowBlur = 20;
          ctx.strokeStyle = 'rgba(255,0,0,0.8)';
          ctx.lineWidth = 2;
          ctx.strokeRect(mx, my, TILE, TILE);
          ctx.shadowBlur = 0;
        } else {
          ctx.shadowColor = '#00ff88';
          ctx.shadowBlur = 12;
          ctx.strokeStyle = 'rgba(0,255,136,0.5)';
          ctx.lineWidth = 1;
          ctx.strokeRect(mx, my, TILE, TILE);
          ctx.shadowBlur = 0;
        }
      }

      // ── 7. Fog of War (destination-out spotlight) ─────────────────
      fctx.fillStyle = 'rgba(5,5,8,0.94)';
      fctx.fillRect(0, 0, fogCanvas.width, fogCanvas.height);

      const grad = fctx.createRadialGradient(
        mx + TILE / 2, my + TILE / 2, 0,
        mx + TILE / 2, my + TILE / 2, FOG_RADIUS * TILE,
      );
      grad.addColorStop(0,   'rgba(0,0,0,1)');
      grad.addColorStop(0.6, 'rgba(0,0,0,0.9)');
      grad.addColorStop(1,   'rgba(0,0,0,0)');

      fctx.globalCompositeOperation = 'destination-out';
      fctx.fillStyle = grad;
      fctx.fillRect(0, 0, fogCanvas.width, fogCanvas.height);
      fctx.globalCompositeOperation = 'source-over';

      ctx.drawImage(fogCanvas, 0, 0);

      // ── 7b. Blood Hunt beacon — drawn AFTER fog, always visible ──────
      // Reveals the richest player's exact position regardless of fog radius
      if (bloodHuntActive && bloodHuntTarget) {
        const targetPlayer = (players || {})[bloodHuntTarget];
        const isMe = bloodHuntTarget === myId;
        let btx, bty;
        if (targetPlayer) {
          btx = targetPlayer.pos.x;
          bty = targetPlayer.pos.y;
        } else if (isMe && myPos) {
          btx = myPos.x;
          bty = myPos.y;
        }

        if (btx !== undefined) {
          const bcx = btx * TILE + TILE / 2;
          const bcy = bty * TILE + TILE / 2;
          const pulse = 0.5 + 0.5 * Math.sin(frame * 0.18);

          // Outer blood-red glow ring
          ctx.shadowColor = `rgba(220,0,0,${0.7 + 0.3 * pulse})`;
          ctx.shadowBlur  = 16 + 8 * pulse;
          ctx.strokeStyle = `rgba(255,40,40,${0.6 + 0.4 * pulse})`;
          ctx.lineWidth   = 2;
          ctx.beginPath();
          ctx.arc(bcx, bcy, TILE * 1.4, 0, Math.PI * 2);
          ctx.stroke();

          // Inner crosshair lines
          ctx.strokeStyle = `rgba(255,80,80,${0.5 + 0.5 * pulse})`;
          ctx.lineWidth   = 1;
          const hs = TILE * 0.9;
          ctx.beginPath();
          ctx.moveTo(bcx - hs, bcy); ctx.lineTo(bcx + hs, bcy);
          ctx.moveTo(bcx, bcy - hs); ctx.lineTo(bcx, bcy + hs);
          ctx.stroke();
          ctx.shadowBlur = 0;

          // Treasure count badge above beacon
          const treasure = targetPlayer?.treasure ?? 0;
          ctx.font        = `bold ${Math.ceil(TILE * 0.75)}px monospace`;
          ctx.textAlign   = 'center';
          ctx.fillStyle   = `rgba(255,215,0,${0.85 + 0.15 * pulse})`;
          ctx.fillText(`◆ ${treasure}`, bcx, bcy - TILE * 1.8);

          // Direction arrow — shown when target is outside fog radius
          const fdx = bcx - (cx * TILE + TILE / 2);
          const fdy = bcy - (cy * TILE + TILE / 2);
          const distPx = Math.sqrt(fdx * fdx + fdy * fdy);
          if (distPx > FOG_RADIUS * TILE * 0.7) {
            const angle   = Math.atan2(fdy, fdx);
            const edgeDist = FOG_RADIUS * TILE * 0.75;
            const arrowX  = cx * TILE + TILE / 2 + Math.cos(angle) * edgeDist;
            const arrowY  = cy * TILE + TILE / 2 + Math.sin(angle) * edgeDist;

            ctx.save();
            ctx.translate(arrowX, arrowY);
            ctx.rotate(angle);
            ctx.shadowColor = 'rgba(220,0,0,0.8)';
            ctx.shadowBlur  = 8;
            ctx.fillStyle   = `rgba(255,60,60,${0.7 + 0.3 * pulse})`;
            ctx.beginPath();
            ctx.moveTo(10, 0);
            ctx.lineTo(-6, -5);
            ctx.lineTo(-6, 5);
            ctx.closePath();
            ctx.fill();
            ctx.shadowBlur = 0;
            ctx.restore();
          }
        }
      }

      // ── 8. Map boundary — drawn AFTER fog so always visible ───────
      // Outer glow (wide, soft)
      ctx.shadowColor = 'rgba(255,107,0,0.9)';
      ctx.shadowBlur  = 18;
      ctx.strokeStyle = 'rgba(255,107,0,1)';
      ctx.lineWidth   = 5;
      ctx.strokeRect(2, 2, canvas.width - 4, canvas.height - 4);
      // Inner hard line
      ctx.shadowBlur  = 0;
      ctx.strokeStyle = 'rgba(255,60,0,0.6)';
      ctx.lineWidth   = 1;
      ctx.strokeRect(6, 6, canvas.width - 12, canvas.height - 12);

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

      {/* Spawn movement prompt — shown until first keypress (multiplayer only) */}
      {showSpawnPrompt && (
        <div className="game__spawn-prompt">
          <div className="spawn-prompt__box">
            <div className="spawn-prompt__icon">⚔</div>
            <div className="spawn-prompt__title">YOU HAVE SPAWNED</div>
            <div className="spawn-prompt__sub">
              Press <kbd>WASD</kbd> or <kbd>ARROW KEYS</kbd> to move<br />
              Press <kbd>SPACE</kbd> or <kbd>F</kbd> to attack when adjacent to an enemy
            </div>
            <button className="spawn-prompt__btn" onClick={() => {
              hasMoved.current = true;
              setShowSpawnPrompt(false);
            }}>
              ENTER THE FOG
            </button>
          </div>
        </div>
      )}

      <div className="game__controls-hint">
        WASD / ARROWS — MOVE &nbsp;|&nbsp; SPACE / F — ATTACK
      </div>
    </div>
  );
}
