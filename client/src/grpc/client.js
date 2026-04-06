import { grpc } from 'grpc-web';

const BASE_URL = import.meta.env.VITE_BACKEND_URL || 'https://fog-of-war-v4y8.onrender.com';

// Auth Service Client
export class AuthClient {
  async login(publicKey, signature, message) {
    const req = { public_key: publicKey, signature, message };
    const res = await fetch(`${BASE_URL}/game.AuthService/Login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req),
    });
    if (!res.ok) throw new Error(`Login failed: ${res.statusText}`);
    return res.json();
  }
}

// Game Service Client
export class GameClient {
  constructor(token) {
    this.token = token;
    this.headers = {
      'Content-Type': 'application/json',
      'authorization': `Bearer ${token}`,
    };
  }

  async move(gameId, targetX, targetY) {
    const req = { game_id: gameId, target_x: targetX, target_y: targetY };
    const res = await fetch(`${BASE_URL}/game.GameService/Move`, {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify(req),
    });
    if (!res.ok) throw new Error(`Move failed: ${res.statusText}`);
    return res.json();
  }

  async collectLoot(gameId, lootId) {
    const req = { game_id: gameId, loot_id: lootId };
    const res = await fetch(`${BASE_URL}/game.GameService/CollectLoot`, {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify(req),
    });
    if (!res.ok) throw new Error(`CollectLoot failed: ${res.statusText}`);
    return res.json();
  }

  connectStream(gameId, onData, onError, onEnd) {
    // Use EventSource for server-sent events or implement grpc-web streaming
    // For now, we'll use a polling fallback that the backend team can upgrade
    const url = `${BASE_URL}/game.GameService/Connect`;
    
    // Simplified streaming using fetch with ReadableStream
    fetch(url, {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify({ game_id: gameId }),
    })
      .then(async (response) => {
        if (!response.ok) throw new Error(`Connect failed: ${response.statusText}`);
        
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        
        while (true) {
          const { done, value } = await reader.read();
          if (done) {
            onEnd?.();
            break;
          }
          
          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split('\n').filter(Boolean);
          
          for (const line of lines) {
            try {
              const data = JSON.parse(line);
              onData(data);
            } catch (e) {
              console.warn('Failed to parse stream chunk:', e);
            }
          }
        }
      })
      .catch((err) => {
        onError?.(err);
      });
  }
}
