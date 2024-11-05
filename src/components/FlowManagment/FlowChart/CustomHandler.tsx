import { Handle, HandleProps } from 'reactflow';

import { useNodeConnection } from '@hooks/useNodeConnection';

interface CustomHandlerProps extends HandleProps {
  style?: React.CSSProperties;
}

const CustomHandler = ({ ...props }: CustomHandlerProps) => {
  const isConnectable = useNodeConnection('sourceHandle', props.id);

  return <Handle {...props} isConnectable={isConnectable} />;
};

export default CustomHandler;
