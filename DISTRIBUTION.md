# Distribution Guide

## Building for Production

### Quick Build
```bash
npm run build
```

This creates an optimized production build in the `dist/` folder.

### What Gets Built
- `dist/index.html` - Entry point
- `dist/assets/` - Bundled JS, CSS, and images
- All files from `public/` folder (including your images) are copied to `dist/`

### Build Output
- Total size: ~340 KB JavaScript (99 KB gzipped)
- All assets optimized and minified
- Ready for static hosting

---

## Deployment Options

### 1. **Static File Hosting** (Easiest)
Upload the entire `dist/` folder to any static host:
- **Netlify**: Drag and drop the `dist/` folder
- **Vercel**: `vercel --prod` from the project root
- **GitHub Pages**: Push `dist/` contents to gh-pages branch
- **AWS S3**: Upload to S3 bucket configured for static hosting
- **Any web server**: Copy `dist/` contents to your web root

### 2. **Preview Locally**
Test the production build locally:
```bash
npm run preview
```
This serves the `dist/` folder at http://localhost:4173

### 3. **Automated Deployment**
Add to `package.json` scripts if using a specific platform:
```json
"deploy:netlify": "npm run build && netlify deploy --prod --dir=dist",
"deploy:vercel": "npm run build && vercel --prod"
```

---

## Important Notes

### Before Building
1. **Compile Ink files**: .ink files are automatically compiled during build
2. **Check images**: Verify all images are in `public/assets/{story-id}/`
3. **Test locally**: Run `npm run dev` and test all features

### After Building
1. **Test the build**: Run `npm run preview` to test before deploying
2. **Check image paths**: All images should load correctly (they're in `/assets/`)
3. **Verify routing**: Since this is a client-side app, ensure your host is configured for SPAs

### SPA Routing Configuration
This app uses client-side routing. Most static hosts need configuration:

**Netlify** - Create `public/_redirects`:
```
/*    /index.html   200
```

**Vercel** - Create `vercel.json`:
```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

**Apache** - Create `.htaccess`:
```
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
```

---

## File Structure After Build

```
dist/
├── index.html                          # Entry point
├── assets/
│   ├── index-[hash].js                # Main JS bundle (gzipped)
│   ├── index-[hash].css               # Styles
│   ├── happy_Internet_v2.png          # Your images
│   ├── vpn_bypass_v2.png
│   └── ... (all other images)
└── [any other files from public/]
```

---

## Distribution Checklist

- [ ] Run `npm run compile-ink` to compile all stories
- [ ] Test locally with `npm run dev`
- [ ] Run `npm run build`
- [ ] Test build with `npm run preview`
- [ ] Verify all images load
- [ ] Check all story branches work
- [ ] Deploy `dist/` folder to hosting service
- [ ] Test deployed site
- [ ] Share the URL!

---

## Performance

The production build is optimized:
- Code splitting enabled
- Assets compressed with gzip
- Images served from `/assets/`
- CSS/JS minified
- Total initial load: ~100 KB (gzipped)

Perfect for a proof of concept! 🚀
