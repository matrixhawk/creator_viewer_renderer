<template>
  <svg :fill="computedColor" :style="{ width: computedSize, height: computedSize }"
    viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
    <path :d="svgPath" />
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

const svgPath = "m13.13 9.462c-.067-.061-.168-.074-.242-.027l-.464.289-.397-3.18c0-.007 0-.02-.007-.027l-.471-1.788c-.027-.087-.108-.155-.202-.148-.094 0-.175.067-.195.161l-.141.672-4.061-4.35c-.067-.067-.168-.087-.249-.034-.081.047-.114.148-.087.242l.45 1.271-3.355 4.316-.013.02-.303-.78c-.034-.087-.128-.141-.222-.128-.094.02-.168.101-.168.195v1.681l.094 2.952c0 .047.02.094.054.135l2.837 3.01c.04.04.094.06.148.06h3.315c.054 0 .108-.02.148-.06l2.891-3.01c.013-.014.02-.027.034-.04l.645-1.183c.04-.087.027-.182-.04-.249m-2.683-1.372l-.686 3.261-2.165 1.324-2.071-1.015-1.069-2.79 2.844-5.876 3.147 5.096";
</script>

<style></style>