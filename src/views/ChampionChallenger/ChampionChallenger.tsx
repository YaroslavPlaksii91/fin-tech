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
import { ReactFlowInstance } from 'reactflow';
import { v4 as uuidv4 } from 'uuid';

import { getConnectedNodesIdDFS } from './utils';

import { FlowNode } from '@domain/flow';
import StepDetailsHeader from '@components/StepManagment/StepDetailsHeader';
import { AddIcon, DeleteOutlineIcon } from '@components/shared/Icons';
import NumberInput from '@components/shared/NumberInput/NumberInput';
import SearchableSelect from '@components/shared/SearchableSelect/SearchableSelect';
import { DEFAULT_EDGE_TYPE } from '@components/FlowManagment/FlowChart/types';

interface ChampionChallengerProps {
  step: FlowNode;
  rfInstance: ReactFlowInstance;
  // setEdges: (edges: Edge[]) => void;
  // setNodes: (nodes: Node[]) => void;
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
  nodeId: string;
}

interface FieldValues {
  splits: Split[];
}

const ChampionChallenger: React.FC<ChampionChallengerProps> = ({
  step,
  rfInstance
  // setEdges,
  // setNodes
}) => {
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const nodes = rfInstance.getNodes();
  const edges = rfInstance.getEdges();
  // const nodes = useNodes();
  // const edges = useEdges();

  const connectedNodeIds = getConnectedNodesIdDFS(edges, step.id);
  const options = nodes
    .filter((node) => connectedNodeIds.includes(node.id))
    .map((node) => ({ nodeId: node.id, label: (node as FlowNode).data.name }));

  const { handleSubmit, control } = useForm<FieldValues>({
    defaultValues: {
      splits: [{ percentage: 100, nodeId: '' }]
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'splits'
  });

  const onSubmit = (data: FieldValues) => {
    const targetNodesIds = data.splits.map((spl) => spl.nodeId);
    const splitEdges = targetNodesIds.map((targetNodeId) => {
      const newEdgeId = uuidv4();
      return {
        id: newEdgeId,
        sourceHandle: newEdgeId,
        source: step.id,
        target: targetNodeId,
        type: DEFAULT_EDGE_TYPE
      };
    });
    const newEdges = edges
      .filter((edg) => !targetNodesIds.includes(edg.target))
      .concat(splitEdges);
    rfInstance.setEdges(newEdges);
    rfInstance.setNodes(
      nodes.map((node: FlowNode) => {
        if (node.id === step.id) {
          return {
            ...node,
            data: {
              ...node.data,
              splits: splitEdges.map((splitEdge, index) => ({
                edgeId: splitEdge.id,
                percentage: data.splits[index].percentage
              }))
            }
          };
        }
        return node;
      })
    );
  };

  // useEffect(() => {
  //   step.data.splits?.map(split => getEdge())
  //   const edges =
  // }, [step])

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
                        name={`splits.${index}.nodeId`}
                        options={options}
                        selectedOptions={selectedOptions}
                        setSelectedOptions={setSelectedOptions}
                      />
                    </TableCell>
                    <TableCell width={40}>
                      <Button
                        onClick={() => {
                          const removedOption = fields[index].nodeId;
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
            append({ percentage: 0, nodeId: '' });
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
