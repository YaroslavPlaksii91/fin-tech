import MuiPersonOutlineIcon from '@mui/icons-material/PersonOutline';
import MuiAddIcon from '@mui/icons-material/Add';
import MuiHexagonOutlinedIcon from '@mui/icons-material/HexagonOutlined';
import MuiDeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import MuiBookmarksOutlinedIcon from '@mui/icons-material/BookmarksOutlined';
import MuiTaskAltOutlinedIcon from '@mui/icons-material/TaskAltOutlined';
import MuiKeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
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

export const KeyboardDoubleArrowLeftIcon = ({
  size = defaultIconSize,
  sx,
  ...props
}: IconPros) => (
  <MuiKeyboardDoubleArrowLeftIcon
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

export const Logo = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="57"
    height="14"
    fill="none"
    viewBox="0 0 57 14"
  >
    <path
      fill="#5F6D7E"
      d="M0 13.327V.673h3.418v9.886h5.09v2.768H0zM24.347 7c0 1.409-.273 2.597-.818 3.565-.545.964-1.28 1.695-2.206 2.194-.927.494-1.96.741-3.099.741-1.147 0-2.184-.25-3.11-.748-.922-.502-1.656-1.235-2.2-2.2-.542-.967-.812-2.151-.812-3.552 0-1.409.27-2.595.811-3.559.545-.968 1.279-1.7 2.201-2.193C16.04.749 17.077.5 18.224.5c1.14 0 2.172.25 3.099.748.926.494 1.661 1.225 2.206 2.193.545.964.818 2.15.818 3.559zM20.83 7c0-.758-.1-1.396-.301-1.915-.197-.524-.49-.919-.88-1.187-.385-.272-.86-.408-1.426-.408-.565 0-1.043.136-1.432.408-.385.268-.678.663-.879 1.187-.197.519-.295 1.157-.295 1.915s.098 1.398.295 1.922c.201.519.494.914.88 1.186.389.268.866.401 1.431.401.566 0 1.041-.133 1.427-.401.389-.272.682-.667.879-1.186.2-.524.3-1.164.3-1.922zM36.856 4.85a1.7 1.7 0 00-.252-.575 1.574 1.574 0 00-.43-.426 1.76 1.76 0 00-.59-.266 2.715 2.715 0 00-.732-.093c-.573 0-1.063.138-1.469.414-.402.276-.709.674-.922 1.193-.209.519-.313 1.145-.313 1.878 0 .742.1 1.376.3 1.903.202.528.5.931.898 1.211s.892.42 1.482.42c.52 0 .952-.076 1.297-.228.348-.152.608-.369.78-.649.172-.28.258-.61.258-.988l.59.061h-2.876V6.26h5.581v1.754c0 1.154-.243 2.14-.731 2.96a4.855 4.855 0 01-2.004 1.878c-.848.433-1.822.649-2.92.649-1.225 0-2.301-.262-3.227-.785a5.5 5.5 0 01-2.17-2.236c-.516-.968-.775-2.12-.775-3.454 0-1.047.158-1.973.474-2.78.32-.808.762-1.49 1.328-2.046a5.608 5.608 0 011.96-1.266A6.524 6.524 0 0134.778.5c.746 0 1.439.107 2.078.321.643.21 1.211.511 1.703.902.496.388.895.847 1.199 1.378.303.532.487 1.114.553 1.749h-3.455zM57 7c0 1.409-.273 2.597-.818 3.565-.545.964-1.28 1.695-2.206 2.194-.926.494-1.96.741-3.099.741-1.147 0-2.184-.25-3.11-.748-.922-.502-1.656-1.235-2.2-2.2-.541-.967-.812-2.151-.812-3.552 0-1.409.27-2.595.811-3.559.545-.968 1.28-1.7 2.201-2.193C48.693.749 49.73.5 50.877.5c1.14 0 2.172.25 3.099.748.926.494 1.661 1.225 2.206 2.193.545.964.818 2.15.818 3.559zm-3.516 0c0-.758-.1-1.396-.301-1.915-.197-.524-.49-.919-.88-1.187-.385-.272-.86-.408-1.425-.408-.566 0-1.043.136-1.433.408-.385.268-.678.663-.879 1.187-.197.519-.295 1.157-.295 1.915s.099 1.398.295 1.922c.201.519.494.914.88 1.186.389.268.866.401 1.431.401.566 0 1.041-.133 1.427-.401.389-.272.682-.667.879-1.186.2-.524.3-1.164.3-1.922z"
    ></path>
  </svg>
);
