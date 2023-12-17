import { ReactFlowProvider } from 'reactflow';
import { Button, Divider, Stack, Typography } from '@mui/material';

import { palette } from '../themeConfig';

import {
  LayoutContainer,
  SideNavContainer,
  MainContainer
} from '@components/Layouts/MainLayout';
import NavigateBack from '@components/shared/Link/NavigateBack';
import FlowChart from '@components/FlowManagment/FlowChart/FlowChart';
import useInitialFlow from '@hooks/useInitialFlow';
import { DatabaseIcon, EditNoteOutlinedIcon } from '@components/shared/Icons';

export default function FlowDetails() {
  const { elements, data } = useInitialFlow();
  return (
    <LayoutContainer>
      <ReactFlowProvider>
        <SideNavContainer
          footer={
            <Button
              variant="contained"
              color="primary"
              endIcon={<EditNoteOutlinedIcon />}
            >
              Edit flow
            </Button>
          }
          header={<NavigateBack title="Back to flow list" />}
        >
          <Stack pl={2} pr={2} spacing={1}>
            <Typography variant="h5">{data.data.name}</Typography>
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
            <Divider />
          </Stack>
        </SideNavContainer>
        <MainContainer>
          <FlowChart data={data} elements={elements} />
        </MainContainer>
      </ReactFlowProvider>
    </LayoutContainer>
  );
}
