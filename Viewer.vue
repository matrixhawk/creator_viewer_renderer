<script setup lang="ts">
import { Filter } from '@element-plus/icons-vue';
import { ElButton, ElCheckbox, ElInput, ElSplitter, ElSplitterPanel, ElText, ElTree, FilterNodeMethodFunction } from 'element-plus';
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import ViewerPropCollapse from './components/property/ViewerPropCollapse.vue';
import { ClientBridge, nodeTreeData, refreshNodeActiveStatus, trackPropGroupDatas, treeRef, viewerChannel } from './CreatorViewerMiddleware';
import { eventBus } from './EventBus';

const expandNodes = ref<string[]>([]);

const listeningPort = ref("等待监听端口...");
onMounted(async () => {
    const [success, port] = await viewerChannel.tryStartListener();
    if (success) {
        listeningPort.value = `已经开启监听端口${port}`;
    }

    eventBus.on('highlight-node', handleHighlight);
    eventBus.on('select-node', handleSelectNode);
})

onBeforeUnmount(() => {
  eventBus.off('highlight-node', handleHighlight);
  eventBus.off('select-node', handleSelectNode);
})

const handleNodeClick = (data) => {
    console.log(data);
    console.log(treeRef.value.getNode(data.uuid))
    ClientBridge.selectNode(data.uuid);
}

const onHandleNodeCheckedChange = (checked: any, data: INodeInfo) => {
    console.log(`on checked`, checked, data);
    ClientBridge.setNodeActive(data.uuid, checked);
    refreshNodeActiveStatus(data, data.parentActive);
}

function allowDropCheck(draggingNode, dropNode, type): boolean {
    if (dropNode.data.name == "platform") return false;
    return true;
}

function allowDragCheck(draggingNode): boolean {
    if (draggingNode.data.name == "platform") return false;
    return true;
}

function onHandleNodeExpand(nodeInfo: INodeInfo) {
    console.log(`on node expand change`, nodeInfo);
    expandNodes.value.push(nodeInfo.uuid);
}

function onHandleNodeCollapse(nodeInfo: INodeInfo) {
    console.log(`on node collapse change`, nodeInfo);
    const index = expandNodes.value.indexOf(nodeInfo.uuid);
    index != -1 && expandNodes.value.splice(index, 1);
}

function onHandleNodeDrop(drapNode) {
    const nodeInfo = drapNode;

    const newNode = treeRef.value.getNode(nodeInfo.data.uuid);
    const newParent = newNode.parent;
    nextTick(() => {
        ClientBridge.setNodeParentOrSiblingIndex(newNode.data.uuid, newParent.data.uuid, newParent.childNodes.indexOf(newNode));
    })
}

function onClickExpandAll() {
    expandNodes.value.length = 0;
    treeRef.value?.store._getAllNodes().forEach((node) => {
        if (!expandNodes.value.includes(node.data.uuid)) expandNodes.value.push(node.data.uuid);
        node.expand();
    })
}

interface Tree {
    [key: string]: any
}

const filterText = ref('')

watch(filterText, (val) => {
    treeRef.value!.filter(val)
})

const filterNode: FilterNodeMethodFunction = (value: string, data: Tree) => {
    if (!value) return true
    //   console.log(data);
    return data.name.includes(value)
}

const defaultProps = {
    children: 'children',
    label: 'name',
    class : getRowClass
}

const highlightTimers = new Map<string, ReturnType<typeof setTimeout>>();

function handleHighlight(nodeId: string) {
    flashHighlight(nodeId);
}

function handleSelectNode(nodeId: string) {
    flashHighlight(nodeId);
    treeRef.value.getNode(nodeId)?.expand(null, true);
    treeRef.value.setCurrentKey(nodeId);
    ClientBridge.selectNode(nodeId);
}

