import grpcWeb from './proto/game_grpc_web_pb';
import game_pb from './proto/game_pb';

const BASE_URL = import.meta.env.VITE_BACKEND_URL || 'https://fog-of-war-v4y8.onrender.com';

// Auth Service Client
export class AuthClient {
  constructor() {
    this.client = new grpcWeb.AuthServicePromiseClient(BASE_URL, null, null);
  }

  async login(publicKey, signature, message) {
    const request = new game_pb.LoginRequest();
    request.setPublicKey(publicKey);
    request.setSignature(signature);
    request.setMessage(message);

    try {
      const response = await this.client.login(request, {});
      return {
        access_token: response.getAccessToken(),
        player_id: response.getPlayerId(),
      };
    } catch (error) {
      throw new Error(`Login failed: ${error.message}`);
    }
  }
}

// Game Service Client
export class GameClient {
  constructor(token) {
    this.token = token;
    this.client = new grpcWeb.GameServicePromiseClient(BASE_URL, null, null);
    this.metadata = {
      'authorization': `Bearer ${token}`,
    };
  }

  async move(gameId, targetX, targetY) {
    const request = new game_pb.MoveRequest();
    request.setGameId(gameId);
    request.setTargetX(targetX);
    request.setTargetY(targetY);

    try {
      const response = await this.client.move(request, this.metadata);
      return {
        success: response.getSuccess(),
        error_message: response.getErrorMessage(),
      };
    } catch (error) {
      throw new Error(`Move failed: ${error.message}`);
    }
  }

  async collectLoot(gameId, lootId) {
    const request = new game_pb.CollectLootRequest();
    request.setGameId(gameId);
    request.setLootId(lootId);

    try {
      const response = await this.client.collectLoot(request, this.metadata);
      return {
        success: response.getSuccess(),
        error_message: response.getErrorMessage(),
        new_encrypted_balance: response.getNewEncryptedBalance(),
      };
    } catch (error) {
      throw new Error(`CollectLoot failed: ${error.message}`);
    }
  }

  connectStream(gameId, onData, onError, onEnd) {
    const request = new game_pb.ConnectRequest();
    request.setGameId(gameId);

    const stream = this.client.connect(request, this.metadata);

    stream.on('data', (response) => {
      // Convert protobuf to plain object
      const players = response.getPlayersList().map(p => ({
        id: p.getId(),
        username: p.getUsername(),
        x: p.getX(),
        y: p.getY(),
        health: p.getHealth(),
        status: p.getStatus(),
        kills: p.getKills(),
      }));

      const loot_items = response.getLootItemsList().map(l => ({
        id: l.getId(),
        item_type: l.getItemType(),
        x: l.getX(),
        y: l.getY(),
        status: l.getStatus(),
      }));

      onData({
        game_id: response.getGameId(),
        server_time: response.getServerTime(),
        players,
        loot_items,
      });
    });

    stream.on('error', (err) => {
      onError?.(err);
    });

    stream.on('end', () => {
      onEnd?.();
    });

    return stream;
  }
}
