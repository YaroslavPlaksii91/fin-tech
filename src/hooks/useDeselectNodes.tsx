import { useEffect } from 'react';
import { useStoreApi } from 'reactflow';

export const useDeselectNodes = () => {
  const reactFlowApi = useStoreApi();
  const { addSelectedNodes } = reactFlowApi.getState();

  useEffect(() => addSelectedNodes([]), []);
};
