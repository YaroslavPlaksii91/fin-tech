import { Button } from '@mui/material';

import TuneIcon from '@icons/tune.svg';

interface FiltersButtonProps {
  onClick: () => void;
  text?: string;
}

const FiltersButton = ({ onClick, text = 'Filters' }: FiltersButtonProps) => (
  <Button
    size="small"
    color="inherit"
    variant="outlined"
    sx={{ minWidth: '80px', borderRadius: '6px' }}
    startIcon={<TuneIcon />}
    onClick={onClick}
  >
    {text}
  </Button>
);

export default FiltersButton;
