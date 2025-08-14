<template>
    <svg :stroke="computedColor" :style="{ width: computedSize, height: computedSize }" class="el-icon svg"  viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><path d="m3 15v-2h-2v-1h2v-8h-2v-1h2v-2h1v2h8v-2h1v2h2v1h-2v8h2v1h-2v2h-1v-2h-8v2h-1m9-3v-8h-8v8h8"/></svg>
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
</script>

<style>

</style>