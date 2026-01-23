'use client';

/**
 * Weighted Graph Visualizer
 * =========================
 * Interactive visualization of weighted graphs and shortest path concepts.
 */

import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import ControlPanel from '@/components/ui/ControlPanel';
import { LaTeX } from '@/components/ui/LaTeX';

type NodeState = 'default' | 'source' | 'relaxed' | 'finalized';
type EdgeState = 'default' | 'relaxing' | 'inPath' | 'relaxed';

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

export default function WeightedGraphVisualizer() {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [sourceNode, setSourceNode] = useState<number>(0);
  const [operation, setOperation] = useState<string>('');
  const [relaxationSteps, setRelaxationSteps] = useState<string[]>([]);

  const SVG_WIDTH = 600;
  const SVG_HEIGHT = 400;
  const NODE_RADIUS = 26;
  const INF = Infinity;

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
      { from: 0, to: 1, weight: 4, state: 'default' },
      { from: 0, to: 2, weight: 2, state: 'default' },
      { from: 1, to: 2, weight: 1, state: 'default' },
      { from: 1, to: 3, weight: 5, state: 'default' },
      { from: 2, to: 3, weight: 8, state: 'default' },
      { from: 2, to: 4, weight: 10, state: 'default' },
      { from: 3, to: 4, weight: 2, state: 'default' },
      { from: 3, to: 5, weight: 6, state: 'default' },
      { from: 4, to: 5, weight: 3, state: 'default' },
    ];

    setNodes(newNodes);
    setEdges(newEdges);
    setOperation('');
    setRelaxationSteps([]);
  }, []);

  useState(() => {
    generateGraph();
  });

  const initializeSingleSource = () => {
    const newNodes = nodes.map(n => ({
      ...n,
      distance: n.id === sourceNode ? 0 : INF,
      parent: null,
      state: (n.id === sourceNode ? 'source' : 'default') as NodeState,
    }));
    setNodes(newNodes);
    setEdges(edges.map(e => ({ ...e, state: 'default' as EdgeState })));
    setRelaxationSteps([`Initialize: d[${sourceNode}] = 0, all others = ∞`]);
    setOperation(`Initialized single source from node ${sourceNode}`);
  };

  const relax = (u: number, v: number, weight: number) => {
    const uDist = nodes[u].distance;
    const vDist = nodes[v].distance;

    if (uDist === INF) {
      setOperation(`Cannot relax (${u},${v}): d[${u}] = ∞`);
      return false;
    }

    const newDist = uDist + weight;
    if (newDist < vDist) {
      const newNodes = [...nodes];
      newNodes[v] = {
        ...newNodes[v],
        distance: newDist,
        parent: u,
        state: 'relaxed' as NodeState,
      };
      setNodes(newNodes);

      const edgeIdx = edges.findIndex(e => e.from === u && e.to === v);
      if (edgeIdx !== -1) {
        const newEdges = [...edges];
        newEdges[edgeIdx] = { ...newEdges[edgeIdx], state: 'relaxed' as EdgeState };
        setEdges(newEdges);
      }

      const step = `Relax(${u},${v}): d[${v}] = ${vDist === INF ? '∞' : vDist} → ${newDist} (via ${u})`;
      setRelaxationSteps(prev => [...prev, step]);
      setOperation(step);
      return true;
    } else {
      setOperation(`No relaxation: d[${v}] = ${vDist} ≤ d[${u}] + w = ${newDist}`);
      return false;
    }
  };

  const relaxAllEdges = () => {
    let changed = false;
    edges.forEach(edge => {
      if (relax(edge.from, edge.to, edge.weight)) {
        changed = true;
      }
    });
    return changed;
  };

  const showShortestPath = (target: number) => {
    if (nodes[target].distance === INF) {
      setOperation(`No path from ${sourceNode} to ${target}`);
      return;
    }

    const newEdges = edges.map(e => ({ ...e, state: 'default' as EdgeState }));
    const path: number[] = [];
    let current: number | null = target;

    while (current !== null) {
      path.unshift(current);
      const parent: number | null = nodes[current].parent;
      if (parent !== null) {
        const edgeIdx = newEdges.findIndex(e => e.from === parent && e.to === current);
        if (edgeIdx !== -1) {
          newEdges[edgeIdx].state = 'inPath' as EdgeState;
        }
      }
      current = parent;
    }

    setEdges(newEdges);
    setOperation(`Shortest path to ${target}: ${path.join(' → ')} (distance: ${nodes[target].distance})`);
  };

  const getNodeColor = (state: NodeState) => {
    switch (state) {
      case 'source': return 'fill-blue-500';
      case 'relaxed': return 'fill-green-500';
      case 'finalized': return 'fill-purple-500';
      default: return 'fill-gray-400';
    }
  };

  const getEdgeColor = (state: EdgeState) => {
    switch (state) {
      case 'relaxing': return 'stroke-yellow-500';
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
        Weighted Graph & Relaxation
      </h2>
      <p className="text-sm text-content-secondary mb-6">
        Understanding shortest paths through edge relaxation: if <LaTeX math="d[v] > d[u] + w(u,v)" />, update <LaTeX math="d[v]" />
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
                    onClick={() => showShortestPath(node.id)}
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
                    d={node.distance === INF ? '∞' : node.distance}
                  </text>
                </g>
              ))}
            </svg>
          </div>

          {/* Relaxation Steps */}
          {relaxationSteps.length > 0 && (
            <div className="bg-surface-secondary rounded-xl p-4 border border-edge-primary max-h-48 overflow-y-auto">
              <h4 className="text-sm font-semibold text-content-primary mb-2">Relaxation Log</h4>
              <div className="space-y-1">
                {relaxationSteps.map((step, idx) => (
                  <div key={idx} className="text-xs font-mono text-content-secondary">
                    {idx + 1}. {step}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Operation Status */}
          {operation && (
            <div className="bg-surface-secondary rounded-xl p-4 border border-edge-primary">
              <span className="text-sm text-content-primary font-mono">{operation}</span>
            </div>
          )}

          {/* Relaxation Formula */}
          <div className="bg-surface-secondary rounded-xl p-4 border border-edge-primary">
            <h4 className="text-sm font-semibold text-content-primary mb-2">Relaxation Operation</h4>
            <div className="text-sm text-content-secondary">
              <LaTeX math="\text{Relax}(u, v, w): \quad \text{if } d[v] > d[u] + w(u,v) \text{ then } d[v] \leftarrow d[u] + w(u,v), \pi[v] \leftarrow u" />
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
                  className="w-full mt-1 px-3 py-2 rounded-lg border border-edge-primary bg-surface-secondary text-content-primary"
                >
                  {nodes.map(node => (
                    <option key={node.id} value={node.id}>Node {node.id}</option>
                  ))}
                </select>
              </div>

              <button
                onClick={initializeSingleSource}
                className="w-full px-3 py-2 rounded-lg bg-blue-500 text-white text-sm font-medium hover:bg-blue-600"
              >
                Initialize Source
              </button>

              <button
                onClick={relaxAllEdges}
                className="w-full px-3 py-2 rounded-lg bg-green-500 text-white text-sm font-medium hover:bg-green-600"
              >
                Relax All Edges
              </button>

              <button
                onClick={generateGraph}
                className="w-full px-3 py-2 rounded-lg bg-surface-tertiary border border-edge-primary text-content-secondary text-sm font-medium hover:bg-surface-accent"
              >
                Reset Graph
              </button>

              <p className="text-xs text-content-muted">
                Click nodes to show shortest path
              </p>
            </div>
          </ControlPanel>

          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 border border-blue-200 dark:border-blue-800">
            <h4 className="text-sm font-semibold text-blue-800 dark:text-blue-200 mb-2">
              Shortest Path Properties
            </h4>
            <ul className="text-xs text-blue-700 dark:text-blue-300 space-y-1">
              <li>• <strong>Optimal substructure:</strong> Subpaths of shortest paths are shortest paths</li>
              <li>• <strong>Triangle inequality:</strong> <LaTeX math="\delta(s,v) \leq \delta(s,u) + w(u,v)" /></li>
              <li>• <strong>Relaxation:</strong> Safe operation that maintains invariants</li>
            </ul>
          </div>

          <div className="bg-amber-50 dark:bg-amber-900/20 rounded-xl p-4 border border-amber-200 dark:border-amber-800">
            <h4 className="text-sm font-semibold text-amber-800 dark:text-amber-200 mb-2">
              Key Insight
            </h4>
            <p className="text-xs text-amber-700 dark:text-amber-300">
              Different algorithms (Bellman-Ford, Dijkstra, DAG relaxation) differ in the <strong>order</strong> they relax edges,
              but all use the same relaxation operation.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
