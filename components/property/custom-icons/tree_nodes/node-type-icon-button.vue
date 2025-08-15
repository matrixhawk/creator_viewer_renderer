<template>
  <svg :fill="computedColor" :style="{ width: computedSize, height: computedSize }" viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg">
<path d="M4.22222 5V19H19.7778V5H4.22222ZM3.11111 3H20.8889C21.5026 3 22 3.44772 22 4V20C22 20.5523 21.5026 21 20.8889 21H3.11111C2.49747 21 2 20.5523 2 20V4C2 3.44772 2.49747 3 3.11111 3Z" />
<path d="M9.5 11.375H12.875C13.9105 11.375 14.75 10.6754 14.75 9.8125C14.75 8.94956 13.9105 8.25 12.875 8.25H9.5V11.375ZM17 14.1875C17 15.7408 15.489 17 13.625 17H8V7H12.875C14.739 7 16.25 8.2592 16.25 9.8125C16.25 10.5652 15.8952 11.2488 15.3173 11.7536C16.3234 12.2404 17 13.1481 17 14.1875ZM9.5 12.625V15.75H13.625C14.6605 15.75 15.5 15.0504 15.5 14.1875C15.5 13.3246 14.6605 12.625 13.625 12.625H9.5Z" />
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