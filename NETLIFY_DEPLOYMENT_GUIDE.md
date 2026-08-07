# Netlify Deployment Guide for Measure DI RevOps

**Account Email configured for deployment**: `measuredichennai@gmail.com`

---

## Deployment Settings

- **Build Command**: `npm run build`
- **Publish Directory**: `dist`
- **Node.js Version**: `20.x` or higher
- **Configuration File**: `netlify.toml` (already included in repository root)

---

## Option 1: Deploy via GitHub (Recommended for Automatic Updates)

1. **Log in to Netlify**:
   - Go to [https://app.netlify.com](https://app.netlify.com)
   - Sign in using **`measuredichennai@gmail.com`** (or GitHub connected to this account).

2. **Add New Site**:
   - Click **"Add new site"** -> **"Import an existing project"**.
   - Select **GitHub** as your Git provider.

3. **Select Repository**:
   - Choose your repository for **Measure DI RevOps**.

4. **Verify Build Settings** (Auto-detected from `netlify.toml`):
   - **Base directory**: (leave blank / root)
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`

5. **Deploy Site**:
   - Click **"Deploy site"**. Netlify will build and host your application in ~1 minute!

---

## Option 2: Direct Drag-and-Drop Deployment (Instant)

1. **Build locally or download output**:
   - Run `npm run build` in your terminal to generate the `dist` folder.
2. **Log in to Netlify**:
   - Visit [https://app.netlify.com/drop](https://app.netlify.com/drop) with **`measuredichennai@gmail.com`**.
3. **Upload**:
   - Drag and drop the `dist` folder directly onto the upload zone.
   - Your site will be live instantly!

---

## Custom Domain Setup (Optional)
To point your custom domain (e.g. `revops.measuredi.com`) to Netlify:
1. Go to **Site settings** -> **Domain management** on Netlify.
2. Click **"Add a domain"** and enter your corporate domain.
3. Update your DNS CNAME record to point to your Netlify app URL.
