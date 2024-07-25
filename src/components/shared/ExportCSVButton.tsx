import { useState } from 'react';
import { Button, CircularProgress } from '@mui/material';
import { AxiosResponse } from 'axios';

import Logger from '@utils/logger';
import ExportCSV from '@icons/exportCSV.svg';
import { downloadFile } from '@utils/helpers';

interface ExportCSVButtonProps {
  defaultFileName: string;
  exportFile: () => Promise<AxiosResponse>;
}

const ExportCSVButton: React.FC<ExportCSVButtonProps> = ({
  defaultFileName,
  exportFile
}) => {
  const [loading, setLoading] = useState(false);

  const handleExport = async () => {
    try {
      setLoading(true);

      const res = await exportFile();

      let filename = `${defaultFileName}.csv`;

      const contentDisposition = res.headers['content-disposition'] as string;

      if (
        contentDisposition &&
        contentDisposition.indexOf('attachment') !== -1
      ) {
        const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
        const matches = filenameRegex.exec(contentDisposition);
        if (matches != null && matches[1]) {
          filename = matches[1].replace(/['"]/g, '');
        }
      }

      downloadFile(res.data as BlobPart, filename);
    } catch (error) {
      Logger.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      size="small"
      color="inherit"
      variant="outlined"
      sx={{ minWidth: '80px', borderRadius: '6px' }}
      startIcon={<ExportCSV />}
      endIcon={loading && <CircularProgress size={16} />}
      onClick={handleExport}
      disabled={loading}
    >
      Export CSV
    </Button>
  );
};

export default ExportCSVButton;
