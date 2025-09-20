# Deployment Instructions for Hostinger

## Steps to Deploy

1. **Build the static files:**
   ```bash
   npm run build
   ```

2. **Upload files to Hostinger:**
   - Upload ALL contents from the `out/` folder to your Hostinger `public_html` directory
   - Do NOT upload the source code files (components/, app/, etc.)
   - Only upload the built static files from `out/`

3. **Main files to upload:**
   - `index.html` (homepage)
   - `_next/` folder (contains JS/CSS assets)
   - All other files and folders from `out/`

## Important Notes

- This app is configured for static export (`output: 'export'` in next.config.js)
- Dynamic routes (like `/post/[id]`) are currently disabled for static hosting
- For dynamic functionality, consider Node.js hosting or platforms like Vercel/Netlify