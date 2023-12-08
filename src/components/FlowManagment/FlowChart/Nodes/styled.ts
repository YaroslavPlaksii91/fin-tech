import { Box, BoxProps } from '@mui/material';
import { styled } from '@mui/material/styles';

const CircleNode = styled(Box)<BoxProps>(() => ({
  width: '40px',
  height: '40px',
  borderRadius: '50%'
}));

export const StyledStartNode = styled(CircleNode)(({ theme }) => ({
  background: theme.palette.pink
}));

export const StyledEndNode = styled(CircleNode)(({ theme }) => ({
  background: theme.palette.lightGreen
}));

export const StyledRectangle = styled(Box)(({ theme }) => ({
  background: theme.palette.dark,
  padding: '6px 18px',
  borderRadius: '5px',
  color: theme.palette.white
}));

export const StyledDiamond = styled(Box)(({ theme }) => ({
  width: '60px',
  height: '60px',
  transform: 'translate(-50%, -50%) rotate(45deg)',
  background: theme.palette.white,
  position: 'absolute',
  left: '50%',
  top: '50%',
  backgroundColor: theme.palette.yellow
}));

export const StyledDiamondLabel = styled(Box)(({ theme }) => ({
  zIndex: 10,
  position: 'relative',
  fontSize: 12,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '100%',
  color: theme.palette.dark
}));

export const targetHandDiamondStyle = {
  backgroundColor: '#8FA5BE',
  zIndex: 1
};

export const sourceHandDiamondStyle = {
  backgroundColor: '#50D876',
  zIndex: 1
};
