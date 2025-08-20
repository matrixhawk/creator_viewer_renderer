<template>
  <ElCollapseItem :title="props.propData.type == 'node' ? props.propData.name : props.propData.name"
    :name="props.propData.uuid">
    <template #title="{ isActive }">
      <div :class="['title-wrapper', { 'is-active': isActive }]">
        <ElCheckbox class="node-checkbox" @click.stop v-model="checkboxModel" @change="onCheckChange"></ElCheckbox>
                <ElIcon @click.stop @click="onClickPrintTarget()" size="large" >
          <component :is="getIconByNodeType(props.propData.type)"></component>
        </ElIcon>
        <span>{{ props.propData.type == 'node' ? `Node<${props.propData.name}>` : props.propData.name }}</span>
      </div>
    </template>
    <div v-for="(item, index) in propData.props.filter(prop => prop.key !== '_name' && prop.key !== '_enabled')"
      :key="index">
      <ViewerPropBase :vprops="{ propName: item.key, index: index }">
        <component :is="getComponent(item.type)" v-bind="typeof item.value === 'object' ? item.value : {}"
          v-model="item.value" :uuid="propData.uuid" :propName="item.key" />
      </ViewerPropBase>
    </div>
  </ElCollapseItem>
</template>

<script setup lang="ts">
import { ElCheckbox, ElCollapseItem, ElIcon } from 'element-plus';
import { computed, inject, provide, ref } from 'vue';
import { ClientBridge, isTrackedNodeActive } from '../../CreatorViewerMiddleware';
import IconCode from './custom-icons/icon-code.vue';
import Package from './custom-icons/icon-package.vue';
import ViewerPropAsset from './prop-components/ViewerPropAsset.vue';
import ViewerPropBase from './prop-components/ViewerPropBase.vue';
import ViewerPropBoolean from './prop-components/ViewerPropBoolean.vue';
import ViewerPropColor from './prop-components/ViewerPropColor.vue';
import ViewerPropComponent from './prop-components/ViewerPropComponent.vue';
import ViewerPropEnum from './prop-components/ViewerPropEnum.vue';
import ViewerPropInput from './prop-components/ViewerPropInput.vue';
import ViewerPropNode from './prop-components/ViewerPropNode.vue';
import ViewerPropNumInput from './prop-components/ViewerPropNumInput.vue';
import ViewerPropRect from './prop-components/ViewerPropRect.vue';
import ViewerPropSize from './prop-components/ViewerPropSize.vue';
import ViewerPropVec2 from './prop-components/ViewerPropVec2.vue';
import ViewerPropVec3 from './prop-components/ViewerPropVec3.vue';
import ViewerPropVec4 from './prop-components/ViewerPropVec4.vue';
import { getIconByNodeType } from '../../Utils';

const props = defineProps<{ propData: ICCObjectPropGroup }>();

const isChecked = ref(false);

const checkboxModel = computed({
  get() {
    return props.propData.type === 'node' ? isTrackedNodeActive.value : isChecked.value;
  },
  set(val: boolean) {
    if (props.propData.type === 'node') {
      isTrackedNodeActive.value = val;
    } else {
      isChecked.value = val;
    }
  }
});

function onCheckChange(value: boolean) {
  if (props.propData.type == "node") {
    ClientBridge.setNodeActive(props.propData.uuid, value);
  }
  else {
    for (const prop of props.propData.props) {
      if (prop.key == "_enabled") {
        isChecked.value = value;
        ClientBridge.modifyTargetProp(props.propData.uuid, '_enabled', value);
        break;
      }
    }
  }
}

function onClickPrintTarget() {
  ClientBridge.printTargetByUuid(props.propData.uuid);
}

isChecked.value = false;
function refreshCheckedStatus() {
  if (props.propData.type == "node") {
    isChecked.value = true;
  }
  else {
    for (const prop of props.propData.props) {
      if (prop.key == "_enabled") {
        isChecked.value = prop.value;
        break;
      }
    }
  }
}
refreshCheckedStatus();

const propNameWidth = inject('propNameWidth', ref(120));
const propResizing = inject('propResizing', ref(false));

provide('propNameWidth', propNameWidth);
provide('propResizing', propResizing);

const iconMap: Record<string, any> = {
  "node": Package,
  "component": IconCode,
}

function getComponent(type: cvSupportType) {
  if (type === 'string') return ViewerPropInput;
  if (type === 'number') return ViewerPropNumInput;
  else if (type === 'Vec3') return ViewerPropVec3;
  else if (type === 'Vec2') return ViewerPropVec2;
  else if (type === 'Vec4') return ViewerPropVec4;
  else if (type === 'Color') return ViewerPropColor;
  else if (type === 'Enum') return ViewerPropEnum;
  else if (type === 'boolean') return ViewerPropBoolean;
  else if (type === 'Size') return ViewerPropSize;
  else if (type === 'Rect') return ViewerPropRect;
  else if (type === 'Asset') return ViewerPropAsset;
  else if (type === 'Node') return ViewerPropNode;
  else if (type === 'Component') return ViewerPropComponent;

  return ViewerPropInput;
}

</script>

<style lang="css">
.property-row {
  display: flex;
  align-items: center;
  padding: 4px 0;
  position: relative;
}

.title-wrapper {
  display: flex;
  align-items: center;
  width: 100%;
  gap: 4px;
  position: relative;
  flex: 1;
  height: 28px;
}

.node-checkbox>.el-checkbox__inner {
  border-color: rgb(121, 121, 121) !important;
  height: 26px !important;
}
</style>