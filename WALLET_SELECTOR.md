# 🔄 Wallet Selector — Change Wallet Anytime

## New Feature: Custom Wallet Selector

You can now easily change wallets without refreshing the page!

---

## How It Works

### First Time (No Wallet Connected)

1. Click **"Select Wallet"** button
2. Modal opens showing all available wallets
3. Wallets are grouped:
   - **Installed** (green badge) — Ready to use
   - **Install** (orange badge) — Click to install
4. Click on your preferred wallet
5. Approve connection in wallet popup
6. You're connected!

---

### Changing Wallets (Already Connected)

1. Click **"Change Wallet"** button (🔄 icon)
2. Current wallet automatically disconnects
3. Modal opens with wallet options
4. Select a different wallet
5. Approve connection
6. Done!

**No page refresh needed!**

---

## Supported Wallets

### ✅ Fully Supported
- **Phantom** (Recommended)
- **Solflare**
- **Torus**

### 🔜 Coming Soon
- Backpack
- Glow
- Slope

---

## Features

### Smart Detection
- Shows only installed wallets first
- Uninstalled wallets show "Install" badge
- Click uninstalled wallet → Opens install page

### Auto-Disconnect
- Changing wallets automatically disconnects current one
- No manual disconnect needed
- Clean state management

### Visual Feedback
- Green badge = Installed & ready
- Orange badge = Not installed
- Hover effects for better UX
- Smooth animations

---

## UI Elements

### Select Wallet Button
```
👛 Select Wallet
```
- Shows when no wallet connected
- Opens wallet selection modal

### Change Wallet Button
```
🔄 Change Wallet
```
- Shows when wallet is connected
- Replaces "Disconnect" button
- More intuitive for users

### Wallet Modal
```
┌─────────────────────────────┐
│ Select Wallet            ✕  │
├─────────────────────────────┤
│ [Phantom Logo] Phantom      │
│                   Installed │
├─────────────────────────────┤
│ [Solflare Logo] Solflare    │
│                   Installed │
├─────────────────────────────┤
│ [Torus Logo] Torus          │
│                     Install │
├─────────────────────────────┤
│ Don't have a wallet?        │
│ Get Phantom →               │
└─────────────────────────────┘
```

---

## User Flow Examples

### Example 1: First-Time User
```
1. Opens game
2. Sees "Select Wallet" button
3. Clicks it
4. Sees Phantom is installed
5. Clicks Phantom
6. Approves connection
7. Sees "Enter Arena" button
```

### Example 2: Switching Wallets
```
1. Connected with Phantom
2. Wants to use Solflare instead
3. Clicks "Change Wallet"
4. Phantom auto-disconnects
5. Selects Solflare
6. Approves connection
7. Now using Solflare
```

### Example 3: Installing New Wallet
```
1. Opens wallet selector
2. Sees Phantom has "Install" badge
3. Clicks Phantom
4. Opens phantom.app in new tab
5. Installs extension
6. Refreshes game page
7. Now shows "Installed" badge
```

---

## Technical Details

### Component: WalletSelector.jsx

**Props:** None (uses wallet context)

**State:**
- `isOpen` — Modal visibility
- Reads from `useWallet()` hook

**Methods:**
- `handleSelect(walletName)` — Disconnects current, selects new
- `handleChangeWallet()` — Opens modal after disconnect

**Styling:** `WalletSelector.css`

---

## Advantages Over Default

### Default Wallet Adapter UI
❌ Can't change wallet easily
❌ Must disconnect manually first
❌ Confusing for users
❌ Generic styling

### Custom Wallet Selector
✅ One-click wallet change
✅ Auto-disconnect on change
✅ Clear "Change Wallet" button
✅ Matches game design
✅ Shows install status
✅ Better UX

---

## Accessibility

- ✅ Keyboard navigation (Tab, Enter, Esc)
- ✅ Screen reader friendly
- ✅ High contrast colors
- ✅ Clear button labels
- ✅ Focus indicators

---

## Mobile Support (Future)

Currently optimized for desktop. Mobile improvements coming:
- Touch-friendly button sizes
- Swipe to dismiss modal
- Bottom sheet on mobile
- Larger tap targets

---

## Troubleshooting

### "Change Wallet" button doesn't appear
**Solution:** You're not connected. Click "Select Wallet" first.

### Modal won't close
**Solution:** 
- Click ✕ button
- Click outside modal (backdrop)
- Press Escape key

### Wallet shows "Install" but it's installed
**Solution:**
- Refresh page
- Check if extension is enabled
- Try different browser

### Can't select wallet
**Solution:**
- Make sure wallet extension is installed
- Check if wallet is enabled
- Try clicking "Install" to reinstall

---

## Code Example

```jsx
import WalletSelector from './components/WalletSelector';

function Landing() {
  return (
    <div>
      <WalletSelector />
      {/* Rest of your UI */}
    </div>
  );
}
```

---

## Future Enhancements

- [ ] Remember last used wallet
- [ ] Show wallet balance in selector
- [ ] Multi-wallet support (connect multiple)
- [ ] Wallet reputation badges
- [ ] Custom wallet icons
- [ ] Wallet search/filter

---

**Status:** ✅ Implemented and tested  
**Version:** 1.0.0  
**Last updated:** 2025-04-08
