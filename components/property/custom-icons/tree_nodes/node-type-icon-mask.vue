<template>
  <svg :fill="computedColor" :style="{ width: computedSize, height: computedSize }" viewBox="0 0 24 24">
    <path d="M15 17V19H6C5.44772 19 5 18.5523 5 18V7H2V5H5V2H7V17H15ZM17 22V7H9V5H18C18.5523 5 19 5.44772 19 6V17H22V19H19V22H17Z" />
  </svg>
</template>
<script setup lang="ts">
import { computed } from 'vue';
const props = defineProps<{
  size?: number | string;  // 可传 16 / '1em' / '24px'
  color?: string;
}>()

const computedSize = computed(() => {
  return typeof props.size === 'number' ? `${props.size}px` : props.size || '1em'
})

const computedColor = computed(() => {
  return props.color || '#000000FF'
})
</script>

<style></style>