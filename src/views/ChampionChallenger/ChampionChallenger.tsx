import { useState, useEffect } from 'react';
import {
  Button,
  Paper,
  Stack,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  Typography
} from '@mui/material';
import { useFieldArray, useForm } from 'react-hook-form';
import { ReactFlowInstance } from 'reactflow';
import { v4 as uuidv4 } from 'uuid';
import { yupResolver } from '@hookform/resolvers/yup';
import isEmpty from 'lodash/isEmpty';

import { getConnectedNodesIdDFS } from './utils';
import validationSchema from './validationSchema';
import { FieldValues, columns } from './types';

import { FlowNode } from '@domain/flow';
import StepDetailsHeader from '@components/StepManagment/StepDetailsHeader';
import { AddIcon, DeleteOutlineIcon } from '@components/shared/Icons';
import NumberInput from '@components/shared/NumberInput/NumberInput';
import SearchableSelect from '@components/shared/SearchableSelect/SearchableSelect';
import { DEFAULT_EDGE_TYPE } from '@components/FlowManagment/FlowChart/types';
import ErrorMessage from '@components/shared/ErrorText/ErrorText';
import { InputText } from '@components/shared/Forms/InputText';
import {
  StyledTableCell,
  StyledTableRow
} from '@components/shared/Table/styled';

interface ChampionChallengerProps {
  step: FlowNode;
  rfInstance: ReactFlowInstance;
}

const ChampionChallenger: React.FC<ChampionChallengerProps> = ({
  step,
  rfInstance: { getEdge, getNodes, getEdges, setNodes, setEdges }
}) => {
  const [options, setOptions] = useState<{ nodeId: string; label: string }[]>(
    []
  );
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);

  const nodes = getNodes();
  const edges = getEdges();

  const {
    handleSubmit,
    control,
    clearErrors,
    formState: { errors, isDirty },
    setValue
  } = useForm<FieldValues>({
    mode: 'onChange',
    defaultValues: { splits: [], note: '' },
    resolver: yupResolver(validationSchema)
  });

  const { fields, append, remove } = useFieldArray({
    name: 'splits',
    control
  });

  const onSubmit = (data: FieldValues) => {
    const existingSplitEdges =
      step.data.splits?.map(({ edgeId }) => edgeId) ?? [];

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
      .filter((edg) => !existingSplitEdges.includes(edg.id))
      .filter((edg) => !targetNodesIds.includes(edg.target))
      .concat(splitEdges);

    setEdges(newEdges);

    const updatedNodes = nodes.map((node: FlowNode) => {
      if (node.id === step.id) {
        if (node.data.splits?.length) {
          const test = node.data.splits;
          test.length = 0;
          test.push(
            ...splitEdges.map((splitEdge, index) => ({
              edgeId: splitEdge.id,
              percentage: data.splits[index].percentage
            }))
          );
          node.data = {
            ...node.data,
            note: data.note,
            splits: [...test]
          };
          // return {
          //   ...node,
          //   data: {
          //     ...node.data,
          //     splits: test
          //   }
          // };
        } else {
          node.data = {
            ...node.data,
            note: data.note,
            splits: splitEdges.map((splitEdge, index) => ({
              edgeId: splitEdge.id,
              percentage: data.splits[index].percentage
            }))
          };
        }
      }
      return node;
    });

    setNodes(updatedNodes);
  };

  useEffect(() => {
    const connectedNodeIds = getConnectedNodesIdDFS(edges, step.id);
    const formattedOptions = nodes
      .filter((node) => connectedNodeIds.includes(node.id))
      .map((node) => ({
        nodeId: node.id,
        label: (node as FlowNode).data.name
      }));
    setOptions(formattedOptions);
  }, [nodes.length, edges.length, step.id]);

  useEffect(() => {
    if (step.data.splits) {
      const defaultSelectedOptions: string[] = [];
      const defaultNote = step.data.note || '';
      const defaultSplits = step.data.splits.map((split) => {
        const connectedEdges = getEdge(split.edgeId);
        const connectedNode = connectedEdges?.target || '';
        defaultSelectedOptions.push(connectedNode);
        return {
          percentage: split.percentage,
          nodeId: connectedNode
        };
      });
      setValue('splits', defaultSplits);
      setValue('note', defaultNote);
      setSelectedOptions(defaultSelectedOptions);
    }
  }, [step.data]);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <StepDetailsHeader
        title={step.data.name}
        details="A Champion Challenger is an step that allows you to split traffic into
   several groups and run experiment."
        onDiscard={() => 'click'}
        onSave={() => {}}
        disabled={!isDirty || !isEmpty(errors)}
      />
      <Stack pl={3} pr={3}>
        <Paper sx={{ width: '100%', overflow: 'hidden', marginBottom: '16px' }}>
          <TableContainer sx={{ maxHeight: 440 }}>
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <StyledTableRow>
                  {columns.map((column) => (
                    <StyledTableCell
                      key={column.id}
                      align={column.align}
                      style={{ width: column.width }}
                    >
                      {column.label}
                    </StyledTableCell>
                  ))}
                </StyledTableRow>
              </TableHead>
              <TableBody>
                {fields.map((field, index) => (
                  <StyledTableRow key={field.id}>
                    <StyledTableCell sx={{ padding: '0 12px' }}>
                      <NumberInput
                        control={control}
                        name={`splits.${index}.percentage`}
                        onChangeCb={() => clearErrors()}
                      />
                    </StyledTableCell>
                    <StyledTableCell sx={{ padding: 0 }}>
                      <SearchableSelect
                        index={index}
                        control={control}
                        onChangeCb={() => clearErrors()}
                        name={`splits.${index}.nodeId`}
                        options={options}
                        selectedOptions={selectedOptions}
                        setSelectedOptions={setSelectedOptions}
                      />
                    </StyledTableCell>
                    <StyledTableCell sx={{ padding: 0 }} width={40}>
                      <Button
                        fullWidth
                        sx={{ padding: '10px' }}
                        onClick={() => {
                          clearErrors();
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
                    </StyledTableCell>
                  </StyledTableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
        <ErrorMessage errors={errors} name="splits" />
        <Button
          sx={{ width: '135px' }}
          onClick={() => {
            append({ percentage: 0, nodeId: '' });
          }}
          startIcon={<AddIcon />}
        >
          Add new split
        </Button>
        <Stack pt="18px" width="558px">
          <Typography variant="h2" pb="16px">
            Note for this object
          </Typography>
          <InputText
            fullWidth
            name="note"
            control={control}
            label="Note"
            placeholder="Enter note here"
          />
        </Stack>
      </Stack>
    </form>
  );
};

export default ChampionChallenger;