function flashHighlight(nodeId: string, duration = 600) {
  const node = treeRef.value.getNode(nodeId);
  if (!node) return
    console.log(`flashHighlight ${nodeId} `);
  const data = node.data
  data.highlight = true
  treeRef.value.updateKeyChildren(nodeId, node.childNodes.map(n => n.data))

  const nodeDom = treeRef.value.$el.querySelector(`.el-tree-node[data-key="${nodeId}"]`) as HTMLElement;
  if(nodeDom) {
    nodeDom.scrollIntoView({ behavior: 'auto', block: 'center' })
  }

  

  // 如果之前有高亮定时器，先清除
  if (highlightTimers.has(nodeId)) {
    clearTimeout(highlightTimers.get(nodeId))
  }

  // 设置新的定时器
  const timer = setTimeout(() => {
    data.highlight = false
    treeRef.value.updateKeyChildren(nodeId, node.childNodes.map(n => n.data))
    highlightTimers.delete(nodeId)
  }, duration)

  highlightTimers.set(nodeId, timer)
}

// 用来设置每行的class
function getRowClass(data: any) {
    console.log(`get class ?` , data.highlight);
  return data.highlight ? 'highlight-row' : ''
}

// 暂定类型 Vec3 Vec4 Vec2 Color Number String Enum

</script>

<template style="height: 100%;">
    <div
        style="height: 100%; box-shadow: var(--el-border-color-light) 0px 0px 10px;display: flex; flex-direction: column;">
        <div style="display: flex; flex-direction: row;">
            <ElText>{{ listeningPort }}</ElText>
            <ElButton @click="onClickExpandAll">展开所有</ElButton>
        </div>
        <ElInput :prefix-icon="Filter" v-model="filterText" class="w-60 mb-2" placeholder="输入节点名称" />
        <ElSplitter layout="vertical">
            <ElSplitterPanel>
                <ElTree ref="treeRef" style="width: 100%;" :data="nodeTreeData" :props="defaultProps"
                    :show-checkbox="false" :check-strictly="true" :indent="18" :highlight-current="true"
                    :defaultExpandAll="false" :check-on-click-node="false" :check-on-click-leaf="false"
                    :auto-expand-parent="false" :draggable="true" node-key="uuid" @node-click="handleNodeClick"
                    :allow-drop="allowDropCheck" :allowDrag="allowDragCheck" @node-expand="onHandleNodeExpand"
                    @node-collapse="onHandleNodeCollapse" @node-drop="onHandleNodeDrop"
                    :default-expanded-keys="expandNodes" :filter-node-method="filterNode" empty-text="等待Creator客户端连接" >

                    <template #default="{ node, data }">
                        <ElCheckbox v-model="data.active" @click.stop @change="onHandleNodeCheckedChange($event, data)"
                            :class="data.activeInHierarchy ? 'checkbox-active' : 'checkbox-inactive'" />
                        <span :style="{ color: !data.activeInHierarchy ? 'gray' : 'white' }">
                            {{ node.label }}
                        </span>
                    </template>
                </ElTree>
            </ElSplitterPanel>
            <ElSplitterPanel style="display: flex; flex-direction: column;">
                <ViewerPropCollapse style="display: flex; flex-direction: column;" :items="trackPropGroupDatas" />
            </ElSplitterPanel>
        </ElSplitter>
    </div>
</template>

<style>
.demo-tabs>.el-tabs__content {
    padding: 32px;
    color: #6b778c;
    font-size: 32px;
    font-weight: 600;
}

.demo-panel {
    align-items: center;
    justify-content: center;
    height: 100%;
}

.checkbox-active {
    --el-checkbox-checked-bg-color: #409EFF;
    /* 蓝色 */
    --el-checkbox-checked-input-border-color: #409EFF;
}

.checkbox-inactive {
    --el-checkbox-checked-bg-color: #888888;
    /* 灰色 */
    --el-checkbox-checked-input-border-color: #888888;
}

.el-tree-node__content {
  transition: background-color 0.4s;
}

.highlight-row > .el-tree-node__content {
  background-color: #ff9d34ae;
  transition: background-color 0.2s;
}
</style>