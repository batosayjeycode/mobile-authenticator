/** @type {import('@capacitor/cli').CapacitorConfig} */
const config = {
  appId: 'com.authenticator.app',
  appName: 'Authenticator',
  webDir: 'dist',
  plugins: {
    CapacitorMlkitBarcodeScanning: {},
  },
};

module.exports = config;
