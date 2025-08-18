<template>
  <svg :fill="computedColor" :style="{ width: computedSize, height: computedSize }" viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg">
<path d="M19 19C19 17.3431 17.6569 16 16 16C14.3431 16 13 17.3431 13 19C13 20.6569 14.3431 22 16 22C17.6569 22 19 20.6569 19 19Z" fill="#5DCFDB"/>
<path d="M20 7.5C20 4.46243 17.5376 2 14.5 2C11.4624 2 9 4.46243 9 7.5C9 10.5376 11.4624 13 14.5 13C17.5376 13 20 10.5376 20 7.5Z" fill="#EE8585"/>
<path d="M10 16C10 13.7909 8.20914 12 6 12C3.79086 12 2 13.7909 2 16C2 18.2091 3.79086 20 6 20C8.20914 20 10 18.2091 10 16Z" fill="#E8E5A0"/>
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

const svgPath = 'M16 16C17.6569 16 19 17.3431 19 19C19 20.6569 17.6569 22 16 22C14.3431 22 13 20.6569 13 19C13 17.3431 14.3431 16 16 16ZM6 12C8.20914 12 10 13.7909 10 16C10 18.2091 8.20914 20 6 20C3.79086 20 2 18.2091 2 16C2 13.7909 3.79086 12 6 12ZM14.5 2C17.5376 2 20 4.46243 20 7.5C20 10.5376 17.5376 13 14.5 13C11.4624 13 9 10.5376 9 7.5C9 4.46243 11.4624 2 14.5 2Z';
</script>

<style></style>