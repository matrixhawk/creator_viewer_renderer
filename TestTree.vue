<template>
    <div style="display: flex; flex-direction: column; row-gap: 3px;">
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
import type { FilterNodeMethodFunction, RenderContentFunction } from 'element-plus';
import { ElTree } from 'element-plus';
import { h, inject, nextTick, onBeforeUnmount, onMounted, ref, VNode, watch } from 'vue';

import IconEyeOpen from './components/property/custom-icons/icon-eye-open.vue';
import { ClientBridge, nodeTreeData, refreshNodeActiveStatus, treeRef } from './CreatorViewerMiddleware';
import { eventBus } from './EventBus';
import { getIconByNodeType } from './Utils';

const expandNodes = ref<string[]>([]);
const titleVisibleWidth = ref(25);
const treeFilterText = inject('treeFilterText', ref(""));

const defaultProps = {
    children: 'children',
    label: 'name',
    class: getRowClass
}

watch(treeFilterText, (val) => {
    treeRef.value!.filter(val)
})

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

onMounted(async () => {
    eventBus.on('highlight-node', handleHighlight);
    eventBus.on('select-node', handleSelectNode);
})

onBeforeUnmount(() => {
    eventBus.off('highlight-node', handleHighlight);
    eventBus.off('select-node', handleSelectNode);
})

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

//@ts-ignore
const renderContent: RenderContentFunction = (_, { node, data, store }: { node, data: INodeInfo, store }) => {
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
                    h('div', {
                        style: {
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            width: `${titleVisibleWidth.value}px`
                        }
                    }, [
                        h(IconEyeOpen, {
                            class: 'icon',
                            size: '14',
                            color: "#ffffff",
                            open: data.active,
                            style: {
                                //@ts-ignore
                                opacity: data.hover || !data.active || node.isCurrent ? 0.6 : 0,
                                paddingLeft: 5
                            },
                            onClick(e: MouseEvent) {
                                e.stopPropagation();
                                data.active = !data.active;
                                onHandleNodeCheckedChange(data.active, data as INodeInfo);
                            }
                        }),
                        // h(TreeNodeMenu, {
                        //     style: {
                        //         //@ts-ignore
                        //         opacity: data.hover ? 1 : 0,
                        //         right : 0,
                        //         position : "absolute"
                        //     },
                        //     // onClick() {
                        //     //     data.active = !data.active;
                        //     //     onHandleNodeCheckedChange(data.active, data as INodeInfo);
                        //     // }
                        // }),                        
                    ])
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
                    e.stopPropagation();
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
            h('div', {
                style: {
                    marginRight: "5px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "18px",
                    opacity: data.activeInHierarchy ? 1 : 0.5,
                }
            }, [
                h(getIconByNodeType(data.type)),
            ]),
            h('span', {
                style: {
                    opacity: data.activeInHierarchy ? 1 : 0.5,
                }
            }, node.label || (data.type == "scene" ? "Unnamed Scene" : "")),
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
    position: relative;
    /* 给容器定位 */
}

/* 在 .el-tree 下面插入一个伪元素当背景层 */
.el-tree::before {
    content: '';
    position: absolute;
    inset: 0;
    /* 铺满整个容器 */
    z-index: 1;
    pointer-events: none;
    /* 不挡鼠标事件 */
    background: repeating-linear-gradient(to bottom,
            #0000 0,
            /* 黑 */
            #0000 20px,
            /* 行高：26px，你根据实际行高调整 */
            #ffffff06 20px,
            /* 白 */
            #ffffff06 40px);
}
</style>