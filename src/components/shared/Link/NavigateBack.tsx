import { Button, Stack, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

import { KeyboardDoubleArrowLeftIcon } from '../Icons';
import { palette } from '../../../themeConfig';

interface NavigateBackProps {
  title: string;
}

const NavigateBack: React.FC<NavigateBackProps> = ({ title }) => {
  const navigate = useNavigate();

  const handleGoBack = () => navigate(-1);

  return (
    <Stack direction="row" alignItems="center" pl={2} pr={2}>
      <Button
        sx={{ width: '24px', height: '24px' }}
        variant="contained"
        color="secondary"
        onClick={handleGoBack}
      >
        <KeyboardDoubleArrowLeftIcon />
      </Button>
      <Typography color={palette.gray} ml={1} variant="h6">
        {title}
      </Typography>
    </Stack>
  );
};

export default NavigateBack;
