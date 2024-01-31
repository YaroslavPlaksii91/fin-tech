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

interface CustomeHandlerProps extends HandleProps {
  connectionLimit: number;
  style?: React.CSSProperties;
}

const CustomHandle = ({ connectionLimit, ...props }: CustomeHandlerProps) => {
  const { nodeInternals, edges } = useStore(selector);
  const nodeId = useNodeId();

  const isHandleConnectable = useMemo(() => {
    if (nodeId) {
      const node = nodeInternals.get(nodeId) as Node;

      const outputEdges = edges.filter((edg) => edg.source === node.id);

      const connectedEdges = getConnectedEdges([node], outputEdges);

      return connectedEdges.length < connectionLimit;
    }
    return true;
  }, [nodeInternals, edges, nodeId, connectionLimit]);

  return <Handle {...props} isConnectable={isHandleConnectable}></Handle>;
};

export default CustomHandle;
