# Steepshot Web - Migration to Modern Stack

**Date:** 2025-11-16
**Version:** 0.0.6 → 0.0.7

## Summary of Changes

This document outlines all major changes made to update Steepshot Web to modern dependencies and fix security vulnerabilities.

---

## 📦 Package Updates

### Major Version Upgrades

| Package | Old Version | New Version | Change |
|---------|-------------|-------------|--------|
| react | 16.4.2 | 18.3.1 | +2 majors |
| react-dom | 16.4.2 | 18.3.1 | +2 majors |
| react-scripts | 1.1.4 | 5.0.1 | +4 majors |
| redux | 3.7.2 | 5.0.1 | +2 majors |
| react-redux | 5.0.6 | 9.2.0 | +4 majors |
| react-router-dom | 4.3.1 | 6.28.0 | +2 majors |
| styled-components | 3.4.2 | 6.1.19 | +3 majors |
| history | 4.7.2 | 5.3.0 | +1 major |
| redux-thunk | 2.2.0 | 3.1.0 | +1 major |

### Security Fixes

**Removed Vulnerable Packages:**
- ❌ `react-render-html` (CVE-2020-14418 - XSS vulnerability)
- ❌ `react-router-redux` (deprecated, unmaintained)
- ❌ `redux-promise` (replaced with custom middleware)
- ❌ `es6-promise` (not needed in modern browsers)
- ❌ `isomorphic-fetch` (built into modern Node/browsers)

**Added Secure Alternatives:**
- ✅ `dompurify` (3.2.2) - HTML sanitization
- ✅ `react-markdown` (9.0.1) - Safe markdown rendering
- ✅ `remark-gfm` (4.0.0) - GitHub Flavored Markdown support

---

## 🔐 Security Improvements

### 1. XSS Protection

**Before:**
```javascript
import renderHTML from 'react-render-html';
{renderHTML(userContent)}  // Vulnerable to XSS
```

**After:**
```javascript
import SafeHtml from '../../Common/SafeHtml/SafeHtml';
<SafeHtml html={userContent} />  // Sanitized with DOMPurify
```

### 2. Markdown Rendering

**New Components:**
- `src/components/Common/SafeMarkdown/SafeMarkdown.js` - Secure markdown renderer
- `src/components/Common/SafeHtml/SafeHtml.js` - Secure HTML renderer

Both components use DOMPurify to prevent XSS attacks.

### 3. Content Security Policy

TODO: Add CSP headers in production deployment (see security audit report).

---

## 🎨 React Router v6 Migration

### Breaking Changes Fixed

#### 1. Switch → Routes
```javascript
// Before (v4)
<Switch>
  <Route path="/" component={Home} />
</Switch>

// After (v6)
<Routes>
  <Route path="/" element={<Home />} />
</Routes>
```

#### 2. Route Props
```javascript
// Before (v4)
<Route path="/about" component={About} />
<Route path="/signin" render={() => <Login />} />

// After (v6)
<Route path="/about" element={<About />} />
<Route path="/signin" element={<Login />} />
```

#### 3. Redirect → Navigate
```javascript
// Before (v4)
<Redirect to="/browse" />

// After (v6)
<Navigate to="/browse" replace />
```

#### 4. Custom Route Components

**PrivateRoute:**
```javascript
// Before (v4)
<PrivateRoute path="/feed" component={Feed} />

// After (v6)
<Route path="/feed" element={<PrivateRoute><Feed /></PrivateRoute>} />
```

**RouteWithService:**
```javascript
// Before (v4)
<RouteWithService path="/browse" component={Browse} />

// After (v6)
<Route path="/browse" element={<RouteWithService><Browse /></RouteWithService>} />
```

### Navigation Helper

Created compatibility shim for navigation:
- `src/utils/react-router-redux-shim.js`

Replaces deprecated `react-router-redux` package with functions compatible with React Router v6.

**Usage in Actions:**
```javascript
import {push} from '../../utils/react-router-redux-shim';

export function logout() {
  return (dispatch) => {
    // ... logout logic
    dispatch(push('/signin'));
  };
}
```

---

## 🏪 Redux v5 Migration

### Store Configuration

**Changes:**
```javascript
// Before (Redux 3)
import {createStore} from 'redux';

// After (Redux 5)
import {legacy_createStore as createStore} from 'redux';
```

### Removed Dependencies
- ❌ `react-router-redux` (routerMiddleware, routerReducer)
- ❌ `redux-promise` (replaced with custom middleware)

### Custom Promise Middleware
```javascript
const promiseMiddleware = store => next => action => {
  if (action && action.payload && typeof action.payload.then === 'function') {
    return action.payload.then(
      result => next({...action, payload: result}),
      error => {
        next({...action, payload: error, error: true});
        return Promise.reject(error);
      }
    );
  }
  return next(action);
};
```

---

## 🐳 Docker Support

### New Files

1. **Dockerfile** - Multi-stage build for dev/prod
2. **docker-compose.yml** - Dev and prod services
3. **.dockerignore** - Optimize build context
4. **DOCKER_README.md** - Complete Docker documentation

### Docker Commands

```bash
# Development with hot reload
docker-compose up steepshot-dev

# Production build
docker-compose --profile production up steepshot-prod
```

