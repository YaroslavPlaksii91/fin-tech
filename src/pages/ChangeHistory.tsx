import React, { useEffect, useState } from 'react';
import {
  Breadcrumbs,
  Grid,
  Link,
  Stack,
  Typography,
  Container
} from '@mui/material';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';

import { palette } from '@theme';
import routes from '@constants/routes.ts';
import { changeHistoryService } from '@services/change-history.tsx';
import Logger from '@utils/logger.ts';
import { ChangeHistoryRecord } from '@domain/changeHistory.ts';
import { useLoading } from '@contexts/LoadingContext.tsx';
import LoadingButton from '@components/shared/LoadingButton.tsx';
import ChangeHistoryItem from '@components/ChangeHistory/ChangeHistoryItem.tsx';

const breadcrumbs = [
  <Link
    underline="hover"
    key="flow-list"
    variant="body2"
    color={palette.gray}
    href={routes.index}
  >
    Underwriting
  </Link>,
  <Link underline="none" key="main-flow" variant="body2" color={palette.gray}>
    ChangeHistory
  </Link>
];

const pageSize = 10;

const ChangeHistoryPage: React.FC<ChangeHistoryPageProps> = () => {
  const { startLoading, stopLoading, loading } = useLoading();
  const [list, setList] = useState<ChangeHistoryRecord[]>([]);
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);

  const fetchList = async (page: number) => {
    try {
      if (page === 1) {
        startLoading();
      }
      const res = await changeHistoryService.getList(page, pageSize);
      if (res.length < pageSize) {
        setHasMore(false);
      }
      setList((prev) => [...prev, ...res]);
    } catch (e) {
      Logger.error(e);
    } finally {
      stopLoading();
    }
  };

  useEffect(() => {
    void fetchList(page);
  }, [page]);

  return (
    <Container maxWidth="xl" sx={{ overflow: 'auto', height: '100%' }}>
      <Stack sx={{ width: '100%' }}>
        <Stack spacing={2} pt={2} pb={2}>
          <Breadcrumbs
            separator={<NavigateNextIcon fontSize="medium" />}
            aria-label="breadcrumb"
          >
            {[breadcrumbs]}
          </Breadcrumbs>
        </Stack>
        <Stack paddingBottom={4}>
          <Typography variant="h4" pb={3}>
            Production Change History
          </Typography>
          <Grid container spacing={2}>
            {list.map((item, index) => (
              <Grid key={item.id + index} item xs={12}>
                <ChangeHistoryItem data={item} />
              </Grid>
            ))}
          </Grid>
          {hasMore && (
            <LoadingButton
              sx={{ maxWidth: 180, margin: '24px auto' }}
              loading={loading}
              disabled={loading}
              variant="contained"
              color="secondary"
              type="submit"
              onClick={() => setPage((p) => p + 1)}
            >
              Show More History
            </LoadingButton>
          )}
        </Stack>
      </Stack>
    </Container>
  );
};

interface ChangeHistoryPageProps {}

export default ChangeHistoryPage;
