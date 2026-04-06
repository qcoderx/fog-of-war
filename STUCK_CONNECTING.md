# 🔧 Fix: Wallet Stuck in "Connecting" State

## Problem
Debug panel shows:
```
Connected: ❌
Connecting: ✅  ← Stuck here
PublicKey: ❌
SignMessage: ❌
Wallet: Phantom
ReadyState: Installed
```

## What This Means
- Wallet extension is installed ✅
- Connection request was sent ✅
- But connection never completed ❌

## Why This Happens

### 1. Popup Blocked
Phantom popup was blocked by browser

### 2. Extension Not Ready
Phantom extension still loading

### 3. Network Issue
Can't reach Solana RPC endpoint

### 4. Permission Denied
User closed popup without approving

### 5. Extension Conflict
Another extension interfering

---

## Solutions

### Solution 1: Use Retry Button

If you see the yellow warning button:
```
⚠️ Connection Stuck - Click to Retry
```

1. Click it
2. Wait 2 seconds
3. Click "Select Wallet" again
4. Choose Phantom
5. Approve popup

---

### Solution 2: Check Popup Blocker

**Chrome:**
1. Look for 🚫 icon in address bar
2. Click it
3. Select "Always allow popups from localhost"
4. Refresh page
5. Try connecting again

**Firefox:**
1. Look for popup blocked notification
2. Click "Preferences"
3. Allow popups for this site
4. Refresh page

---

### Solution 3: Manually Open Phantom

1. Click Phantom extension icon in toolbar
2. If it says "Connect to localhost?" → Click "Connect"
3. If it says "Approve" → Click "Approve"
4. Refresh the game page
5. Should now show Connected: ✅

---

### Solution 4: Reset Connection

1. Open Phantom extension
2. Click ⚙️ Settings
3. Scroll to "Trusted Apps"
4. Find "localhost" or your domain
5. Click "Revoke"
6. Close Phantom
7. Refresh game page
8. Click "Select Wallet" → Phantom
9. Approve connection

---

### Solution 5: Restart Extension

**Chrome/Brave/Edge:**
1. Go to `chrome://extensions`
2. Find Phantom
3. Toggle it OFF
4. Wait 2 seconds
5. Toggle it ON
6. Refresh game page

**Firefox:**
1. Go to `about:addons`
2. Find Phantom
3. Click "Disable"
4. Wait 2 seconds
5. Click "Enable"
6. Refresh game page

---

### Solution 6: Clear Browser Data

1. Press `Ctrl+Shift+Delete`
2. Select:
   - ✅ Cookies and site data
   - ✅ Cached images and files
   - ❌ Browsing history (optional)
3. Time range: "Last hour"
4. Click "Clear data"
5. Refresh page
6. Try connecting again

---

### Solution 7: Try Different Browser

If stuck in Chrome, try:
- Firefox
- Brave
- Edge

Sometimes browser-specific issues occur.

---

### Solution 8: Reinstall Phantom

**Last resort:**

1. Open Phantom
2. Settings → Security & Privacy
3. Write down recovery phrase (IMPORTANT!)
4. Uninstall extension
5. Go to https://phantom.app
6. Install fresh
7. Import wallet with recovery phrase
8. Try game again

---

## Prevention

### Enable Popups Beforehand
```
Chrome → Settings → Privacy → Site Settings → Popups
Add localhost:5173 to "Allowed to send popups"
```

### Keep Extension Updated
```
Phantom → Settings → About
Check for updates
```

### Use Supported Browser
```
✅ Chrome 90+
✅ Firefox 88+
✅ Brave (latest)
✅ Edge 90+
❌ Safari (not supported)
❌ Opera (not tested)
```

---

## Auto-Timeout Feature

The app now has a **10-second timeout**:

```
1. Click "Select Wallet"
2. Choose Phantom
3. If no response after 10 seconds...
4. Auto-disconnects
5. Shows retry button
```

This prevents infinite "Connecting..." state.

---

## Debug Checklist

Before reporting bug, verify:

- [ ] Phantom extension installed
- [ ] Extension is enabled
- [ ] On Solana Devnet (not Mainnet)
- [ ] Popups allowed for this site
- [ ] No other wallet extensions active
- [ ] Browser is up to date
- [ ] Tried in incognito mode
- [ ] Tried different browser
- [ ] Checked browser console for errors

---

## Still Stuck?

### Check Console
Press `F12` → Console tab

**Look for:**
```javascript
// Good signs:
"Auto-connect failed: ..." // Expected, will retry

// Bad signs:
"Uncaught Error: ..."
"Network request failed"
"RPC endpoint unreachable"
```

### Check Network Tab
Press `F12` → Network tab

**Look for:**
- Red (failed) requests to Solana RPC
- 429 (rate limit) errors
- Timeout errors

### Try Different RPC
Edit `.env`:
```bash
# Default
VITE_SOLANA_RPC=https://api.devnet.solana.com

# Alternative
VITE_SOLANA_RPC=https://rpc.ankr.com/solana_devnet
```

---

## Contact Support

If none of these work:

1. Take screenshot of debug panel
2. Copy browser console errors
3. Note your browser + version
4. Open GitHub issue with details

**GitHub:** [repo-url]/issues  
**Discord:** [discord-link]  
**Twitter:** @coder0214h

---

**Last updated:** 2025-04-08
