import mitt from 'mitt'

type Events = {
  'highlight-node': string // UUID 类型
}

export const eventBus = mitt<Events>();