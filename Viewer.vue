<script setup lang="ts">
import { ElButton, ElContainer, ElFooter, ElHeader, ElInput, ElMain, ElSplitter, ElSplitterPanel, ElTabPane, ElTabs, ElText } from 'element-plus';
import { onMounted, provide, ref, watch } from 'vue';
import ViewerPropCollapse from './components/property/ViewerPropCollapse.vue';
import { trackPropGroupDatas, treeRef, viewerChannel } from './CreatorViewerMiddleware';
import TestTree from './TestTree.vue';
import IconEyeOpen from './components/property/custom-icons/icon-eye-open.vue';
import IconFilter from './components/property/custom-icons/icon-filter.vue';
import IconPinia from './components/property/custom-icons/icon-pinia.vue';
import StoragePanel from './panels/StoragePanel.vue';

const expandNodes = ref<string[]>([]);

const treeFilterText = ref("");

provide('treeFilterText', treeFilterText);

const listeningPort = ref("等待监听端口...");
onMounted(async () => {
    const [success, port] = await viewerChannel.tryStartListener();
    if (success) {
        listeningPort.value = `已经开启监听端口${port}`;
    }
})

const expandAll = ref(false);
function onClickExpandAll() {
    if (!expandAll.value) {
        expandNodes.value.length = 0;
        treeRef.value?.store._getAllNodes().forEach((node) => {
            if (!expandNodes.value.includes(node.data.uuid)) expandNodes.value.push(node.data.uuid);
            node.expand();
        })
    }
    else {
        expandNodes.value.length = 0;
        treeRef.value?.store._getAllNodes().forEach((node) => {
            node.collapse();
        })
    }

    expandAll.value = !expandAll.value;
}

</script>

<template>
    <div
        style="height: 100%; box-shadow: var(--el-border-color-light) 0px 0px 10px;display: flex; flex-direction: column;">
        <ElContainer style="height:100%;">
            <!-- <ElHeader>
                <div style="display: flex; flex-direction: row;padding:10px;column-gap: 5px;">
                    <ElText>{{ listeningPort }}</ElText>
                    <ElButton @click="onClickExpandAll">{{ expandAll ? "展开" : "收起" }}</ElButton>
                </div>
            </ElHeader> -->
            <ElMain style=" display: flex; padding: 0px 0px 0px 0px;border-bottom: 1px solid rgb(121, 121, 121);">
                <ElTabs tab-position="top" type="border-card" class="demo-tabs" style="width: 100%;">
                    <ElTabPane style="display: flex; flex-direction: column;">
                        <template #label>
                            <IconPinia ></IconPinia>
                            <span class="custom-tabs-label">
                                
                                <span>节点树</span>
                            </span>
                        </template>
                        <div style="display: flex; height: 30px; padding-top: 2px; padding-left: 2px; column-gap: 1px;">
                            <div
                                :style="{ width: `${26}px`, backgroundColor: '#383838', display: 'flex', alignItems: 'center', justifyContent: 'center' }">
                                <IconEyeOpen color="#FFFFFF" size="14" :open="true"></IconEyeOpen>
                            </div>
                            <div
                                :style="{ backgroundColor: '#383838', flex: 1, fontSize: '14px', display: 'flex', alignItems: 'center', paddingLeft: '5px' }">
                                <span style="width: 100px;">节点信息</span>
                                <ElInput style="height: 25px;" flex="1" :prefix-icon="IconFilter"
                                    v-model="treeFilterText" placeholder="输入节点名称" />
                                <ElButton>展开</ElButton>
                            </div>
                        </div>
                        <ElSplitter layout="vertical">
                            <ElSplitterPanel>
                                <TestTree></TestTree>
                            </ElSplitterPanel>
                            <ElSplitterPanel>
                                <ViewerPropCollapse :items="trackPropGroupDatas" />
                            </ElSplitterPanel>
                        </ElSplitter>
                    </ElTabPane>
                                        <ElTabPane style="display: flex; flex-direction: column;">
                        <template #label>
                            <span class="custom-tabs-label">
                                <span>日志面板</span>
                            </span>
                        </template>
                    </ElTabPane>
                    <ElTabPane style="display: flex; flex-direction: column;">
                        <template #label>
                            <span class="custom-tabs-label">
                                <span>存储</span>
                            </span>
                        </template>
                        <StoragePanel></StoragePanel>
                    </ElTabPane>
                </ElTabs>
            </ElMain>
            <ElFooter height="35px"></ElFooter>
        </ElContainer>
    </div>
</template>

<style>
.el-tabs {
    margin-top: 3px;
    display: flex;
    --el-tabs-header-height: 30px;
}

.demo-tabs .el-tab-pane {
    height: 100%;
}

.demo-tabs .el-tabs__content {
    padding: 3px;
}

/* .demo-tabs .custom-tabs-label .el-icon {
    vertical-align: middle;
}

.demo-tabs .custom-tabs-label span {
    vertical-align: middle;
    margin-left: 0px;
} */

.checkbox-active {
    --el-checkbox-checked-bg-color: #8c9dad;
    /* 蓝色 */
    --el-checkbox-checked-input-border-color: #8c939b;
}

.checkbox-inactive {
    --el-checkbox-checked-bg-color: #888888;
    /* 灰色 */
    --el-checkbox-checked-input-border-color: #888888;
}

.el-tree-node__content {
    transition: background-color 0.4s;
    --el-tree-node-content-height: 20px;
    font-size: 13px;
}

.highlight-row>.el-tree-node__content {
    background-color: #ff9d34ae;
    transition: background-color 0.2s;
}
</style>