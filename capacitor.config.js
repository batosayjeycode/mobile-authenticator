/** @type {import('@capacitor/cli').CapacitorConfig} */
const config = {
  appId: 'com.sociolla.authenticatorapp',
  appName: 'Authenticator',
  webDir: 'dist',
  plugins: {
    CapacitorMlkitBarcodeScanning: {},
  },
};

module.exports = config;
