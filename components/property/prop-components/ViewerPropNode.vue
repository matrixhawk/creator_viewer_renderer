<script setup lang="ts">
import { ElButton, ElInput } from 'element-plus';
import { onMounted } from 'vue';
import { ClientBridge, treeRef } from '../../../CreatorViewerMiddleware';


const props = defineProps<{ modelValue: INodeTypeData, uuid: string, propName: string }>();
onMounted(() => {
    // console.log(props);
});

function onClickItem() {
    treeRef.value.getNode(props.modelValue.nodeUuid)?.expand(null, true);
}



</script>

<template>
    <ElButton v-on:click="onClickItem" type="success">{{modelValue.nodeName}}</ElButton>
</template>

<style lang="css"></style>