### Features
- ✅ Multi-stage builds (build, production, development)
- ✅ Hot module reloading in development
- ✅ Health checks in production
- ✅ Optimized layer caching
- ✅ Non-root user for security

---

## ⚠️ Known Issues & TODO

### Still Using Deprecated Lifecycle Methods

19 files still use `componentWillReceiveProps` (deprecated in React 16.3+, removed in React 17+):

```
src/components/Atoms/HeadingLeadComponent.js
src/components/Browse/Browse.js
src/components/Comments/Comments.js
src/components/Common/Avatar/Avatar.js
src/components/Common/TextInput/TextInput.js
src/components/Common/Timer/Timer.js
src/components/EditPost/EditPost.js
src/components/Header/Header.js
src/components/ImagesGallery/ImagesGallery.js
src/components/InfinityScroll/InfinityScroll.js
src/components/LikesFlagsList/LikesFlagsList.js
src/components/Modals/SendBid/SendBid.js
src/components/PostModal/PostModal.js
src/components/PostsList/PostsList.js
src/components/PushNotifications/PushNotifications.js
src/components/UserProfile/UserProfile.js
src/components/UsersList/UsersList.js
src/components/Wallet/TransactionHistory/TransactionHistory.js
```

**Fix Required:**
```javascript
// Before
componentWillReceiveProps(nextProps) {
  if (nextProps.data !== this.props.data) {
    this.setState({...});
  }
}

// After
componentDidUpdate(prevProps) {
  if (this.props.data !== prevProps.data) {
    this.setState({...});
  }
}
```

### Private Keys in LocalStorage

**CRITICAL SECURITY ISSUE:** Private keys are still stored in localStorage.

**Files Affected:**
- `src/utils/Storage.js`
- `src/reducers/auth.js`
- `src/actions/transfer.js`
- `src/actions/wallet.js`

**Recommended Fix:**
1. Remove all private key storage from localStorage
2. Implement OAuth-only authentication via SteemConnect
3. Or use in-memory storage with session timeout

### Server-Side Rendering

**Potential Issues:**
- `create-react-server` may not be fully compatible with React 18
- SSR rendering needs testing with new React Router v6
- May need to update to a modern SSR solution (Next.js, Remix, or custom)

### Missing Error Boundaries

No React Error Boundaries implemented. Any component error crashes the entire app.

**Recommended:**
Add error boundaries at route level:
```javascript
<ErrorBoundary>
  <Route path="/" element={<Home />} />
</ErrorBoundary>
```

---

## 🧪 Testing

### Build Test

```bash
# Install dependencies
npm install --legacy-peer-deps

# Test development build
npm start

# Test production build
npm run build

# Test in Docker
docker-compose up steepshot-dev
```

### Known Build Warnings

You may see the following warnings (non-critical):
- Peer dependency warnings (expected with major version jumps)
- Deprecation warnings for `componentWillReceiveProps`
- Source map warnings (can be ignored in development)

---

## 📝 Migration Checklist

### Completed ✅

- [x] Update package.json to latest versions
- [x] Fix Redux 5 breaking changes (createStore → legacy_createStore)
- [x] Remove react-router-redux dependency
- [x] Create React Router v6 compatibility shim
- [x] Update all route definitions (Switch → Routes)
- [x] Update PrivateRoute and RouteWithService components
- [x] Replace react-render-html with SafeHtml/SafeMarkdown
- [x] Add DOMPurify for XSS protection
- [x] Create Dockerfile and docker-compose.yml
- [x] Add Docker documentation

### In Progress 🔄

- [ ] Fix deprecated lifecycle methods (19 files)
- [ ] Test all routes and navigation
- [ ] Test form submissions and actions

### TODO 📋

- [ ] Add React Error Boundaries
- [ ] Implement proper error logging
- [ ] Add unit tests (Jest + Testing Library)
- [ ] Fix private key storage security issue
- [ ] Add Content Security Policy headers
- [ ] Migrate to React Hooks (optional but recommended)
- [ ] Add TypeScript (optional)
- [ ] Update SSR implementation for React 18 compatibility
- [ ] Add PropTypes to all components missing them
- [ ] Performance optimization (React.memo, useMemo, useCallback)

---

## 🚀 Deployment

### Development

```bash
npm install --legacy-peer-deps
npm start
```

### Production (Local)

```bash
npm install --legacy-peer-deps
npm run build
npm run server
```

### Docker Production

```bash
docker-compose --profile production up -d
```

---

## 📚 Additional Resources

- [React 18 Upgrade Guide](https://react.dev/blog/2022/03/08/react-18-upgrade-guide)
- [React Router v6 Migration Guide](https://reactrouter.com/en/main/upgrading/v5)
- [Redux v5 Migration Guide](https://redux.js.org/usage/migrating-to-modern-redux)
- [DOMPurify Documentation](https://github.com/cure53/DOMPurify)

---

## 🐛 Reporting Issues

If you encounter build errors or runtime issues:

1. Check console for error messages
2. Clear node_modules and reinstall:
   ```bash
   rm -rf node_modules package-lock.json
   npm install --legacy-peer-deps
   ```
3. Check Docker logs if using containers:
   ```bash
   docker-compose logs -f
   ```

---

**Migration completed by:** AI Assistant
**Date:** 2025-11-16
**Estimated time to complete remaining tasks:** 2-3 weeks with 2 developers
