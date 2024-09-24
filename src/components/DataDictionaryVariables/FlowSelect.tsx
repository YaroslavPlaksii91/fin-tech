import { useNavigate, useParams } from 'react-router-dom';
import {
  FormControl,
  InputLabel,
  MenuItem,
  SelectChangeEvent
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import { StyledSelect, StyledListSubheader } from './styled';

import { PRODUCTION_FLOW_ID } from '@constants/common';
import routes from '@constants/routes';
import { useAppSelector } from '@store/hooks';
import { selectFlowList } from '@store/flowList/selectors';

const FlowSelect = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { flowList, flowProduction } = useAppSelector(selectFlowList);
  const flowId = id === PRODUCTION_FLOW_ID ? PRODUCTION_FLOW_ID : id;

  const handleChange = (event: SelectChangeEvent<unknown>) => {
    const selectedValue = event.target.value as string;
    const id =
      selectedValue === PRODUCTION_FLOW_ID ? PRODUCTION_FLOW_ID : selectedValue;
    navigate(routes.underwriting.flow.dataDictionary(id));
  };

  return (
    <FormControl sx={{ width: 320 }}>
      <InputLabel>Select Flow</InputLabel>
      <StyledSelect
        value={flowId}
        onChange={handleChange}
        label="Select Flow"
        defaultValue={PRODUCTION_FLOW_ID}
        IconComponent={ExpandMoreIcon}
        MenuProps={{
          PaperProps: {
            style: {
              maxHeight: 310
            }
          }
        }}
      >
        <StyledListSubheader>Flow on Production</StyledListSubheader>
        <MenuItem value={PRODUCTION_FLOW_ID}>{flowProduction.name}</MenuItem>
        <StyledListSubheader>Draft Flows</StyledListSubheader>
        {flowList.map((flow) => (
          <MenuItem key={flow.id} value={flow.id}>
            {flow.name}
          </MenuItem>
        ))}
      </StyledSelect>
    </FormControl>
  );
};

export default FlowSelect;
