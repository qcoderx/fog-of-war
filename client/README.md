# Fog of War — Frontend

Real-time multiplayer extraction game built with React + Vite, powered by Solana wallet auth and gRPC-Web backend.

## 🚀 Quick Start

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

## 🎮 Features

- **Wallet Authentication** — Login with Phantom wallet (Solana Devnet)
- **Real-time Gameplay** — 10Hz game state streaming via gRPC-Web
- **Fog of War** — Limited visibility with heatmap footprints
- **Canvas Rendering** — 60fps HTML5 Canvas with 128×128 grid
- **Blood Hunt Mode** — Leader revealed in final 5 minutes
- **On-chain Payouts** — Winner receives 90% of prize pool

## 📁 Project Structure

```
client/
├── src/
│   ├── components/
│   │   ├── Landing.jsx       # Wallet connect + entry
│   │   ├── Lobby.jsx          # Matchmaking queue
│   │   ├── Game.jsx           # Main canvas + fog rendering
│   │   ├── HUD.jsx            # HP, treasure, timer, leaderboard
│   │   └── Results.jsx        # Victory/defeat screen
│   ├── grpc/
│   │   └── client.js          # gRPC-Web client wrapper
│   ├── store.js               # Zustand game state
│   ├── socket.js              # Backend integration layer
│   ├── App.jsx                # Root router
│   └── main.jsx               # Entry point
├── proto/
│   └── game.proto             # gRPC service definitions
└── .env                       # Backend URL config
```

## 🔧 Configuration

Edit `.env` to change backend endpoint:

```bash
# Production (default)
VITE_BACKEND_URL=https://fog-of-war-v4y8.onrender.com

# Local development
VITE_BACKEND_URL=http://localhost:8080
```

## 🎯 Game Controls

- **WASD** or **Arrow Keys** — Move player
- **Auto-combat** — Triggers when adjacent to enemies
- **Auto-collect** — Walk over treasure to collect

## 🏗️ Build for Production

```bash
npm run build
```

Output in `dist/` — deploy to Vercel, Netlify, or any static host.

## 🔗 Backend Integration

The frontend communicates with the Go gRPC-Web backend:

- **Auth:** `AuthService.Login` — Wallet signature verification
- **Game Stream:** `GameService.Connect` — 10Hz state updates
- **Actions:** `GameService.Move`, `GameService.CollectLoot`

See [API Documentation](../docs/API.md) for full backend spec.

## 🛠️ Tech Stack

- **React 19** + **Vite 8**
- **Zustand** — State management
- **Solana Web3.js** — Wallet integration
- **gRPC-Web** — Backend communication
- **HTML5 Canvas** — Game rendering

## 📦 Key Dependencies

```json
{
  "@solana/wallet-adapter-react": "^0.15.39",
  "@solana/web3.js": "^1.98.4",
  "grpc-web": "^2.0.2",
  "zustand": "^5.0.12",
  "uuid": "^13.0.0"
}
```

## 🎨 Design System

- **Fonts:** Orbitron (headings), Share Tech Mono (body)
- **Colors:**
  - Accent: `#ff6b00` (orange)
  - Safe: `#00ff88` (green)
  - Danger: `#ff2244` (red)
  - Gold: `#ffd700` (treasure)
- **Grid:** 128×128 tiles, 8px per tile

## 🐛 Troubleshooting

**Wallet won't connect:**
- Make sure you're on Solana Devnet in Phantom settings
- Clear browser cache and reload

**Game stream disconnects:**
- Check backend URL in `.env`
- Verify backend is running: `curl https://fog-of-war-v4y8.onrender.com`

**Build errors:**
- Delete `node_modules` and `package-lock.json`
- Run `npm install` again

## 📝 License

MIT — Built for Replit Buildathon 2025

---

**Built by:** [@platinum](https://github.com/platinum) + [@koded](https://github.com/koded)  
**Backend by:** [@coder0214h](https://x.com/coder0214h)
