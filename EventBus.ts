import mitt from 'mitt'

type Events = {
  'highlight-node': string; // UUID 类型
  'select-node' : string;
}

export const eventBus = mitt<Events>();