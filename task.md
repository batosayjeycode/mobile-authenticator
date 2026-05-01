# Capacitor Mobile App — Task Tracker

## Phase 1 — Scaffold Project
- [x] Create `mobile-authenticator-app/` directory structure
- [x] Create `package.json` with Capacitor + Vite + Vue deps
- [x] Create `vite.config.js`
- [x] Create `capacitor.config.js` (JS, not TS)
- [x] Create `index.html`
- [x] Run `npm install` ✅

## Phase 2 — Storage Layer
- [x] `src/lib/storage.js` — rewritten (chrome.storage → @capacitor/preferences) ✅
- [x] `src/lib/totp.js` — copied as-is ✅
- [x] `src/lib/base32.js` — copied as-is ✅
- [x] `src/lib/crypto.js` — adapted (chrome.storage → @capacitor/preferences) ✅
- [x] `src/lib/qr.js` — copied as-is ✅
- [x] `src/lib/utils.js` — copied as-is ✅
- [x] `src/store/accounts.js` — copied as-is ✅

## Phase 3 — Adapt Vue Components
- [x] `AccountCard.vue` — updated import paths ✅
- [x] `ProgressRing.vue` — copied as-is ✅
- [x] `AddAccount.vue` — updated import paths ✅
- [x] `Toast.vue` — safe-area-inset-bottom for home bar ✅
- [x] `AccountList.vue` — removed chrome.storage.session call ✅
- [x] `QrScanner.vue` — native camera via @capacitor-mlkit/barcode-scanning ✅
- [x] `App.vue` — responsive full-screen + safe areas ✅
- [x] `src/main.js` — standard Vue entrypoint ✅
- [x] `src/assets/global.scss` — mobile-first design tokens ✅

## Phase 4 — Native Platform Setup
- [x] `npm run build` — ✅ 41 modules, builds in 768ms
- [x] `npx cap add android` — ✅ All 3 plugins detected
- [x] `npx cap sync android` — ✅ Web assets synced to android/
- [x] Added CAMERA permission to AndroidManifest.xml ✅
- [x] `npx cap add ios` — ✅ ios/ project folder created
- [x] Bumped iOS deployment target to 16.0 in Podfile (MLKit requirement) ✅
- [~] `npx cap sync ios` — ⚠️ Web assets synced, pod install needs Xcode full app (not just CLI tools)

## Phase 5 — Verify
- [x] Vite build compiles without errors ✅
- [x] Android cap sync succeeds — 3 plugins: @capacitor/preferences, @capacitor/clipboard, @capacitor-mlkit/barcode-scanning ✅
- [~] iOS cap sync — web assets ok, pod install blocked by missing Xcode app (user action needed)
- [ ] User: open in Android Studio → `npx cap open android`
- [ ] User: install Xcode from App Store → re-run `LANG=en_US.UTF-8 npx cap sync ios` → `npx cap open ios`
