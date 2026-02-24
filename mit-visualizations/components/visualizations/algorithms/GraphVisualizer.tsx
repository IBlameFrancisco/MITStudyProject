'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import * as d3 from 'd3';
import Button from '@/components/ui/Button';
import Slider from '@/components/ui/Slider';
import ControlPanel from '@/components/ui/ControlPanel';

interface Node {
  id: number;
  x: number;
  y: number;
  state: 'default' | 'visiting' | 'visited' | 'current';
}

interface Edge {
  source: number;
  target: number;
}

type Algorithm = 'bfs' | 'dfs';

export default function GraphVisualizer() {
  const svgRef = useRef<SVGSVGElement>(null);
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [nodeCount, setNodeCount] = useState(8);
  const [algorithm, setAlgorithm] = useState<Algorithm>('bfs');
  const [startNode, setStartNode] = useState(0);
  const [speed, setSpeed] = useState(50);
  const [running, setRunning] = useState(false);
  const [visitOrder, setVisitOrder] = useState<number[]>([]);
  const runningRef = useRef(false);

  const generateGraph = useCallback(() => {
    const width = 500;
    const height = 300;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) / 3;

    const newNodes: Node[] = [];
    for (let i = 0; i < nodeCount; i++) {
      const angle = (2 * Math.PI * i) / nodeCount - Math.PI / 2;
      newNodes.push({
        id: i,
        x: centerX + radius * Math.cos(angle),
        y: centerY + radius * Math.sin(angle),
        state: 'default',
      });
    }

    const newEdges: Edge[] = [];
    for (let i = 0; i < nodeCount; i++) {
      newEdges.push({ source: i, target: (i + 1) % nodeCount });
      if (i < nodeCount - 2) {
        newEdges.push({ source: i, target: i + 2 });
      }
    }
    if (nodeCount > 4) {
      newEdges.push({ source: 0, target: Math.floor(nodeCount / 2) });
    }

    setNodes(newNodes);
    setEdges(newEdges);
    setVisitOrder([]);
    setStartNode(0);
  }, [nodeCount]);

  useEffect(() => {
    generateGraph();
  }, [generateGraph]);

  useEffect(() => {
    if (!svgRef.current || nodes.length === 0) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const g = svg.append('g');

    g.selectAll('line')
      .data(edges)
      .join('line')
      .attr('x1', (d) => nodes[d.source].x)
      .attr('y1', (d) => nodes[d.source].y)
      .attr('x2', (d) => nodes[d.target].x)
      .attr('y2', (d) => nodes[d.target].y)
      .attr('stroke', '#94a3b8')
      .attr('stroke-width', 2);

    const nodeGroups = g
      .selectAll('g.node')
      .data(nodes)
      .join('g')
      .attr('class', 'node')
      .attr('transform', (d) => `translate(${d.x}, ${d.y})`);

    nodeGroups
      .append('circle')
      .attr('r', 20)
      .attr('fill', (d) => {
        switch (d.state) {
          case 'current':
            return '#ef4444';
          case 'visiting':
            return '#f59e0b';
          case 'visited':
            return '#22c55e';
          default:
            return '#3b82f6';
        }
      })
      .attr('stroke', '#1e293b')
      .attr('stroke-width', 2);

    nodeGroups
      .append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', '0.35em')
      .attr('fill', 'white')
      .attr('font-weight', 'bold')
      .text((d) => d.id);
  }, [nodes, edges]);

  const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

  const getAdjacencyList = (): Map<number, number[]> => {
    const adj = new Map<number, number[]>();
    nodes.forEach((node) => adj.set(node.id, []));
    edges.forEach((edge) => {
      adj.get(edge.source)?.push(edge.target);
      adj.get(edge.target)?.push(edge.source);
    });
    return adj;
  };

  const runBFS = async () => {
    const adj = getAdjacencyList();
    const visited = new Set<number>();
    const queue: number[] = [startNode];
    const order: number[] = [];

    const updatedNodes = [...nodes];
    updatedNodes[startNode].state = 'current';
    setNodes([...updatedNodes]);

    while (queue.length > 0 && runningRef.current) {
      const current = queue.shift()!;

      if (visited.has(current)) continue;
      visited.add(current);
      order.push(current);
      setVisitOrder([...order]);

      updatedNodes[current].state = 'current';
      setNodes([...updatedNodes]);
      await sleep(501 - speed * 5);

      const neighbors = adj.get(current) || [];
      for (const neighbor of neighbors) {
        if (!visited.has(neighbor) && !queue.includes(neighbor)) {
          queue.push(neighbor);
          updatedNodes[neighbor].state = 'visiting';
          setNodes([...updatedNodes]);
        }
      }

      updatedNodes[current].state = 'visited';
      setNodes([...updatedNodes]);
    }
  };

  const runDFS = async () => {
    const adj = getAdjacencyList();
    const visited = new Set<number>();
    const order: number[] = [];
    const updatedNodes = [...nodes];

    const dfs = async (node: number) => {
      if (visited.has(node) || !runningRef.current) return;

      visited.add(node);
      order.push(node);
      setVisitOrder([...order]);

      updatedNodes[node].state = 'current';
      setNodes([...updatedNodes]);
      await sleep(501 - speed * 5);

      const neighbors = adj.get(node) || [];
      for (const neighbor of neighbors) {
        if (!visited.has(neighbor)) {
          updatedNodes[neighbor].state = 'visiting';
          setNodes([...updatedNodes]);
          await dfs(neighbor);
        }
      }

      updatedNodes[node].state = 'visited';
      setNodes([...updatedNodes]);
    };

    await dfs(startNode);
  };

  const startAlgorithm = async () => {
    setRunning(true);
    runningRef.current = true;
    setVisitOrder([]);

    const resetNodes = nodes.map((n) => ({ ...n, state: 'default' as const }));
    setNodes(resetNodes);

    await sleep(100);

    if (algorithm === 'bfs') {
      await runBFS();
    } else {
      await runDFS();
    }

    setRunning(false);
    runningRef.current = false;
  };

  const stopAlgorithm = () => {
    runningRef.current = false;
    setRunning(false);
  };

  const reset = () => {
    stopAlgorithm();
    const resetNodes = nodes.map((n) => ({ ...n, state: 'default' as const }));
    setNodes(resetNodes);
    setVisitOrder([]);
  };

  return (
    <div>
      <h2 className="text-xl font-semibold text-content-primary mb-4">
        Graph Traversal Visualizer
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <div className="bg-surface-tertiary rounded-lg p-4">
            <svg ref={svgRef} width="100%" height="300" viewBox="0 0 500 300" />
          </div>

          <div className="mt-4 flex items-center justify-center space-x-4 text-sm text-content-secondary">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-blue-500 rounded-full" />
              <span>Unvisited</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-yellow-500 rounded-full" />
              <span>In Queue/Stack</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-red-500 rounded-full" />
              <span>Current</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-green-500 rounded-full" />
              <span>Visited</span>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <ControlPanel title="Controls">
            <div>
              <label className="block text-sm font-medium text-content-secondary mb-2">
                Algorithm
              </label>
              <select
                value={algorithm}
                onChange={(e) => setAlgorithm(e.target.value as Algorithm)}
                disabled={running}
                className="w-full px-3 py-2 rounded-lg border border-edge-secondary dark:border-edge-secondary bg-surface-secondary text-content-primary"
              >
                <option value="bfs">Breadth-First Search</option>
                <option value="dfs">Depth-First Search</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-content-secondary mb-2">
                Start Node
              </label>
              <select
                value={startNode}
                onChange={(e) => setStartNode(Number(e.target.value))}
                disabled={running}
                className="w-full px-3 py-2 rounded-lg border border-edge-secondary dark:border-edge-secondary bg-surface-secondary text-content-primary"
              >
                {nodes.map((node) => (
                  <option key={node.id} value={node.id}>
                    Node {node.id}
                  </option>
                ))}
              </select>
            </div>

            <Slider
              label="Nodes"
              value={nodeCount}
              onChange={(e) => setNodeCount(Number(e.target.value))}
              min={4}
              max={12}
              disabled={running}
            />

            <Slider
              label="Speed"
              value={speed}
              onChange={(e) => setSpeed(Number(e.target.value))}
              min={1}
              max={100}
            />

            <div className="flex flex-col space-y-2">
              {running ? (
                <Button onClick={stopAlgorithm} variant="primary">
                  Stop
                </Button>
              ) : (
                <Button onClick={startAlgorithm} variant="primary">
                  Start
                </Button>
              )}
              <Button onClick={reset} disabled={running} variant="secondary">
                Reset
              </Button>
              <Button onClick={generateGraph} disabled={running} variant="outline">
                New Graph
              </Button>
            </div>
          </ControlPanel>

          <ControlPanel title="Visit Order">
            <div className="flex flex-wrap gap-2">
              {visitOrder.length > 0 ? (
                visitOrder.map((nodeId, idx) => (
                  <span
                    key={idx}
                    className="w-8 h-8 flex items-center justify-center bg-green-500 text-white rounded-full text-sm font-medium"
                  >
                    {nodeId}
                  </span>
                ))
              ) : (
                <span className="text-content-muted text-sm">Run algorithm to see order</span>
              )}
            </div>
          </ControlPanel>
        </div>
      </div>
    </div>
  );
}
