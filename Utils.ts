import { h } from "vue";
import NodeTypeIconButton from './components/property/custom-icons/tree_nodes/node-type-icon-button.vue';
import NodeTypeIconCamera from './components/property/custom-icons/tree_nodes/node-type-icon-camera.vue';
import NodeTypeIconCanvas from './components/property/custom-icons/tree_nodes/node-type-icon-canvas.vue';
import NodeTypeIconEditBox from './components/property/custom-icons/tree_nodes/node-type-icon-edit-box.vue';
import NodeTypeIconGraphics from './components/property/custom-icons/tree_nodes/node-type-icon-graphics.vue';
import NodeTypeIconImage from './components/property/custom-icons/tree_nodes/node-type-icon-image.vue';
import NodeTypeIconLabel from './components/property/custom-icons/tree_nodes/node-type-icon-label.vue';
import NodeTypeIconLayout from './components/property/custom-icons/tree_nodes/node-type-icon-layout.vue';
import NodeTypeIconMask from './components/property/custom-icons/tree_nodes/node-type-icon-mask.vue';
import NodeTypeIconNode from './components/property/custom-icons/tree_nodes/node-type-icon-node.vue';
import NodeTypeIconPageView from './components/property/custom-icons/tree_nodes/node-type-icon-page-view.vue';
import NodeTypeIconParticle from './components/property/custom-icons/tree_nodes/node-type-icon-particle.vue';
import NodeTypeIconProgress from './components/property/custom-icons/tree_nodes/node-type-icon-progress.vue';
import NodeTypeIconRichEdit from './components/property/custom-icons/tree_nodes/node-type-icon-rich-edit.vue';
import NodeTypeIconScene from './components/property/custom-icons/tree_nodes/node-type-icon-scene.vue';
import NodeTypeIconScrollView from './components/property/custom-icons/tree_nodes/node-type-icon-scroll-view.vue';
import NodeTypeIconSkeleton2D from './components/property/custom-icons/tree_nodes/node-type-icon-skeleton2D.vue';
import NodeTypeIconSlider from './components/property/custom-icons/tree_nodes/node-type-icon-slider.vue';
import NodeTypeIconTiledmap from './components/property/custom-icons/tree_nodes/node-type-icon-tiledmap.vue';
import NodeTypeIconToggleGroup from './components/property/custom-icons/tree_nodes/node-type-icon-toggle-group.vue';
import NodeTypeIconToggle from './components/property/custom-icons/tree_nodes/node-type-icon-toggle.vue';
import NodeTypeIconTransform from './components/property/custom-icons/tree_nodes/node-type-icon-transform.vue';
import NodeTypeIconVideoPlayer from './components/property/custom-icons/tree_nodes/node-type-icon-video-player.vue';
import NodeTypeIconWebView from './components/property/custom-icons/tree_nodes/node-type-icon-web-view.vue';
import NodeTypeIconWidget from './components/property/custom-icons/tree_nodes/node-type-icon-widget.vue';
import NodeTypeIconComponent from "./components/property/custom-icons/tree_nodes/node-type-icon-component.vue";

export function getIconByNodeType(type: NodeType) {
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
        case 'graphics': return h(NodeTypeIconGraphics, { size: 18, color: "#00a897" });
        case 'scene': return h(NodeTypeIconScene, { size: 16, color: "#f0ad4e" });
        case 'scroll_view': return h(NodeTypeIconScrollView, { size: 18, color: "#34d399" });
        case 'progress_bar': return h(NodeTypeIconProgress, { size: 18, color: "#34d399" });
        case "component": return h(NodeTypeIconComponent, { size: 18, color: "#409eff" });;
    }

    return h(NodeTypeIconImage, { size: 16, color: "#f286c4" });
}