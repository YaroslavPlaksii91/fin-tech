import { useState } from 'react';
import { Button, CircularProgress } from '@mui/material';
import { AxiosResponse } from 'axios';

import Logger from '@utils/logger';
import ExportCSV from '@icons/exportCSV.svg';

interface ExportCSVButtonProps {
  fileName: string;
  exportFile: () => Promise<AxiosResponse>;
  exportFormat?: string;
}

const ExportCSVButton: React.FC<ExportCSVButtonProps> = ({
  fileName,
  exportFile,
  exportFormat = 'csv'
}) => {
  const [loading, setLoading] = useState(false);

  const handleExport = async () => {
    try {
      setLoading(true);

      const res = await exportFile();

      const href = URL.createObjectURL(new Blob([res.data]));

      //TODO get filename form res header when BE will be ready
      // const contentDisposition = res.headers['content-disposition'];
      // const filename = contentDisposition.match(
      //   /filename=(?<filename>[^,;]+);/
      // )[0];

      const link = document.createElement('a');
      link.href = href;
      link.setAttribute('download', `${fileName}.${exportFormat}`);
      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);
      URL.revokeObjectURL(href);
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
    >
      Export CSV
    </Button>
  );
};

export default ExportCSVButton;
