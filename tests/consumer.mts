import {
  breadthFirstWalk,
  depthFirstWalk,
  type GraphEdge,
  type WalkOptions,
} from '@lp-labs/graph-walks';
export type PublicTypes = [GraphEdge, WalkOptions];
void breadthFirstWalk;
void depthFirstWalk;
// @ts-expect-error public API requires numeric vertex counts
depthFirstWalk('invalid', []);
