<script setup lang="ts">
import { ElIcon, ElInput, ElText } from 'element-plus';
import { onMounted } from 'vue';
import { ClientBridge } from '../../../CreatorViewerMiddleware';
import IconPackage from '../custom-icons/icon-package.vue';
import IconPicture from '../custom-icons/icon-picture.vue';


const props = defineProps<{ modelValue: IAssetTypeData, uuid: string, propName: string }>();
onMounted(() => {
    // console.log(props);
});

function getTypeIcon(value: string) {
    if(value == "cc.SpriteFrame") {
        return IconPicture;
    }
    return IconPackage
}



</script>

<template>
    <ElText style="align-items: center;"><component :size="26" :is="getTypeIcon(props.modelValue.className)"> </component>{{  props.modelValue.assetName }}</ElText>
</template>

<style lang="css"></style>