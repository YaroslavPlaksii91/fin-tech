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

export const HexagonOutlinedIconSvg = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="18"
    fill="none"
    viewBox="0 0 16 18"
  >
    <path
      stroke="#fff"
      strokeLinecap="round"
      strokeWidth="2"
      d="M2.115 5.177l5-3.125a1.667 1.667 0 011.767 0l5 3.125c.487.305.783.839.783 1.413v4.82c0 .574-.296 1.108-.783 1.413l-5 3.125a1.667 1.667 0 01-1.767 0l-5-3.125a1.667 1.667 0 01-.783-1.413V6.59c0-.574.296-1.108.783-1.413z"
    ></path>
  </svg>
);
