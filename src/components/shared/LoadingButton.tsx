import { Button, ButtonProps } from '@mui/material';

import { CircularProgress } from './Icons';

interface LoadingButtonProps extends ButtonProps {
  loading: boolean;
}

const LoadingButton: React.FC<LoadingButtonProps> = ({ loading, ...props }) => (
  <Button {...props} endIcon={loading && <CircularProgress />} />
);

export default LoadingButton;
