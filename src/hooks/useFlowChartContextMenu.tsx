import { useState, useCallback } from 'react';
import { useReactFlow } from 'reactflow';

import { FlowNode } from '@domain/flow.ts';
import { StepType } from '@components/FlowManagment/FlowChart/types';

const NODE_MENU_OPEN_CLASS = 'node-menu-open';

function useFlowChartContextMenu() {
  const { getNode } = useReactFlow();

  const [nodeElement, setNodeElement] = useState<HTMLElement | null>(null);
  const [flowNode, setFlowNode] = useState<FlowNode | null>(null);

  const onPaneClick = useCallback(() => {
    nodeElement && nodeElement.classList.remove(NODE_MENU_OPEN_CLASS);
    setFlowNode(null);
    setNodeElement(null);
  }, [setFlowNode, setNodeElement, nodeElement]);

  const onNodeContextMenu = useCallback(
    (event: React.MouseEvent) => {
      event.preventDefault();

      const targetElement = event.currentTarget as HTMLElement;
      const nodeId = targetElement.dataset.id;

      if (nodeId) {
        const node = getNode(nodeId);
        if (node?.type === StepType.START || node?.type === StepType.END)
          return;
        targetElement.classList.add(NODE_MENU_OPEN_CLASS);
        setNodeElement(targetElement);
        setFlowNode(getNode(nodeId) as FlowNode);
      }
    },
    [setFlowNode]
  );

  return { flowNode, setFlowNode, nodeElement, onPaneClick, onNodeContextMenu };
}

export default useFlowChartContextMenu;
