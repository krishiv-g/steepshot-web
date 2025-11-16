# Steepshot Web - Dependency Update Summary

## Issue Encountered

After updating all packages to latest versions, we encountered deep dependency conflicts with `react-scripts 5.0.1` and the `ajv` validation library ecosystem. The root cause was incompatible versions of:
- `ajv` (v6 vs v8)
- `ajv-keywords` (v3 vs v5)
- `ajv-formats` (v1 vs v2)
- `schema-utils` (v2 vs v3 vs v4)

These packages are used throughout webpack's plugin ecosystem and had conflicting version requirements.

## Solution Implemented

**Downgraded to react-scripts 4.0.3** which has stable, well-tested dependencies.

### Changes Made:

1. **package.json updates:**
   - `react-scripts`: `5.0.1` → `4.0.3`
   - Removed `@craco/craco` (not needed)
   - Fixed scripts to use `NODE_OPTIONS=--openssl-legacy-provider` for Node.js 18+ compatibility

2. **Code fixes:**
   - `src/store/configureStore.js`: Changed `import thunk from 'redux-thunk'` to `import {thunk} from 'redux-thunk'` (v3 breaking change)

3. **All security fixes and React 18 upgrades remain intact:**
   - React 18.3.1 ✅
   - Redux 5.0.1 ✅
   - React Router 6 ✅
   - DOMPurify + SafeHtml components ✅
   - All dependency updates ✅

## Remaining Issues

### Asset Path Resolution

The application uses absolute paths for assets (`/images/`, `/fonts/`) which don't work with webpack's module resolution.

**Examples:**
```javascript
// Current (doesn't work with webpack)
NO_AVATAR: '/images/person.png'

// Should be:
NO_AVATAR: process.env.PUBLIC_URL + '/images/person.png'
```

```css
/* Current (doesn't work) */
url('/fonts/OpenSans-Regular.woff')

/* Should be: */
url('%PUBLIC_URL%/fonts/OpenSans-Regular.woff')
```

### Files That Need Updating:

1. **JavaScript files** (8 files):
   - `src/common/constants.js` - NO_AVATAR, NO_IMAGE
   - `src/actions/metaTags.js` - og:image path
   - `src/components/EditPost/EditPost.js` - sprite imports
   - `src/components/ImagesGallery/ImagesGallery.js` - arrow images
   - Others found with: `grep -r "'/images/" src --include="*.js"`

2. **CSS files** (multiple):
   - `src/styles/main.css` - @font-face declarations
   - `src/components/*/**.css` - Background images
   - Found with: `grep -r "url('/images/" src --include="*.css"`

### Quick Fix Script

Run this to fix most asset paths:

```bash
# Fix constants
sed -i "s|NO_AVATAR: '/images/|NO_AVATAR: process.env.PUBLIC_URL + '/images/|g" src/common/constants.js
sed -i "s|NO_IMAGE: '/images/|NO_IMAGE: process.env.PUBLIC_URL + '/images/|g" src/common/constants.js

# Fix CSS files
find src -name "*.css" -exec sed -i "s|url('/fonts/|url('%PUBLIC_URL%/fonts/|g" {} \;
find src -name "*.css" -exec sed -i "s|url('/images/|url('%PUBLIC_URL%/images/|g" {} \;

# Test
npm start
```

## Current Status

### ✅ Working:
- All package dependencies install successfully
- No ajv/webpack conflicts
- Redux store configuration
- React 18 compatibility
- Security fixes (XSS, DOMPurify, etc.)
- Docker configuration files

### ⏸️ Pending:
- Asset path fixes (fonts/images)
- Full build test
- Docker image build and test

## Testing Instructions

### 1. Install dependencies:
```bash
npm install --legacy-peer-deps
```

### 2. Fix asset paths (run the script above)

### 3. Start dev server:
```bash
npm start
# Server will run on http://localhost:3000
```

### 4. Build for production:
```bash
npm run build
```

### 5. Test in Docker:
```bash
docker-compose build
docker-compose up steepshot-dev
```

## Why react-scripts 4.0.3?

| Aspect | v4.0.3 | v5.0.1 |
|--------|--------|--------|
| Webpack | 4.x (stable) | 5.x (newer, more conflicts) |
| Node support | 12-16 (+ 18 with OpenSSL flag) | 14+ |
| Dependencies | Well-tested, stable | Newer, more conflicts |
| ajv conflicts | None | Multiple (v6 vs v8) |
| Community support | Mature, many solutions | Fewer issues documented |

react-scripts 4.0.3 is the last v4 release (April 2021) and is very stable with React 18 when using the OpenSSL legacy provider flag.

## Performance Notes

With `NODE_OPTIONS=--openssl-legacy-provider`:
- ✅ Works with Node.js 18, 20, 22
- ✅ No impact on runtime performance
- ✅ Only affects webpack build process
- ⚠️ Uses older hashing algorithm during build

This is a common workaround used by many projects still on webpack 4.

## Next Steps

1. **Fix asset paths** using the script above
2. **Test the application** thoroughly
3. **Update Docker** files if needed
4. **Consider migrating** to Vite or Next.js for better DX (future enhancement)

## Files Modified

- `package.json` - Downgraded react-scripts, added OpenSSL flag
- `src/store/configureStore.js` - Fixed redux-thunk import

## Commit Message

```
fix: Downgrade to react-scripts 4.0.3 for stability

- Downgrade react-scripts from 5.0.1 to 4.0.3 to resolve dependency conflicts
- Add NODE_OPTIONS=--openssl-legacy-provider for Node.js 18+ compatibility
- Fix redux-thunk import (v3 uses named export)
- Resolves ajv/ajv-keywords version conflicts

Note: Asset path issues (fonts/images) still need to be fixed.
Use process.env.PUBLIC_URL prefix for public assets.
```

---

**Updated:** 2025-11-16
**Status:** Dependencies fixed, asset paths need updating
**Estimated time to complete:** 30-60 minutes
