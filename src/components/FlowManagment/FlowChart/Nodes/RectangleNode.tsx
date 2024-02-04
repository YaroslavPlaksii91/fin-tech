import { Handle, Position, NodeProps } from 'reactflow';

import styles from './style.module.scss';

import { HexagonOutlinedIconSvg } from '@components/shared/Icons';
import { NodeData } from '@domain/flow';

const RectangleNode: React.FC<NodeProps<NodeData>> = ({ data }) => (
  <div className={styles['node-rectangle']}>
    <Handle type="source" position={Position.Right} />
    <HexagonOutlinedIconSvg />
    <div>
      <p className={styles['node-tag']}>{data.tag}</p>
      <p className={styles['node-label']}>{data.name}</p>
    </div>
    <Handle type="target" position={Position.Left} />
  </div>
);

export default RectangleNode;
