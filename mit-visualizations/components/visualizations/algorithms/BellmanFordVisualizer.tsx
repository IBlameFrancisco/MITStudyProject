'use client';

/**
 * Bellman-Ford Visualizer
 * =======================
 * Interactive visualization of the Bellman-Ford algorithm for shortest paths.
 */

import { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ControlPanel from '@/components/ui/ControlPanel';
import { LaTeX } from '@/components/ui/LaTeX';

type NodeState = 'default' | 'source' | 'updated' | 'finalized';
type EdgeState = 'default' | 'relaxing' | 'relaxed' | 'negative';

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

export default function BellmanFordVisualizer() {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [sourceNode, setSourceNode] = useState<number>(0);
  const [currentIteration, setCurrentIteration] = useState(0);
  const [currentEdge, setCurrentEdge] = useState<number>(-1);
  const [operation, setOperation] = useState<string>('');
  const [isAnimating, setIsAnimating] = useState(false);
  const [hasNegativeCycle, setHasNegativeCycle] = useState<boolean | null>(null);
  const [speed, setSpeed] = useState(50);
  const [includeNegativeEdge, setIncludeNegativeEdge] = useState(false);
  const animationRef = useRef(false);

  const SVG_WIDTH = 600;
  const SVG_HEIGHT = 400;
  const NODE_RADIUS = 26;
  const INF = 999999;

  const generateGraph = useCallback(() => {
    const newNodes: Node[] = [
      { id: 0, x: 80, y: 200, state: 'default', distance: INF, parent: null },
      { id: 1, x: 200, y: 80, state: 'default', distance: INF, parent: null },
      { id: 2, x: 200, y: 320, state: 'default', distance: INF, parent: null },
      { id: 3, x: 350, y: 140, state: 'default', distance: INF, parent: null },
      { id: 4, x: 350, y: 260, state: 'default', distance: INF, parent: null },
      { id: 5, x: 520, y: 200, state: 'default', distance: INF, parent: null },
    ];

    const newEdges: Edge[] = [
      { from: 0, to: 1, weight: 6, state: 'default' },
      { from: 0, to: 2, weight: 7, state: 'default' },
      { from: 1, to: 2, weight: 8, state: 'default' },
      { from: 1, to: 3, weight: 5, state: 'default' },
      { from: 1, to: 4, weight: -4, state: 'default' },
      { from: 2, to: 3, weight: -3, state: 'default' },
      { from: 2, to: 4, weight: 9, state: 'default' },
      { from: 3, to: 1, weight: -2, state: 'default' },
      { from: 4, to: 0, weight: 2, state: 'default' },
      { from: 4, to: 5, weight: 7, state: 'default' },
      { from: 3, to: 5, weight: 4, state: 'default' },
    ];

    // Add negative cycle edge if enabled
    if (includeNegativeEdge) {
      newEdges.push({ from: 5, to: 3, weight: -10, state: 'default' });
    }

    setNodes(newNodes);
    setEdges(newEdges);
    setCurrentIteration(0);
    setCurrentEdge(-1);
    setOperation('');
    setHasNegativeCycle(null);
  }, [includeNegativeEdge]);

  useState(() => {
    generateGraph();
  });

  const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const runBellmanFord = async () => {
    setIsAnimating(true);
    animationRef.current = true;
    setHasNegativeCycle(null);

    // Initialize
    const nodesCopy: Node[] = nodes.map(n => ({
      ...n,
      distance: n.id === sourceNode ? 0 : INF,
      parent: null,
      state: (n.id === sourceNode ? 'source' : 'default') as NodeState,
    }));
    const edgesCopy: Edge[] = edges.map(e => ({ ...e, state: 'default' as EdgeState }));

    setNodes(nodesCopy);
    setEdges(edgesCopy);
    setOperation(`Initialize: d[${sourceNode}] = 0, all others = ∞`);
    await sleep(800 - speed * 6);

    const V = nodesCopy.length;

    // Main loop: V-1 iterations
    for (let i = 1; i < V && animationRef.current; i++) {
      setCurrentIteration(i);
      setOperation(`Iteration ${i} of ${V - 1}`);
      await sleep(400 - speed * 3);

      let anyRelaxed = false;

      for (let j = 0; j < edgesCopy.length && animationRef.current; j++) {
        const edge = edgesCopy[j];
        setCurrentEdge(j);

        // Highlight current edge
        edgesCopy[j].state = 'relaxing' as EdgeState;
        setEdges([...edgesCopy]);

        const u = edge.from;
        const v = edge.to;
        const w = edge.weight;

        if (nodesCopy[u].distance !== INF && nodesCopy[u].distance + w < nodesCopy[v].distance) {
          nodesCopy[v].distance = nodesCopy[u].distance + w;
          nodesCopy[v].parent = u;
          nodesCopy[v].state = 'updated' as NodeState;
          edgesCopy[j].state = 'relaxed' as EdgeState;
          anyRelaxed = true;
          setNodes([...nodesCopy]);
          setOperation(`Relaxed (${u},${v}): d[${v}] = ${nodesCopy[v].distance}`);
        } else {
          edgesCopy[j].state = 'default' as EdgeState;
          setOperation(`Edge (${u},${v}): No relaxation needed`);
        }

        setEdges([...edgesCopy]);
        await sleep(500 - speed * 4);
      }

      // Reset edge states for next iteration
      edgesCopy.forEach(e => {
        if (e.state === 'relaxing') e.state = 'default' as EdgeState;
      });

      if (!anyRelaxed) {
        setOperation(`Iteration ${i}: No changes - algorithm can terminate early`);
        break;
      }
    }

    // Check for negative cycles
    if (animationRef.current) {
      setOperation('Checking for negative cycles...');
      await sleep(600);

      let negativeCycle = false;
      for (let j = 0; j < edgesCopy.length && animationRef.current; j++) {
        const edge = edgesCopy[j];
        const u = edge.from;
        const v = edge.to;
        const w = edge.weight;

        edgesCopy[j].state = 'relaxing' as EdgeState;
        setEdges([...edgesCopy]);
        await sleep(300 - speed * 2);

        if (nodesCopy[u].distance !== INF && nodesCopy[u].distance + w < nodesCopy[v].distance) {
          negativeCycle = true;
          edgesCopy[j].state = 'negative' as EdgeState;
          setOperation(`Negative cycle detected! Edge (${u},${v}) can still be relaxed`);
          break;
        } else {
          edgesCopy[j].state = 'default' as EdgeState;
        }
        setEdges([...edgesCopy]);
      }

      setHasNegativeCycle(negativeCycle);
      if (!negativeCycle) {
        setOperation('No negative cycles detected. Shortest paths found!');
        nodesCopy.forEach(n => {
          if (n.distance !== INF) n.state = 'finalized' as NodeState;
        });
        setNodes([...nodesCopy]);
      }
    }

    setIsAnimating(false);
    animationRef.current = false;
    setCurrentEdge(-1);
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
      case 'source': return 'fill-blue-500';
      case 'updated': return 'fill-yellow-500';
      case 'finalized': return 'fill-green-500';
      default: return 'fill-gray-400';
    }
  };

  const getEdgeColor = (state: EdgeState) => {
    switch (state) {
      case 'relaxing': return 'stroke-yellow-500';
      case 'relaxed': return 'stroke-green-500';
      case 'negative': return 'stroke-red-500';
      default: return 'stroke-gray-400 dark:stroke-gray-600';
    }
  };

  const renderEdge = (edge: Edge, index: number) => {
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

    // Offset for parallel edges
    const perpX = -uy * 15;
    const perpY = ux * 15;

    const midX = (startX + endX) / 2 + perpX;
    const midY = (startY + endY) / 2 + perpY;

    const arrowSize = 10;
    const angle = Math.atan2(dy, dx);

    const isHighlighted = index === currentEdge;

    return (
      <g key={`${edge.from}-${edge.to}-${index}`}>
        <line
          x1={startX + perpX * 0.3}
          y1={startY + perpY * 0.3}
          x2={endX + perpX * 0.3}
          y2={endY + perpY * 0.3}
          className={getEdgeColor(edge.state)}
          strokeWidth={isHighlighted ? 4 : 2}
        />
        <polygon
          points={`
            ${endX + perpX * 0.3},${endY + perpY * 0.3}
            ${endX + perpX * 0.3 - arrowSize * Math.cos(angle - Math.PI / 6)},${endY + perpY * 0.3 - arrowSize * Math.sin(angle - Math.PI / 6)}
            ${endX + perpX * 0.3 - arrowSize * Math.cos(angle + Math.PI / 6)},${endY + perpY * 0.3 - arrowSize * Math.sin(angle + Math.PI / 6)}
          `}
          className={getEdgeColor(edge.state).replace('stroke-', 'fill-')}
        />
        <rect
          x={midX - 14}
          y={midY - 10}
          width={28}
          height={20}
          rx={4}
          className={`${edge.weight < 0 ? 'fill-red-100 dark:fill-red-900/30' : 'fill-surface-secondary'}`}
        />
        <text
          x={midX}
          y={midY + 5}
          textAnchor="middle"
          className={`font-mono text-sm font-bold ${edge.weight < 0 ? 'fill-red-600 dark:fill-red-400' : 'fill-content-primary'}`}
        >
          {edge.weight}
        </text>
      </g>
    );
  };

  return (
    <div>
      <h2 className="text-xl font-semibold text-content-primary mb-2">
        Bellman-Ford Algorithm
      </h2>
      <p className="text-sm text-content-secondary mb-6">
        Single-source shortest paths with negative edges. Time: <LaTeX math="O(VE)" />. Detects negative cycles.
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
              {edges.map((edge, index) => renderEdge(edge, index))}

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

            <div className="mt-2 text-center text-sm text-content-muted">
              Iteration: {currentIteration} / {nodes.length - 1}
              {currentEdge >= 0 && ` | Processing edge ${currentEdge + 1} / ${edges.length}`}
            </div>
          </div>

          {/* Negative Cycle Status */}
          {hasNegativeCycle !== null && (
            <div className={`rounded-xl p-4 border ${hasNegativeCycle ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800' : 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'}`}>
              <div className="flex items-center gap-2">
                {hasNegativeCycle ? (
                  <>
                    <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <span className="font-semibold text-red-800 dark:text-red-200">Negative Cycle Detected!</span>
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="font-semibold text-green-800 dark:text-green-200">No Negative Cycles - Valid Shortest Paths</span>
                  </>
                )}
              </div>
            </div>
          )}

          {/* Operation Status */}
          {operation && (
            <div className="bg-surface-secondary rounded-xl p-4 border border-edge-primary">
              <span className="text-sm text-content-primary font-mono">{operation}</span>
            </div>
          )}

          {/* Algorithm Steps */}
          <div className="bg-surface-secondary rounded-xl p-4 border border-edge-primary">
            <h4 className="text-sm font-semibold text-content-primary mb-2">Bellman-Ford Algorithm</h4>
            <ol className="text-xs text-content-secondary space-y-1 list-decimal list-inside">
              <li>Initialize: d[s] = 0, d[v] = ∞ for all v ≠ s</li>
              <li>Repeat |V| - 1 times: relax all edges</li>
              <li>Check for negative cycles: if any edge can still be relaxed, negative cycle exists</li>
            </ol>
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

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="negativeCycle"
                  checked={includeNegativeEdge}
                  onChange={(e) => {
                    setIncludeNegativeEdge(e.target.checked);
                  }}
                  disabled={isAnimating}
                  className="rounded"
                />
                <label htmlFor="negativeCycle" className="text-xs text-content-secondary">
                  Include negative cycle
                </label>
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
                  onClick={runBellmanFord}
                  className="w-full px-3 py-2 rounded-lg bg-brand-500 text-white text-sm font-medium hover:bg-brand-600"
                >
                  Run Bellman-Ford
                </button>
              )}

              <button
                onClick={resetGraph}
                disabled={isAnimating}
                className="w-full px-3 py-2 rounded-lg bg-surface-tertiary border border-edge-primary text-content-secondary text-sm font-medium hover:bg-surface-accent disabled:opacity-50"
              >
                Reset Graph
              </button>
            </div>
          </ControlPanel>

          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 border border-blue-200 dark:border-blue-800">
            <h4 className="text-sm font-semibold text-blue-800 dark:text-blue-200 mb-2">
              Key Properties
            </h4>
            <ul className="text-xs text-blue-700 dark:text-blue-300 space-y-1">
              <li>• Handles <strong>negative edges</strong></li>
              <li>• Detects <strong>negative cycles</strong></li>
              <li>• |V|-1 iterations guarantee convergence</li>
              <li>• Slower than Dijkstra: O(VE) vs O(E log V)</li>
            </ul>
          </div>

          <div className="bg-red-50 dark:bg-red-900/20 rounded-xl p-4 border border-red-200 dark:border-red-800">
            <h4 className="text-sm font-semibold text-red-800 dark:text-red-200 mb-2">
              Negative Cycles
            </h4>
            <p className="text-xs text-red-700 dark:text-red-300">
              A negative cycle is reachable from the source if after |V|-1 iterations,
              we can still relax an edge. This means shortest paths are undefined (−∞).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
