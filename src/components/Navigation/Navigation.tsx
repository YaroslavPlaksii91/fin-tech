import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';

import { StyledAppBar } from './styled';
import Dropdown from './Dropdown';

import routes from '@constants/routes';

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
        <Toolbar disableGutters>
          <Typography variant="h6" noWrap component="a" href="/">
            LOGO
          </Typography>
          <Box
            flexGrow="1"
            style={{ display: 'flex', justifyContent: 'center' }}
          >
            {pages.map(({ label, options }, key) => (
              <Dropdown key={key} label={label} options={options} />
            ))}
          </Box>
          <Avatar alt="Remy Sharp" src="/static/images/avatar/2.jpg" />
        </Toolbar>
      </Container>
    </StyledAppBar>
  );
}
export default Navigation;
