'use client';

/**
 * DFS Visualizer
 * ==============
 * Interactive visualization of Depth-First Search algorithm with edge classification.
 */

import { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ControlPanel from '@/components/ui/ControlPanel';
import { LaTeX } from '@/components/ui/LaTeX';

type NodeState = 'white' | 'gray' | 'black';
type EdgeType = 'default' | 'tree' | 'back' | 'forward' | 'cross';

interface Node {
  id: number;
  x: number;
  y: number;
  state: NodeState;
  discoveryTime: number | null;
  finishTime: number | null;
  parent: number | null;
}

interface Edge {
  from: number;
  to: number;
  type: EdgeType;
  directed: boolean;
}

export default function DFSVisualizer() {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [stack, setStack] = useState<number[]>([]);
  const [time, setTime] = useState(0);
  const [sourceNode, setSourceNode] = useState<number>(0);
  const [operation, setOperation] = useState<string>('');
  const [isAnimating, setIsAnimating] = useState(false);
  const [speed, setSpeed] = useState(50);
  const [isDirected, setIsDirected] = useState(true);
  const [topologicalOrder, setTopologicalOrder] = useState<number[]>([]);
  const animationRef = useRef(false);
  const timeRef = useRef(0);

  const SVG_WIDTH = 600;
  const SVG_HEIGHT = 400;
  const NODE_RADIUS = 24;

  const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const generateGraph = useCallback(() => {
    const newNodes: Node[] = [
      { id: 0, x: 100, y: 80, state: 'white', discoveryTime: null, finishTime: null, parent: null },
      { id: 1, x: 250, y: 80, state: 'white', discoveryTime: null, finishTime: null, parent: null },
      { id: 2, x: 400, y: 80, state: 'white', discoveryTime: null, finishTime: null, parent: null },
      { id: 3, x: 500, y: 180, state: 'white', discoveryTime: null, finishTime: null, parent: null },
      { id: 4, x: 100, y: 280, state: 'white', discoveryTime: null, finishTime: null, parent: null },
      { id: 5, x: 250, y: 280, state: 'white', discoveryTime: null, finishTime: null, parent: null },
      { id: 6, x: 400, y: 280, state: 'white', discoveryTime: null, finishTime: null, parent: null },
    ];

    const newEdges: Edge[] = [
      { from: 0, to: 1, type: 'default', directed: isDirected },
      { from: 0, to: 4, type: 'default', directed: isDirected },
      { from: 1, to: 2, type: 'default', directed: isDirected },
      { from: 1, to: 5, type: 'default', directed: isDirected },
      { from: 2, to: 3, type: 'default', directed: isDirected },
      { from: 2, to: 6, type: 'default', directed: isDirected },
      { from: 4, to: 5, type: 'default', directed: isDirected },
      { from: 5, to: 6, type: 'default', directed: isDirected },
      { from: 6, to: 3, type: 'default', directed: isDirected },
    ];

    setNodes(newNodes);
    setEdges(newEdges);
    setStack([]);
    setTime(0);
    timeRef.current = 0;
    setOperation('');
    setTopologicalOrder([]);
  }, [isDirected]);

  useState(() => {
    generateGraph();
  });

  const getNeighbors = (nodeId: number): number[] => {
    const neighbors: number[] = [];
    edges.forEach(edge => {
      if (edge.from === nodeId) neighbors.push(edge.to);
      if (!isDirected && edge.to === nodeId) neighbors.push(edge.from);
    });
    return neighbors;
  };

  const classifyEdge = (from: number, to: number, nodesCopy: Node[]): EdgeType => {
    const fromNode = nodesCopy[from];
    const toNode = nodesCopy[to];

    if (toNode.state === 'white') {
      return 'tree';
    } else if (toNode.state === 'gray') {
      return 'back';
    } else {
      if (fromNode.discoveryTime !== null && toNode.discoveryTime !== null) {
        if (fromNode.discoveryTime < toNode.discoveryTime) {
          return 'forward';
        } else {
          return 'cross';
        }
      }
      return 'cross';
    }
  };

  const runDFS = async () => {
    setIsAnimating(true);
    animationRef.current = true;
    timeRef.current = 0;
    setTime(0);
    setTopologicalOrder([]);

    const nodesCopy: Node[] = nodes.map(n => ({
      ...n,
      state: 'white' as NodeState,
      discoveryTime: null,
      finishTime: null,
      parent: null,
    }));
    const edgesCopy: Edge[] = edges.map(e => ({ ...e, type: 'default' as EdgeType }));

    setNodes(nodesCopy);
    setEdges(edgesCopy);
    await sleep(200);

    const topoOrder: number[] = [];

    const dfsVisit = async (u: number): Promise<void> => {
      if (!animationRef.current) return;

      timeRef.current++;
      nodesCopy[u].discoveryTime = timeRef.current;
      nodesCopy[u].state = 'gray' as NodeState;
      setNodes([...nodesCopy]);
      setStack(prev => [...prev, u]);
      setTime(timeRef.current);
      setOperation(`Discovered node ${u} at time ${timeRef.current}`);
      await sleep(800 - speed * 6);

      const neighbors = getNeighbors(u);
      for (const v of neighbors) {
        if (!animationRef.current) return;

        const edgeIdx = edgesCopy.findIndex(
          e => (e.from === u && e.to === v) || (!isDirected && e.from === v && e.to === u)
        );

        const edgeType = classifyEdge(u, v, nodesCopy);
        if (edgeIdx !== -1) {
          edgesCopy[edgeIdx].type = edgeType as EdgeType;
          setEdges([...edgesCopy]);
        }

        setOperation(`Edge (${u},${v}) classified as ${edgeType.toUpperCase()}`);
        await sleep(600 - speed * 5);

        if (nodesCopy[v].state === 'white') {
          nodesCopy[v].parent = u;
          await dfsVisit(v);
        }
      }

      timeRef.current++;
      nodesCopy[u].finishTime = timeRef.current;
      nodesCopy[u].state = 'black' as NodeState;
      setNodes([...nodesCopy]);
      setStack(prev => prev.filter(x => x !== u));
      setTime(timeRef.current);
      topoOrder.unshift(u);
      setTopologicalOrder([...topoOrder]);
      setOperation(`Finished node ${u} at time ${timeRef.current}`);
      await sleep(400 - speed * 3);
    };

    // Start DFS from source node
    if (nodesCopy[sourceNode].state === 'white') {
      await dfsVisit(sourceNode);
    }

    // Continue for any unvisited nodes (for disconnected graphs)
    for (let i = 0; i < nodesCopy.length && animationRef.current; i++) {
      if (nodesCopy[i].state === 'white') {
        await dfsVisit(i);
      }
    }

    if (animationRef.current) {
      setOperation('DFS complete! Check edge classifications and topological order.');
      setStack([]);
    }

    setIsAnimating(false);
    animationRef.current = false;
  };

  const stopDFS = () => {
    animationRef.current = false;
    setIsAnimating(false);
  };

  const resetGraph = () => {
    setNodes(nodes.map(n => ({
      ...n,
      state: 'white' as NodeState,
      discoveryTime: null,
      finishTime: null,
      parent: null,
    })));
    setEdges(edges.map(e => ({ ...e, type: 'default' as EdgeType })));
    setStack([]);
    setTime(0);
    setOperation('');
    setTopologicalOrder([]);
  };

  const getNodeColor = (state: NodeState) => {
    switch (state) {
      case 'gray': return 'fill-yellow-500';
      case 'black': return 'fill-green-500';
      default: return 'fill-gray-400';
    }
  };

  const getEdgeColor = (type: EdgeType) => {
    switch (type) {
      case 'tree': return 'stroke-green-500';
      case 'back': return 'stroke-red-500';
      case 'forward': return 'stroke-blue-500';
      case 'cross': return 'stroke-purple-500';
      default: return 'stroke-gray-300 dark:stroke-gray-600';
    }
  };

  const renderArrow = (edge: Edge) => {
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

    const arrowSize = 10;
    const arrowAngle = Math.PI / 6;
    const angle = Math.atan2(dy, dx);

    return (
      <g key={`${edge.from}-${edge.to}`}>
        <line
          x1={startX}
          y1={startY}
          x2={endX}
          y2={endY}
          className={getEdgeColor(edge.type)}
          strokeWidth={edge.type !== 'default' ? 3 : 2}
          markerEnd={isDirected ? undefined : undefined}
        />
        {isDirected && (
          <polygon
            points={`
              ${endX},${endY}
              ${endX - arrowSize * Math.cos(angle - arrowAngle)},${endY - arrowSize * Math.sin(angle - arrowAngle)}
              ${endX - arrowSize * Math.cos(angle + arrowAngle)},${endY - arrowSize * Math.sin(angle + arrowAngle)}
            `}
            className={getEdgeColor(edge.type).replace('stroke-', 'fill-')}
          />
        )}
      </g>
    );
  };

  return (
    <div>
      <h2 className="text-xl font-semibold text-content-primary mb-2">
        Depth-First Search Visualizer
      </h2>
      <p className="text-sm text-content-secondary mb-6">
        DFS with edge classification. Time: <LaTeX math="O(V + E)" />. Colors: White (undiscovered), Gray (in progress), Black (finished)
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 space-y-4">
          {/* Graph Type Toggle */}
          <div className="flex gap-4">
            <button
              onClick={() => { setIsDirected(true); generateGraph(); }}
              disabled={isAnimating}
              className={`px-4 py-2 rounded-xl font-medium transition-all ${
                isDirected
                  ? 'bg-brand-500 text-white shadow-soft-lg'
                  : 'bg-surface-tertiary text-content-secondary hover:bg-surface-accent border border-edge-primary'
              }`}
            >
              Directed Graph
            </button>
            <button
              onClick={() => { setIsDirected(false); generateGraph(); }}
              disabled={isAnimating}
              className={`px-4 py-2 rounded-xl font-medium transition-all ${
                !isDirected
                  ? 'bg-brand-500 text-white shadow-soft-lg'
                  : 'bg-surface-tertiary text-content-secondary hover:bg-surface-accent border border-edge-primary'
              }`}
            >
              Undirected Graph
            </button>
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
              {edges.map(edge => renderArrow(edge))}

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
                  <text
                    x={node.x}
                    y={node.y + 5}
                    textAnchor="middle"
                    className="fill-white font-mono text-sm font-bold"
                  >
                    {node.id}
                  </text>
                  {(node.discoveryTime !== null || node.finishTime !== null) && (
                    <text
                      x={node.x}
                      y={node.y - NODE_RADIUS - 8}
                      textAnchor="middle"
                      className="fill-content-primary font-mono text-xs"
                    >
                      {node.discoveryTime}/{node.finishTime ?? '?'}
                    </text>
                  )}
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
            <div className="mt-4 flex flex-wrap items-center justify-center gap-4 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-content-muted rounded-full" />
                <span className="text-content-muted">White (Undiscovered)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-yellow-500 rounded-full" />
                <span className="text-content-muted">Gray (In Progress)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-green-500 rounded-full" />
                <span className="text-content-muted">Black (Finished)</span>
              </div>
            </div>
          </div>

          {/* Stack Visualization */}
          <div className="bg-surface-secondary rounded-xl p-4 border border-edge-primary">
            <h4 className="text-sm font-semibold text-content-primary mb-3">
              Recursion Stack (LIFO) - Time: {time}
            </h4>
            <div className="flex items-center gap-2">
              <span className="text-xs text-content-muted">Bottom →</span>
              <div className="flex gap-1">
                <AnimatePresence>
                  {stack.map((nodeId, idx) => (
                    <motion.div
                      key={`${nodeId}-${idx}`}
                      initial={{ scale: 0, y: -20 }}
                      animate={{ scale: 1, y: 0 }}
                      exit={{ scale: 0, y: 20 }}
                      className="w-10 h-10 flex items-center justify-center bg-yellow-500 text-white rounded-lg font-mono font-bold"
                    >
                      {nodeId}
                    </motion.div>
                  ))}
                </AnimatePresence>
                {stack.length === 0 && (
                  <span className="text-content-muted text-sm italic">empty</span>
                )}
              </div>
              <span className="text-xs text-content-muted">← Top</span>
            </div>
          </div>

          {/* Edge Classification */}
          <div className="bg-surface-secondary rounded-xl p-4 border border-edge-primary">
            <h4 className="text-sm font-semibold text-content-primary mb-3">Edge Classification</h4>
            <div className="flex flex-wrap gap-4 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-8 h-1 bg-green-500 rounded" />
                <span className="text-content-muted">Tree Edge</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-1 bg-red-500 rounded" />
                <span className="text-content-muted">Back Edge (cycle!)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-1 bg-blue-500 rounded" />
                <span className="text-content-muted">Forward Edge</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-1 bg-purple-500 rounded" />
                <span className="text-content-muted">Cross Edge</span>
              </div>
            </div>
          </div>

          {/* Operation Status */}
          {operation && (
            <div className="bg-surface-secondary rounded-xl p-4 border border-edge-primary">
              <span className="text-sm text-content-primary font-mono">{operation}</span>
            </div>
          )}

          {/* Topological Order */}
          {topologicalOrder.length > 0 && (
            <div className="bg-surface-secondary rounded-xl p-4 border border-edge-primary">
              <h4 className="text-sm font-semibold text-content-primary mb-3">
                Topological Order (if DAG)
              </h4>
              <div className="flex gap-2">
                {topologicalOrder.map((nodeId, idx) => (
                  <div key={idx} className="flex items-center">
                    <span className="px-3 py-1 bg-green-500 text-white rounded-lg font-mono text-sm">
                      {nodeId}
                    </span>
                    {idx < topologicalOrder.length - 1 && (
                      <span className="mx-1 text-content-muted">→</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
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
                  onClick={stopDFS}
                  className="w-full px-3 py-2 rounded-lg bg-red-500 text-white text-sm font-medium hover:bg-red-600"
                >
                  Stop
                </button>
              ) : (
                <button
                  onClick={runDFS}
                  className="w-full px-3 py-2 rounded-lg bg-brand-500 text-white text-sm font-medium hover:bg-brand-600"
                >
                  Run DFS
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
              DFS Properties
            </h4>
            <ul className="text-xs text-blue-700 dark:text-blue-300 space-y-1">
              <li>• Explores as deep as possible first</li>
              <li>• Uses a <strong>stack</strong> (LIFO)</li>
              <li>• Discovery/finish times form parenthesis structure</li>
              <li>• Back edges indicate cycles</li>
            </ul>
          </div>

          <div className="bg-amber-50 dark:bg-amber-900/20 rounded-xl p-4 border border-amber-200 dark:border-amber-800">
            <h4 className="text-sm font-semibold text-amber-800 dark:text-amber-200 mb-2">
              Applications
            </h4>
            <ul className="text-xs text-amber-700 dark:text-amber-300 space-y-1">
              <li>• Topological sorting (DAGs)</li>
              <li>• Cycle detection</li>
              <li>• Strongly connected components</li>
              <li>• Maze solving</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
