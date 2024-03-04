import MuiPersonOutlineIcon from '@mui/icons-material/PersonOutline';
import MuiAddIcon from '@mui/icons-material/Add';
import MuiHexagonOutlinedIcon from '@mui/icons-material/HexagonOutlined';
import MuiDeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import MuiBookmarksOutlinedIcon from '@mui/icons-material/BookmarksOutlined';
import MuiTaskAltOutlinedIcon from '@mui/icons-material/TaskAltOutlined';
import MuiKeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import MuiBorderColorOutlinedIcon from '@mui/icons-material/BorderColorOutlined';
import MuiCircularProgress, {
  CircularProgressProps
} from '@mui/material/CircularProgress';
import MuiMoreVertIcon from '@mui/icons-material/MoreVert';
import MuiCloseIcon from '@mui/icons-material/Close';
import MuiArrowForwardIcon from '@mui/icons-material/ArrowForward';
import MuiCheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import MuiErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import MuiRemoveIcon from '@mui/icons-material/Remove';
import MuiAddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
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

export const AddCircleOutlineIcon = ({
  size = defaultIconSize,
  sx,
  ...props
}: IconPros) => (
  <MuiAddCircleOutlineIcon
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

export const CheckCircleOutlinedIcon = ({
  size = defaultIconSize,
  sx,
  ...props
}: IconPros) => (
  <MuiCheckCircleOutlinedIcon
    sx={{ width: size, height: size, ...sx }}
    {...props}
  />
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

export const ArrowForwardIcon = ({
  size = defaultIconSize,
  sx,
  ...props
}: IconPros) => (
  <MuiArrowForwardIcon sx={{ width: size, height: size, ...sx }} {...props} />
);

export const CircularProgress = ({ ...props }: CircularProgressProps) => (
  <MuiCircularProgress {...props} />
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

export const ChartIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="90px"
    height="90px"
    fill="none"
    viewBox="0 0 138 138"
  >
    <g clipPath="url(#clip0_1401_117702)">
      <path
        fill="#5F6D7E"
        fillRule="evenodd"
        d="M82.678 43.294a1.06 1.06 0 01-1.078 1.078h-8.061a1.06 1.06 0 01-1.078-1.078 1.09 1.09 0 011.078-1.078h8.06c.61 0 1.079.516 1.079 1.078zM67.021 43.294a1.09 1.09 0 01-1.078 1.078h-7.498v17.247c0 .609-.469 1.078-1.031 1.078a1.06 1.06 0 01-1.078-1.078V43.294a1.09 1.09 0 011.078-1.078h8.53c.562 0 1.077.516 1.077 1.078zM52.772 69.492c0 .562-.469 1.03-1.078 1.03h-5.108c-.61 0-1.078-.468-1.078-1.03 0-.61.468-1.078 1.078-1.078h5.108c.61 0 1.078.469 1.078 1.078zM40.03 69.492a1.04 1.04 0 01-1.031 1.03h-6.374a1.04 1.04 0 01-1.031-1.03c0-.61.468-1.078 1.03-1.078H39c.562 0 1.03.469 1.03 1.078zM100.201 43.294v25.981c0 .563-.469 1.031-1.078 1.031-.562 0-1.078-.468-1.078-1.03V44.371h-7.451a1.06 1.06 0 01-1.078-1.078 1.09 1.09 0 011.078-1.078h8.53c.608 0 1.077.516 1.077 1.078zM67.021 94.706a1.09 1.09 0 01-1.078 1.078h-8.53a1.06 1.06 0 01-1.077-1.078V77.319a1.09 1.09 0 011.078-1.078c.562 0 1.03.515 1.03 1.078v16.309h7.5c.562 0 1.077.516 1.077 1.078zM82.678 94.706a1.06 1.06 0 01-1.078 1.078h-8.061a1.06 1.06 0 01-1.078-1.078 1.09 1.09 0 011.078-1.078h8.06c.61 0 1.079.516 1.079 1.078z"
        clipRule="evenodd"
      ></path>
      <path
        fill="#5F6D7E"
        fillRule="evenodd"
        d="M100.201 68.772v25.934a1.06 1.06 0 01-1.078 1.078h-8.53a1.06 1.06 0 01-1.077-1.078 1.09 1.09 0 011.078-1.078h7.451V68.772c0-.61.516-1.078 1.078-1.078.61 0 1.078.468 1.078 1.078z"
        clipRule="evenodd"
      ></path>
      <circle
        cx="29"
        cy="69.5"
        r="5"
        fill="#FFB4B4"
        transform="rotate(-90 29 69.5)"
      ></circle>
      <path
        fill="#2E3646"
        fillRule="evenodd"
        d="M47.623 60.213v18.559c0 .562-.469 1.078-1.03 1.078H39a1.09 1.09 0 01-1.078-1.078v-18.56c0-.609.469-1.077 1.078-1.077h7.545c.61 0 1.078.468 1.078 1.078z"
        clipRule="evenodd"
      ></path>
      <path
        fill="#DDCD93"
        fillRule="evenodd"
        d="M64.161 69.492c0 .188-.093.422-.234.61l-5.67 7.826a1.047 1.047 0 01-.844.469c-.375 0-.703-.188-.89-.47l-5.672-7.826a1.054 1.054 0 010-1.265l5.671-7.827c.188-.28.516-.421.89-.421.329 0 .657.14.844.421l5.671 7.827c.14.187.234.422.234.656z"
        clipRule="evenodd"
      ></path>
      <path
        fill="#2E3646"
        fillRule="evenodd"
        d="M74.568 31.203v24.23a1.04 1.04 0 01-1.03 1.03h-7.593c-.61 0-1.078-.468-1.078-1.03v-24.23c0-.61.469-1.078 1.078-1.078h7.592c.563 0 1.031.468 1.031 1.078z"
        clipRule="evenodd"
      ></path>
      <path
        fill="#DDCD93"
        fillRule="evenodd"
        d="M91.627 43.294c0 .188-.047.375-.094.516l-4.5 8.107c-.187.328-.561.516-.936.516s-.75-.188-.938-.516L80.66 43.81a1.313 1.313 0 010-1.031l4.5-8.061c.187-.328.562-.563.937-.563s.75.235.937.563l4.499 8.06c.047.188.094.329.094.516z"
        clipRule="evenodd"
      ></path>
      <path
        fill="#2E3646"
        fillRule="evenodd"
        d="M74.568 82.615v24.229a1.04 1.04 0 01-1.03 1.031h-7.593c-.61 0-1.078-.468-1.078-1.031v-24.23c0-.609.469-1.077 1.078-1.077h7.592c.563 0 1.031.468 1.031 1.078z"
        clipRule="evenodd"
      ></path>
      <path
        fill="#DDCD93"
        fillRule="evenodd"
        d="M91.627 94.706c0 .187-.047.375-.094.515l-4.5 8.108c-.187.328-.561.516-.936.516s-.75-.188-.938-.516l-4.499-8.108a1.313 1.313 0 010-1.03l4.5-8.062c.187-.328.562-.562.937-.562s.75.234.937.562l4.499 8.061c.047.188.094.328.094.516z"
        clipRule="evenodd"
      ></path>
      <circle
        cx="109"
        cy="69"
        r="5"
        fill="#ABDCB9"
        transform="rotate(-90 109 69)"
      ></circle>
      <path
        fill="#5F6D7E"
        fillRule="evenodd"
        d="M105.772 69.492c0 .562-.469 1.03-1.078 1.03h-5.108c-.61 0-1.078-.468-1.078-1.03 0-.61.469-1.078 1.078-1.078h5.108a1.06 1.06 0 011.078 1.078z"
        clipRule="evenodd"
      ></path>
    </g>
    <defs>
      <clipPath id="clip0_1401_117702">
        <path
          fill="#fff"
          d="M0 0H80V90H0z"
          transform="rotate(-90 66.5 42.5)"
        ></path>
      </clipPath>
    </defs>
  </svg>
);

export const DatabaseIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="12"
    height="14"
    fill="none"
    viewBox="0 0 12 14"
  >
    <path
      fill="#5F6D7E"
      d="M6.001.5C2.731.5.168 1.89.168 3.667v6.666c0 1.717 2.671 3.167 5.833 3.167 3.162 0 5.834-1.45 5.834-3.167V3.667C11.835 1.89 9.272.5 6 .5zM10.835 7c0 1.025-1.986 2.167-4.834 2.167S1.168 8.025 1.168 7V5.461c1.04.834 2.8 1.372 4.833 1.372 2.034 0 3.793-.538 4.834-1.372V7zM6 1.5c2.848 0 4.834 1.142 4.834 2.167 0 1.024-1.986 2.166-4.834 2.166S1.168 4.691 1.168 3.667c0-1.025 1.985-2.167 4.833-2.167zm0 11c-2.905 0-4.833-1.304-4.833-2.167V8.795c1.04.833 2.8 1.372 4.833 1.372 2.034 0 3.793-.54 4.834-1.372v1.538c0 .863-1.928 2.167-4.834 2.167z"
    ></path>
  </svg>
);
