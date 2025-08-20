<template>
    <ElCollapse v-model="propCollapseActiveNames" expand-icon-position="left" v-for="(item, index) in items" :key="index">
        <ViewerPropGroup :prop-data="item"></ViewerPropGroup>
    </ElCollapse>
</template>

<script setup lang="ts">
import { onMounted, provide, ref } from 'vue';
import ViewerPropGroup from './ViewerPropGroup.vue';
import { ElCollapse } from 'element-plus';
import { propCollapseActiveNames } from '../../CreatorViewerMiddleware';

const props = defineProps({
    items: {
        type: Array as () => Array<ICCObjectPropGroup>,
        required: true
    }
})

const propNameWidth = ref(120);
const propResizing = ref(false);

provide('propNameWidth', propNameWidth);
provide('propResizing', propResizing);

</script>

<style>

.el-collapse {
    --el-collapse-header-height : 28px;
}

.el-collapse-item__title {
    height: 28px;
}

.el-collapse-item__header {
    background-color: rgba(212, 212, 212, 0.253) !important;
    box-sizing: border-box;
    
}

.el-collapse-item__content {
    padding-bottom: 0px;
}

</style>