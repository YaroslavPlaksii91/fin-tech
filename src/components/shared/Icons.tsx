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

// TODO: remove old icons, new Icons

export const TimePast = () => (
  <svg
    width={24}
    height={24}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M14 15C13.744 15 13.488 14.902 13.293 14.707L11.293 12.707C11.105 12.519 11 12.265 11 12V8C11 7.448 11.447 7 12 7C12.553 7 13 7.448 13 8V11.5859L14.707 13.293C15.098 13.684 15.098 14.316 14.707 14.707C14.512 14.902 14.256 15 14 15Z"
      fill="#1E4620"
    />
    <path
      opacity={0.4}
      d="M12.0263 2C9.35625 2 6.84937 3.07793 5.00037 4.92993V3C5.00037 2.448 4.55337 2 4.00037 2C3.44737 2 3.00037 2.448 3.00037 3V7C3.00037 7.552 3.44737 8 4.00037 8H8.00037C8.55337 8 9.00037 7.552 9.00037 7C9.00037 6.448 8.55337 6 8.00037 6H6.76136C8.19936 4.727 10.0603 4 12.0263 4C16.4223 4 20.0004 7.589 20.0004 12C20.0004 16.411 16.4233 20 12.0263 20C8.97125 20 6.24035 18.2991 4.89735 15.5601C4.65535 15.0641 4.05646 14.8581 3.55946 15.1021C3.06346 15.3451 2.85943 15.9439 3.10243 16.4399C4.78343 19.8699 8.20325 22 12.0263 22C17.5253 22 22.0004 17.514 22.0004 12C22.0004 6.486 17.5253 2 12.0263 2Z"
      fill="#1E4620"
    />
  </svg>
);

export const DocumentList = () => (
  <svg
    width={24}
    height={24}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      opacity={0.4}
      d="M6 21C4 21 3 20 3 18V6C3 4 4 3 6 3H14C16 3 17 4 17 6V19C17 20.104 17.896 21 19 21H6Z"
      fill="#1E4620"
    />
    <path
      d="M17 10H19.5C20.33 10 21 10.67 21 11.5V19C21 19.55 20.7799 20.05 20.4099 20.41C20.0499 20.78 19.55 21 19 21C17.9 21 17 20.1 17 19V10Z"
      fill="#1E4620"
    />
    <path
      d="M7.25 8C7.25 8.414 6.914 8.75 6.5 8.75C6.086 8.75 5.75 8.414 5.75 8C5.75 7.586 6.086 7.25 6.5 7.25C6.914 7.25 7.25 7.586 7.25 8ZM6.5 11.25C6.086 11.25 5.75 11.586 5.75 12C5.75 12.414 6.086 12.75 6.5 12.75C6.914 12.75 7.25 12.414 7.25 12C7.25 11.586 6.914 11.25 6.5 11.25ZM6.5 15.25C6.086 15.25 5.75 15.586 5.75 16C5.75 16.414 6.086 16.75 6.5 16.75C6.914 16.75 7.25 16.414 7.25 16C7.25 15.586 6.914 15.25 6.5 15.25ZM14.25 8C14.25 7.586 13.914 7.25 13.5 7.25H9C8.586 7.25 8.25 7.586 8.25 8C8.25 8.414 8.586 8.75 9 8.75H13.5C13.914 8.75 14.25 8.414 14.25 8ZM14.25 12C14.25 11.586 13.914 11.25 13.5 11.25H9C8.586 11.25 8.25 11.586 8.25 12C8.25 12.414 8.586 12.75 9 12.75H13.5C13.914 12.75 14.25 12.414 14.25 12ZM14.25 16C14.25 15.586 13.914 15.25 13.5 15.25H9C8.586 15.25 8.25 15.586 8.25 16C8.25 16.414 8.586 16.75 9 16.75H13.5C13.914 16.75 14.25 16.414 14.25 16Z"
      fill="#1E4620"
    />
  </svg>
);

