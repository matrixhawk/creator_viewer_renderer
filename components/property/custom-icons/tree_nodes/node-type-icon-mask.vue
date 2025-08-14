<template>
  <svg :style="{ width: computedSize, height: computedSize }" fill="none" viewBox="0 0 24 24">
    <path d="M6 4H15V11H6V4Z" :fill="computedColor"/>
    <path d="M15 11V1H1V11H15ZM15 11V4H6M15 11H6V4M6 4H20V14H6V4Z" :stroke="computedColor"/>
  </svg>
</template>
<script setup lang="ts">
import { computed } from 'vue';
const props = defineProps<{
  size?: number | string;  // 可传 16 / '1em' / '24px'
  color?: string;
  stroke?: boolean;
  fill?: boolean;
}>()

const computedSize = computed(() => {
  return typeof props.size === 'number' ? `${props.size}px` : props.size || '1em'
})

const computedColor = computed(() => {
  return props.color || '#000000FF'
})

const svgPath = "M10.5 15H10v2h7v-7h-2v4a1 1 0 0 1-1 1zm0-1H10v-4h4v4zM9 14H7V7h7v2h-4a1 1 0 0 0-1 1zm-1 1H7a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h7a1 1 0 0 1 1 1v2h2a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1h-7a1 1 0 0 1-1-1v-2z";
</script>

<style></style>