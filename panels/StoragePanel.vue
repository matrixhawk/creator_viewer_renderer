<template>
    <div style="display: flex; flex-direction: column; height: 100%; row-gap: 5px;">
        <div style="height: 25px; display: flex; flex-direction: row-reverse; column-gap: 10px;padding-right: 10px;">

            <ElButton type="success" style="height: 25px;">
                <span style="color: #194D00; font-weight: bold">保存</span>
            </ElButton>
            <ElButton @click="onClickPullStorage()" type="warning" style="height: 25px;">
                <span style="color: #4E330A; font-weight: bold">刷新</span>
            </ElButton>
        </div>
        <div class="vue-jsoneditor" ref="editorEl" style="min-height: 0;"></div>
    </div>
</template>

<script lang="ts" setup>
import { createJSONEditor, JsonEditor } from 'vanilla-jsoneditor';
import { onBeforeUnmount, onMounted, onUpdated, ref, watch } from 'vue';
import { ClientBridge, clientStorageDatas } from '../CreatorViewerMiddleware';

watch(clientStorageDatas,()=>{
    editor.updateProps({
        content : {
            json : clientStorageDatas.value
        }
    })
}, { deep : true})

const supportedPropNames = [
    'content',
    'selection',
    'readOnly',
    'indentation',
    'tabSize',
    'mode',
    'mainMenuBar',
    'navigationBar',
    'statusBar',
    'askToFormat',
    'escapeControlCharacters',
    'escapeUnicodeCharacters',
    'flattenColumns',
    'parser',
    'validator',
    'validationParser',
    'pathParser',
    'queryLanguages',
    'queryLanguageId',
    'onChangeQueryLanguage',
    'onChange',
    'onRenderValue',
    'onClassName',
    'onRenderMenu',
    'onRenderContextMenu',
    'onChangeMode',
    'onSelect',
    'onError',
    'onFocus',
    'onBlur',
]
const supportedPropNamesSet = new Set(supportedPropNames)

function filterProps(props, prevProps) {
    return Object.fromEntries(
        Object.entries(props)
            .filter(([key, value]) => supportedPropNamesSet.has(key))
            .filter(([key, value]) => value !== prevProps[key])
    )
}

// ====== setup 逻辑 ======
const props = defineProps<{
    content?: any
    selection?: any
    readOnly?: boolean
    indentation?: number
    tabSize?: number
    mode?: string
    mainMenuBar?: boolean
    navigationBar?: boolean
    statusBar?: boolean
    askToFormat?: boolean
    escapeControlCharacters?: boolean
    escapeUnicodeCharacters?: boolean
    flattenColumns?: boolean
    parser?: Function
    validator?: Function
    validationParser?: Function
    pathParser?: Function
    queryLanguages?: any
    queryLanguageId?: string
    onChangeQueryLanguage?: Function
    onChange?: Function
    onRenderValue?: Function
    onClassName?: Function
    onRenderMenu?: Function
    onRenderContextMenu?: Function
    onChangeMode?: Function
    onSelect?: Function
    onError?: Function
    onFocus?: Function
    onBlur?: Function
}>()


const editorEl = ref(null)
let editor : JsonEditor = null
let prevProps = {}

onMounted(() => {
    const initProps = filterProps(props, {})
    prevProps = initProps
    editor = createJSONEditor({
        target: editorEl.value,
        props: [
            {
                mode: "table"
            }
        ]
    })
    console.log('create editor', editor, initProps)
})

onUpdated(() => {
    const updatedProps = filterProps(props, prevProps)
    if (Object.keys(updatedProps).length > 0) {
        console.log('update props', updatedProps)
        editor.updateProps(updatedProps)
        prevProps = { ...prevProps, ...updatedProps }
    }
})

onBeforeUnmount(() => {
    if (editor) {
        console.log('destroy editor')
        editor.destroy()
        editor = null
    }
})

function onClickPullStorage() {
    ClientBridge.pullClientStorage();
}

</script>

<style>
.vue-jsoneditor {
    flex: 1;
    --jse-theme-color: #757575;
    --jse-theme-color-highlight: #467cd2;
    --jse-background-color: #1e1e1e;
    --jse-text-color: #d4d4d4;
    --jse-main-border: 1px solid #4f4f4f;
    --jse-menu-color: #fff;
    --jse-modal-background: #2f2f2f;
    --jse-modal-overlay-background: rgba(0, 0, 0, 0.5);
    --jse-modal-code-background: #2f2f2f;
    --jse-panel-background: #333333;
    --jse-panel-background-border: 1px solid #464646;
    --jse-panel-color: var(--jse-text-color);
    --jse-panel-color-readonly: #737373;
    --jse-panel-border: 1px solid #3c3c3c;
    --jse-panel-button-color-highlight: #e5e5e5;
    --jse-panel-button-background-highlight: #464646;
    --jse-navigation-bar-background: #656565;
    --jse-navigation-bar-background-highlight: #7e7e7e;
    --jse-navigation-bar-dropdown-color: var(--jse-text-color);
    --jse-context-menu-background: #4b4b4b;
    --jse-context-menu-background-highlight: #595959;
    --jse-context-menu-separator-color: #595959;
    --jse-context-menu-color: var(--jse-text-color);
    --jse-context-menu-button-background: #737373;
    --jse-context-menu-button-background-highlight: #818181;
    --jse-context-menu-button-color: var(--jse-context-menu-color);
    --jse-key-color: #9cdcfe;
    --jse-value-color: var(--jse-text-color);
    --jse-value-color-number: #b5cea8;
    --jse-value-color-boolean: #569cd6;
    --jse-value-color-null: #569cd6;
    --jse-value-color-string: #ce9178;
    --jse-value-color-url: #ce9178;
    --jse-delimiter-color: #949494;
    --jse-edit-outline: 2px solid var(--jse-text-color);
    --jse-selection-background-color: #464646;
    --jse-selection-background-light-color: #333333;
    --jse-hover-background-color: #343434;
    --jse-collapsed-items-background-color: #333333;
    --jse-collapsed-items-selected-background-color: #565656;
    --jse-collapsed-items-link-color: #b2b2b2;
    --jse-collapsed-items-link-color-highlight: #ec8477;
    --jse-search-match-color: #724c27;
    --jse-search-match-outline: 1px solid #966535;
    --jse-search-match-active-color: #9f6c39;
    --jse-search-match-active-outline: 1px solid #bb7f43;
    --jse-tag-background: #444444;
    --jse-tag-color: #bdbdbd;
    --jse-input-background: #3d3d3d;
    --jse-input-border: var(--jse-main-border);
    --jse-button-background: #808080;
    --jse-button-background-highlight: #7a7a7a;
    --jse-button-color: #e0e0e0;
    --jse-a-color: #55abff;
    --jse-a-color-highlight: #4387c9;
    --background: #3d3d3d;
    --border: 1px solid #4f4f4f;
    --listBackground: #3d3d3d;
    --itemHoverBG: #505050;
    --multiItemBG: #5b5b5b;
    --inputColor: #d4d4d4;
    --multiClearBG: #8a8a8a;
    --listShadow: 0 2px 6px 0 rgba(0, 0, 0, 0.24);
    --jse-color-picker-background: #656565;
    --jse-color-picker-border-box-shadow: #8c8c8c 0 0 0 1px;


}

.vue-jsoneditor .jse-header .svelte-1y24war {
        background: #757575;
}

.jse-table-cell-gutter {
    background: #ffffff1f !important;
}

.jse-table-cell-header {
    background: #ffffff2f !important;
}

</style>