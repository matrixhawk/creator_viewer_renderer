<template>
    <div style="display: flex; flex-direction: column; height: 100%; row-gap: 5px;">
        <div style="flex : 1;">
            <CodeEditor border-radius="4px" padding="10px" ref="editor" font-size="14px" value="console.log('hello world')" height="100%" width="100%" :wrap="true" :line-nums="true"></CodeEditor>
        </div>
        <div style="height: 25px; display: flex; flex-direction: row-reverse; column-gap: 10px;padding-right: 10px;">
            <ElButton :onclick="onClickExecute" type="info" style="height: 25px;">
                执行
            </ElButton>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import CodeEditor from './code-editor/CodeEditor.vue';
import { ClientBridge } from '../CreatorViewerMiddleware';
import './code-editor/themes-base16.css'
import './code-editor/themes.css'

const editor = ref(null);

function onClickExecute() {
    ClientBridge.executeCode(editor.value.content);
}

</script>

<style></style>