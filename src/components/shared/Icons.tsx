import MuiAddIcon from '@mui/icons-material/Add';
import MuiCircularProgress, {
  CircularProgressProps
} from '@mui/material/CircularProgress';
import MuiCloseIcon from '@mui/icons-material/Close';
import MuiErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import MuiRemoveIcon from '@mui/icons-material/Remove';
import MuiExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { SvgIconProps } from '@mui/material/SvgIcon';

const defaultIconSize = '18px';

interface IconPros extends SvgIconProps {
  size?: string;
}

export const AddIcon = ({ size = defaultIconSize, sx, ...props }: IconPros) => (
  <MuiAddIcon sx={{ width: size, height: size, ...sx }} {...props} />
);

export const RemoveIcon = ({
  size = defaultIconSize,
  sx,
  ...props
}: IconPros) => (
  <MuiRemoveIcon sx={{ width: size, height: size, ...sx }} {...props} />
);

export const ErrorOutlineOutlinedIcon = ({
  size = defaultIconSize,
  sx,
  ...props
}: IconPros) => (
  <MuiErrorOutlineOutlinedIcon
    sx={{ width: size, height: size, ...sx }}
    {...props}
  />
);

export const CloseIcon = ({
  size = defaultIconSize,
  sx,
  ...props
}: IconPros) => (
  <MuiCloseIcon sx={{ width: size, height: size, ...sx }} {...props} />
);

export const CircularProgress = ({ ...props }: CircularProgressProps) => (
  <MuiCircularProgress {...props} />
);

export const ExpandMoreIcon = ({ sx, ...props }: IconPros) => (
  <MuiExpandMoreIcon sx={{ ...sx }} {...props} />
);
