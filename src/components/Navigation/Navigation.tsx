import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { Stack } from '@mui/material';

import { StyledAppBar } from './styled';
import Dropdown from './Dropdown';

import routes from '@constants/routes';
import { PersonOutlineIcon } from '@components/shared/Icons';

const pages = [
  {
    label: 'Dashboard',
    options: [{ label: 'Test', path: '/' }]
  },
  {
    label: 'Lead managemend',
    options: [{ label: 'Test', path: '/' }]
  },
  {
    label: 'Underwriting',
    options: [
      { label: 'Flow list', path: routes.underwriting.flowList },
      { label: 'Data Dictionary', path: routes.underwriting.dataDictionary },
      { label: 'Changes history', path: routes.underwriting.changeHistory }
    ]
  },
  {
    label: 'Lead request',
    options: [{ label: 'Test', path: '/' }]
  }
];

function Navigation() {
  return (
    <StyledAppBar position="static">
      <Container maxWidth="xl">
        <Toolbar variant="dense" disableGutters>
          <Typography variant="h6" noWrap component="a" href="/">
            LOGO
          </Typography>
          <Box
            flexGrow="1"
            style={{ display: 'flex', justifyContent: 'center' }}
          >
            <Stack direction="row" spacing={6}>
              {pages.map(({ label, options }, key) => (
                <Dropdown key={key} label={label} options={options} />
              ))}
            </Stack>
          </Box>
          <Avatar sx={{ bgcolor: 'gray', width: '24px', height: '24px' }}>
            <PersonOutlineIcon />
          </Avatar>
          <Typography ml={1} variant="body2" color="gray">
            Cristofer Calzoni
          </Typography>
        </Toolbar>
      </Container>
    </StyledAppBar>
  );
}
export default Navigation;
