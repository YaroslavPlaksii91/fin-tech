import { useState, useCallback } from 'react';
import { useReactFlow } from 'reactflow';

import { FlowNode } from '@domain/flow.ts';

function useFlowChartContextMenu() {
  const { getNode } = useReactFlow();

  const [nodeElement, setNodeElement] = useState<HTMLElement | null>(null);
  const [flowNode, setFlowNode] = useState<FlowNode | null>(null);

  const onPaneClick = useCallback(() => {
    setFlowNode(null);
    setNodeElement(null);
  }, [setFlowNode, setNodeElement]);

  const onNodeContextMenu = useCallback(
    (event: React.MouseEvent) => {
      event.preventDefault();

      const targetElement = event.currentTarget as HTMLElement;
      const nodeId = targetElement.dataset.id;

      if (nodeId) {
        setNodeElement(targetElement);
        setFlowNode(getNode(nodeId) as FlowNode);
      }
    },
    [setFlowNode]
  );

  return { flowNode, setFlowNode, nodeElement, onPaneClick, onNodeContextMenu };
}

export default useFlowChartContextMenu;
