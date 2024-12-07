import { useEffect, useState } from 'react';
import { Grid, Stack, Typography, Box } from '@mui/material';

import Logger from '@utils/logger';
import { ChangeHistoryRecord } from '@domain/changeHistory';
import { useLoading } from '@contexts/LoadingContext';
import LoadingButton from '@components/shared/Buttons/Loading';
import Item from '@components/ChangeHistory/Item';
import { flowService } from '@services/flow-service';

const PAGE_SIZE = 10;

const ChangeHistory = () => {
  const { startLoading, stopLoading, loading } = useLoading();
  const [list, setList] = useState<ChangeHistoryRecord[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchList = async (page: number) => {
    try {
      if (page === 1) {
        startLoading();
      }
      const res = await flowService.getChangeHistoryList(page, PAGE_SIZE);
      if (res.length < PAGE_SIZE) {
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
    <Box
      sx={{
        overflow: 'auto',
        padding: '0 24px',
        height: '100%'
      }}
    >
      <Stack sx={{ width: '100%' }}>
        <Stack paddingBottom={4}>
          <Typography variant="h4" pb={2} pt={2}>
            Changes History
          </Typography>
          <Grid container spacing={2}>
            {list.map((item, index) => (
              <Grid key={item.id + index} item xs={12}>
                <Item data={item} index={index} />
              </Grid>
            ))}
          </Grid>
          {hasMore && (
            <LoadingButton
              sx={{ maxWidth: 180, margin: '24px auto' }}
              loading={loading}
              disabled={loading}
              variant="outlined"
              color="secondary"
              type="submit"
              onClick={() => setPage((p) => p + 1)}
            >
              Show More History
            </LoadingButton>
          )}
        </Stack>
      </Stack>
    </Box>
  );
};

export default ChangeHistory;
