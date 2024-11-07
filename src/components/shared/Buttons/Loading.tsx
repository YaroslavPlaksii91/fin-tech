import { Button, ButtonProps } from '@mui/material';

import { CircularProgress } from '../Icons';

interface LoadingButtonProps extends ButtonProps {
  loading: boolean;
}

const LoadingButton = ({ loading, ...props }: LoadingButtonProps) => (
  <Button {...props} endIcon={loading && <CircularProgress size={16} />} />
);

export default LoadingButton;
