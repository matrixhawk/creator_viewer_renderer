<template>
    <div ref="containerRef" style="width: 100%;height: 100%;">
    <el-auto-resizer >
        <template #default="{ height, width }">
            <ElTableV2 :columns="columns" :estimated-row-height="40" :data="data" :width="width" :height="height" />
        </template>
    </el-auto-resizer>
    </div>

</template>

<script setup lang="tsx">
import { Column, ElButton, ElTableV2, TableV2FixedDir, ElTag } from 'element-plus';
import { onMounted, ref } from 'vue';

let resizeObserver: ResizeObserver | null = null;
const containerRef = ref<HTMLElement | null>(null);

onMounted(()=>{
  if (containerRef.value) {
    resizeObserver = new ResizeObserver(() => {
      if (containerRef.value) {
        const sourceValue = [...data.value];
        data.value.length = 0;
        data.value.push(...sourceValue);
      }
    })
    resizeObserver.observe(containerRef.value)
  }
})

const longText =
  'Quaerat ipsam necessitatibus eum quibusdam est id voluptatem cumque mollitia.'
const midText = 'Corrupti doloremque a quos vero delectus consequatur.'
const shortText = 'Eius optio fugiat.'

const textList = [shortText, midText, longText]
let id = 1;
const dataGenerator = () => ({
  id: `random-${++id}`,
  name: 'Tom',
  date: '2016-05-03',
  description: textList[Math.floor(Math.random() * 3)],
})

const data = ref(
  Array.from({ length: 200 })
    .map(dataGenerator)
    .sort((a, b) => (a.name > b.name ? 1 : -1))
)

const columns: Column<any>[] = [
  {
    key: 'id',
    title: 'Id',
    dataKey: 'id',
    width: 150,
    sortable: true,
    fixed: TableV2FixedDir.LEFT,
  },
  {
    key: 'name',
    title: 'Name',
    dataKey: 'name',
    width: 150,
    align: 'center',
    cellRenderer: ({ cellData: name }) => <ElTag>{name}</ElTag>,
  },
  {
    key: 'description',
    title: 'Description',
    dataKey: 'description',
    width: 150,
    cellRenderer: ({ cellData: description }) => (
      <div style="padding: 10px 0;">{description}</div>
    ),
    flexGrow : 1
  },
  {
    key: 'operations',
    title: 'Operations',
    cellRenderer: () => (
      <>
        <ElButton size="small">Edit</ElButton>
        <ElButton size="small" type="danger">
          Delete
        </ElButton>
      </>
    ),
    width: 150,
    align: 'center',
  },
]


</script>

<style>
</style>