<template>
  <svg :fill="computedColor" :style="{ width: computedSize, height: computedSize }" viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg">
    <path :d="svgPath" />
  </svg>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  size?: number | string, // 可传 16 / '1em' / '24px' , 
  color?: string
}>()

const computedSize = computed(() => {
  return typeof props.size === 'number' ? `${props.size}px` : props.size || '1em'
})

const computedColor = computed(() => {
  return props.color || '#FFFFFF'
})

const svgPath = "M21 8V20.9932C21 21.5501 20.5552 22 20.0066 22H3.9934C3.44495 22 3 21.556 3 21.0082V2.9918C3 2.45531 3.4487 2 4.00221 2H14.9968L21 8ZM19 9H14V4H5V20H19V9ZM8 7H11V9H8V7ZM8 11H16V13H8V11ZM8 15H16V17H8V15Z";

</script>

<style></style>