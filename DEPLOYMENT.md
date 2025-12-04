# Deployment Guide - Netlify

## Prerequisites
- GitHub account
- Netlify account (free tier is sufficient)

## Deployment Steps

### 1. Push to GitHub
```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit changes
git commit -m "Initial commit - Fundación Rimas prototype"

# Create a new repository on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/fundacion-rimas.git
git branch -M main
git push -u origin main
```

### 2. Deploy on Netlify

#### Option A: Via Netlify Dashboard
1. Log in to [Netlify](https://app.netlify.com)
2. Click "Add new site" → "Import an existing project"
3. Choose "GitHub" and authorize Netlify
4. Select your `fundacion-rimas` repository
5. Build settings:
   - **Build command:** Leave empty (static site)
   - **Publish directory:** `.` (root directory)
6. Click "Deploy site"

#### Option B: Via Netlify CLI
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login to Netlify
netlify login

# Deploy
netlify deploy --prod
```

### 3. Custom Domain (Optional)
1. In Netlify dashboard, go to "Domain settings"
2. Click "Add custom domain"
3. Follow instructions to configure DNS

## Configuration

The project includes `netlify.toml` with:
- **Security headers** (XSS protection, frame options, etc.)
- **Cache optimization** for static assets
- **SPA routing** (redirects all routes to index.html)

## Environment Variables
This project doesn't require environment variables. If you add a backend in the future:
1. Go to Site settings → Build & deploy → Environment
2. Add your variables

## Post-Deployment Checklist
- [ ] Test all sections and translations
- [ ] Verify mobile responsiveness
- [ ] Check music player functionality
- [ ] Test newsletter form
- [ ] Verify all images load correctly
- [ ] Test language switcher
- [ ] Test Light/Dark theme toggle
- [ ] Verify News section links

## Troubleshooting

**Images not loading?**
- Ensure all image paths are relative (e.g., `assets/images/...`)
- Check that images are committed to git

**Styles not applying?**
- Verify Tailwind CDN link in index.html
- Check browser console for errors

**Forms not working?**
- Consider adding Netlify Forms by adding `netlify` attribute to forms
- Or integrate with a service like Formspree

## Performance Optimization
The site is already optimized with:
- Lazy loading for images
- Optimized asset caching (1 year)
- Minified external dependencies

## Support
For issues, check:
- [Netlify Documentation](https://docs.netlify.com)
- [Netlify Community](https://answers.netlify.com)
