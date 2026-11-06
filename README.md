# @lp-labs/graph-walks

Snapshot-owning iterative breadth-first and depth-first vertex walks. Zero runtime and peer dependencies. MIT. Node.js 18+; ES2022-compatible browser runtimes. No browser globals are accessed at import.

## Install

```sh
npm install @lp-labs/graph-walks
```

## Quick start

```js
import { breadthFirstWalk } from '@lp-labs/graph-walks';
console.log([
  ...breadthFirstWalk(
    3,
    [
      { from: 0, to: 1 },
      { from: 0, to: 2 },
    ],
    0,
  ),
]);
```

Use the named ESM imports shown above. CommonJS uses `const { breadthFirstWalk } = require('@lp-labs/graph-walks');`. Both formats ship declarations.

## Public API and customization

Runtime exports: `breadthFirstWalk, depthFirstWalk`.

Public signatures: `breadthFirstWalk(vertexCount: number, edges: readonly GraphEdge[], start: number, options?: WalkOptions): IterableIterator<number>; depthFirstWalk(vertexCount: number, edges: readonly GraphEdge[], start: number, options?: WalkOptions): IterableIterator<number>`.

Types: `GraphEdge = { from: number; to: number }`; `WalkOptions = { directed?: boolean; maxVisited?: number }`. `directed` defaults to `false`; `maxVisited` defaults to `vertexCount`.

Both functions return lazy iterable iterators, visit each reachable vertex at most once, preserve adjacency order deterministically, and accept directed mode and a maxVisited cap. Edges are copied and validated at iterator creation. All graph vertices are integer indices from `0` to `vertexCount - 1`; edges are copied into algorithm-owned structures. Options are per call; no global configuration.

## Errors, ownership and limits

O(V+E) preprocessing and O(V+E) traversal, bounded by 100,000 vertices and 1,000,000 edges; maxVisited defaults to vertexCount. Invalid vertex counts, endpoints, edge shapes, option values, work exhaustion, and impossible numeric results raise `RangeError`. Results are fresh arrays/objects; input arrays are not mutated.

Synchronous algorithms are bounded by stated input/work limits, not cancellable or real-time. Validation does not sandbox hostile getters, proxies, or callbacks. Finite floating-point behavior applies where weights are used. No I/O, network, persistence, or cryptographic guarantees.

## Development

```sh
npm ci --offline
npm run build
npm run typecheck
npm test
npm run format:check
```

Strict TypeScript NodeNext builds produce ESM, CommonJS, and declarations. Installed ESM/CommonJS consumer checks and seeded or exhaustive reference-oracle tests are included. Only TypeScript and Prettier are development dependencies.

## Support

If this library is useful to you, consider supporting its maintenance with a [donation via PayPal](https://www.paypal.me/LibinPrasanth).

## Author

Created by [Libin Prasanth](https://www.linkedin.com/in/libinprasanth/). Connect on LinkedIn for updates and discussion.
