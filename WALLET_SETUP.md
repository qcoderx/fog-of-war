# 🦊 Phantom Wallet Setup Guide

## Step 1: Install Phantom

1. Go to https://phantom.app
2. Click "Download"
3. Choose your browser (Chrome, Firefox, Brave, Edge)
4. Click "Add to [Browser]"
5. Click "Add Extension"
6. Phantom icon appears in browser toolbar

## Step 2: Create or Import Wallet

### Option A: Create New Wallet
1. Click Phantom icon
2. Click "Create New Wallet"
3. Write down your 12-word recovery phrase
4. **IMPORTANT:** Store it safely — you can't recover without it
5. Confirm recovery phrase
6. Set a password

### Option B: Import Existing Wallet
1. Click Phantom icon
2. Click "I already have a wallet"
3. Enter your 12-word recovery phrase
4. Set a password

## Step 3: Switch to Devnet

**This is critical — the game runs on Devnet, not Mainnet!**

1. Click Phantom icon
2. Click ⚙️ (Settings) at bottom
3. Scroll down to "Developer Settings"
4. Click "Change Network"
5. Select **"Devnet"**
6. Close settings

**Verify:** Top of Phantom should say "Devnet" in orange

## Step 4: Get Test SOL

You need test SOL to play (it's free, not real money).

1. Copy your wallet address:
   - Click Phantom icon
   - Click your address at top (e.g. "7xKX...9pQm")
   - It copies automatically

2. Go to https://faucet.solana.com

3. Paste your address

4. Click "Confirm Airdrop"

5. Wait 30 seconds

6. Check Phantom — you should see 1-2 SOL

**If faucet doesn't work:**
- Try https://solfaucet.com
- Or https://faucet.triangleplatform.com/solana/devnet

## Step 5: Connect to Fog of War

1. Open the game: http://localhost:5173 (or your deployed URL)

2. Click "Select Wallet"

3. Choose "Phantom"

4. Phantom popup appears → Click "Connect"

5. Your wallet address appears on screen

6. Click "ENTER ARENA (1 SOL)"

7. Phantom popup appears → Click "Sign"

8. You're in! 🎮

---

## ❌ Troubleshooting

### "Phantom not detected"

**Solution:**
1. Make sure Phantom extension is installed
2. Refresh the page
3. Try in incognito mode (to rule out extension conflicts)

### "Connection failed"

**Solution:**
1. Disconnect wallet:
   - Click Phantom icon
   - Click ⚙️ Settings
   - Trusted Apps → Find "localhost" or your domain
   - Click "Revoke"
2. Refresh page
3. Try connecting again

### "Insufficient funds"

**Solution:**
- You need at least 1 SOL on Devnet
- Go to faucet (Step 4 above)
- Request more SOL

### "Wrong network"

**Solution:**
- You're on Mainnet instead of Devnet
- Follow Step 3 above to switch
- Refresh page

### "Sign message failed"

**Solution:**
1. Make sure you clicked "Sign" in Phantom popup
2. If popup didn't appear:
   - Check if popup blocker is enabled
   - Allow popups for this site
3. Try disconnecting and reconnecting wallet

### "Wallet not supported"

**Solution:**
- Only Phantom, Solflare, and Torus are supported
- Install Phantom (recommended)
- Other wallets may not support message signing

---

## 🔒 Security Tips

1. **Never share your recovery phrase**
   - Not with support
   - Not with teammates
   - Not with anyone

2. **This is Devnet — not real money**
   - Devnet SOL has no value
   - Safe to experiment
   - Can't lose real money

3. **When switching to Mainnet (production):**
   - Double-check you're on the right network
   - Start with small amounts
   - Verify contract addresses

4. **Phantom password:**
   - Use a strong password
   - Don't reuse passwords
   - Enable biometric unlock if available

---

## 📱 Mobile Setup (Future)

Currently desktop only. Mobile support coming soon.

For now:
- Use desktop browser (Chrome, Firefox, Brave, Edge)
- Minimum screen: 1024×768

---

## 🆘 Still Having Issues?

**Check the debug panel:**
- Bottom right corner (dev mode only)
- Shows wallet connection status
- All items should be ✅

**Common debug panel readings:**

```
✅ All green = Ready to play
❌ Connected: ❌ = Click "Select Wallet"
❌ SignMessage: ❌ = Wrong wallet (use Phantom)
⏳ Connecting: ⏳ = Wait a moment
```

**Get help:**
- GitHub Issues: [repo-url]/issues
- Discord: [discord-link]
- Twitter: @coder0214h

---

## ✅ Quick Checklist

Before playing, verify:

- [ ] Phantom installed
- [ ] Wallet created/imported
- [ ] Switched to Devnet (orange badge in Phantom)
- [ ] Have 1+ SOL (from faucet)
- [ ] Connected to game
- [ ] Signed message
- [ ] Debug panel shows all ✅

**You're ready to play! 🎮**

---

**Last updated:** 2025-04-08
