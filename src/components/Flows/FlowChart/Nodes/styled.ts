import { Box, BoxProps } from '@mui/material';
import { styled } from '@mui/material/styles';

const CircleNode = styled(Box)<BoxProps>(() => ({
  width: '40px',
  height: '40px',
  borderRadius: '50%'
}));

export const StyledStartNode = styled(CircleNode)(() => ({
  background: '#FFB4B4'
}));

export const StyledEndNode = styled(CircleNode)(() => ({
  background: '#ABDCB9'
}));

export const StyledRectangle = styled(Box)(() => ({
  background: '#2E3646',
  padding: '6px 18px',
  borderRadius: '5px',
  color: '#FFFFFF'
}));

export const StyledDiamond = styled(Box)(() => ({
  width: '60px',
  height: '60px',
  transform: 'translate(-50%, -50%) rotate(45deg)',
  background: 'white',
  position: 'absolute',
  left: '50%',
  top: '50%',
  backgroundColor: '#DDCD93'
}));

export const StyledDiamondLabel = styled(Box)(() => ({
  zIndex: 10,
  position: 'relative',
  fontSize: 12,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '100%',
  color: '#2E3646'
}));

export const targetHandDiamondStyle = {
  backgroundColor: '#8FA5BE',
  zIndex: 1
};

export const sourceHandDiamondStyle = {
  backgroundColor: '#50D876',
  zIndex: 1
};
