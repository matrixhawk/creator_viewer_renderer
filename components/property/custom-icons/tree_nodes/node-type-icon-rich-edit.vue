<template>
  <svg :fill="computedColor" :style="{ width: computedSize, height: computedSize }" viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg">
    <path :d="svgPath" />
  </svg>
</template>
<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  size?: number | string;  // 可传 16 / '1em' / '24px'
  color?: string
}>()

const computedSize = computed(() => {
  return typeof props.size === 'number' ? `${props.size}px` : props.size || '1em'
})

const computedColor = computed(() => {
  return props.color || '#000000FF'
})

const svgPath = 'M1 2V5H3V4H5V9H3.5V11H8.5V9H7V4H9V5H11V2H1ZM21 3H14V5H20V19H4V14H2V20C2 20.5523 2.44772 21 3 21H21C21.5523 21 22 20.5523 22 20V4C22 3.44772 21.5523 3 21 3Z';
</script>

<style></style>