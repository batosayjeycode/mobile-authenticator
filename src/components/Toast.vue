<template>
  <transition name="toast-slide">
    <div v-if="visible" class="toast" :class="`toast--${type}`">
      <svg v-if="type === 'success'" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
      <svg v-else-if="type === 'error'" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>
      <svg v-else width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
      <span>{{ message }}</span>
    </div>
  </transition>
</template>

<script>
import { ref } from 'vue';

export default {
  name: 'Toast',
  setup() {
    const visible = ref(false);
    const message = ref('');
    const type = ref('info');
    let _timer = null;

    function show(msg, t = 'info', duration = 2200) {
      if (_timer) clearTimeout(_timer);
      message.value = msg;
      type.value = t;
      visible.value = true;
      _timer = setTimeout(() => { visible.value = false; }, duration);
    }

    return { visible, message, type, show };
  },
};
</script>

<style lang="scss" scoped>
.toast {
  position: fixed;
  bottom: calc(24px + var(--safe-bottom, 0px));
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  border-radius: 10px;
  font-size: 13px;
  font-weight: 500;
  white-space: nowrap;
  z-index: 9999;
  box-shadow: 0 4px 20px rgba(0,0,0,0.4);
  backdrop-filter: blur(8px);

  &--success { background: rgba(31,111,235,0.9); color: white; }
  &--error   { background: rgba(248,81,73,0.9);  color: white; }
  &--info    { background: rgba(30,40,60,0.95);  color: var(--text-primary); border: 1px solid var(--border); }
}

.toast-slide-enter-active,
.toast-slide-leave-active { transition: all 0.25s ease; }
.toast-slide-enter-from,
.toast-slide-leave-to { opacity: 0; transform: translateX(-50%) translateY(12px); }
</style>
