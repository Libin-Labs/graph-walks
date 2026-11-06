import test from 'node:test';
import assert from 'node:assert/strict';
import * as lib from '../dist/esm/index.js';
test('breadth-first order is deterministic and visits each node once', () => {
  const edges = [
    { from: 0, to: 2 },
    { from: 0, to: 1 },
    { from: 1, to: 3 },
    { from: 2, to: 3 },
  ];
  assert.deepEqual([...lib.breadthFirstWalk(5, edges, 0)], [0, 2, 1, 3]);
});
test('depth-first walk has iterative deterministic preorder', () => {
  const edges = [
    { from: 0, to: 1 },
    { from: 0, to: 2 },
    { from: 1, to: 3 },
  ];
  assert.deepEqual([...lib.depthFirstWalk(4, edges, 0)], [0, 1, 3, 2]);
});
test('directed traversal respects orientation and disconnected nodes', () => {
  const edges = [
    { from: 0, to: 1 },
    { from: 2, to: 0 },
  ];
  assert.deepEqual([...lib.breadthFirstWalk(3, edges, 0, { directed: true })], [0, 1]);
});
test('maxVisited bounds output and traversal can stop lazily', () => {
  const edges = Array.from({ length: 99 }, (_, i) => ({ from: i, to: i + 1 }));
  const walk = lib.breadthFirstWalk(100, edges, 0, { maxVisited: 7 });
  assert.deepEqual([...walk], [0, 1, 2, 3, 4, 5, 6]);
  assert.equal([...lib.depthFirstWalk(100, edges, 0, { maxVisited: 3 })].length, 3);
});
test('iterators own adjacency snapshot after construction', () => {
  const edges = [{ from: 0, to: 1 }];
  const walk = lib.breadthFirstWalk(3, edges, 0);
  edges.push({ from: 1, to: 2 });
  assert.deepEqual([...walk], [0, 1]);
});
test('invalid inputs and maxVisited are rejected before returning iterator', () => {
  assert.throws(() => lib.depthFirstWalk(0, [], 0), RangeError);
  assert.throws(() => lib.breadthFirstWalk(2, [{ from: 0, to: 2 }], 0), RangeError);
  assert.throws(() => lib.breadthFirstWalk(2, [], 0, { maxVisited: 3 }), RangeError);
});
