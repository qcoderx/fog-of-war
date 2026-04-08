# 📱 Mobile Testing Guide

## Quick Test Checklist

### 1. Start the App
```bash
cd client
npm run dev
```

### 2. Test on Real Device

#### Option A: Local Network
1. Find your local IP: `ipconfig` (Windows) or `ifconfig` (Mac/Linux)
2. Update Vite config to allow network access
3. Open `http://YOUR_IP:5173` on mobile

#### Option B: ngrok Tunnel
```bash
npm install -g ngrok
ngrok http 5173
```
Use the ngrok URL on your mobile device

#### Option C: Deploy to Vercel
```bash
cd client
vercel
```
Test the live URL

### 3. Test Features

#### Landing Page
- [ ] Title scales properly
- [ ] Buttons are touch-friendly
- [ ] Stats display correctly
- [ ] Wallet connect works
- [ ] Solo mode button works

#### Game Screen
- [ ] Canvas scales to fit screen
- [ ] Virtual joystick appears
- [ ] Dragging joystick moves player
- [ ] HUD elements visible
- [ ] Leaderboard readable
- [ ] Timer visible
- [ ] HP bar visible
- [ ] Treasure counter visible
- [ ] Wallet badge doesn't overlap joystick

#### Gameplay
- [ ] Player moves smoothly
- [ ] Treasure collection works
- [ ] Combat triggers automatically
- [ ] Fog of war renders correctly
- [ ] Footprints visible
- [ ] Blood Hunt beacon shows
- [ ] No lag or stuttering

#### Results Screen
- [ ] Victory/defeat message shows
- [ ] Stats are readable
- [ ] Buttons work
- [ ] Layout fits screen

### 4. Test Gestures
- [ ] No accidental zoom
- [ ] No text selection
- [ ] No context menu on long press
- [ ] Smooth scrolling (where applicable)
- [ ] No bounce effect

### 5. Test Orientations
- [ ] Portrait mode works
- [ ] Landscape mode works
- [ ] Rotation doesn't break layout
- [ ] Canvas resizes on rotation

### 6. Test Browsers
- [ ] iOS Safari
- [ ] Chrome Mobile
- [ ] Firefox Mobile
- [ ] Samsung Internet

### 7. Performance Check
- [ ] 60 FPS maintained
- [ ] No memory leaks
- [ ] Battery usage reasonable
- [ ] No overheating

## Common Issues & Fixes

### Issue: Joystick not appearing
**Fix**: Check if `isMobile` state is true. Verify touch detection logic.

### Issue: Canvas too small/large
**Fix**: Check responsive scaling in render loop. Verify CSS media queries.

### Issue: Can't move player
**Fix**: Verify touch event listeners are attached. Check `handleMove` function.

### Issue: UI elements overlap
**Fix**: Adjust z-index and positioning in CSS. Check mobile breakpoints.

### Issue: Lag on mobile
**Fix**: Reduce canvas resolution. Optimize render loop. Disable shadows on mobile.

## Debug Mode

Add this to Game.jsx to see touch events:
```jsx
useEffect(() => {
  const debug = (e) => {
    console.log('Touch:', e.touches[0].clientX, e.touches[0].clientY);
  };
  window.addEventListener('touchstart', debug);
  return () => window.removeEventListener('touchstart', debug);
}, []);
```

## Performance Monitoring

Add FPS counter:
```jsx
const [fps, setFps] = useState(60);
useEffect(() => {
  let lastTime = performance.now();
  let frames = 0;
  const measure = () => {
    frames++;
    const now = performance.now();
    if (now >= lastTime + 1000) {
      setFps(frames);
      frames = 0;
      lastTime = now;
    }
    requestAnimationFrame(measure);
  };
  measure();
}, []);
```

## Success Criteria

✅ All checklist items pass
✅ Smooth 60 FPS gameplay
✅ No console errors
✅ Works on iOS and Android
✅ Playable in both orientations
✅ Touch controls feel natural

---

**Status**: Ready for mobile testing! 🚀
