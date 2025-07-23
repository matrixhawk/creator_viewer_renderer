<script setup lang="ts">
import { ElButton } from 'element-plus';
import { reactive, Ref, watch } from 'vue';
import { trackersMap, treeRef } from '../../../CreatorViewerMiddleware';
import { Link } from '@element-plus/icons-vue'
import { eventBus } from '../../../EventBus';
import IconLink from '../custom-icons/icon-link.vue';
import IconUnlink from '../custom-icons/icon-unlink.vue';
import IconCode from '../custom-icons/icon-code.vue';


const props = defineProps<{ modelValue: IComponentTypeData, uuid: string, propName: string }>();

const tracker = trackersMap.get(props.uuid + props.propName) as Ref<IComponentTypeData>;

watch(tracker, () => {
    internalValue.isValid = tracker.value.isValid;
    internalValue.nodeName = tracker.value.nodeName;
    internalValue.nodeUuid = tracker.value.nodeUuid;
    internalValue.componentName = tracker.value.componentName;
})

const internalValue = reactive<IComponentTypeData>({
    isValid: props.modelValue.isValid,
    nodeName: props.modelValue.nodeName,
    nodeUuid: props.modelValue.nodeUuid,
    componentName: props.modelValue.componentName
})

function onClickItem() {
    treeRef.value.getNode(props.modelValue.nodeUuid)?.expand(null, true);
    eventBus.emit('highlight-node', props.modelValue.nodeUuid);
}

</script>

<template>
    <div style="display: flex; align-items: center;">
        <IconCode size="18"></IconCode>
        <ElButton style="width: 100%;justify-content:left" text bg size="small" v-on:click="onClickItem"
            :disabled="!internalValue.isValid" :icon="internalValue.isValid ? IconLink : IconUnlink">
            {{ internalValue.isValid ? `${internalValue.nodeName}.${internalValue.componentName}` : "null" }}</ElButton>
    </div>
</template>

<style lang="css"></style>