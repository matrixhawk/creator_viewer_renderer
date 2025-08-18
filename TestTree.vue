<template>
    <div style="display: flex; flex-direction: column; row-gap: 3px;">
        <div style="display: flex; height: 25px; padding-top: 2px; padding-left: 2px; column-gap: 1px;">
             <div :style="{ width: `${titleVisibleWidth}px`, backgroundColor : '#383838' , display : 'flex', alignItems : 'center', justifyContent : 'center'}">
                <IconEyeOpen color="#FFFFFF" size="14" :open="true"></IconEyeOpen>
             </div>
             <div :style="{ backgroundColor : '#383838', flex : 1, fontSize:'14px' , display : 'flex', alignItems : 'center', paddingLeft : '5px'}">节点信息</div>
        </div>
        <div class="custom-tree">
            <ElTree :render-content="renderContent" ref="treeRef" style="width: 100%;" :data="nodeTreeData"
                :props="defaultProps" :show-checkbox="false" :check-strictly="true" :indent="18"
                :highlight-current="true" :defaultExpandAll="false" :check-on-click-node="false"
                :check-on-click-leaf="false" :auto-expand-parent="false" :draggable="true" node-key="uuid"
                @node-click="handleNodeClick" :allow-drop="allowDropCheck" :allowDrag="allowDragCheck"
                @node-drop="onHandleNodeDrop" :default-expanded-keys="expandNodes" :filter-node-method="filterNode"
                empty-text="等待Creator客户端连接" :expand-on-click-node="false" />
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ElTree } from 'element-plus';
import { nextTick, ref, VNode } from 'vue';

import type { FilterNodeMethodFunction, RenderContentFunction } from 'element-plus';

import IconEyeOpen from './components/property/custom-icons/icon-eye-open.vue';
import { ClientBridge, nodeTreeData, refreshNodeActiveStatus, treeRef } from './CreatorViewerMiddleware';
import { getIconByNodeType } from './Utils';

const expandNodes = ref<string[]>([]);
const titleVisibleWidth = ref(25);

const defaultProps = {
    children: 'children',
    label: 'name',
    class: getRowClass
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

function allowDragCheck(draggingNode): boolean {
    if (draggingNode.data.name == "platform") return false;
    return true;
}

// 用来设置每行的class
function getRowClass(data: any) {
    return data.highlight ? 'highlight-row' : ''
}

function allowDropCheck(draggingNode, dropNode, type): boolean {
    if (dropNode.data.name == "platform") return false;
    return true;
}

function onHandleNodeDrop(drapNode) {
    const nodeInfo = drapNode;

    const newNode = treeRef.value.getNode(nodeInfo.data.uuid);
    const newParent = newNode.parent;
    nextTick(() => {
        ClientBridge.setNodeParentOrSiblingIndex(newNode.data.uuid, newParent.data.uuid, newParent.childNodes.indexOf(newNode));
    })
}

const onHandleNodeCheckedChange = (checked: boolean, data: INodeInfo) => {
    ClientBridge.setNodeActive(data.uuid, checked);
    refreshNodeActiveStatus(data, data.parentActive);
}


const filterNode: FilterNodeMethodFunction = (value: string, data: Tree) => {
    if (!value) return true
    return data.name.includes(value)
}

interface Tree {
    [key: string]: any
}


// 你原本的处理函数
function onMouseOverTreeItem(data) {
    data.hover = true;
}
function onMouseLeaveTreeItem(data) {
    data.hover = false;
}

const handleNodeClick = (data) => {
	console.log(`on handle node click`, data);
    ClientBridge.selectNode(data.uuid);
}

const renderContent: RenderContentFunction = (h, { node, data, store }) => {
    return [h(
        'div',
        {
            class: 'custom-tree-node',
            onVnodeMounted: (vnode: VNode) => {
                const parentElement = vnode.el.parentElement as HTMLElement;
                if (!parentElement) return;
                const element = parentElement.querySelector('.el-tree-node__expand-icon') as HTMLElement;
                element?.remove();
                parentElement.addEventListener('mouseenter', () => {
                    onMouseOverTreeItem(data);
                });

                parentElement.addEventListener('mouseleave', () => {
                    onMouseLeaveTreeItem(data);
                });
            }
        },
        [
            h(
                'div',
                {
                    class: 'eye-content-node',
                },
                [
                    h(IconEyeOpen, {
                        class: 'icon',
                        size: '14',
                        color: "#ffffff",
                        open: data.active,
                        style: {
                            opacity: data.hover || !data.active || node.isCurrent ? 0.6 : 0,
                            paddingLeft: 5
                        },
                        onClick() {
                            data.active = !data.active;
                            onHandleNodeCheckedChange(data.active, data);
                        }
                    }),
                ]
            ),
            h('div', {
                style: `width : ${titleVisibleWidth.value}px;`
            }),
            h('div', {
                class: {
                    'el-icon': true,
                    'el-tree-node__expand-icon': true,
                    'expandedex': node.expanded,
                },
                style: { pointerEvents: 'auto', transition: 'transform 0.3s ease', display: 'flex', width: '16px', height: '16px' },
                onClick: (e: MouseEvent) => {
                    node.expanded = !node.expanded;
                    if (node.expanded) {
                        onHandleNodeExpand(data as INodeInfo);
                    }
                    else {
                        onHandleNodeCollapse(data as INodeInfo);
                    }

                }
            }, [
                h('svg', {
                    xmlns: 'http://www.w3.org/2000/svg',
                    viewBox: '0 0 1024 1024',
                    display: node.childNodes.length > 0 ? 'block' : 'none',
                    style: {
                        height: '12px',
                        width: '12px',
                    }
                }, [
                    h('path', {
                        fill: '#8d9095',
                        d: 'M384 192v640l384-320.064z', // 示例路径
                    }),
                ])
            ]),
            h(getIconByNodeType(data.type), { style: 'margin-right:5px' }),
            h('span', null, node.label || (data.type == "scene" ? "Unnamed Scene" : "")),
        ]
    )
    ]
}
</script>

<style>
.custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    font-size: 14px;
	height: 23px;
    gap: 3px;
}

.expandedex {
    transform: rotate(90deg);
}

.eye-content-node {
    position: absolute;
    right: 0;
    width: 100%;
    height: 26px;
    display: flex;
    align-items: center;
}

.eye-content-node .icon {
    transition: opacity 0.25s;
}

.el-tree {
  position: relative; /* 给容器定位 */
}

/* 在 .el-tree 下面插入一个伪元素当背景层 */
.el-tree::before {
  content: '';
  position: absolute;
  inset: 0; /* 铺满整个容器 */
  z-index: -10;
  pointer-events: none; /* 不挡鼠标事件 */
  background: repeating-linear-gradient(
    to bottom,
    #0000 0,          /* 黑 */
    #0000 20px,       /* 行高：26px，你根据实际行高调整 */
    #ffffff0A 20px,       /* 白 */
    #ffffff0A 40px
  );
}

</style>