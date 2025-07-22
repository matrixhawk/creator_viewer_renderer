<script setup lang="ts">
import { ElInput } from 'element-plus';
import { onMounted } from 'vue';
import { ClientBridge } from '../../../CreatorViewerMiddleware';


const props = defineProps<{ modelValue: IAssetTypeData, uuid: string, propName: string }>();
onMounted(() => {
    // console.log(props);
});

function onInput(value: string) {
    ClientBridge.modifyTargetProp(props.uuid, props.propName, value);
}

</script>

<template>
    <ElInput size="default" :autosize="{ minRows: 1, maxRows: 3 }" type="textarea" v-model="modelValue.assetName"
        @input="onInput" disabled></ElInput>
</template>

<style lang="css"></style>