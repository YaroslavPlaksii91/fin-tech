import ReactJson from '@microlink/react-json-view';
import { memo } from 'react';
import { Typography } from '@mui/material';

import { jsonViewTheme } from './constants';

const AccordionContent = ({ json }: { json?: string | null }) => (
  <Typography sx={{ overflow: 'auto' }} component="div" variant="body2">
    {json ? (
      <ReactJson
        name={false}
        displayObjectSize={false}
        displayDataTypes={false}
        src={JSON.parse(json) as object}
        theme={jsonViewTheme}
        style={{ fontFamily: 'inherit', fontSize: 'inherit' }}
      />
    ) : (
      'No data'
    )}
  </Typography>
);

export default memo(AccordionContent);
