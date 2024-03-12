import { useParams } from 'react-router-dom';
import { Typography, Breadcrumbs, Stack, Link } from '@mui/material';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';

import { palette } from '../themeConfig.ts';

import { LayoutContainer } from '@components/Layouts/MainLayout';
import DataDictionaryVariableList from '@components/DataDictionaryVariableList/DataDictionaryVariableList.tsx';
import useDataDictionaryVariables from '@hooks/useDataDictionaryVariables';
import routes from '@constants/routes';

export default function DataDictionary() {
  const { id } = useParams();

  const { variables } = useDataDictionaryVariables();

  const breadcrumbs = [
    <Link
      underline="hover"
      key="flow-list"
      variant="body2"
      color={palette.gray}
      href={routes.underwriting.flow.list}
    >
      Flow list
    </Link>,
    <Link
      underline="hover"
      key="main-flow"
      variant="body2"
      color={palette.gray}
      href={routes.underwriting.flow.details(id as string)}
    >
      Main flow
    </Link>,
    <Typography key="data-dictionary" variant="body2" color={palette.gray}>
      Data dictionary
    </Typography>
  ];
  return (
    <LayoutContainer>
      <Stack paddingX={12} sx={{ width: '100%' }}>
        <Stack spacing={2} pt={2} pb={2}>
          <Breadcrumbs
            separator={<NavigateNextIcon fontSize="medium" />}
            aria-label="breadcrumb"
          >
            {breadcrumbs}
          </Breadcrumbs>
        </Stack>
        {variables && <DataDictionaryVariableList variables={variables} />}
      </Stack>
    </LayoutContainer>
  );
}
