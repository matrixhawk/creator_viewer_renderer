<script setup lang="ts">
import { ElButton } from 'element-plus';
import { reactive, Ref, watch } from 'vue';
import { trackersMap, treeRef } from '../../../CreatorViewerMiddleware';
import { eventBus } from '../../../EventBus';
import IconLink from '../custom-icons/icon-link.vue';
import IconPackage from '../custom-icons/icon-package.vue';
import IconUnlink from '../custom-icons/icon-unlink.vue';


const props = defineProps<{ modelValue: INodeTypeData, uuid: string, propName: string }>();

const tracker = trackersMap.get(props.uuid + props.propName) as Ref<INodeTypeData>;

watch(tracker, () => {
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
    treeRef.value.getNode(props.modelValue.nodeUuid)?.parent?.expand(null, true);
    eventBus.emit('highlight-node', props.modelValue.nodeUuid);
}

</script>

<template>
    <div style="display: flex; align-items: center;">
        <IconPackage size="18"></IconPackage>
        <ElButton style="flex: 1;justify-content:left;margin-left: 5px; border: 1px solid var(--el-border-color);" text
            bg size="small" v-on:click="onClickItem" :disabled="!internalValue.isValid"
            :icon="internalValue.isValid ? IconLink : IconUnlink">{{ internalValue.isValid ? internalValue.nodeName :
            "null"}}</ElButton>
    </div>

</template>

<style lang="css"></style>