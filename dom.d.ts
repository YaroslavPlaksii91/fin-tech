import { FlowNode } from './src/domain/flow';
import {
  CUSTOM_FLOW_EVENT_DELETE,
  CUSTOM_FLOW_EVENT_RENAME,
  CUSTOM_FLOW_EVENT_DUPLICATE
} from './src/components/FlowManagment/FlowChart/constants';
interface CustomEventMap {
  [CUSTOM_FLOW_EVENT_DELETE]: CustomEvent<{
    subFlowId: string;
    deleteNodes: FlowNode[];
  }>;
  [CUSTOM_FLOW_EVENT_RENAME]: CustomEvent<{
    updatedNode: FlowNode;
    subFlowId: string;
  }>;
  [CUSTOM_FLOW_EVENT_DUPLICATE]: CustomEvent<{
    newNode: FlowNode;
    subFlowId: string;
  }>;
}
declare global {
  interface Document {
    addEventListener<K extends keyof CustomEventMap>(
      type: K,
      listener: (this: Document, ev: CustomEventMap[K]) => void
    ): void;
    removeEventListener<K extends keyof CustomEventMap>(
      type: K,
      listener: (this: Document, ev: CustomEventMap[K]) => void
    ): void;
    dispatchEvent<K extends keyof CustomEventMap>(ev: CustomEventMap[K]): void;
  }
}

export {};
