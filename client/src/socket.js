import { AuthClient, GameClient } from './grpc/client';
import { useGameStore } from './store';

let authClient = new AuthClient();
let gameClient = null;
let streamActive = false;

export async function loginWithWallet(publicKey, signMessageFn) {
  try {
    const message = 'Sign this message to login to Fog of War';
    const encodedMessage = new TextEncoder().encode(message);
    
    // Call the signMessage function from the wallet
    const signature = await signMessageFn(encodedMessage);
    
    // Convert Uint8Array signature to base64
    const signatureBase64 = btoa(String.fromCharCode(...signature));

    const response = await authClient.login(publicKey.toBase58(), signatureBase64, message);
    
    localStorage.setItem('fog_token', response.access_token);
    localStorage.setItem('fog_player_id', response.player_id);
    
    gameClient = new GameClient(response.access_token);
    
    return response;
  } catch (error) {
    console.error('Login failed:', error);
    throw error;
  }
}

export function connectToGame(gameId) {
  if (!gameClient) {
    const token = localStorage.getItem('fog_token');
    if (!token) throw new Error('Not authenticated');
    gameClient = new GameClient(token);
  }

  if (streamActive) return;
  streamActive = true;

  const store = useGameStore.getState();
  store.setMyId(localStorage.getItem('fog_player_id'));

  gameClient.connectStream(
    gameId,
    (update) => {
      // Transform backend state to frontend format
      const players = {};
      (update.players || []).forEach(p => {
        players[p.id] = {
          id: p.id,
          username: p.username || 'Player',
          pos: { x: p.x, y: p.y },
          hp: p.health,
          treasure: 0, // backend doesn't expose this yet
          status: p.status,
        };
      });

      const treasures = (update.loot_items || [])
        .filter(l => l.status === 'available')
        .map(l => ({ x: l.x, y: l.y, id: l.id }));

      // Calculate footprints from player positions (simplified)
      const footprints = [];
      Object.values(players).forEach(p => {
        footprints.push({ x: Math.floor(p.pos.x), y: Math.floor(p.pos.y), age: 0, playerId: p.id });
      });

      // Find leader for blood hunt
      const leaderboard = Object.values(players)
        .sort((a, b) => (b.treasure || 0) - (a.treasure || 0));
      
      const bloodHuntTarget = leaderboard[0]?.id;

      store.applyTick({
        players,
        footprints,
        treasures,
        timeLeft: 300, // backend should send this
        bloodHuntActive: false, // backend should send this
        bloodHuntTarget,
        leaderboard: leaderboard.map(p => ({ id: p.id, treasure: p.treasure || 0, hp: p.hp })),
      });
    },
    (error) => {
      console.error('Stream error:', error);
      streamActive = false;
      // Implement reconnect logic
      setTimeout(() => connectToGame(gameId), 2000);
    },
    () => {
      console.log('Stream ended');
      streamActive = false;
    }
  );
}

export async function sendMove(direction) {
  if (!gameClient) return;

  const store = useGameStore.getState();
  const { myPos } = store;
  const gameId = localStorage.getItem('fog_game_id');

  const delta = { up: [0, -5], down: [0, 5], left: [-5, 0], right: [5, 0] }[direction] || [0, 0];
  const targetX = Math.max(0, Math.min(128, myPos.x + delta[0]));
  const targetY = Math.max(0, Math.min(128, myPos.y + delta[1]));

  try {
    await gameClient.move(gameId, targetX, targetY);
  } catch (error) {
    console.error('Move failed:', error);
  }
}

export async function collectLoot(lootId) {
  if (!gameClient) return;

  const gameId = localStorage.getItem('fog_game_id');

  try {
    const response = await gameClient.collectLoot(gameId, lootId);
    if (response.success) {
      console.log('Loot collected!', response.new_encrypted_balance);
    }
    return response;
  } catch (error) {
    console.error('CollectLoot failed:', error);
    throw error;
  }
}
