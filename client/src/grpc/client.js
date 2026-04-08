import grpcWeb from './proto/game_grpc_web_pb';
import game_pb from './proto/game_pb';

const BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8080';

// ─── Auth ─────────────────────────────────────────────────────────────────

export class AuthClient {
  constructor() {
    this.client = new grpcWeb.AuthServicePromiseClient(BASE_URL, null, null);
  }

  async login(publicKey, signature, message) {
    const req = new game_pb.LoginRequest();
    req.setPublicKey(publicKey);
    req.setSignature(signature);
    req.setMessage(message);
    const res = await this.client.login(req, {});
    return { access_token: res.getAccessToken(), player_id: res.getPlayerId() };
  }
}

// ─── Game ─────────────────────────────────────────────────────────────────

export class GameClient {
  constructor(token, walletPubkey = '') {
    this.token = token;
    this.client = new grpcWeb.GameServicePromiseClient(BASE_URL, null, null);
    this.meta = {
      authorization:    `Bearer ${token}`,
      'x-wallet-pubkey': walletPubkey,
    };
  }

  // ── Escrow ────────────────────────────────────────────────────────────

  async getHouseWallet() {
    const req = new game_pb.GetHouseWalletRequest();
    const res = await this.client.getHouseWallet(req, this.meta);
    return res.getHouseWallet();
  }

  async confirmDeposit(sessionId, txSig) {
    const req = new game_pb.ConfirmDepositRequest();
    req.setSessionId(sessionId);
    req.setTxSig(txSig);
    const res = await this.client.confirmDeposit(req, this.meta);
    return { success: res.getSuccess(), error: res.getError(), player_id: res.getPlayerId() };
  }

  // ── Session management ────────────────────────────────────────────────

  async createSession(maxPlayers, entryFee, durationSeconds, botCount = 0) {
    const req = new game_pb.CreateSessionRequest();
    req.setMaxPlayers(maxPlayers);
    req.setEntryFee(entryFee);
    req.setDurationSeconds(durationSeconds);
    req.setBotCount(botCount);
    const res = await this.client.createSession(req, this.meta);
    return { session_id: res.getSessionId(), error: res.getError() };
  }

  async listSessions() {
    const req = new game_pb.ListSessionsRequest();
    const res = await this.client.listSessions(req, this.meta);
    return res.getSessionsList().map(s => ({
      session_id:       s.getSessionId(),
      host_id:          s.getHostId(),
      max_players:      s.getMaxPlayers(),
      current_players:  s.getCurrentPlayers(),
      entry_fee:        s.getEntryFee(),
      duration_seconds: s.getDurationSeconds(),
      status:           s.getStatus(),
    }));
  }

  async joinSession(sessionId) {
    const req = new game_pb.JoinSessionRequest();
    req.setSessionId(sessionId);
    const res = await this.client.joinSession(req, this.meta);
    return { success: res.getSuccess(), error: res.getError() };
  }

  async startGame(sessionId) {
    const req = new game_pb.StartGameRequest();
    req.setSessionId(sessionId);
    const res = await this.client.startGame(req, this.meta);
    return { success: res.getSuccess(), error: res.getError() };
  }

  watchLobby(sessionId, onData, onError, onEnd) {
    const req = new game_pb.WatchLobbyRequest();
    req.setSessionId(sessionId);
    const stream = this.client.watchLobby(req, this.meta);
    stream.on('data', (u) => onData({
      session_id:       u.getSessionId(),
      players:          u.getPlayersList().map(p => ({
        player_id: p.getPlayerId(),
        is_host:   p.getIsHost(),
      })),
      max_players:      u.getMaxPlayers(),
      entry_fee:        u.getEntryFee(),
      duration_seconds: u.getDurationSeconds(),
      status:           u.getStatus(),
      host_id:          u.getHostId(),
    }));
    stream.on('error', onError);
    stream.on('end',   onEnd);
    return stream;
  }

  // ── In-game ───────────────────────────────────────────────────────────

  async move(sessionId, targetX, targetY) {
    const req = new game_pb.MoveRequest();
    req.setSessionId(sessionId);
    req.setTargetX(targetX);
    req.setTargetY(targetY);
    const res = await this.client.move(req, this.meta);
    return { success: res.getSuccess(), error_message: res.getErrorMessage() };
  }

  async collectLoot(sessionId, lootId) {
    const req = new game_pb.CollectLootRequest();
    req.setSessionId(sessionId);
    req.setLootId(lootId);
    const res = await this.client.collectLoot(req, this.meta);
    return {
      success:               res.getSuccess(),
      error_message:         res.getErrorMessage(),
      new_encrypted_balance: res.getNewEncryptedBalance(),
    };
  }

  async attack(sessionId, targetPlayerId) {
    const req = new game_pb.AttackRequest();
    req.setSessionId(sessionId);
    req.setTargetPlayerId(targetPlayerId);
    const res = await this.client.attack(req, this.meta);
    return { success: res.getSuccess(), error_message: res.getErrorMessage() };
  }

  connectStream(sessionId, onData, onError, onEnd) {
    const req = new game_pb.ConnectRequest();
    req.setSessionId(sessionId);
    const stream = this.client.connect(req, this.meta);
    stream.on('data', (r) => {
      const players = r.getPlayersList().map(p => ({
        id: p.getId(), username: p.getUsername(),
        x: p.getX(), y: p.getY(),
        health: p.getHealth(), status: p.getStatus(), kills: p.getKills(),
        treasure: p.getTreasure(), character_idx: (p.getCharacterIdx && p.getCharacterIdx()) || 0,
      }));
      const loot_items = r.getLootItemsList().map(l => ({
        id: l.getId(), item_type: l.getItemType(),
        x: l.getX(), y: l.getY(), status: l.getStatus(),
      }));
      const npcs = r.getNpcsList().map(n => ({
        id: n.getId(), npc_type: n.getNpcType(),
        x: n.getX(), y: n.getY(), health: n.getHealth(),
      }));
      const events = r.getEventsList().map(e => ({
        event_type: e.getEventType(),
        player_id:  e.getPlayerId(),
        target_id:  e.getTargetId(),
        data:       e.getData(),
      }));
      onData({
        session_id:        r.getSessionId(),
        server_time:       r.getServerTime(),
        remaining_seconds: r.getRemainingSeconds(),
        players,
        loot_items,
        npcs,
        events,
      });
    });
    stream.on('error', onError);
    stream.on('end',   onEnd);
    return stream;
  }
}
