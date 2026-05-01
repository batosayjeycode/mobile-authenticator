# Walkthrough — Chrome Extension → Capacitor Mobile App

## What Was Built

A new project at `/Users/sociolla/Documents/ai-helper/mobile-authenticator-app/` is ready to run as a native **Android and iOS app**. The original Chrome extension at `mobile-authenticator/` is untouched.

---

## Changes Made

### New Files Created

| File | Purpose |
|---|---|
| `package.json` | Capacitor 7 + Vite 5 + Vue 3 deps |
| `vite.config.js` | Replaces Webpack |
| `capacitor.config.js` | App ID: `com.authenticator.app` |
| `index.html` | Mobile viewport with `viewport-fit=cover` |
| `src/main.js` | Standard Vue entrypoint |
| `src/assets/global.scss` | Design tokens + mobile safe areas |

### Files Adapted (Chrome API Removal)

| File | Change |
|---|---|
| `src/lib/storage.js` | **Rewritten**: `chrome.storage.local` → `@capacitor/preferences` |
| `src/lib/crypto.js` | **Adapted**: `chrome.storage.local` → `@capacitor/preferences` for AES key storage |
| `src/components/AccountList.vue` | **3 lines removed**: `chrome.storage.session.get` call in `onMounted` |
| `src/components/QrScanner.vue` | **Replaced**: Chrome tab scan → native camera via `@capacitor-mlkit/barcode-scanning` |
| `src/App.vue` | **Responsive**: `width: 380px` → `100%`, added `100dvh` height + iOS safe area padding |
| `src/components/Toast.vue` | **Minor**: toast bottom offset accounts for iPhone home bar |

### Files Copied As-Is (Zero Changes)
`totp.js`, `base32.js`, `qr.js`, `utils.js`, `store/accounts.js`, `AccountCard.vue`, `ProgressRing.vue`, `AddAccount.vue`

---

## Build Results

```
✓ 41 modules transformed
dist/index.html                   0.88 kB │ gzip:  0.46 kB
dist/assets/index-D6Z_PYkr.css   17.17 kB │ gzip:  3.53 kB
dist/assets/index-Cr5S0_5l.js   116.05 kB │ gzip: 42.09 kB
dist/assets/jsQR-UMIdgYmG.js    130.80 kB │ gzip: 47.46 kB
✓ built in 768ms
```

## Capacitor Sync Results

**Android ✅**
```
[info] Found 3 Capacitor plugins for android:
       @capacitor/clipboard@7.0.4
       @capacitor/preferences@7.0.4
       @capacitor-mlkit/barcode-scanning@7.5.0
[success] android platform added!
```

**iOS ⚠️** — Web assets synced to `ios/App/App/public/` ✅  
`pod install` fails because **Xcode full app** is not installed (only CLI tools).

---

## Your Next Steps

### Android (Ready Now)
1. Open **Android Studio**
2. Run in your terminal:
```bash
cd /Users/sociolla/Documents/ai-helper/mobile-authenticator-app
npx cap open android
```
3. In Android Studio → Run on emulator or device

### iOS (Requires Xcode)

> [!IMPORTANT]
> Install Xcode from the Mac App Store first (it's free, ~7GB)

After Xcode is installed:
```bash
# Set the active developer directory to Xcode
sudo xcode-select -s /Applications/Xcode.app/Contents/Developer

# Sync iOS (will run pod install successfully)
cd /Users/sociolla/Documents/ai-helper/mobile-authenticator-app
LANG=en_US.UTF-8 npx cap sync ios

# Open in Xcode
npx cap open ios
```

In Xcode: select your Team in Signing & Capabilities → Run on simulator or device.

---

## Workflow for Future Updates

```bash
cd /Users/sociolla/Documents/ai-helper/mobile-authenticator-app

# 1. Make changes to src/
# 2. Rebuild
npm run build

# 3. Sync to native
npx cap sync android
LANG=en_US.UTF-8 npx cap sync ios
```

---

## Key Architecture Notes

- **Data persistence**: `@capacitor/preferences` stores accounts as JSON — equivalent to `chrome.storage.local`
- **QR scanning**: `@capacitor-mlkit/barcode-scanning` uses the native camera — works with `isNative()` check, falls back to file picker in browser dev mode
- **Clipboard**: Uses `navigator.clipboard.writeText()` — works correctly in Capacitor WKWebView with user gesture
- **Safe areas**: `env(safe-area-inset-*)` CSS variables handle iPhone notch and home bar automatically
