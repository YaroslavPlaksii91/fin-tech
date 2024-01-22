import { useState } from 'react';
import {
  Button,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material';
import { useFieldArray, useForm } from 'react-hook-form';
import { useEdges, useNodes } from 'reactflow';

import { getConnectedNodesIdDFS } from './utils';

import { FlowNode } from '@domain/flow';
import StepDetailsHeader from '@components/StepManagment/StepDetailsHeader';
import { AddIcon, DeleteOutlineIcon } from '@components/shared/Icons';
import NumberInput from '@components/shared/NumberInput/NumberInput';
import SearchableSelect from '@components/shared/SearchableSelect/SearchableSelect';

interface ChampionChallengerProps {
  step: FlowNode;
}

interface Column {
  id: 'split' | 'step' | 'delete';
  label: string;
  minWidth?: number;
  width?: number;
  align?: 'left' | 'center';
}

const columns: readonly Column[] = [
  { id: 'split', label: 'User splits', minWidth: 170 },
  { id: 'step', label: 'Step', minWidth: 100 },
  {
    id: 'delete',
    label: '',
    minWidth: 40,
    align: 'center'
  }
];

interface Split {
  percentage: number;
  edgeId: string;
}

interface FieldValues {
  splits: Split[];
}

// const options = [
//   { edgeId: '1', label: 'Option One' },
//   { edgeId: '2', label: 'Option Two' },
//   { edgeId: '3', label: 'Option Three' },
//   { edgeId: '4', label: 'Option Four' }
// ];

const ChampionChallenger: React.FC<ChampionChallengerProps> = ({ step }) => {
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const edges = useEdges();
  const nodes = useNodes();
  const connectedNodeIds = getConnectedNodesIdDFS(edges, step.id);
  const options = nodes
    .filter((node) => connectedNodeIds.includes(node.id))
    .map((node) => ({ edgeId: node.id, label: (node as FlowNode).data.name }));

  const { handleSubmit, control } = useForm<FieldValues>({
    defaultValues: {
      splits: [{ percentage: 100, edgeId: '' }]
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'splits'
  });

  const onSubmit = () => {
    // event.preventDefault();
    // console.log('data', data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <StepDetailsHeader
        title={step.data.name}
        details="A Champion Challenger is an step that allows you to split traffic into
   several groups and run experiment."
        onDiscard={() => 'click'}
        onSave={() => {}}
      />
      <Stack pl={3} pr={3}>
        <Paper sx={{ width: '100%', overflow: 'hidden' }}>
          <TableContainer sx={{ maxHeight: 440 }}>
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  {columns.map((column) => (
                    <TableCell
                      key={column.id}
                      align={column.align}
                      style={{ minWidth: column.minWidth }}
                    >
                      {column.label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {fields.map((field, index) => (
                  <TableRow key={field.id}>
                    <TableCell>
                      <NumberInput
                        control={control}
                        name={`splits.${index}.percentage`}
                      />
                    </TableCell>
                    <TableCell>
                      <SearchableSelect
                        index={index}
                        control={control}
                        name={`splits.${index}.edgeId`}
                        options={options}
                        selectedOptions={selectedOptions}
                        setSelectedOptions={setSelectedOptions}
                      />
                    </TableCell>
                    <TableCell width={40}>
                      <Button
                        onClick={() => {
                          const removedOption = fields[index].edgeId;
                          setSelectedOptions(
                            selectedOptions.filter(
                              (option) => option !== removedOption
                            )
                          );
                          remove(index);
                        }}
                      >
                        <DeleteOutlineIcon />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
        <Button
          sx={{ width: '135px' }}
          onClick={() => {
            append({ percentage: 0, edgeId: '' });
          }}
          startIcon={<AddIcon />}
        >
          Add new split
        </Button>
      </Stack>
    </form>
  );
};

export default ChampionChallenger;
