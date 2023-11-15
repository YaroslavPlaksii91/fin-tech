import { useState } from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { Grid } from '@mui/material';

import AuthMock from '@components/Auth/AuthMock';

function Auth() {
  const [isError, setIsError] = useState(false);
  return (
    <Grid
      container
      spacing={0}
      direction="column"
      alignItems="center"
      justifyContent="center"
      sx={{ minHeight: '100vh' }}
    >
      <Grid container direction="column" alignItems="center">
        <Typography align="center" variant="h5">
          Welcome to the Underwriting plantform
        </Typography>
        <Box>
          {isError && (
            <Typography>Error message. Something went wrong...</Typography>
          )}
        </Box>
        <AuthMock setIsError={setIsError} />
      </Grid>
    </Grid>
  );
}

export default Auth;
