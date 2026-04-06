import { create } from 'zustand';

export const useGameStore = create((set, get) => ({
  // screens: 'landing' | 'lobby' | 'game' | 'results'
  screen: 'landing',
  walletAddress: null,
  solBalance: null,

  // lobby
  playersInLobby: 1,
  maxPlayers: 8,
  poolSize: 0,

  // game
  players: {},
  myId: null,
  myPos: { x: 64, y: 64 }, // Start at center of 128x128 grid
  myHp: 100,
  myTreasure: 0,
  footprints: [], // [{x, y, age, playerId}]
  treasures: [],  // [{x, y, id}]
  timeLeft: 300,
  bloodHuntActive: false,
  bloodHuntTarget: null,
  leaderboard: [],

  // results
  winner: null,
  payout: 0,

  setScreen: (screen) => set({ screen }),
  setWallet: (address, balance) => set({ walletAddress: address, solBalance: balance }),
  setMyId: (id) => set({ myId: id }),

  applyTick: (state) => set({
    players: state.players,
    footprints: state.footprints,
    treasures: state.treasures,
    timeLeft: state.timeLeft,
    bloodHuntActive: state.bloodHuntActive,
    bloodHuntTarget: state.bloodHuntTarget,
    leaderboard: state.leaderboard,
    myHp: state.players[get().myId]?.hp ?? get().myHp,
    myTreasure: state.players[get().myId]?.treasure ?? get().myTreasure,
    myPos: state.players[get().myId]?.pos ?? get().myPos,
  }),

  setResults: (winner, payout) => set({ winner, payout, screen: 'results' }),
  setLobbyCount: (n) => set({ playersInLobby: n, poolSize: n }),
}));
