# Deployment Guide

## 🚀 Deploy to Vercel (Recommended)

1. **Install Vercel CLI:**
```bash
npm i -g vercel
```

2. **Deploy:**
```bash
cd client
vercel
```

3. **Set Environment Variable:**
In Vercel dashboard → Settings → Environment Variables:
```
VITE_BACKEND_URL=https://fog-of-war-v4y8.onrender.com
```

4. **Redeploy:**
```bash
vercel --prod
```

---

## 🌐 Deploy to Netlify

1. **Install Netlify CLI:**
```bash
npm i -g netlify-cli
```

2. **Build:**
```bash
cd client
npm run build
```

3. **Deploy:**
```bash
netlify deploy --prod --dir=dist
```

4. **Set Environment Variable:**
In Netlify dashboard → Site settings → Environment variables:
```
VITE_BACKEND_URL=https://fog-of-war-v4y8.onrender.com
```

---

## 📦 Deploy to GitHub Pages

1. **Update `vite.config.js`:**
```js
export default defineConfig({
  base: '/fog-of-war/', // your repo name
  // ... rest of config
});
```

2. **Build:**
```bash
npm run build
```

3. **Deploy:**
```bash
npm install -g gh-pages
gh-pages -d dist
```

---

## 🐳 Deploy with Docker

1. **Create `Dockerfile` in client directory:**
```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=0 /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

2. **Build and run:**
```bash
docker build -t fog-of-war-client .
docker run -p 8080:80 fog-of-war-client
```

---

## ⚙️ Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `VITE_BACKEND_URL` | Yes | `https://fog-of-war-v4y8.onrender.com` | gRPC-Web backend endpoint |

---

## 🔍 Pre-deployment Checklist

- [ ] Backend URL is set correctly in `.env`
- [ ] Build completes without errors (`npm run build`)
- [ ] Wallet connects on Devnet
- [ ] Game stream receives updates
- [ ] Movement works (WASD/arrows)
- [ ] Canvas renders at 60fps
- [ ] Fog of war displays correctly

---

## 🐛 Common Issues

**Build fails with "Module not found":**
```bash
rm -rf node_modules package-lock.json
npm install
npm run build
```

**Blank page after deployment:**
- Check browser console for errors
- Verify `VITE_BACKEND_URL` is set
- Ensure backend is accessible from your domain

**CORS errors:**
- Backend must allow your frontend domain
- Contact backend team to whitelist your URL

---

## 📊 Performance Tips

1. **Enable gzip compression** on your hosting platform
2. **Use CDN** for static assets (Cloudflare, etc.)
3. **Lazy load** non-critical components
4. **Optimize images** (if you add any)

---

## 🔐 Security Notes

- Never commit `.env` files with production secrets
- Use environment variables for all config
- Validate all user inputs before sending to backend
- Implement rate limiting on frontend actions

---

**Need help?** Open an issue on GitHub or contact the team.
