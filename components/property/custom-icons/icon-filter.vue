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

const svgPath = "M10 18H14V16H10V18ZM3 6V8H21V6H3ZM6 13H18V11H6V13Z";

</script>

<style></style>