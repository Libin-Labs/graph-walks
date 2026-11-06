export interface GraphEdge {
  from: number;
  to: number;
}
export interface WalkOptions {
  directed?: boolean;
  maxVisited?: number;
}
type Neighbor = { to: number; edgeId: number };
function prepare(
  vertexCount: number,
  edges: readonly GraphEdge[],
  start: number,
  options: WalkOptions,
): { adjacency: Neighbor[][]; maxVisited: number } {
  if (!Number.isSafeInteger(vertexCount) || vertexCount < 1 || vertexCount > 100_000)
    throw new RangeError('Invalid vertexCount');
  if (!Number.isSafeInteger(start) || start < 0 || start >= vertexCount)
    throw new RangeError('Invalid start');
  if (!options || typeof options !== 'object') throw new RangeError('Invalid options');
  if (options.directed !== undefined && typeof options.directed !== 'boolean')
    throw new RangeError('directed must be boolean');
  if (!Array.isArray(edges) || edges.length > 1_000_000) throw new RangeError('Invalid edges');
  const maxVisited = options.maxVisited === undefined ? vertexCount : options.maxVisited;
  if (!Number.isSafeInteger(maxVisited) || maxVisited < 1 || maxVisited > vertexCount)
    throw new RangeError('Invalid maxVisited');
  const adjacency: Neighbor[][] = Array.from({ length: vertexCount }, () => []);
  edges.forEach((edge, edgeId) => {
    if (!edge || typeof edge !== 'object') throw new RangeError('Invalid edge');
    const { from, to } = edge;
    if (
      !Number.isSafeInteger(from) ||
      !Number.isSafeInteger(to) ||
      from < 0 ||
      to < 0 ||
      from >= vertexCount ||
      to >= vertexCount
    )
      throw new RangeError('Edge endpoint out of range');
    adjacency[from]!.push({ to, edgeId });
    if (!(options.directed ?? false)) adjacency[to]!.push({ to: from, edgeId });
  });
  return { adjacency, maxVisited };
}
export function breadthFirstWalk(
  vertexCount: number,
  edges: readonly GraphEdge[],
  start: number,
  options: WalkOptions = {},
): IterableIterator<number> {
  const { adjacency, maxVisited } = prepare(vertexCount, edges, start, options);
  return (function* () {
    const seen = new Uint8Array(vertexCount);
    const queue = [start];
    seen[start] = 1;
    for (let head = 0; head < queue.length && head < maxVisited; head++) {
      const node = queue[head]!;
      yield node;
      for (const { to } of adjacency[node]!) {
        if (!seen[to]) {
          seen[to] = 1;
          queue.push(to);
          if (queue.length === maxVisited) break;
        }
      }
    }
  })();
}
export function depthFirstWalk(
  vertexCount: number,
  edges: readonly GraphEdge[],
  start: number,
  options: WalkOptions = {},
): IterableIterator<number> {
  const { adjacency, maxVisited } = prepare(vertexCount, edges, start, options);
  return (function* () {
    const seen = new Uint8Array(vertexCount);
    const stack = [start];
    seen[start] = 1;
    let visited = 0;
    while (stack.length && visited < maxVisited) {
      const node = stack.pop()!;
      yield node;
      visited++;
      const neighbors = adjacency[node]!;
      for (let i = neighbors.length - 1; i >= 0; i--) {
        const next = neighbors[i]!.to;
        if (!seen[next]) {
          seen[next] = 1;
          stack.push(next);
        }
      }
    }
  })();
}
