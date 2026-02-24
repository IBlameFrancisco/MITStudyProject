'use client';

/**
 * Johnson's Algorithm Visualizer
 * ==============================
 * Interactive visualization of Johnson's All-Pairs Shortest Paths algorithm.
 */

import { useState, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import ControlPanel from '@/components/ui/ControlPanel';
import { LaTeX } from '@/components/ui/LaTeX';

type Phase = 'idle' | 'addSource' | 'bellmanFord' | 'reweight' | 'dijkstra' | 'complete';

interface Node {
  id: number;
  x: number;
  y: number;
  h: number; // h value from Bellman-Ford
}

interface Edge {
  from: number;
  to: number;
  weight: number;
  reweightedWeight: number | null;
  highlighted: boolean;
}

export default function JohnsonVisualizer() {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [phase, setPhase] = useState<Phase>('idle');
  const [distanceMatrix, setDistanceMatrix] = useState<number[][]>([]);
  const [currentSource, setCurrentSource] = useState<number | null>(null);
  const [operation, setOperation] = useState<string>('');
  const [isAnimating, setIsAnimating] = useState(false);
  const [speed, setSpeed] = useState(50);
  const [showReweighted, setShowReweighted] = useState(false);
  const animationRef = useRef(false);

  const SVG_WIDTH = 500;
  const SVG_HEIGHT = 350;
  const NODE_RADIUS = 24;
  const INF = 999999;

  const generateGraph = useCallback(() => {
    const newNodes: Node[] = [
      { id: 0, x: 100, y: 175, h: 0 },
      { id: 1, x: 250, y: 80, h: 0 },
      { id: 2, x: 250, y: 270, h: 0 },
      { id: 3, x: 400, y: 175, h: 0 },
    ];

    const newEdges: Edge[] = [
      { from: 0, to: 1, weight: 3, reweightedWeight: null, highlighted: false },
      { from: 0, to: 2, weight: 8, reweightedWeight: null, highlighted: false },
      { from: 1, to: 2, weight: -2, reweightedWeight: null, highlighted: false },
      { from: 1, to: 3, weight: 1, reweightedWeight: null, highlighted: false },
      { from: 2, to: 3, weight: 4, reweightedWeight: null, highlighted: false },
      { from: 3, to: 0, weight: 2, reweightedWeight: null, highlighted: false },
    ];

    setNodes(newNodes);
    setEdges(newEdges);
    setPhase('idle');
    setDistanceMatrix([]);
    setCurrentSource(null);
    setOperation('');
    setShowReweighted(false);
  }, []);

  useState(() => {
    generateGraph();
  });

  const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const runJohnson = async () => {
    setIsAnimating(true);
    animationRef.current = true;

    const V = nodes.length;

    // Phase 1: Add new source vertex s with 0-weight edges to all vertices
    setPhase('addSource');
    setOperation('Step 1: Add auxiliary source vertex s with 0-weight edges to all vertices');
    await sleep(1500 - speed * 10);

    // Phase 2: Run Bellman-Ford from s to compute h values
    setPhase('bellmanFord');
    setOperation('Step 2: Run Bellman-Ford from s to compute h(v) for each vertex');
    await sleep(1000 - speed * 8);

    // Simulate Bellman-Ford to get h values
    const h = new Array(V).fill(0);

    // Run V-1 iterations
    for (let i = 0; i < V - 1 && animationRef.current; i++) {
      setOperation(`Bellman-Ford iteration ${i + 1}/${V - 1}`);
      for (const edge of edges) {
        if (h[edge.from] + edge.weight < h[edge.to]) {
          h[edge.to] = h[edge.from] + edge.weight;
        }
      }
      // Also edges from s (weight 0)
      for (let v = 0; v < V; v++) {
        if (0 < h[v]) h[v] = 0;
      }
      const nodesCopy = nodes.map((n, idx) => ({ ...n, h: h[idx] }));
      setNodes(nodesCopy);
      await sleep(800 - speed * 6);
    }

    if (!animationRef.current) return;

    setOperation(`Bellman-Ford complete. h values: ${h.map((val, i) => `h(${i})=${val}`).join(', ')}`);
    await sleep(1200 - speed * 8);

    // Phase 3: Reweight edges
    setPhase('reweight');
    setOperation('Step 3: Reweight edges: ŵ(u,v) = w(u,v) + h(u) - h(v)');
    await sleep(1000 - speed * 8);

    const edgesCopy = edges.map(e => ({
      ...e,
      reweightedWeight: e.weight + h[e.from] - h[e.to],
    }));
    setEdges(edgesCopy);
    setShowReweighted(true);
    await sleep(1500 - speed * 10);

    if (!animationRef.current) return;

    // Phase 4: Run Dijkstra from each vertex
    setPhase('dijkstra');
    const D: number[][] = Array(V).fill(null).map(() => Array(V).fill(INF));

    for (let s = 0; s < V && animationRef.current; s++) {
      setCurrentSource(s);
      setOperation(`Step 4: Running Dijkstra from vertex ${s}`);

      // Initialize
      const dist = new Array(V).fill(INF);
      dist[s] = 0;
      const visited = new Array(V).fill(false);

      for (let i = 0; i < V && animationRef.current; i++) {
        // Find min
        let u = -1;
        for (let v = 0; v < V; v++) {
          if (!visited[v] && (u === -1 || dist[v] < dist[u])) {
            u = v;
          }
        }

        if (u === -1 || dist[u] === INF) break;
        visited[u] = true;

        // Relax edges
        for (const edge of edgesCopy) {
          if (edge.from === u && edge.reweightedWeight !== null) {
            const newDist = dist[u] + edge.reweightedWeight;
            if (newDist < dist[edge.to]) {
              dist[edge.to] = newDist;
            }
          }
        }
      }

      // Convert back to original weights
      for (let v = 0; v < V; v++) {
        if (dist[v] < INF) {
          D[s][v] = dist[v] - h[s] + h[v];
        } else {
          D[s][v] = INF;
        }
      }

      setDistanceMatrix([...D]);
      await sleep(1000 - speed * 8);
    }

    if (animationRef.current) {
      setPhase('complete');
      setCurrentSource(null);
      setOperation("Johnson's Algorithm complete! All-pairs shortest paths computed.");
    }

    setIsAnimating(false);
    animationRef.current = false;
  };

  const stopAlgorithm = () => {
    animationRef.current = false;
    setIsAnimating(false);
  };

  const resetGraph = () => {
    generateGraph();
  };

  const getNodeColor = (nodeId: number) => {
    if (currentSource === nodeId) return 'fill-blue-500';
    if (phase === 'complete') return 'fill-green-500';
    return 'fill-gray-500';
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

    const displayWeight = showReweighted && edge.reweightedWeight !== null
      ? edge.reweightedWeight
      : edge.weight;

    return (
      <g key={`${edge.from}-${edge.to}`}>
        <line
          x1={startX}
          y1={startY}
          x2={endX}
          y2={endY}
          className={edge.highlighted ? 'stroke-green-500' : 'stroke-gray-400 dark:stroke-gray-600'}
          strokeWidth={2}
        />
        <polygon
          points={`
            ${endX},${endY}
            ${endX - arrowSize * Math.cos(angle - Math.PI / 6)},${endY - arrowSize * Math.sin(angle - Math.PI / 6)}
            ${endX - arrowSize * Math.cos(angle + Math.PI / 6)},${endY - arrowSize * Math.sin(angle + Math.PI / 6)}
          `}
          className={edge.highlighted ? 'fill-green-500' : 'fill-gray-400 dark:fill-gray-600'}
        />
        <rect
          x={midX - 16}
          y={midY - 12}
          width={32}
          height={24}
          rx={4}
          className={`${displayWeight < 0 ? 'fill-red-100 dark:fill-red-900/30' : 'fill-surface-secondary'}`}
        />
        <text
          x={midX}
          y={midY + 5}
          textAnchor="middle"
          className={`font-mono text-sm font-bold ${displayWeight < 0 ? 'fill-red-600 dark:fill-red-400' : 'fill-content-primary'}`}
        >
          {displayWeight}
        </text>
      </g>
    );
  };

  const getPhaseDescription = () => {
    switch (phase) {
      case 'addSource': return 'Adding auxiliary source vertex';
      case 'bellmanFord': return 'Running Bellman-Ford for h values';
      case 'reweight': return 'Reweighting edges';
      case 'dijkstra': return `Running Dijkstra (source: ${currentSource})`;
      case 'complete': return 'Complete';
      default: return 'Ready';
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold text-content-primary mb-2">
        Johnson's Algorithm (APSP)
      </h2>
      <p className="text-sm text-content-secondary mb-6">
        All-Pairs Shortest Paths. Time: <LaTeX math="O(VE + V^2 \log V)" /> - faster than Floyd-Warshall for sparse graphs.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 space-y-4">
          {/* Phase Indicator */}
          <div className="flex items-center gap-2 flex-wrap">
            {['idle', 'addSource', 'bellmanFord', 'reweight', 'dijkstra', 'complete'].map((p, idx) => (
              <div
                key={p}
                className={`flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-medium ${
                  phase === p
                    ? 'bg-brand-500 text-white'
                    : idx < ['idle', 'addSource', 'bellmanFord', 'reweight', 'dijkstra', 'complete'].indexOf(phase)
                    ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                    : 'bg-surface-tertiary text-content-muted'
                }`}
              >
                <span>{idx + 1}.</span>
                <span>{p === 'idle' ? 'Start' : p === 'addSource' ? 'Add s' : p === 'bellmanFord' ? 'B-F' : p === 'reweight' ? 'Reweight' : p === 'dijkstra' ? 'Dijkstra' : 'Done'}</span>
              </div>
            ))}
          </div>

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
                    className={getNodeColor(node.id)}
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
                  {phase !== 'idle' && (
                    <text
                      x={node.x}
                      y={node.y - NODE_RADIUS - 8}
                      textAnchor="middle"
                      className="fill-content-primary font-mono text-xs"
                    >
                      h={node.h}
                    </text>
                  )}
                </g>
              ))}
            </svg>

            <div className="mt-2 flex items-center justify-center gap-4 text-xs text-content-muted">
              <span>Phase: {getPhaseDescription()}</span>
              {showReweighted && <span className="text-green-600">Showing reweighted edges</span>}
            </div>
          </div>

          {/* Distance Matrix */}
          {distanceMatrix.length > 0 && (
            <div className="bg-surface-secondary rounded-xl p-4 border border-edge-primary">
              <h4 className="text-sm font-semibold text-content-primary mb-3">Distance Matrix D[u][v]</h4>
              <div className="overflow-x-auto">
                <table className="w-full text-center text-sm font-mono">
                  <thead>
                    <tr>
                      <th className="px-3 py-2 text-content-muted">u \ v</th>
                      {nodes.map(n => (
                        <th key={n.id} className="px-3 py-2 text-content-primary">{n.id}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {distanceMatrix.map((row, u) => (
                      <tr key={u}>
                        <td className="px-3 py-2 text-content-primary font-bold">{u}</td>
                        {row.map((d, v) => (
                          <td
                            key={v}
                            className={`px-3 py-2 ${
                              u === v
                                ? 'text-content-muted'
                                : d >= INF
                                ? 'text-red-500'
                                : currentSource === u
                                ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                                : 'text-content-primary'
                            }`}
                          >
                            {d >= INF ? '∞' : d}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Operation Status */}
          {operation && (
            <div className="bg-surface-secondary rounded-xl p-4 border border-edge-primary">
              <span className="text-sm text-content-primary font-mono">{operation}</span>
            </div>
          )}

          {/* Algorithm Overview */}
          <div className="bg-surface-secondary rounded-xl p-4 border border-edge-primary">
            <h4 className="text-sm font-semibold text-content-primary mb-2">Johnson's Algorithm Steps</h4>
            <ol className="text-xs text-content-secondary space-y-1 list-decimal list-inside">
              <li>Add new vertex s with 0-weight edges to all vertices</li>
              <li>Run Bellman-Ford from s to compute h(v) for each v</li>
              <li>Reweight edges: <LaTeX math="\hat{w}(u,v) = w(u,v) + h(u) - h(v)" /> (all non-negative!)</li>
              <li>Run Dijkstra from each vertex using reweighted edges</li>
              <li>Convert back: <LaTeX math="D[u][v] = \hat{D}[u][v] - h(u) + h(v)" /></li>
            </ol>
          </div>
        </div>

        {/* Controls */}
        <div className="space-y-4">
          <ControlPanel title="Controls">
            <div className="space-y-3">
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
                  onClick={runJohnson}
                  className="w-full px-3 py-2 rounded-lg bg-brand-500 text-white text-sm font-medium hover:bg-brand-600"
                >
                  Run Johnson's Algorithm
                </button>
              )}

              <button
                onClick={resetGraph}
                disabled={isAnimating}
                className="w-full px-3 py-2 rounded-lg bg-surface-tertiary border border-edge-primary text-content-secondary text-sm font-medium hover:bg-surface-accent disabled:opacity-50"
              >
                Reset Graph
              </button>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="showReweighted"
                  checked={showReweighted}
                  onChange={(e) => setShowReweighted(e.target.checked)}
                  className="rounded"
                />
                <label htmlFor="showReweighted" className="text-xs text-content-secondary">
                  Show reweighted edges
                </label>
              </div>
            </div>
          </ControlPanel>

          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 border border-blue-200 dark:border-blue-800">
            <h4 className="text-sm font-semibold text-blue-800 dark:text-blue-200 mb-2">
              Key Insight
            </h4>
            <p className="text-xs text-blue-700 dark:text-blue-300">
              Reweighting transforms a graph with negative edges into one with all non-negative edges,
              enabling the use of Dijkstra's algorithm while preserving shortest paths.
            </p>
          </div>

          <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-xl p-4 border border-emerald-200 dark:border-emerald-800">
            <h4 className="text-sm font-semibold text-emerald-800 dark:text-emerald-200 mb-2">
              Complexity
            </h4>
            <ul className="text-xs text-emerald-700 dark:text-emerald-300 space-y-1">
              <li>• Bellman-Ford: <LaTeX math="O(VE)" /></li>
              <li>• V × Dijkstra: <LaTeX math="O(V(V+E) \log V)" /></li>
              <li>• Total: <LaTeX math="O(VE + V^2 \log V)" /></li>
              <li>• Better than Floyd-Warshall (<LaTeX math="O(V^3)" />) for sparse graphs</li>
            </ul>
          </div>

          <div className="bg-amber-50 dark:bg-amber-900/20 rounded-xl p-4 border border-amber-200 dark:border-amber-800">
            <h4 className="text-sm font-semibold text-amber-800 dark:text-amber-200 mb-2">
              When to Use
            </h4>
            <p className="text-xs text-amber-700 dark:text-amber-300">
              Use Johnson's for <strong>sparse graphs</strong> with negative edges.
              Use Floyd-Warshall for <strong>dense graphs</strong> (simpler implementation).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
