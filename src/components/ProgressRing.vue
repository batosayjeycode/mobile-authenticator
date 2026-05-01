<template>
  <svg :width="size" :height="size" :viewBox="`0 0 ${size} ${size}`" class="progress-ring">
    <circle
      class="ring-track"
      :cx="center"
      :cy="center"
      :r="radius"
      fill="none"
      :stroke-width="strokeWidth"
    />
    <circle
      class="ring-fill"
      :class="ringClass"
      :cx="center"
      :cy="center"
      :r="radius"
      fill="none"
      :stroke-width="strokeWidth"
      :stroke-dasharray="circumference"
      :stroke-dashoffset="dashOffset"
      stroke-linecap="round"
      transform-origin="center"
      style="transform: rotate(-90deg); transform-box: fill-box;"
    />
    <text
      :x="center"
      :y="center"
      text-anchor="middle"
      dominant-baseline="central"
      class="ring-text"
      :class="ringClass"
    >{{ remaining }}</text>
  </svg>
</template>

<script>
import { computed } from 'vue';

export default {
  name: 'ProgressRing',
  props: {
    remaining: { type: Number, default: 30 },
    total: { type: Number, default: 30 },
    size: { type: Number, default: 36 },
  },
  setup(props) {
    const strokeWidth = 2.5;
    const center = computed(() => props.size / 2);
    const radius = computed(() => (props.size - strokeWidth * 2) / 2);
    const circumference = computed(() => 2 * Math.PI * radius.value);
    const dashOffset = computed(() => {
      const progress = props.remaining / props.total;
      return circumference.value * (1 - progress);
    });

    const ringClass = computed(() => {
      if (props.remaining <= 5) return 'ring--critical';
      if (props.remaining <= 10) return 'ring--expiring';
      return 'ring--normal';
    });

    return { strokeWidth, center, radius, circumference, dashOffset, ringClass };
  },
};
</script>

<style lang="scss" scoped>
.progress-ring { flex-shrink: 0; }

.ring-track {
  stroke: rgba(255,255,255,0.07);
}

.ring-fill {
  transition: stroke-dashoffset 1s linear, stroke 0.5s ease;
  &.ring--normal { stroke: var(--accent); }
  &.ring--expiring { stroke: #d29922; }
  &.ring--critical { stroke: #f85149; }
}

.ring-text {
  font-family: 'JetBrains Mono', monospace;
  font-size: 9px;
  font-weight: 700;
  fill: var(--text-muted);
  &.ring--expiring { fill: #d29922; }
  &.ring--critical { fill: #f85149; }
}
</style>
