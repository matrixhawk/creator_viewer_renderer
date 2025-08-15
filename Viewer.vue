<script setup lang="ts">
import { Filter } from '@element-plus/icons-vue';
import { ElButton, ElCheckbox, ElContainer, ElFooter, ElHeader, ElInput, ElMain, ElSplitter, ElSplitterPanel, ElText, ElTree, FilterNodeMethodFunction } from 'element-plus';
import { h, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import ViewerPropCollapse from './components/property/ViewerPropCollapse.vue';
import { ClientBridge, nodeTreeData, refreshNodeActiveStatus, trackPropGroupDatas, treeRef, viewerChannel } from './CreatorViewerMiddleware';
import { eventBus } from './EventBus';
import NodeCanvas from './components/property/custom-icons/tree_nodes/node-type-icon-canvas.vue';
import NodeImage from './components/property/custom-icons/tree_nodes/node-type-icon-image.vue';
import NodeTypeIconImage from './components/property/custom-icons/tree_nodes/node-type-icon-image.vue';
import NodeTypeIconCanvas from './components/property/custom-icons/tree_nodes/node-type-icon-canvas.vue';
import NodeTypeIconCamera from './components/property/custom-icons/tree_nodes/node-type-icon-camera.vue';
import NodeTypeIconScene from './components/property/custom-icons/tree_nodes/node-type-icon-scene.vue';
import NodeTypeIconNode from './components/property/custom-icons/tree_nodes/node-type-icon-node.vue';
import NodeTypeIconLabel from './components/property/custom-icons/tree_nodes/node-type-icon-label.vue';
import NodeTypeIconEditBox from './components/property/custom-icons/tree_nodes/node-type-icon-edit-box.vue';
import NodeTypeIconToggle from './components/property/custom-icons/tree_nodes/node-type-icon-toggle.vue';
import NodeTypeIconToggleGroup from './components/property/custom-icons/tree_nodes/node-type-icon-toggle-group.vue';
import NodeTypeIconMask from './components/property/custom-icons/tree_nodes/node-type-icon-mask.vue';
import NodeTypeIconSkeleton2D from './components/property/custom-icons/tree_nodes/node-type-icon-skeleton2D.vue';
import NodeTypeIconTransform from './components/property/custom-icons/tree_nodes/node-type-icon-transform.vue';
import NodeTypeIconLayout from './components/property/custom-icons/tree_nodes/node-type-icon-layout.vue';
import NodeTypeIconTiledmap from './components/property/custom-icons/tree_nodes/node-type-icon-tiledmap.vue';
import NodeTypeIconPageView from './components/property/custom-icons/tree_nodes/node-type-icon-page-view.vue';
import NodeTypeIconScrollView from './components/property/custom-icons/tree_nodes/node-type-icon-scroll-view.vue';
import NodeTypeIconVideoPlayer from './components/property/custom-icons/tree_nodes/node-type-icon-video-player.vue';
import NodeTypeIconWebView from './components/property/custom-icons/tree_nodes/node-type-icon-web-view.vue';
import NodeTypeIconParticle from './components/property/custom-icons/tree_nodes/node-type-icon-particle.vue';
import NodeTypeIconGraphics from './components/property/custom-icons/tree_nodes/node-type-icon-graphics.vue';
import NodeTypeIconRichEdit from './components/property/custom-icons/tree_nodes/node-type-icon-rich-edit.vue';
import NodeTypeIconButton from './components/property/custom-icons/tree_nodes/node-type-icon-button.vue';
import NodeTypeIconWidget from './components/property/custom-icons/tree_nodes/node-type-icon-widget.vue';
import NodeTypeIconSlider from './components/property/custom-icons/tree_nodes/node-type-icon-slider.vue';
import NodeTypeIconProgress from './components/property/custom-icons/tree_nodes/node-type-icon-progress.vue';

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
    class: getRowClass
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
    if (nodeDom) {
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
    return data.highlight ? 'highlight-row' : ''
}


function getIconByNodeType(type: NodeType) {
    console.log(type);
    switch (type) {
        case 'node': return h(NodeTypeIconNode, { size: 16, color: "#f0ad4e" });
        case 'transform': return h(NodeTypeIconTransform, { size: 16, color: "#f0ad4e" });
        case 'slider': return h(NodeTypeIconSlider, { size: 18, color: "#34d399" });
        case 'tiled_map': return h(NodeTypeIconTiledmap, { size: 18, color: "#34d399" });
        case 'widget': return h(NodeTypeIconWidget, { size: 18, color: "#e7ee8b" });
        case 'webview': return h(NodeTypeIconWebView, { size: 18, color: "#34d399" });
        case 'video_player': return h(NodeTypeIconVideoPlayer, { size: 18, color: "#34d399" });
        case 'page_view': return h(NodeTypeIconPageView, { size: 18, color: "#34d399" });
        case 'layout': return h(NodeTypeIconLayout, { size: 18, color: "#34d399" });
        case 'canvas': return h(NodeTypeIconCanvas, { size: 18, color: "#34d399" });
        case 'camera': return h(NodeTypeIconCamera, { size: 16, color: "#f0ad4e" });
        case 'sprite': return h(NodeTypeIconImage, { size: 16, color: "#FFA5F1" });
        case 'particle2D': return h(NodeTypeIconParticle, { size: 16, color: "#42b883" });
        case 'skeleton2D': return h(NodeTypeIconSkeleton2D, { size: 16, color: "#42b883" });
        case 'rich_edit': return h(NodeTypeIconRichEdit, { size: 18, color: "#55c4f1" });
        case 'edit_box': return h(NodeTypeIconEditBox, { size: 18, color: "#55c4f1" });
        case 'label': return h(NodeTypeIconLabel, { size: 18, color: "#55c4f1" });
        case 'toggle': return h(NodeTypeIconToggle, { size: 18, color: "#55c4f1" });
        case 'toggle_group': return h(NodeTypeIconToggleGroup, { size: 20, color: "#55c4f1" });
        case 'mask': return h(NodeTypeIconMask, { size: 20, color: "#55c4f1" });
        case 'button': return h(NodeTypeIconButton, { size: 18, color: "#bf9ee2" });
        case 'graphics': return h(NodeTypeIconGraphics, { size: 18, color: "#55c4f1" });
        case 'scene': return h(NodeTypeIconScene, { size: 16, color: "#f0ad4e" });
        case 'scroll_view': return h(NodeTypeIconScrollView, { size: 18, color: "#34d399" });
        case 'progress_bar': return h(NodeTypeIconProgress, { size: 18, color: "#34d399" });
    }

    return h(NodeTypeIconImage, { size: 16, color: "#f286c4" });
}
// 暂定类型 Vec3 Vec4 Vec2 Color Number String Enum

function onMouseOverTreeItem(data) {
    console.log(data);
}

function renderNode(h, { node, data }) {
  return h(
    'div',
    {
      style: 'display:flex;align-items:center;width:99%',
      onMouseenter: () => onMouseOverTreeItem(data),
    //   onMouseleave: () => onMouseLeaveTreeItem(data)
    },
    [
      h(getIconByNodeType(data.type), { style: 'margin-right:5px' }),
      h('span', { style: { color: !data.activeInHierarchy ? 'gray' : 'white' } }, node.label)
    ]
  );
}

</script>

<template>
    <div style="height: 100%; box-shadow: var(--el-border-color-light) 0px 0px 10px;display: flex; flex-direction: column;">
        <ElContainer style="height:100%;">
            <ElHeader>
                <div style="display: flex; flex-direction: row;padding:10px;column-gap: 5px;">
                    <ElText>{{ listeningPort }}</ElText>
                    <ElButton @click="onClickExpandAll">{{ expandAll ? "展开" : "收起" }}</ElButton>
                </div>
            </ElHeader>
            <ElMain style="padding: 5px 0px 5px 0px;border-top: 1px solid rgb(121, 121, 121);border-bottom: 1px solid rgb(121, 121, 121);">
                <ElSplitter layout="vertical">
                    <ElSplitterPanel>
                        <div
                            style="display: flex; flex-direction: row;padding-left: 10px; padding-right: 10px;column-gap: 5px;">
                            <ElInput :prefix-icon="Filter" v-model="filterText" placeholder="输入节点名称" />
                            <ElButton>展开</ElButton>
                        </div>
                        <ElTree ref="treeRef" style="width: 100%;" :data="nodeTreeData" :props="defaultProps"
                            :show-checkbox="false" :check-strictly="true" :indent="18" :highlight-current="true"
                            :defaultExpandAll="false" :check-on-click-node="false" :check-on-click-leaf="false"
                            :auto-expand-parent="false" :draggable="true" node-key="uuid" @node-click="handleNodeClick"
                            :allow-drop="allowDropCheck" :allowDrag="allowDragCheck" @node-expand="onHandleNodeExpand"
                            @node-collapse="onHandleNodeCollapse" @node-drop="onHandleNodeDrop"
                            :default-expanded-keys="expandNodes" :filter-node-method="filterNode"
                            empty-text="等待Creator客户端连接" :expand-on-click-node="false" :render-content="renderNode">

                            <template #default="{ node, data }">
                                <div v-on:mouseenter="onMouseOverTreeItem(data)" style="display: flex; align-items: center; width: 100%;">
                                    <component :is="getIconByNodeType(data.type)" style="margin-right: 5px;" />
                                    <!-- <ElCheckbox v-model="data.active" @click.stop @change="onHandleNodeCheckedChange($event, data)"
                                :class="data.activeInHierarchy ? 'checkbox-active' : 'checkbox-inactive'" /> -->
                                    <span :style="{ color: !data.activeInHierarchy ? 'gray' : 'white' }">
                                        {{ node.label }}
                                    </span>
                                </div>
                            </template>
                        </ElTree>
                    </ElSplitterPanel>
                    <ElSplitterPanel style="display: flex; flex-direction: column;">
                        <ViewerPropCollapse style="display: flex; flex-direction: column;"
                            :items="trackPropGroupDatas" />
                    </ElSplitterPanel>
                </ElSplitter>
            </ElMain>
            <ElFooter></ElFooter>
        </ElContainer>
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