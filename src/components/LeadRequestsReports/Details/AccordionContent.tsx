import ReactJson, { OnCopyProps } from '@microlink/react-json-view';
import { memo } from 'react';
import { Typography } from '@mui/material';

import { jsonViewTheme } from './constants';

const AccordionContent = ({ json }: { json?: string | null }) => {
  const handleCopy = async (copy: OnCopyProps) => {
    const jsonString = JSON.stringify(copy.src, null, 2);
    await navigator.clipboard.writeText(jsonString);
  };

  return (
    <Typography sx={{ overflow: 'auto' }} component="div" variant="body2">
      {json ? (
        <ReactJson
          name={false}
          displayObjectSize={false}
          displayDataTypes={false}
          src={JSON.parse(json) as object}
          theme={jsonViewTheme}
          style={{ fontFamily: 'inherit', fontSize: 'inherit' }}
          enableClipboard={handleCopy}
        />
      ) : (
        'No data'
      )}
    </Typography>
  );
};

export default memo(AccordionContent);
