# 🚀 Steepshot Web - Quick Start Guide

## ✅ What's Been Updated

Your codebase has been modernized with:
- ✅ **React 18.3** (from 16.4)
- ✅ **Redux 5.0** (from 3.7)
- ✅ **React Router 6** (from 4)
- ✅ **All packages updated** to latest stable versions
- ✅ **Critical security vulnerabilities fixed**
- ✅ **Docker support added**
- ✅ **Complete documentation**

---

## 🐳 Running with Docker (Recommended)

### Development Mode
```bash
# Start development server with hot reload
docker-compose up steepshot-dev

# Access at: http://localhost:3000
```

### Production Mode
```bash
# Build and run production server
docker-compose --profile production up steepshot-prod

# Access at: http://localhost:3001
```

### Docker Commands
```bash
# Stop all containers
docker-compose down

# View logs
docker-compose logs -f steepshot-dev

# Rebuild after changes
docker-compose build
```

---

## 💻 Running Locally (Without Docker)

### Prerequisites
- Node.js 18+
- npm 9+

### Steps
```bash
# 1. Install dependencies
npm install --legacy-peer-deps

# 2. Start development server
npm start

# 3. Open browser
# http://localhost:3000

# 4. For production build
npm run build
npm run server
```

---

## 📁 Important Files

### Documentation
- **MIGRATION_NOTES.md** - Complete changelog and migration guide
- **DOCKER_README.md** - Detailed Docker documentation
- **QUICKSTART.md** - This file

### Docker Files
- **Dockerfile** - Multi-stage build configuration
- **docker-compose.yml** - Development and production services
- **.dockerignore** - Docker build optimization

### Package Management
- **package.json** - Updated dependencies
- **package.json.backup** - Original package.json (for reference)

---

## 🔐 Security Improvements

### Fixed Vulnerabilities
1. ✅ **XSS Protection** - Replaced `react-render-html` with DOMPurify-based components
2. ✅ **Markdown Rendering** - New secure `SafeMarkdown` and `SafeHtml` components
3. ✅ **Updated Dependencies** - All packages updated to latest secure versions

### New Security Components
- `src/components/Common/SafeHtml/SafeHtml.js`
- `src/components/Common/SafeMarkdown/SafeMarkdown.js`

Both use DOMPurify to sanitize HTML and prevent XSS attacks.

---

## ⚠️ Known Issues & TODO

### Critical (Needs Attention)
1. **Private Keys in LocalStorage** - Still stored insecurely
   - **Location:** `src/utils/Storage.js`, `src/actions/transfer.js`, `src/actions/wallet.js`
   - **Recommendation:** Implement OAuth-only authentication or secure key management

2. **Deprecated Lifecycle Methods** - 19 files still use `componentWillReceiveProps`
   - **Status:** Non-blocking but should be fixed
   - **See:** MIGRATION_NOTES.md for complete list

### Medium Priority
3. **Error Boundaries** - None implemented
4. **PropTypes** - Missing on 30+ components
5. **Memory Leaks** - Event listeners not cleaned up in some components

### Low Priority
6. **Unit Tests** - No test coverage
7. **TypeScript** - Could add for better type safety
8. **Performance** - Could optimize with React.memo, useMemo

---

## 🧪 Testing the Build

### Quick Test
```bash
# Install and start
npm install --legacy-peer-deps
npm start
```

### Expected Warnings (Safe to Ignore)
- Peer dependency warnings (expected with major upgrades)
- `componentWillReceiveProps` deprecation warnings
- Source map warnings in development

### Build Errors?
If you encounter errors:

1. **Clear cache:**
   ```bash
   rm -rf node_modules package-lock.json
   npm install --legacy-peer-deps
   ```

2. **Check Node version:**
   ```bash
   node --version  # Should be 18+
   ```

3. **Try Docker:**
   ```bash
   docker-compose up steepshot-dev
   ```

---

## 📊 Package Update Summary

### Major Updates
| Package | Old | New | Change |
|---------|-----|-----|--------|
| react | 16.4.2 | 18.3.1 | +2 major versions |
| redux | 3.7.2 | 5.0.1 | +2 major versions |
| react-router-dom | 4.3.1 | 6.28.0 | +2 major versions |
| styled-components | 3.4.2 | 6.1.19 | +3 major versions |

### Security Fixes
- ❌ Removed `react-render-html` (CVE-2020-14418)
- ✅ Added `dompurify` (3.2.2)
- ✅ Added `react-markdown` (9.0.1)

---

## 🔧 Development Workflow

### Making Changes
1. Edit files in `src/` directory
2. Changes auto-reload in browser (hot module replacement)
3. Check console for errors

### Adding Dependencies
```bash
# Add new package
npm install package-name --legacy-peer-deps

# For Docker, rebuild:
docker-compose down
docker-compose build
docker-compose up
```

### Git Workflow
```bash
# Current branch
git branch  # claude/review-steep-code-01G5QoooQQMv5TBsbDLQNDSv

# Commit changes
git add .
git commit -m "Your message"
git push
```

---

## 🆘 Troubleshooting

### Port Already in Use
```bash
# Check what's using port 3000
lsof -i :3000

# Kill the process
kill -9 <PID>

# Or use different port in docker-compose.yml
```

### Docker Not Working
```bash
# Check Docker is running
docker ps

# Check disk space
docker system df

# Clean up
docker system prune -f
```

### Build Fails
```bash
# Clear everything
rm -rf node_modules package-lock.json build
npm cache clean --force
npm install --legacy-peer-deps

# Or use Docker (fresh environment)
docker-compose build --no-cache
docker-compose up
```

---

## 📚 Next Steps

1. **Test the Application**
   - Start with Docker: `docker-compose up steepshot-dev`
   - Test all major features (login, posting, browsing, wallet)

2. **Fix Deprecation Warnings**
   - See MIGRATION_NOTES.md for list of 19 files
   - Replace `componentWillReceiveProps` with `componentDidUpdate`

3. **Security Audit**
   - Review private key storage
   - Implement proper authentication
   - Add Content Security Policy headers

4. **Add Tests**
   - Unit tests with Jest
   - Integration tests with Testing Library
   - E2E tests with Cypress (optional)

---

## 📞 Support

### Documentation
- **MIGRATION_NOTES.md** - Complete changelog
- **DOCKER_README.md** - Docker guide
- **Original README.md** - Project overview

### Logs
```bash
# Development logs
docker-compose logs -f steepshot-dev

# Production logs
docker-compose --profile production logs -f steepshot-prod

# Browser console
# F12 → Console tab
```

---

## ✨ What's New

### Components
- `SafeHtml` - Secure HTML rendering with DOMPurify
- `SafeMarkdown` - Secure markdown rendering
- `PrivateRoute` - Updated for React Router v6
- `RouteWithService` - Updated for React Router v6

### Utilities
- `react-router-redux-shim.js` - Navigation compatibility layer
- `navigationHelper.js` - Navigation utilities

### Docker
- Multi-stage builds for optimization
- Separate dev/prod configurations
- Health checks in production
- Hot reload in development

---

**Last Updated:** 2025-11-16
**Version:** 0.0.7
**Commit:** feat: Modernize stack and add Docker support

Happy coding! 🎉
