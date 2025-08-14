<template>
    <svg :fill="computedColor" :style="{ width: computedSize, height: computedSize }" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path :d="svgPath"/></svg>
</template>
<script setup lang="ts">
import { computed } from 'vue';
const props = defineProps<{
  size?: number | string;  // 可传 16 / '1em' / '24px'
  color ?: string
}>()

const computedSize = computed(() => {
  return typeof props.size === 'number' ? `${props.size}px` : props.size || '1em'
})

const computedColor = computed(() => {
  return props.color || '#000000FF'
})

const svgPath = "M12 1L21.5 6.5V17.5L12 23L2.5 17.5V6.5L12 1ZM5.49388 7.0777L12.0001 10.8444L18.5062 7.07774L12 3.311L5.49388 7.0777ZM4.5 8.81329V16.3469L11.0001 20.1101V12.5765L4.5 8.81329ZM13.0001 20.11L19.5 16.3469V8.81337L13.0001 12.5765V20.11Z";
</script>

<style>

.el-icon {
  fill: calc(computedColor);
}
</style>