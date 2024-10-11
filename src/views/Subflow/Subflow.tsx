import { Edge, ReactFlowProvider } from 'reactflow';
import { useCallback, useMemo } from 'react';
import { cloneDeep } from 'lodash';

import {
  addNodeInSubFlow,
  findSubFlow,
  removeNodesAndEdgesInSubFlow,
  updateNodesInSubFlow
} from './utils';

import { FlowNode, IFlow } from '@domain/flow';
import { CustomReactFlowInstance } from '@components/FlowManagment/FlowChart/types';
import { StepContainer } from '@views/styled';
import SubFlowChartEditor from '@components/FlowManagment/FlowChart/FlowChartEditor/SubFlowChartEditor';
import { selectUserInfo } from '@store/auth';
import { useAppSelector } from '@store/hooks';
import { getFullUserName } from '@utils/helpers';
import { updateNodes } from '@store/flow/utils';
import { useDeselectNodes } from '@hooks/useDeselectNodes';

interface SubFlowProps {
  mainFlow: IFlow;
  activeStepId: string;
  resetActiveStepId: () => void;
  rfInstance: CustomReactFlowInstance;
  isViewMode: boolean;
}

const SubFlow: React.FC<SubFlowProps> = ({
  mainFlow,
  rfInstance,
  rfInstance: { getNodes, setNodes },
  activeStepId,
  resetActiveStepId,
  isViewMode
}) => {
  const user = useAppSelector(selectUserInfo);
  const username = getFullUserName(user);
  const mainFlowNodes: FlowNode[] = getNodes();

  // Need to deselect all nodes to prevent deleting a node when pressing Backspace
  useDeselectNodes();

  const subFlow = useMemo(() => {
    const subFlowNode = cloneDeep(findSubFlow(activeStepId, mainFlowNodes));
    if (subFlowNode) {
      return {
        id: subFlowNode.id,
        data: {
          id: subFlowNode.id,
          name: subFlowNode.data.name,
          createdBy: '',
          createdOn: '',
          editedBy: '',
          editedOn: ''
        },
        nodes: subFlowNode.data.nodes || [],
        edges: subFlowNode.data.edges || [],
        viewport: subFlowNode.data.viewport || { x: 0, y: 0, zoom: 1 },
        temporaryVariables: [],
        permanentVariables: []
      };
    }
    return undefined;
  }, [activeStepId, mainFlowNodes.length]);

  const saveSubflow = useCallback((subFlow: IFlow) => {
    const mainFlowNodes: FlowNode[] = getNodes();
    const updatedNodes = updateNodesInSubFlow(mainFlowNodes, subFlow, username);
    setNodes(updatedNodes);
    resetActiveStepId();
  }, []);

  const addNodeAndSyncMainFlow = useCallback(
    (subFlowId: string, newNode: FlowNode, edges: Edge[]) => {
      const mainFlowNodes: FlowNode[] = getNodes();
      const updatedNodes = addNodeInSubFlow(
        mainFlowNodes,
        subFlowId,
        newNode,
        edges
      );
      setNodes(updatedNodes);
    },
    []
  );

  const deleteNodeAndSyncMainFlow = useCallback((deleteNodes: FlowNode[]) => {
    const mainFlowNodes: FlowNode[] = getNodes();
    const updatedNodes = removeNodesAndEdgesInSubFlow(
      mainFlowNodes,
      deleteNodes
    );
    setNodes(updatedNodes);
  }, []);

  const updateNodeNameAndSyncMainFlow = useCallback((updatedNode: FlowNode) => {
    const mainFlowNodes: FlowNode[] = getNodes();
    const updatedNodes = updateNodes(mainFlowNodes, updatedNode);
    setNodes(updatedNodes);
  }, []);

  return (
    // As subFlow is sub instance main flow, it needs own flow provider
    <StepContainer>
      {subFlow && (
        <ReactFlowProvider>
          <SubFlowChartEditor
            mainFlow={mainFlow}
            flow={subFlow}
            isViewMode={isViewMode}
            mainFlowRfInstance={rfInstance}
            setCopyFlow={saveSubflow}
            addNodeAndSyncMainFlow={addNodeAndSyncMainFlow}
            deleteNodeAndSyncMainFlow={deleteNodeAndSyncMainFlow}
            updateNodeNameAndSyncMainFlow={updateNodeNameAndSyncMainFlow}
          />
        </ReactFlowProvider>
      )}
    </StepContainer>
  );
};

export default SubFlow;
