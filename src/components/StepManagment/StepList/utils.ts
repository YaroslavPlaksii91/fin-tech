import * as _ from 'lodash-es';

import { FlowNode } from '@domain/flow';

export const sortNodesAlphabetically = (nodes?: FlowNode[]) =>
  _.sortBy(nodes, (node) => node.data.name.toLowerCase());
