<template>
  <div class="qr-scanner">
    <!-- Camera Scan Button -->
    <button
      class="btn-camera"
      :class="{ 'btn-camera--scanning': scanningCamera }"
      @click="scanFromCamera"
      :disabled="scanningCamera"
    >
      <div v-if="scanningCamera" class="scan-spinner"></div>
      <svg v-else width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
        <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
        <circle cx="12" cy="13" r="4"></circle>
      </svg>
      <span>{{ scanningCamera ? 'Scanning...' : 'Scan with Camera' }}</span>
    </button>

    <!-- Divider -->
    <div class="divider"><span>or upload an image</span></div>

    <!-- Upload Drop Zone -->
    <div
      class="drop-zone"
      :class="{ 'drop-zone--dragging': isDragging, 'drop-zone--success': scanSuccess, 'drop-zone--error': !!scanError }"
      @dragover.prevent="isDragging = true"
      @dragleave="isDragging = false"
      @drop.prevent="handleDrop"
      @click="fileInput.click()"
    >
      <input ref="fileInput" type="file" accept="image/*" class="hidden-input" @change="handleFileInput" />

      <div v-if="scanning" class="drop-inner">
        <div class="scan-spinner"></div>
        <p>Scanning QR Code...</p>
      </div>
      <div v-else-if="scanSuccess" class="drop-inner success">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#3fb950" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
        <p>QR Code detected!</p>
      </div>
      <div v-else-if="scanError" class="drop-inner error">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#f85149" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line>
        </svg>
        <p>{{ scanError }}</p>
        <span class="hint">Tap to try again</span>
      </div>
      <div v-else class="drop-inner">
        <div class="qr-icon">
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <rect x="3" y="3" width="7" height="7"></rect><rect x="3" y="3" width="3" height="3" fill="currentColor" stroke="none" rx="0.5"></rect>
            <rect x="14" y="3" width="7" height="7"></rect><rect x="16" y="5" width="3" height="3" fill="currentColor" stroke="none" rx="0.5"></rect>
            <rect x="3" y="14" width="7" height="7"></rect><rect x="5" y="16" width="3" height="3" fill="currentColor" stroke="none" rx="0.5"></rect>
            <line x1="14" y1="14" x2="14" y2="14"></line><line x1="17" y1="14" x2="17" y2="14"></line>
            <line x1="20" y1="14" x2="20" y2="14"></line><line x1="14" y1="17" x2="14" y2="17"></line>
            <line x1="17" y1="17" x2="20" y2="17"></line><line x1="20" y1="20" x2="14" y2="20"></line>
          </svg>
        </div>
        <p class="drop-title">Tap to upload QR image</p>
        <p class="drop-sub">from your photo library</p>
        <button type="button" class="btn-upload" @click.stop="fileInput.click()">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
            <polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line>
          </svg>
          Choose Image
        </button>
      </div>
    </div>

    <canvas ref="canvas" style="display:none"></canvas>
  </div>
</template>

<script>
import { ref, inject } from 'vue';
import { decodeQrFromBlob, parseOtpAuthUri } from '../lib/qr.js';

// Detect if running inside Capacitor (native) or plain browser
function isNative() {
  return !!(window.Capacitor && window.Capacitor.isNativePlatform());
}

