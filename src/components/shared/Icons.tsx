import MuiAddIcon from '@mui/icons-material/Add';
import MuiHexagonOutlinedIcon from '@mui/icons-material/HexagonOutlined';
import MuiDeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import MuiBorderColorOutlinedIcon from '@mui/icons-material/BorderColorOutlined';
import MuiCircularProgress, {
  CircularProgressProps
} from '@mui/material/CircularProgress';
import MuiMoreVertIcon from '@mui/icons-material/MoreVert';
import MuiCloseIcon from '@mui/icons-material/Close';
import MuiErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import MuiRemoveIcon from '@mui/icons-material/Remove';
import MuiRemoveRedEyeOutlinedIcon from '@mui/icons-material/RemoveRedEyeOutlined';
import MuiKeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import MuiExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { SvgIconProps } from '@mui/material/SvgIcon';

const defaultIconSize = '18px';

interface IconPros extends SvgIconProps {
  size?: string;
}

export const RemoveRedEyeOutlinedIcon = ({
  size = defaultIconSize,
  sx,
  ...props
}: IconPros) => (
  <MuiRemoveRedEyeOutlinedIcon
    sx={{ width: size, height: size, ...sx }}
    {...props}
  />
);

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

export const HexagonOutlinedIcon = ({
  size = defaultIconSize,
  sx,
  ...props
}: IconPros) => (
  <MuiHexagonOutlinedIcon
    sx={{ width: size, height: size, ...sx }}
    {...props}
  />
);

export const DeleteOutlineIcon = ({
  size = defaultIconSize,
  sx,
  ...props
}: IconPros) => (
  <MuiDeleteOutlineIcon sx={{ width: size, height: size, ...sx }} {...props} />
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

export const EditNoteOutlinedIcon = ({
  size = defaultIconSize,
  sx,
  ...props
}: IconPros) => (
  <MuiBorderColorOutlinedIcon
    sx={{ width: size, height: size, ...sx }}
    {...props}
  />
);

export const MoreVertIcon = ({
  size = defaultIconSize,
  sx,
  ...props
}: IconPros) => (
  <MuiMoreVertIcon sx={{ width: size, height: size, ...sx }} {...props} />
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

export const KeyboardArrowLeftIcon = ({
  size = defaultIconSize,
  sx,
  ...props
}: IconPros) => (
  <MuiKeyboardArrowLeftIcon
    sx={{ width: size, height: size, ...sx }}
    {...props}
  />
);

export const ExpandMoreIcon = ({ sx, ...props }: IconPros) => (
  <MuiExpandMoreIcon sx={{ ...sx }} {...props} />
);
