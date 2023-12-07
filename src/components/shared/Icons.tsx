import MuiPersonOutlineIcon from '@mui/icons-material/PersonOutline';
import MuiAddIcon from '@mui/icons-material/Add';
import MuiHexagonOutlinedIcon from '@mui/icons-material/HexagonOutlined';
import MuiDeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import MuiBookmarksOutlinedIcon from '@mui/icons-material/BookmarksOutlined';
import MuiTaskAltOutlinedIcon from '@mui/icons-material/TaskAltOutlined';
import { SvgIconProps } from '@mui/material/SvgIcon';

const defaultIconSize = '18px';

interface IconPros extends SvgIconProps {
  size?: string;
}

export const PersonOutlineIcon = ({
  size = defaultIconSize,
  sx,
  ...props
}: IconPros) => (
  <MuiPersonOutlineIcon sx={{ width: size, height: size, ...sx }} {...props} />
);

export const AddIcon = ({ size = defaultIconSize, sx, ...props }: IconPros) => (
  <MuiAddIcon sx={{ width: size, height: size, ...sx }} {...props} />
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

export const BookmarksOutlinedIcon = ({
  size = defaultIconSize,
  sx,
  ...props
}: IconPros) => (
  <MuiBookmarksOutlinedIcon
    sx={{ width: size, height: size, ...sx }}
    {...props}
  />
);

export const TaskAltOutlinedIcon = ({
  size = defaultIconSize,
  sx,
  ...props
}: IconPros) => (
  <MuiTaskAltOutlinedIcon
    sx={{ width: size, height: size, ...sx }}
    {...props}
  />
);
