# Asset Path Configuration

## Summary

This document explains the asset path configuration changes required due to the upgrade from react-scripts 1.x to 4.x.

## The Challenge

The original codebase (using react-scripts 1.x from 2017) used absolute paths like `/fonts/` and `/images/` in CSS files. These paths no longer work in react-scripts 4.x due to changes in webpack's css-loader configuration.

## What Has Been Fixed

### JavaScript Files ✅
All JavaScript files now properly use `process.env.PUBLIC_URL` for asset paths:

- **src/common/constants.js** - NO_AVATAR and NO_IMAGE paths
- **src/actions/metaTags.js** - OpenGraph image paths
- **src/components/Common/SafeMarkdown/SafeMarkdown.js** - Image fallback paths
- **src/components/Login/Login.js** - Gallery image paths
- **src/components/Login/ChooseSteemRegModal/ChooseSteemRegModal.js** - Registration service images
- **src/components/PostContextMenu/PostContextMenu.js** - Menu icon paths
- **src/components/Wallet/Wallet.js** - Token and button icon paths

### CSS Files - Current State ⚠️

CSS files in `src/` are processed by webpack's css-loader, which tries to resolve `url()` references as modules. The challenge is that:

1. Assets are in `public/fonts/` and `public/images/`
2. CSS files are at various directory depths in `src/`
3. Webpack's css-loader can't resolve these paths automatically

**Current workaround:** Assets have been copied to `src/fonts/` and `src/images/` to allow webpack bundling.

## Recommendations

###Option 1: Keep Current Setup (Easiest)
- Assets remain in both `public/` and `src/`
- JavaScript uses `process.env.PUBLIC_URL`
- CSS imports assets from `src/`
- Fonts and images get bundled by webpack

### Option 2: Refactor to CSS-in-JS (Best Practice)
- Move all styling to styled-components or CSS modules
- Import assets in JavaScript
- Use `process.env.PUBLIC_URL` consistently
- Remove dependency on CSS `url()` references

### Option 3: Eject and Configure Webpack (Advanced)
- Run `npm run eject` to expose webpack config
- Add custom loaders or aliases for asset resolution
- More control but loses Create React App benefits

## Files Modified

- All JavaScript component files with hardcoded image paths
- src/styles/main.css - Font-face declarations
- All CSS files in src/components/** - Background images and icons
- src/components/Follow/Follow.js - Styled-components background URLs

## Testing

To test the application:

```bash
npm start  # Development server on http://localhost:3000
npm run build  # Production build
```

## Future Improvements

1. Migrate to CSS modules or styled-components for better asset handling
2. Consider using webpack's file-loader configuration
3. Explore Create React App 5.x which may have better asset handling
4. Implement image optimization pipeline

## Notes

- The `process.env.PUBLIC_URL` variable allows the app to be deployed to subdirectories
- In development, `PUBLIC_URL` defaults to empty string
- In production builds, set via `homepage` field in package.json or PUBLIC_URL environment variable
