# 🔧 Troubleshooting Guide

## Common Issues & Solutions

### ❌ WalletConnectionError: Unexpected error

**Symptoms:**
- "WalletConnectionError: Unexpected error" in console
- "ENTER ARENA" button doesn't work
- Wallet connects but can't sign messages

**Causes:**
1. Wallet doesn't support message signing
2. Wallet extension not fully loaded
3. Wrong network selected

**Solutions:**

**1. Use Phantom Wallet**
```
✅ Phantom supports message signing
❌ Some wallets don't support signMessage()
```
- Install: https://phantom.app
- Make sure it's the latest version

**2. Switch to Devnet**
```
Phantom → Settings → Developer Settings → Change Network → Devnet
```

**3. Refresh after connecting**
```
1. Connect wallet
2. Wait 2 seconds
3. Refresh page
4. Try "ENTER ARENA" again
```

**4. Clear browser cache**
```
Chrome: Ctrl+Shift+Delete → Clear cached images and files
Firefox: Ctrl+Shift+Delete → Cache
```

---

### ❌ "Please connect your wallet first"

**Solution:**
- Click "Select Wallet" button
- Choose Phantom
- Click "Connect" in popup
- Approve connection

---

### ❌ "Your wallet does not support message signing"

**Solution:**
- You're using an incompatible wallet
- Install Phantom: https://phantom.app
- Disconnect current wallet
- Connect with Phantom

---

### ❌ Backend connection fails

**Symptoms:**
- "Stream error" in console
- Game doesn't load after entering
- "Failed to connect" alert

**Solutions:**

**1. Check backend status**
```bash
curl https://fog-of-war-v4y8.onrender.com
```
Should return: `404 page not found` (this is OK — means server is up)

**2. Check .env file**
```bash
# client/.env
VITE_BACKEND_URL=https://fog-of-war-v4y8.onrender.com
```

**3. Rebuild**
```bash
cd client
npm run build
npm run dev
```

---

### ❌ Canvas doesn't render

**Symptoms:**
- Black screen after entering game
- No grid visible
- HUD shows but no canvas

**Solutions:**

**1. Check browser console**
```
Look for WebGL errors or Canvas errors
```

**2. Update browser**
```
Chrome, Firefox, Edge — use latest version
```

**3. Disable hardware acceleration**
```
Chrome → Settings → System → Use hardware acceleration (toggle off)
```

---

### ❌ Movement doesn't work

**Symptoms:**
- WASD/arrows don't move player
- Player stuck in place
- No response to keyboard

**Solutions:**

**1. Click on canvas**
```
Canvas needs focus to receive keyboard events
```

**2. Check console for errors**
```
Look for "Move failed" errors
```

**3. Verify game stream is active**
```
Console should show: "Players: [...]" every 100ms
```

---

### ❌ Build fails

**Error:**
```
Module not found
Cannot resolve dependency
```

**Solution:**
```bash
cd client
rm -rf node_modules package-lock.json
npm install
npm run build
```

---

### ❌ Wallet balance shows 0

**Solution:**
```
1. Go to https://faucet.solana.com
2. Paste your wallet address
3. Request 1 SOL (Devnet)
4. Wait 30 seconds
5. Refresh page
```

---

### ❌ "Invalid token" or "401 Unauthenticated"

**Symptoms:**
- Can't join game
- Stream disconnects immediately
- "Unauthenticated" in console

**Solutions:**

**1. Clear localStorage**
```javascript
// In browser console:
localStorage.clear();
location.reload();
```

**2. Re-login**
```
1. Disconnect wallet
2. Refresh page
3. Connect wallet again
4. Try entering arena
```

---

### ❌ Game freezes or lags

**Symptoms:**
- Low FPS
- Stuttering movement
- High CPU usage

**Solutions:**

**1. Close other tabs**
```
Each tab uses memory — close unused tabs
```

**2. Check Performance**
```
DevTools → Performance → Record → Check FPS
Should be 60fps
```

**3. Reduce canvas size**
```javascript
// In Game.jsx, change:
const TILE = 8; // Try 6 or 4 for better performance
```

---

### ❌ CORS errors

**Error:**
```
Access to fetch at '...' from origin '...' has been blocked by CORS policy
```

**Solution:**
- This is a backend issue
- Contact backend team to whitelist your domain
- For local dev, backend should allow `localhost:5173`

---

## 🆘 Still Having Issues?

**1. Check browser console**
```
F12 → Console tab → Look for red errors
```

**2. Check network tab**
```
F12 → Network tab → Look for failed requests (red)
```

**3. Verify versions**
```bash
node --version  # Should be 18+
npm --version   # Should be 9+
```

**4. Try different browser**
```
Chrome → Firefox → Edge
```

**5. Contact support**
```
GitHub Issues: [repo-url]/issues
Discord: [discord-link]
Twitter: @coder0214h
```

---

## 📋 Debug Checklist

Before reporting a bug, check:

- [ ] Using Phantom wallet
- [ ] On Solana Devnet
- [ ] Have test SOL in wallet
- [ ] Browser console shows no errors
- [ ] Backend URL is correct in .env
- [ ] Latest version of code (git pull)
- [ ] node_modules reinstalled
- [ ] Browser cache cleared
- [ ] Tried in incognito mode

---

**Last updated:** 2025-04-08
