import { Handle, Position, NodeProps } from 'reactflow';

import { StepType } from '../types';

import styles from './style.module.scss';

import CalculatorIcon from '@icons/calculator.svg';
import BlocksIcon from '@icons/blocks.svg';
import LineChartDotsSquareIcon from '@icons/lineChartDotsSquare.svg';
import { NodeData, DecisionTableData } from '@domain/flow';
import { NO_TAG_LABEL } from '@constants/common';
import { theme } from '@theme';

const RectangleNode: React.FC<NodeProps<NodeData & DecisionTableData>> = ({
  data
}) => (
  <div id={data.stepId} className={styles['node-container']}>
    <Handle type="source" position={Position.Right} />
    <div className={styles['node-header']}>
      {data.stepType === StepType.CALCULATION && (
        <CalculatorIcon color={theme.palette.primary.main} />
      )}
      {data.stepType === StepType.DECISION_TABLE && (
        <BlocksIcon color={theme.palette.primary.main} />
      )}
      {data.stepType === StepType.DECISION_TABLE && (
        <BlocksIcon color={theme.palette.primary.main} />
      )}
      {data.stepType === StepType.SUBFLOW && (
        <LineChartDotsSquareIcon color={theme.palette.primary.main} />
      )}
      <div>
        <p className={styles['node-tag']}>{data?.tag || NO_TAG_LABEL}</p>
        <p className={styles['node-label']}>{data.name}</p>
      </div>
    </div>
    <Handle type="target" position={Position.Left} />
  </div>
);

export default RectangleNode;
