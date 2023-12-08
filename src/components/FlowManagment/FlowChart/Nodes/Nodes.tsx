import { Handle, Position } from 'reactflow';
import { Typography } from '@mui/material';

import {
  StyledDiamond,
  StyledDiamondLabel,
  StyledEndNode,
  StyledRectangle,
  StyledStartNode,
  targetHandDiamondStyle,
  sourceHandDiamondStyle
} from './styled';

import { HexagonOutlinedIcon } from '@components/shared/Icons';

export function StartNode() {
  return (
    <div>
      <Handle type="source" position={Position.Right} />
      <StyledStartNode />
    </div>
  );
}

export function EndNode() {
  return (
    <div>
      <Handle type="target" position={Position.Left} />
      <StyledEndNode />
    </div>
  );
}

export function Calculation() {
  return (
    <StyledRectangle sx={{ display: 'flex', alignItems: 'center' }}>
      <Handle type="source" position={Position.Right} />
      <HexagonOutlinedIcon sx={{ marginRight: '4px' }} />
      <div>
        <Typography variant="caption">Tag</Typography>
        <Typography variant="body2">Calculation</Typography>
      </div>
      <Handle type="target" position={Position.Left} />
    </StyledRectangle>
  );
}

const nodeStyle = {
  width: 80,
  height: 80
};

export function Condition() {
  return (
    <div style={nodeStyle}>
      <Handle
        style={targetHandDiamondStyle}
        type="target"
        position={Position.Left}
      />
      <StyledDiamond />
      <StyledDiamondLabel>
        <Typography variant="body2" fontWeight={600}>
          if/else.
        </Typography>
      </StyledDiamondLabel>
      <Handle
        style={sourceHandDiamondStyle}
        type="source"
        position={Position.Right}
      />
    </div>
  );
}

const championChallenderStyle = {
  border: '1px solid black',
  backgroundColor: '#ffff'
};

export function ChampionChallender() {
  return (
    <div style={championChallenderStyle}>
      <Handle type="target" position={Position.Left} />
      <h5>Champion Chalenger</h5>
      <p>30%</p>
      <p>20%</p>
      <p>50%</p>
      <Handle type="source" position={Position.Right} />
      <Handle type="source" position={Position.Right} id="a" />
      <Handle type="source" position={Position.Right} id="b" />
    </div>
  );
}
