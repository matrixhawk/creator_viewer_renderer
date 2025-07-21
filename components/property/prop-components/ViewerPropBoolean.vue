<script setup lang="ts">
import { ElCheckbox } from 'element-plus';
import { onMounted, reactive, watch } from 'vue';
import { ClientBridge, trackersMap } from '../../../CreatorViewerMiddleware';


const props = defineProps<{  modelValue: boolean, uuid: string, propName: string }>();
const tracker = trackersMap.get(props.uuid + props.propName);

const internalValue = reactive({
    value: props.modelValue
})

onMounted(()=>{
    console.log(internalValue);
})

watch(
    internalValue,
    (newVal) => {
        if(newVal.value == tracker.value) return;
        tracker.value = newVal.value;
        ClientBridge.modifyTargetProp(props.uuid, props.propName, newVal);
    },
    { deep: true }
)

function onInput(value: boolean) {
//   ClientBridge.modifyTargetProp(props.uuid, props.propName, value);
}

</script>

<template>
    <ElCheckbox size="default" v-model="internalValue.value" v-on:change="onInput"></ElCheckbox>
</template>

<style lang="css">

</style>