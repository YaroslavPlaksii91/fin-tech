import { NavLink, useParams } from 'react-router-dom';
import { Divider, Stack, Typography } from '@mui/material';

import { palette } from '../../themeConfig';

import CroppedText from '@components/shared/CroppedText';
import { DatabaseIcon } from '@components/shared/Icons';
import { StyledNavListItem } from '@components/shared/List/styled';
import routes from '@constants/routes.ts';

const FlowHeader: React.FC<{ name: string }> = ({ name }) => {
  const { id } = useParams();

  return (
    <Stack spacing={1}>
      <Typography variant="h5" paddingLeft={2}>
        <CroppedText>{name}</CroppedText>
      </Typography>

      <StyledNavListItem
        key={id}
        component={NavLink}
        to={routes.underwriting.flow.dataDictionary(id as string)}
      >
        <Stack
          display="flex"
          direction="row"
          alignItems="center"
          spacing={1}
          pb={0.5}
        >
          <Typography color={palette.gray} variant="body2">
            Data dictionary
          </Typography>
          <DatabaseIcon />
        </Stack>
      </StyledNavListItem>

      <Divider />
    </Stack>
  );
};

export default FlowHeader;
