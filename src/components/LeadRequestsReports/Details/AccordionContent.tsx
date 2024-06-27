import ReactJson from '@microlink/react-json-view';
import { memo } from 'react';
import { Typography } from '@mui/material';

import { jsonViewTheme } from './constants';

const AccordionContent = ({ json }: { json?: string | null }) =>
  json ? (
    <Typography component="div" variant="body2">
      <ReactJson
        name={false}
        displayObjectSize={false}
        displayDataTypes={false}
        src={JSON.parse(json) as object}
        theme={jsonViewTheme}
        style={{ fontFamily: 'inherit', fontSize: 'inherit' }}
      />
    </Typography>
  ) : null;

export default memo(AccordionContent);
