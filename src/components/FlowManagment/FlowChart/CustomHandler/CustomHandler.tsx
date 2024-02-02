import { useMemo } from 'react';
import {
  getConnectedEdges,
  Handle,
  HandleProps,
  ReactFlowState,
  useNodeId,
  useStore,
  Node
} from 'reactflow';

const selector = (state: ReactFlowState) => ({
  nodeInternals: state.nodeInternals,
  edges: state.edges
});

interface CustomHandlerProps extends HandleProps {
  style?: React.CSSProperties;
}

const CustomHandler = ({ ...props }: CustomHandlerProps) => {
  const { nodeInternals, edges } = useStore(selector);
  const nodeId = useNodeId();

  const isHandleConnectable = useMemo(() => {
    if (nodeId) {
      const node = nodeInternals.get(nodeId) as Node;

      const outputEdges = edges.filter((edg) => edg.source === node.id);

      const connectedEdges = getConnectedEdges([node], outputEdges);

      const isConnected = connectedEdges.some(
        (edg) => edg.sourceHandle === props.id
      );

      return !isConnected;
    }
    return true;
  }, [nodeInternals, edges, nodeId]);

  return <Handle {...props} isConnectable={isHandleConnectable}></Handle>;
};

export default CustomHandler;
