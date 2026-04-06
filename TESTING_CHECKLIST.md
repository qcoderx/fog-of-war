# 🧪 Integration Testing Checklist

Use this checklist to verify the frontend works correctly with the backend.

---

## 🔐 Authentication Flow

- [ ] Phantom wallet extension installed
- [ ] Wallet switched to Solana Devnet
- [ ] Test SOL available in wallet (get from https://faucet.solana.com)
- [ ] Click "Connect Wallet" button
- [ ] Phantom popup appears
- [ ] Approve connection
- [ ] Wallet address displays on screen
- [ ] SOL balance shows correctly
- [ ] Click "ENTER ARENA"
- [ ] Sign message popup appears
- [ ] Approve signature
- [ ] JWT token stored in localStorage
- [ ] No console errors

**Expected localStorage keys:**
```
fog_token: "eyJhbGc..."
fog_player_id: "uuid-string"
fog_game_id: "uuid-string"
```

---

## 🎮 Game Connection

- [ ] Game screen loads after entering arena
- [ ] Canvas renders (128×128 grid visible)
- [ ] HUD displays at top (HP bar, timer, treasure count)
- [ ] Leaderboard shows on right side
- [ ] Wallet badge shows at bottom left
- [ ] Controls hint shows at bottom right
- [ ] No "Stream error" in console
- [ ] Network tab shows gRPC requests to backend

**Check browser console for:**
```
✅ "Logged in as: [player-id]"
✅ "Players: [...]" (every 100ms)
❌ No "Stream error" or "401 Unauthenticated"
```

---

## 🕹️ Movement & Controls

- [ ] Press **W** → player moves up
- [ ] Press **S** → player moves down
- [ ] Press **A** → player moves left
- [ ] Press **D** → player moves right
- [ ] Press **Arrow Up** → player moves up
- [ ] Press **Arrow Down** → player moves down
- [ ] Press **Arrow Left** → player moves left
- [ ] Press **Arrow Right** → player moves right
- [ ] Player sprite (green square) moves smoothly
- [ ] Movement stays within grid bounds (0-128)
- [ ] Fog of war follows player
- [ ] Footprints appear behind player

**Check network tab:**
```
POST /game.GameService/Move
Request: { game_id, target_x, target_y }
Response: { success: true }
```

---

## 🗺️ Game State Updates

- [ ] Other players visible (red squares)
- [ ] Other players have HP bars above them
- [ ] Treasure items visible (gold circles with glow)
- [ ] Footprints change color over time (orange → yellow → blue)
- [ ] Leaderboard updates in real-time
- [ ] Timer counts down
- [ ] HP bar updates when taking damage

**Check console logs:**
```
Players: [
  { id: "...", x: 64, y: 64, health: 100, status: "alive" }
]
```

---

## 💎 Loot Collection

- [ ] Walk over treasure item
- [ ] Treasure disappears from map
- [ ] Treasure count increases in HUD
- [ ] Console shows "Loot collected!"
- [ ] No errors in console

**Check network tab:**
```
POST /game.GameService/CollectLoot
Request: { game_id, loot_id }
Response: { success: true, new_encrypted_balance: "..." }
```

---

## ⚔️ Combat System

- [ ] Walk adjacent to enemy player
- [ ] Combat triggers automatically
- [ ] HP bar decreases
- [ ] HP bar color changes (green → yellow → red)
- [ ] HP value updates in HUD
- [ ] When HP reaches 0, player is eliminated

---

## 🩸 Blood Hunt Mode

- [ ] Timer reaches 5:00 remaining
- [ ] Red banner appears: "BLOOD HUNT ACTIVE"
- [ ] Richest player has pulsing gold ring
- [ ] Gold ring animates smoothly
- [ ] Banner pulses with red glow

---

## 🏆 Game End

- [ ] Timer reaches 0:00
- [ ] Results screen appears
- [ ] Winner address displayed
- [ ] Payout amount shown (7.2 SOL for 8 players)
- [ ] Victory crown (👑) or defeat skull (💀) shows
- [ ] Transaction hash displayed
- [ ] "ENTER AGAIN" button works
- [ ] "BACK TO LOBBY" button works

---

## 🐛 Error Handling

### Test: Disconnect wallet mid-game
- [ ] Error message appears
- [ ] Game doesn't crash
- [ ] Can reconnect wallet

### Test: Backend goes down
- [ ] Stream error logged
- [ ] Reconnect attempt after 2 seconds
- [ ] User sees error message

### Test: Invalid move (out of bounds)
- [ ] Move rejected by backend
- [ ] Player stays in place
- [ ] No crash

### Test: Network latency
- [ ] Movement still feels responsive
- [ ] Position corrects to server state
- [ ] No rubber-banding

---

## 📊 Performance

- [ ] Canvas renders at 60fps (check DevTools Performance tab)
- [ ] No memory leaks (check Memory tab)
- [ ] Bundle size < 700KB
- [ ] First paint < 2 seconds
- [ ] Game state updates arrive every 100ms

**Check Performance:**
```
1. Open DevTools → Performance
2. Click Record
3. Play for 30 seconds
4. Stop recording
5. Verify FPS stays at 60
```

---

## 🌐 Cross-Browser Testing

- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Edge (latest)
- [ ] Safari (latest) — Mac only
- [ ] Brave (latest)

---

## 📱 Responsive Design (Future)

- [ ] Desktop (1920×1080) ✅
- [ ] Laptop (1366×768) ✅
- [ ] Tablet (768×1024) ⚠️ Not optimized yet
- [ ] Mobile (375×667) ⚠️ Not optimized yet

---

## 🔒 Security

- [ ] JWT token not exposed in URL
- [ ] Wallet private key never sent to backend
- [ ] All requests use HTTPS in production
- [ ] No sensitive data in console logs
- [ ] CORS configured correctly

---

## 🚀 Production Readiness

- [ ] Build completes without errors
- [ ] No console warnings in production build
- [ ] Environment variables set correctly
- [ ] Backend URL points to production
- [ ] Wallet connects on Devnet
- [ ] All features work end-to-end

---

## 📝 Final Checks

- [ ] README.md is complete
- [ ] DEPLOYMENT.md has deploy instructions
- [ ] PROJECT_SUMMARY.md lists all features
- [ ] .env.example provided
- [ ] package.json has correct scripts
- [ ] Git repo is clean (no node_modules committed)

---

## ✅ Sign-Off

**Tested by:** _______________  
**Date:** _______________  
**Backend version:** _______________  
**Frontend version:** _______________  

**Issues found:** _______________  
**Status:** ⬜ Pass  ⬜ Fail  ⬜ Needs fixes

---

**Ready to ship?** If all boxes are checked, you're good to deploy! 🚀