export const AngleLeftSquare = () => (
  <svg
    width={24}
    height={24}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      opacity={0.4}
      d="M6.375 21H17.625C19.875 21 21 19.875 21 17.625V6.375C21 4.125 19.875 3 17.625 3H6.375C4.125 3 3 4.125 3 6.375V17.625C3 19.875 4.125 21 6.375 21Z"
      fill="black"
      fillOpacity={0.56}
    />
    <path
      d="M12.9998 15.75C12.8078 15.75 12.6157 15.6771 12.4697 15.5301L9.46975 12.5301C9.17675 12.2371 9.17675 11.762 9.46975 11.469L12.4697 8.46902C12.7627 8.17602 13.2378 8.17602 13.5308 8.46902C13.8238 8.76202 13.8238 9.23705 13.5308 9.53005L11.0608 12L13.5308 14.47C13.8238 14.763 13.8238 15.238 13.5308 15.531C13.3838 15.677 13.1918 15.75 12.9998 15.75Z"
      fill="black"
      fillOpacity={0.56}
    />
  </svg>
);

export const Bezier = () => (
  <svg
    width={24}
    height={24}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M19.5 14.5H18.5C17.229 14.5 16.5 15.229 16.5 16.5V17.5C16.5 18.771 17.229 19.5 18.5 19.5H19.5C20.771 19.5 21.5 18.771 21.5 17.5V16.5C21.5 15.229 20.771 14.5 19.5 14.5Z"
      fill="black"
      fillOpacity={0.56}
    />
    <path
      d="M5.5 14.5H4.5C3.229 14.5 2.5 15.229 2.5 16.5V17.5C2.5 18.771 3.229 19.5 4.5 19.5H5.5C6.771 19.5 7.5 18.771 7.5 17.5V16.5C7.5 15.229 6.771 14.5 5.5 14.5Z"
      fill="black"
      fillOpacity={0.56}
    />
    <path
      d="M12.5 4.5H11.5C10.229 4.5 9.5 5.229 9.5 6.5V7.5C9.5 8.771 10.229 9.5 11.5 9.5H12.5C13.771 9.5 14.5 8.771 14.5 7.5V6.5C14.5 5.229 13.771 4.5 12.5 4.5Z"
      fill="black"
      fillOpacity={0.56}
    />
    <path
      opacity={0.4}
      d="M16.795 7.75H19C19.414 7.75 19.75 7.414 19.75 7C19.75 6.586 19.414 6.25 19 6.25H14C13.586 6.25 13.25 6.586 13.25 7C13.25 7.033 13.265 7.06199 13.269 7.09399C13.203 7.47999 13.44 7.85801 13.827 7.95001C17.676 8.86301 18.25 12.759 18.25 15C18.25 15.414 18.586 15.75 19 15.75C19.414 15.75 19.75 15.414 19.75 15C19.75 11.727 18.691 9.225 16.795 7.75Z"
      fill="black"
      fillOpacity={0.56}
    />
    <path
      opacity={0.4}
      d="M10 6.25H5C4.586 6.25 4.25 6.586 4.25 7C4.25 7.414 4.586 7.75 5 7.75H7.20502C5.30902 9.225 4.25 11.727 4.25 15C4.25 15.414 4.586 15.75 5 15.75C5.414 15.75 5.75 15.414 5.75 15C5.75 12.759 6.32497 8.86301 10.173 7.95001C10.56 7.85801 10.797 7.48099 10.731 7.09399C10.735 7.06199 10.75 7.033 10.75 7C10.75 6.586 10.414 6.25 10 6.25Z"
      fill="black"
      fillOpacity={0.56}
    />
    <path
      d="M20.5 9C21.6046 9 22.5 8.10457 22.5 7C22.5 5.89543 21.6046 5 20.5 5C19.3954 5 18.5 5.89543 18.5 7C18.5 8.10457 19.3954 9 20.5 9Z"
      fill="black"
      fillOpacity={0.56}
    />
    <path
      d="M3.5 9C4.60457 9 5.5 8.10457 5.5 7C5.5 5.89543 4.60457 5 3.5 5C2.39543 5 1.5 5.89543 1.5 7C1.5 8.10457 2.39543 9 3.5 9Z"
      fill="black"
      fillOpacity={0.56}
    />
  </svg>
);