export default {
  name: 'QrScanner',
  emits: ['scanned', 'cancel'],
  setup(_, { emit }) {
    const toast = inject('toast');
    const fileInput = ref(null);
    const canvas = ref(null);
    const isDragging = ref(false);
    const scanning = ref(false);
    const scanningCamera = ref(false);
    const scanSuccess = ref(false);
    const scanError = ref('');

    async function processQrData(data) {
      if (!data) {
        scanError.value = 'No QR code found';
        return;
      }
      try {
        const parsed = parseOtpAuthUri(data);
        scanSuccess.value = true;
        setTimeout(() => emit('scanned', parsed), 500);
      } catch (e) {
        scanError.value = e.message || 'Invalid QR code format';
      }
    }

    async function handleFile(file) {
      if (!file || !file.type.startsWith('image/')) {
        scanError.value = 'Please select an image file';
        return;
      }
      scanning.value = true;
      scanError.value = '';
      scanSuccess.value = false;
      try {
        const data = await decodeQrFromBlob(file);
        await processQrData(data);
      } catch (e) {
        scanError.value = 'Failed to read image';
      } finally {
        scanning.value = false;
      }
    }

    function handleFileInput(e) {
      const file = e.target.files[0];
      if (file) handleFile(file);
    }

    function handleDrop(e) {
      isDragging.value = false;
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    }

    async function scanFromCamera() {
      scanningCamera.value = true;
      scanError.value = '';

      try {
        if (isNative()) {
          // Native Capacitor path — uses device camera
          const { BarcodeScanner, BarcodeFormat } = await import('@capacitor-mlkit/barcode-scanning');

          // Request permission first
          const { camera } = await BarcodeScanner.requestPermissions();
          if (camera !== 'granted' && camera !== 'limited') {
            scanError.value = 'Camera permission denied';
            return;
          }

          const { barcodes } = await BarcodeScanner.scan({
            formats: [BarcodeFormat.QrCode],
          });

          if (barcodes.length > 0) {
            await processQrData(barcodes[0].rawValue);
          } else {
            scanError.value = 'No QR code found — try again';
          }
        } else {
          // Browser fallback — prompt file picker
          toast?.value?.show('Camera scan requires the mobile app', 'info');
          fileInput.value?.click();
        }
      } catch (e) {
        console.error('[QrScanner] Camera scan failed:', e);
        scanError.value = 'Camera scan failed. Try uploading an image.';
      } finally {
        scanningCamera.value = false;
      }
    }

    return {
      fileInput, canvas, isDragging, scanning, scanningCamera,
      scanSuccess, scanError,
      handleFileInput, handleDrop, scanFromCamera,
    };
  },
};
</script>

<style lang="scss" scoped>
.qr-scanner { padding: 16px; }

/* Camera button — primary action */
.btn-camera {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 28px 16px;
  border-radius: 14px;
  border: none;
  background: linear-gradient(135deg, rgba(88,166,255,0.15) 0%, rgba(88,166,255,0.05) 100%);
  border: 1px solid rgba(88,166,255,0.25);
  color: var(--accent);
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  span { font-family: inherit; }

  &:hover:not(:disabled) {
    background: linear-gradient(135deg, rgba(88,166,255,0.25) 0%, rgba(88,166,255,0.1) 100%);
    border-color: var(--accent);
    transform: translateY(-1px);
    box-shadow: 0 6px 20px rgba(88,166,255,0.2);
  }

  &--scanning {
    opacity: 0.7;
    cursor: not-allowed;
  }

  &:disabled {
    cursor: not-allowed;
  }
}

.drop-zone {
  border: 2px dashed var(--border);
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  min-height: 140px;
  display: flex;
  align-items: center;
  justify-content: center;
  &:hover, &--dragging {
    border-color: var(--accent);
    background: rgba(88, 166, 255, 0.04);
  }
  &--success { border-color: #3fb950; background: rgba(63,185,80,0.04); }
  &--error { border-color: #f85149; background: rgba(248,81,73,0.04); }
}

.drop-inner {
  display: flex; flex-direction: column; align-items: center;
  gap: 10px; padding: 24px; text-align: center;
  &.success p { color: #3fb950; font-weight: 500; }
  &.error p { color: #f85149; font-weight: 500; }
  p { margin: 0; font-size: 13px; color: var(--text-secondary); }
  .hint { font-size: 11px; color: var(--text-muted); }
}

.qr-icon { color: var(--text-muted); opacity: 0.6; }

.drop-title { font-size: 13px; font-weight: 500; color: var(--text-secondary); margin: 0; }
.drop-sub { font-size: 11px; color: var(--text-muted); margin: 0; }

.btn-upload {
  display: flex; align-items: center; gap: 6px; margin-top: 4px;
  padding: 7px 14px; border-radius: 8px;
  border: 1px solid var(--border); background: var(--bg-hover);
  color: var(--text-secondary); font-size: 12px; font-weight: 500;
  cursor: pointer; transition: all 0.15s;
  &:hover { border-color: var(--accent); color: var(--accent); }
}

.hidden-input { display: none; }

.scan-spinner {
  width: 28px; height: 28px;
  border: 2px solid var(--border);
  border-top-color: var(--accent);
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
  &.small { width: 14px; height: 14px; border-width: 2px; }
}
@keyframes spin { to { transform: rotate(360deg); } }

.divider {
  display: flex; align-items: center; gap: 12px;
  margin: 16px 0;
  &::before, &::after { content: ''; flex: 1; height: 1px; background: var(--border); }
  span { font-size: 11px; color: var(--text-muted); white-space: nowrap; }
}
</style>
