'use client';

/**
 * BFS Visualizer
 * ==============
 * Interactive visualization of Breadth-First Search algorithm.
 */

import { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ControlPanel from '@/components/ui/ControlPanel';
import { LaTeX } from '@/components/ui/LaTeX';

type NodeState = 'unvisited' | 'queued' | 'visiting' | 'visited';
type EdgeState = 'default' | 'traversed' | 'tree';

interface Node {
  id: number;
  x: number;
  y: number;
  state: NodeState;
  distance: number | null;
  parent: number | null;
}

interface Edge {
  from: number;
  to: number;
  state: EdgeState;
}

export default function BFSVisualizer() {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [queue, setQueue] = useState<number[]>([]);
  const [sourceNode, setSourceNode] = useState<number>(0);
  const [operation, setOperation] = useState<string>('');
  const [isAnimating, setIsAnimating] = useState(false);
  const [speed, setSpeed] = useState(50);
  const animationRef = useRef(false);

  const SVG_WIDTH = 600;
  const SVG_HEIGHT = 400;
  const NODE_RADIUS = 24;

  const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  // Generate sample graph
  const generateGraph = useCallback(() => {
    // Create a connected graph
    const newNodes: Node[] = [
      { id: 0, x: 300, y: 50, state: 'unvisited', distance: null, parent: null },
      { id: 1, x: 150, y: 140, state: 'unvisited', distance: null, parent: null },
      { id: 2, x: 450, y: 140, state: 'unvisited', distance: null, parent: null },
      { id: 3, x: 80, y: 250, state: 'unvisited', distance: null, parent: null },
      { id: 4, x: 220, y: 250, state: 'unvisited', distance: null, parent: null },
      { id: 5, x: 380, y: 250, state: 'unvisited', distance: null, parent: null },
      { id: 6, x: 520, y: 250, state: 'unvisited', distance: null, parent: null },
      { id: 7, x: 150, y: 350, state: 'unvisited', distance: null, parent: null },
      { id: 8, x: 300, y: 350, state: 'unvisited', distance: null, parent: null },
      { id: 9, x: 450, y: 350, state: 'unvisited', distance: null, parent: null },
    ];

    const newEdges: Edge[] = [
      { from: 0, to: 1, state: 'default' },
      { from: 0, to: 2, state: 'default' },
      { from: 1, to: 3, state: 'default' },
      { from: 1, to: 4, state: 'default' },
      { from: 2, to: 5, state: 'default' },
      { from: 2, to: 6, state: 'default' },
      { from: 3, to: 7, state: 'default' },
      { from: 4, to: 7, state: 'default' },
      { from: 4, to: 8, state: 'default' },
      { from: 5, to: 8, state: 'default' },
      { from: 5, to: 9, state: 'default' },
      { from: 6, to: 9, state: 'default' },
      { from: 7, to: 8, state: 'default' },
      { from: 8, to: 9, state: 'default' },
    ];

    setNodes(newNodes);
    setEdges(newEdges);
    setQueue([]);
    setOperation('');
  }, []);

  // Initialize on first render
  useState(() => {
    generateGraph();
  });

  // Get adjacency list
  const getNeighbors = (nodeId: number): number[] => {
    const neighbors: number[] = [];
    edges.forEach(edge => {
      if (edge.from === nodeId) neighbors.push(edge.to);
      if (edge.to === nodeId) neighbors.push(edge.from);
    });
    return neighbors;
  };

  // Run BFS
  const runBFS = async () => {
    setIsAnimating(true);
    animationRef.current = true;

    // Reset graph state
    const resetNodes = nodes.map(n => ({
      ...n,
      state: 'unvisited' as const,
      distance: null,
      parent: null,
    }));
    const resetEdges = edges.map(e => ({ ...e, state: 'default' as const }));

    setNodes(resetNodes);
    setEdges(resetEdges);
    setQueue([]);
    await sleep(200);

    const visited = new Set<number>();
    const bfsQueue: number[] = [sourceNode];
    const nodesCopy: Node[] = [...resetNodes];
    const edgesCopy: Edge[] = [...resetEdges];

    // Initialize source
    nodesCopy[sourceNode].state = 'queued' as NodeState;
    nodesCopy[sourceNode].distance = 0;
    setNodes([...nodesCopy]);
    setQueue([sourceNode]);
    setOperation(`Starting BFS from node ${sourceNode}`);
    await sleep(1000 - speed * 8);

    while (bfsQueue.length > 0 && animationRef.current) {
      const current = bfsQueue.shift()!;
      visited.add(current);

      // Mark as visiting
      nodesCopy[current].state = 'visiting' as NodeState;
      setNodes([...nodesCopy]);
      setQueue([...bfsQueue]);
      setOperation(`Visiting node ${current} (distance: ${nodesCopy[current].distance})`);
      await sleep(800 - speed * 6);

      // Explore neighbors
      const neighbors = getNeighbors(current);
      for (const neighbor of neighbors) {
        if (!animationRef.current) break;

        // Find and highlight edge
        const edgeIdx = edgesCopy.findIndex(
          e => (e.from === current && e.to === neighbor) || (e.to === current && e.from === neighbor)
        );

        if (edgeIdx !== -1) {
          edgesCopy[edgeIdx].state = 'traversed' as EdgeState;
          setEdges([...edgesCopy]);
        }

        if (!visited.has(neighbor) && !bfsQueue.includes(neighbor)) {
          nodesCopy[neighbor].state = 'queued' as NodeState;
          nodesCopy[neighbor].distance = (nodesCopy[current].distance ?? 0) + 1;
          nodesCopy[neighbor].parent = current;
          bfsQueue.push(neighbor);

          if (edgeIdx !== -1) {
            edgesCopy[edgeIdx].state = 'tree' as EdgeState;
          }

          setNodes([...nodesCopy]);
          setQueue([...bfsQueue]);
          setEdges([...edgesCopy]);
          setOperation(`Discovered node ${neighbor} (distance: ${nodesCopy[neighbor].distance})`);
          await sleep(600 - speed * 5);
        }
      }

      // Mark as visited
      nodesCopy[current].state = 'visited' as NodeState;
      setNodes([...nodesCopy]);
      await sleep(300 - speed * 2);
    }

    if (animationRef.current) {
      setOperation('BFS complete! All reachable nodes visited.');
      setQueue([]);
    }

    setIsAnimating(false);
    animationRef.current = false;
  };

  const stopBFS = () => {
    animationRef.current = false;
    setIsAnimating(false);
  };

  const resetGraph = () => {
    setNodes(nodes.map(n => ({
      ...n,
      state: 'unvisited' as const,
      distance: null,
      parent: null,
    })));
    setEdges(edges.map(e => ({ ...e, state: 'default' as const })));
    setQueue([]);
    setOperation('');
  };

  // Get node color
  const getNodeColor = (state: Node['state']) => {
    switch (state) {
      case 'queued': return 'fill-yellow-500';
      case 'visiting': return 'fill-blue-500';
      case 'visited': return 'fill-green-500';
      default: return 'fill-gray-400';
    }
  };

  // Get edge color
  const getEdgeColor = (state: Edge['state']) => {
    switch (state) {
      case 'traversed': return 'stroke-yellow-500';
      case 'tree': return 'stroke-green-500';
      default: return 'stroke-gray-300 dark:stroke-gray-600';
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold text-content-primary mb-2">
        Breadth-First Search Visualizer
      </h2>
      <p className="text-sm text-content-secondary mb-6">
        Level-by-level graph exploration. Time: <LaTeX math="O(V + E)" />, Space: <LaTeX math="O(V)" />
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
              {edges.map((edge, idx) => {
                const fromNode = nodes.find(n => n.id === edge.from);
                const toNode = nodes.find(n => n.id === edge.to);
                if (!fromNode || !toNode) return null;

                return (
                  <motion.line
                    key={idx}
                    x1={fromNode.x}
                    y1={fromNode.y}
                    x2={toNode.x}
                    y2={toNode.y}
                    className={getEdgeColor(edge.state)}
                    strokeWidth={edge.state === 'tree' ? 4 : 2}
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                  />
                );
              })}

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
                    style={{ cursor: !isAnimating ? 'pointer' : 'default' }}
                    onClick={() => !isAnimating && setSourceNode(node.id)}
                  />

                  {/* Node ID */}
                  <text
                    x={node.x}
                    y={node.y + 5}
                    textAnchor="middle"
                    className="fill-white font-mono text-sm font-bold"
                  >
                    {node.id}
                  </text>

                  {/* Distance label */}
                  {node.distance !== null && (
                    <text
                      x={node.x}
                      y={node.y - NODE_RADIUS - 8}
                      textAnchor="middle"
                      className="fill-content-primary font-mono text-xs font-bold"
                    >
                      d={node.distance}
                    </text>
                  )}

                  {/* Source indicator */}
                  {node.id === sourceNode && (
                    <circle
                      cx={node.x}
                      cy={node.y}
                      r={NODE_RADIUS + 4}
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      className="text-brand-500"
                      strokeDasharray="4 2"
                    />
                  )}
                </g>
              ))}
            </svg>

            {/* Legend */}
            <div className="mt-4 flex items-center justify-center gap-6 text-xs">
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
                <span className="text-content-muted">Visiting</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-green-500 rounded-full" />
                <span className="text-content-muted">Visited</span>
              </div>
            </div>
          </div>

          {/* Queue Visualization */}
          <div className="bg-surface-secondary rounded-xl p-4 border border-edge-primary">
            <h4 className="text-sm font-semibold text-content-primary mb-3">
              Queue (FIFO)
            </h4>
            <div className="flex items-center gap-2">
              <span className="text-xs text-content-muted">Front →</span>
              <div className="flex gap-1">
                <AnimatePresence>
                  {queue.map((nodeId, idx) => (
                    <motion.div
                      key={`${nodeId}-${idx}`}
                      initial={{ scale: 0, x: 20 }}
                      animate={{ scale: 1, x: 0 }}
                      exit={{ scale: 0, x: -20 }}
                      className="w-10 h-10 flex items-center justify-center bg-yellow-500 text-white rounded-lg font-mono font-bold"
                    >
                      {nodeId}
                    </motion.div>
                  ))}
                </AnimatePresence>
                {queue.length === 0 && (
                  <span className="text-content-muted text-sm italic">empty</span>
                )}
              </div>
              <span className="text-xs text-content-muted">← Back</span>
            </div>
          </div>

          {/* Operation Status */}
          {operation && (
            <div className="bg-surface-secondary rounded-xl p-4 border border-edge-primary">
              <span className="text-sm text-content-primary font-mono">{operation}</span>
            </div>
          )}

          {/* BFS Tree / Distances */}
          <div className="bg-surface-secondary rounded-xl p-4 border border-edge-primary">
            <h4 className="text-sm font-semibold text-content-primary mb-3">Shortest Distances from Node {sourceNode}</h4>
            <div className="flex gap-2 flex-wrap">
              {nodes.map(node => (
                <div key={node.id} className="flex flex-col items-center">
                  <div className={`w-10 h-10 flex items-center justify-center rounded-lg font-mono text-sm ${
                    node.state === 'visited' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' :
                    node.state === 'queued' ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300' :
                    'bg-surface-tertiary dark:bg-surface-secondary text-content-muted'
                  }`}>
                    {node.distance ?? '∞'}
                  </div>
                  <span className="text-xs text-content-muted mt-1">v{node.id}</span>
                </div>
              ))}
            </div>
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
                  onClick={stopBFS}
                  className="w-full px-3 py-2 rounded-lg bg-red-500 text-white text-sm font-medium hover:bg-red-600"
                >
                  Stop
                </button>
              ) : (
                <button
                  onClick={runBFS}
                  className="w-full px-3 py-2 rounded-lg bg-brand-500 text-white text-sm font-medium hover:bg-brand-600"
                >
                  Run BFS
                </button>
              )}

              <div className="flex gap-2">
                <button
                  onClick={resetGraph}
                  disabled={isAnimating}
                  className="flex-1 px-3 py-2 rounded-lg bg-surface-tertiary border border-edge-primary text-content-secondary text-sm font-medium hover:bg-surface-accent disabled:opacity-50"
                >
                  Reset
                </button>
                <button
                  onClick={generateGraph}
                  disabled={isAnimating}
                  className="flex-1 px-3 py-2 rounded-lg bg-surface-tertiary border border-edge-primary text-content-secondary text-sm font-medium hover:bg-surface-accent disabled:opacity-50"
                >
                  New Graph
                </button>
              </div>
            </div>
          </ControlPanel>

          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 border border-blue-200 dark:border-blue-800">
            <h4 className="text-sm font-semibold text-blue-800 dark:text-blue-200 mb-2">
              BFS Properties
            </h4>
            <ul className="text-xs text-blue-700 dark:text-blue-300 space-y-1">
              <li>• Explores level by level</li>
              <li>• Uses a <strong>queue</strong> (FIFO)</li>
              <li>• Finds <strong>shortest paths</strong> in unweighted graphs</li>
              <li>• Discovers all vertices at distance k before k+1</li>
            </ul>
          </div>

          <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-xl p-4 border border-emerald-200 dark:border-emerald-800">
            <h4 className="text-sm font-semibold text-emerald-800 dark:text-emerald-200 mb-2">
              Applications
            </h4>
            <ul className="text-xs text-emerald-700 dark:text-emerald-300 space-y-1">
              <li>• Shortest path in unweighted graphs</li>
              <li>• Level-order tree traversal</li>
              <li>• Finding connected components</li>
              <li>• Web crawlers</li>
              <li>• Social network analysis</li>
            </ul>
          </div>

          <div className="bg-amber-50 dark:bg-amber-900/20 rounded-xl p-4 border border-amber-200 dark:border-amber-800">
            <h4 className="text-sm font-semibold text-amber-800 dark:text-amber-200 mb-2">
              Click to Select Source
            </h4>
            <p className="text-xs text-amber-700 dark:text-amber-300">
              Click any node in the graph to set it as the BFS starting point.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
