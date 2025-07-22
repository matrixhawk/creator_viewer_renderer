<script setup lang="ts">
import { ElButton } from 'element-plus';
import { reactive, Ref, watch } from 'vue';
import { trackersMap, treeRef } from '../../../CreatorViewerMiddleware';
import { Link } from '@element-plus/icons-vue'
import { eventBus } from '../../../EventBus';


const props = defineProps<{ modelValue: INodeTypeData, uuid: string, propName: string }>();

const tracker = trackersMap.get(props.uuid + props.propName) as Ref<INodeTypeData>;

watch(tracker,()=>{
    internalValue.isValid = tracker.value.isValid;
    internalValue.nodeName = tracker.value.nodeName;
    internalValue.nodeUuid = tracker.value.nodeUuid;
})

const internalValue = reactive<INodeTypeData>({
    isValid: props.modelValue.isValid,
    nodeName: props.modelValue.nodeName,
    nodeUuid: props.modelValue.nodeUuid
})

function onClickItem() {
    treeRef.value.getNode(props.modelValue.nodeUuid)?.expand(null, true);
    eventBus.emit('highlight-node', props.modelValue.nodeUuid);
}

</script>

<template>
    <ElButton style="width: 100%;justify-content:left" text bg size="small" v-on:click="onClickItem" :disabled="!internalValue.isValid" :icon="Link">{{internalValue.isValid ? internalValue.nodeName : "null"}}</ElButton>
</template>

<style lang="css"></style>