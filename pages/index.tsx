import React from 'react';
import Head from 'next/head';
import { Box, Button, Typography } from '@mui/material';

import Icon from '@components/shared/Icon/Icon';
import { iconSymobls } from '@components/shared/Icon/icons';

const Home = () => (
  <div>
    <Head>
      <title>Underwriting Platform</title>
      <link rel="icon" href="/favicon.ico" />
    </Head>

    <main>
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        height="100vh"
      >
        <Typography variant="h4" gutterBottom>
          Welcome to Underwriting
        </Typography>
        <Icon symbol={iconSymobls.kiwiIcon} size={60} />
        <Button variant="contained" color="primary">
          Login
        </Button>
      </Box>
    </main>
  </div>
);

export default Home;
