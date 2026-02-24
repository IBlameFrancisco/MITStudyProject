'use client';

/**
 * Dijkstra's Algorithm Visualizer
 * ================================
 * Interactive visualization of Dijkstra's shortest path algorithm.
 */

import { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ControlPanel from '@/components/ui/ControlPanel';
import { LaTeX } from '@/components/ui/LaTeX';

type NodeState = 'unvisited' | 'inQueue' | 'current' | 'visited';
type EdgeState = 'default' | 'considering' | 'relaxed' | 'inPath';

interface Node {
  id: number;
  x: number;
  y: number;
  state: NodeState;
  distance: number;
  parent: number | null;
}

interface Edge {
  from: number;
  to: number;
  weight: number;
  state: EdgeState;
}

interface PriorityQueueItem {
  nodeId: number;
  priority: number;
}

export default function DijkstraVisualizer() {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [priorityQueue, setPriorityQueue] = useState<PriorityQueueItem[]>([]);
  const [sourceNode, setSourceNode] = useState<number>(0);
  const [operation, setOperation] = useState<string>('');
  const [isAnimating, setIsAnimating] = useState(false);
  const [speed, setSpeed] = useState(50);
  const animationRef = useRef(false);

  const SVG_WIDTH = 600;
  const SVG_HEIGHT = 400;
  const NODE_RADIUS = 26;
  const INF = 999999;

  const generateGraph = useCallback(() => {
    const newNodes: Node[] = [
      { id: 0, x: 80, y: 200, state: 'unvisited', distance: INF, parent: null },
      { id: 1, x: 180, y: 80, state: 'unvisited', distance: INF, parent: null },
      { id: 2, x: 180, y: 320, state: 'unvisited', distance: INF, parent: null },
      { id: 3, x: 320, y: 80, state: 'unvisited', distance: INF, parent: null },
      { id: 4, x: 320, y: 320, state: 'unvisited', distance: INF, parent: null },
      { id: 5, x: 450, y: 200, state: 'unvisited', distance: INF, parent: null },
      { id: 6, x: 550, y: 200, state: 'unvisited', distance: INF, parent: null },
    ];

    const newEdges: Edge[] = [
      { from: 0, to: 1, weight: 4, state: 'default' },
      { from: 0, to: 2, weight: 2, state: 'default' },
      { from: 1, to: 2, weight: 1, state: 'default' },
      { from: 1, to: 3, weight: 5, state: 'default' },
      { from: 2, to: 3, weight: 8, state: 'default' },
      { from: 2, to: 4, weight: 10, state: 'default' },
      { from: 3, to: 4, weight: 2, state: 'default' },
      { from: 3, to: 5, weight: 6, state: 'default' },
      { from: 4, to: 5, weight: 3, state: 'default' },
      { from: 5, to: 6, weight: 1, state: 'default' },
    ];

    setNodes(newNodes);
    setEdges(newEdges);
    setPriorityQueue([]);
    setOperation('');
  }, []);

  useState(() => {
    generateGraph();
  });

  const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const getNeighbors = (nodeId: number): { to: number; weight: number }[] => {
    const neighbors: { to: number; weight: number }[] = [];
    edges.forEach(edge => {
      if (edge.from === nodeId) {
        neighbors.push({ to: edge.to, weight: edge.weight });
      }
    });
    return neighbors;
  };

  const runDijkstra = async () => {
    setIsAnimating(true);
    animationRef.current = true;

    // Initialize
    const nodesCopy: Node[] = nodes.map(n => ({
      ...n,
      distance: n.id === sourceNode ? 0 : INF,
      parent: null,
      state: 'unvisited' as NodeState,
    }));
    const edgesCopy: Edge[] = edges.map(e => ({ ...e, state: 'default' as EdgeState }));

    nodesCopy[sourceNode].state = 'inQueue' as NodeState;
    setNodes(nodesCopy);
    setEdges(edgesCopy);

    // Priority queue (min-heap simulation with array)
    const pq: PriorityQueueItem[] = [{ nodeId: sourceNode, priority: 0 }];
    setPriorityQueue([...pq]);
    setOperation(`Initialize: d[${sourceNode}] = 0, add to priority queue`);
    await sleep(800 - speed * 6);

    while (pq.length > 0 && animationRef.current) {
      // Extract min
      pq.sort((a, b) => a.priority - b.priority);
      const { nodeId: u, priority } = pq.shift()!;
      setPriorityQueue([...pq]);

      // Skip if already processed with better distance
      if (nodesCopy[u].state === 'visited') {
        continue;
      }

      nodesCopy[u].state = 'current' as NodeState;
      setNodes([...nodesCopy]);
      setOperation(`Extract-Min: node ${u} with d[${u}] = ${priority}`);
      await sleep(600 - speed * 5);

      // Process neighbors
      const neighbors = getNeighbors(u);
      for (const { to: v, weight } of neighbors) {
        if (!animationRef.current) break;
        if (nodesCopy[v].state === 'visited') continue;

        // Highlight edge being considered
        const edgeIdx = edgesCopy.findIndex(e => e.from === u && e.to === v);
        if (edgeIdx !== -1) {
          edgesCopy[edgeIdx].state = 'considering' as EdgeState;
          setEdges([...edgesCopy]);
        }

        const newDist = nodesCopy[u].distance + weight;
        setOperation(`Considering edge (${u},${v}): ${nodesCopy[u].distance} + ${weight} = ${newDist} vs d[${v}] = ${nodesCopy[v].distance >= INF ? '∞' : nodesCopy[v].distance}`);
        await sleep(500 - speed * 4);

        if (newDist < nodesCopy[v].distance) {
          nodesCopy[v].distance = newDist;
          nodesCopy[v].parent = u;
          nodesCopy[v].state = 'inQueue' as NodeState;

          if (edgeIdx !== -1) {
            edgesCopy[edgeIdx].state = 'relaxed' as EdgeState;
          }

          // Add to priority queue (or decrease key)
          const existingIdx = pq.findIndex(item => item.nodeId === v);
          if (existingIdx !== -1) {
            pq[existingIdx].priority = newDist;
          } else {
            pq.push({ nodeId: v, priority: newDist });
          }
          setPriorityQueue([...pq]);
          setNodes([...nodesCopy]);
          setOperation(`Relaxed: d[${v}] = ${newDist}`);
        } else {
          if (edgeIdx !== -1) {
            edgesCopy[edgeIdx].state = 'default' as EdgeState;
          }
        }
        setEdges([...edgesCopy]);
        await sleep(400 - speed * 3);
      }

      // Mark as visited
      nodesCopy[u].state = 'visited' as NodeState;
      setNodes([...nodesCopy]);
      await sleep(300 - speed * 2);
    }

    if (animationRef.current) {
      setOperation('Dijkstra complete! All shortest paths found.');
    }

    setIsAnimating(false);
    animationRef.current = false;
  };

  const showPath = (target: number) => {
    if (nodes[target].distance >= INF) {
      setOperation(`No path from ${sourceNode} to ${target}`);
      return;
    }

    const edgesCopy = edges.map(e => ({ ...e, state: 'default' as EdgeState }));
    const path: number[] = [];
    let current: number | null = target;

    while (current !== null) {
      path.unshift(current);
      const parent: number | null = nodes[current].parent;
      if (parent !== null) {
        const edgeIdx = edgesCopy.findIndex(e => e.from === parent && e.to === current);
        if (edgeIdx !== -1) {
          edgesCopy[edgeIdx].state = 'inPath' as EdgeState;
        }
      }
      current = parent;
    }

    setEdges(edgesCopy);
    setOperation(`Shortest path to ${target}: ${path.join(' → ')} (distance: ${nodes[target].distance})`);
  };

  const stopAlgorithm = () => {
    animationRef.current = false;
    setIsAnimating(false);
  };

  const resetGraph = () => {
    generateGraph();
  };

  const getNodeColor = (state: NodeState) => {
    switch (state) {
      case 'inQueue': return 'fill-yellow-500';
      case 'current': return 'fill-blue-500';
      case 'visited': return 'fill-green-500';
      default: return 'fill-gray-400';
    }
  };

  const getEdgeColor = (state: EdgeState) => {
    switch (state) {
      case 'considering': return 'stroke-yellow-500';
      case 'relaxed': return 'stroke-green-500';
      case 'inPath': return 'stroke-blue-500';
      default: return 'stroke-gray-400 dark:stroke-gray-600';
    }
  };

  const renderEdge = (edge: Edge) => {
    const fromNode = nodes.find(n => n.id === edge.from);
    const toNode = nodes.find(n => n.id === edge.to);
    if (!fromNode || !toNode) return null;

    const dx = toNode.x - fromNode.x;
    const dy = toNode.y - fromNode.y;
    const len = Math.sqrt(dx * dx + dy * dy);
    const ux = dx / len;
    const uy = dy / len;

    const startX = fromNode.x + ux * NODE_RADIUS;
    const startY = fromNode.y + uy * NODE_RADIUS;
    const endX = toNode.x - ux * (NODE_RADIUS + 8);
    const endY = toNode.y - uy * (NODE_RADIUS + 8);

    const midX = (startX + endX) / 2;
    const midY = (startY + endY) / 2;

    const arrowSize = 10;
    const angle = Math.atan2(dy, dx);

    return (
      <g key={`${edge.from}-${edge.to}`}>
        <line
          x1={startX}
          y1={startY}
          x2={endX}
          y2={endY}
          className={getEdgeColor(edge.state)}
          strokeWidth={edge.state === 'inPath' ? 4 : 2}
        />
        <polygon
          points={`
            ${endX},${endY}
            ${endX - arrowSize * Math.cos(angle - Math.PI / 6)},${endY - arrowSize * Math.sin(angle - Math.PI / 6)}
            ${endX - arrowSize * Math.cos(angle + Math.PI / 6)},${endY - arrowSize * Math.sin(angle + Math.PI / 6)}
          `}
          className={getEdgeColor(edge.state).replace('stroke-', 'fill-')}
        />
        <rect
          x={midX - 12}
          y={midY - 10}
          width={24}
          height={20}
          rx={4}
          className="fill-surface-secondary"
        />
        <text
          x={midX}
          y={midY + 5}
          textAnchor="middle"
          className="fill-content-primary font-mono text-sm font-bold"
        >
          {edge.weight}
        </text>
      </g>
    );
  };

  return (
    <div>
      <h2 className="text-xl font-semibold text-content-primary mb-2">
        Dijkstra's Algorithm
      </h2>
      <p className="text-sm text-content-secondary mb-6">
        Single-source shortest paths with non-negative edges. Time: <LaTeX math="O((V + E) \log V)" /> with binary heap.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 space-y-4">
          {/* Graph Visualization */}
          <div className="bg-surface-tertiary rounded-2xl p-4 border border-edge-primary">
            <svg
              width="100%"
              height={SVG_HEIGHT}
              viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`}
              className="overflow-visible"
            >
              {/* Edges */}
              {edges.map(edge => renderEdge(edge))}

              {/* Nodes */}
              {nodes.map(node => (
                <g key={node.id}>
                  <motion.circle
                    cx={node.x}
                    cy={node.y}
                    r={NODE_RADIUS}
                    className={getNodeColor(node.state)}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    whileHover={{ scale: 1.1 }}
                    style={{ cursor: 'pointer' }}
                    onClick={() => !isAnimating && showPath(node.id)}
                  />
                  <text
                    x={node.x}
                    y={node.y + 5}
                    textAnchor="middle"
                    className="fill-white font-mono text-sm font-bold"
                  >
                    {node.id}
                  </text>
                  <text
                    x={node.x}
                    y={node.y - NODE_RADIUS - 8}
                    textAnchor="middle"
                    className="fill-content-primary font-mono text-xs font-bold"
                  >
                    d={node.distance >= INF ? '∞' : node.distance}
                  </text>
                </g>
              ))}
            </svg>

            {/* Legend */}
            <div className="mt-4 flex flex-wrap items-center justify-center gap-4 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-content-muted rounded-full" />
                <span className="text-content-muted">Unvisited</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-yellow-500 rounded-full" />
                <span className="text-content-muted">In Queue</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-blue-500 rounded-full" />
                <span className="text-content-muted">Current</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-green-500 rounded-full" />
                <span className="text-content-muted">Visited</span>
              </div>
            </div>
          </div>

          {/* Priority Queue Visualization */}
          <div className="bg-surface-secondary rounded-xl p-4 border border-edge-primary">
            <h4 className="text-sm font-semibold text-content-primary mb-3">
              Priority Queue (Min-Heap)
            </h4>
            <div className="flex items-center gap-2 flex-wrap">
              <AnimatePresence>
                {priorityQueue
                  .sort((a, b) => a.priority - b.priority)
                  .map((item, idx) => (
                    <motion.div
                      key={`${item.nodeId}-${idx}`}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="flex flex-col items-center px-3 py-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg border border-yellow-300 dark:border-yellow-700"
                    >
                      <span className="font-mono font-bold text-yellow-800 dark:text-yellow-200">
                        {item.nodeId}
                      </span>
                      <span className="text-xs text-yellow-600 dark:text-yellow-400">
                        d={item.priority}
                      </span>
                    </motion.div>
                  ))}
              </AnimatePresence>
              {priorityQueue.length === 0 && (
                <span className="text-content-muted text-sm italic">empty</span>
              )}
            </div>
          </div>

          {/* Operation Status */}
          {operation && (
            <div className="bg-surface-secondary rounded-xl p-4 border border-edge-primary">
              <span className="text-sm text-content-primary font-mono">{operation}</span>
            </div>
          )}

          {/* Algorithm Pseudocode */}
          <div className="bg-surface-secondary rounded-xl p-4 border border-edge-primary">
            <h4 className="text-sm font-semibold text-content-primary mb-2">Dijkstra's Algorithm</h4>
            <pre className="text-xs text-content-secondary font-mono whitespace-pre-wrap">
{`1. Initialize d[s] = 0, d[v] = ∞ for v ≠ s
2. Insert all vertices into priority queue Q
3. While Q is not empty:
   a. u = Extract-Min(Q)
   b. For each neighbor v of u:
      if d[u] + w(u,v) < d[v]:
         d[v] = d[u] + w(u,v)
         Decrease-Key(Q, v, d[v])`}
            </pre>
          </div>
        </div>

        {/* Controls */}
        <div className="space-y-4">
          <ControlPanel title="Controls">
            <div className="space-y-3">
              <div>
                <label className="text-xs text-content-muted">Source Node</label>
                <select
                  value={sourceNode}
                  onChange={(e) => setSourceNode(parseInt(e.target.value))}
                  disabled={isAnimating}
                  className="w-full mt-1 px-3 py-2 rounded-lg border border-edge-primary bg-surface-secondary text-content-primary disabled:opacity-50"
                >
                  {nodes.map(node => (
                    <option key={node.id} value={node.id}>Node {node.id}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs text-content-muted">Animation Speed</label>
                <input
                  type="range"
                  min={1}
                  max={100}
                  value={speed}
                  onChange={(e) => setSpeed(parseInt(e.target.value))}
                  className="w-full mt-1"
                />
              </div>

              {isAnimating ? (
                <button
                  onClick={stopAlgorithm}
                  className="w-full px-3 py-2 rounded-lg bg-red-500 text-white text-sm font-medium hover:bg-red-600"
                >
                  Stop
                </button>
              ) : (
                <button
                  onClick={runDijkstra}
                  className="w-full px-3 py-2 rounded-lg bg-brand-500 text-white text-sm font-medium hover:bg-brand-600"
                >
                  Run Dijkstra
                </button>
              )}

              <button
                onClick={resetGraph}
                disabled={isAnimating}
                className="w-full px-3 py-2 rounded-lg bg-surface-tertiary border border-edge-primary text-content-secondary text-sm font-medium hover:bg-surface-accent disabled:opacity-50"
              >
                Reset Graph
              </button>

              <p className="text-xs text-content-muted">
                Click nodes to show shortest path after running
              </p>
            </div>
          </ControlPanel>

          <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-xl p-4 border border-emerald-200 dark:border-emerald-800">
            <h4 className="text-sm font-semibold text-emerald-800 dark:text-emerald-200 mb-2">
              Key Properties
            </h4>
            <ul className="text-xs text-emerald-700 dark:text-emerald-300 space-y-1">
              <li>• <strong>Greedy:</strong> Always processes minimum distance vertex</li>
              <li>• <strong>Non-negative edges only</strong></li>
              <li>• Once a vertex is visited, its distance is final</li>
              <li>• Uses priority queue for efficiency</li>
            </ul>
          </div>

          <div className="bg-amber-50 dark:bg-amber-900/20 rounded-xl p-4 border border-amber-200 dark:border-amber-800">
            <h4 className="text-sm font-semibold text-amber-800 dark:text-amber-200 mb-2">
              Complexity
            </h4>
            <ul className="text-xs text-amber-700 dark:text-amber-300 space-y-1">
              <li>• Binary heap: <LaTeX math="O((V+E) \log V)" /></li>
              <li>• Fibonacci heap: <LaTeX math="O(E + V \log V)" /></li>
              <li>• Array (no heap): <LaTeX math="O(V^2)" /></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
