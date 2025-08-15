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

const svgPath = 'M3 21C2.44772 21 2 20.5523 2 20V4C2 3.44772 2.44772 3 3 3H21C21.5523 3 22 3.44772 22 4V20C22 20.5523 21.5523 21 21 21H3ZM7 10H4V19H7V10ZM20 10H9V19H20V10ZM20 5H4V8H20V5Z';
</script>

<style></style>