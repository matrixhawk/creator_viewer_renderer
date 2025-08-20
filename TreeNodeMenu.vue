<template>
    <ElDropdown trigger="click">
        <IconMore class="el-icon--right" :size="18"></IconMore>
        <template #dropdown>
            <ElDropdownMenu>
                <ElDropdownItem>
                    删除
                </ElDropdownItem>
            </ElDropdownMenu>
        </template>
    </ElDropdown>
</template>

<script setup lang="ts">
import { ElDropdown, ElDropdownItem, ElDropdownMenu } from 'element-plus';
import IconMore from './components/property/custom-icons/icon-more.vue';


</script>