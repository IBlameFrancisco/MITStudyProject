'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import * as d3 from 'd3';
import Button from '@/components/ui/Button';
import Slider from '@/components/ui/Slider';
import ControlPanel from '@/components/ui/ControlPanel';

interface TreeNode {
  value: number;
  left?: TreeNode;
  right?: TreeNode;
  x?: number;
  y?: number;
  state: 'default' | 'current' | 'visited';
}

type Traversal = 'inorder' | 'preorder' | 'postorder';

export default function TreeVisualizer() {
  const svgRef = useRef<SVGSVGElement>(null);
  const [root, setRoot] = useState<TreeNode | null>(null);
  const [nodeCount, setNodeCount] = useState(7);
  const [traversal, setTraversal] = useState<Traversal>('inorder');
  const [speed, setSpeed] = useState(50);
  const [running, setRunning] = useState(false);
  const [visitOrder, setVisitOrder] = useState<number[]>([]);
  const [insertValue, setInsertValue] = useState('');
  const runningRef = useRef(false);

  const insertNode = (node: TreeNode | null | undefined, value: number): TreeNode => {
    if (!node) {
      return { value, state: 'default' };
    }
    if (value < node.value) {
      node.left = insertNode(node.left, value);
    } else {
      node.right = insertNode(node.right, value);
    }
    return node;
  };

  const generateTree = useCallback(() => {
    const values: number[] = [];
    const used = new Set<number>();

    while (values.length < nodeCount) {
      const val = Math.floor(Math.random() * 99) + 1;
      if (!used.has(val)) {
        used.add(val);
        values.push(val);
      }
    }

    let newRoot: TreeNode | null = null;
    values.forEach((val) => {
      newRoot = insertNode(newRoot, val);
    });

    setRoot(newRoot);
    setVisitOrder([]);
  }, [nodeCount]);

  useEffect(() => {
    generateTree();
  }, [generateTree]);

  const calculatePositions = useCallback((node: TreeNode | null | undefined, depth: number, left: number, right: number): void => {
    if (!node) return;

    const x = (left + right) / 2;
    const y = depth * 60 + 40;
    node.x = x;
    node.y = y;

    calculatePositions(node.left, depth + 1, left, x);
    calculatePositions(node.right, depth + 1, x, right);
  }, []);

  useEffect(() => {
    if (!svgRef.current || !root) return;

    const width = 600;
    const tempRoot = JSON.parse(JSON.stringify(root));
    calculatePositions(tempRoot, 0, 0, width);

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const g = svg.append('g');

    const drawEdges = (node: TreeNode | null | undefined) => {
      if (!node) return;
      if (node.left && node.x !== undefined && node.y !== undefined && node.left.x !== undefined && node.left.y !== undefined) {
        g.append('line')
          .attr('x1', node.x)
          .attr('y1', node.y)
          .attr('x2', node.left.x)
          .attr('y2', node.left.y)
          .attr('stroke', '#94a3b8')
          .attr('stroke-width', 2);
        drawEdges(node.left);
      }
      if (node.right && node.x !== undefined && node.y !== undefined && node.right.x !== undefined && node.right.y !== undefined) {
        g.append('line')
          .attr('x1', node.x)
          .attr('y1', node.y)
          .attr('x2', node.right.x)
          .attr('y2', node.right.y)
          .attr('stroke', '#94a3b8')
          .attr('stroke-width', 2);
        drawEdges(node.right);
      }
    };

    drawEdges(tempRoot);

    const drawNodes = (node: TreeNode | null | undefined) => {
      if (!node || node.x === undefined || node.y === undefined) return;

      const originalNode = findNode(root, node.value);
      const state = originalNode?.state || 'default';

      let fillColor = '#3b82f6';
      if (state === 'current') fillColor = '#ef4444';
      else if (state === 'visited') fillColor = '#22c55e';

      g.append('circle')
        .attr('cx', node.x)
        .attr('cy', node.y)
        .attr('r', 20)
        .attr('fill', fillColor)
        .attr('stroke', '#1e293b')
        .attr('stroke-width', 2);

      g.append('text')
        .attr('x', node.x)
        .attr('y', node.y)
        .attr('text-anchor', 'middle')
        .attr('dy', '0.35em')
        .attr('fill', 'white')
        .attr('font-weight', 'bold')
        .attr('font-size', '12px')
        .text(node.value);

      drawNodes(node.left);
      drawNodes(node.right);
    };

    drawNodes(tempRoot);
  }, [root, calculatePositions]);

  const findNode = (node: TreeNode | null | undefined, value: number): TreeNode | null => {
    if (!node) return null;
    if (node.value === value) return node;
    return findNode(node.left, value) || findNode(node.right, value);
  };

  const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

  const cloneTree = (node: TreeNode | null | undefined): TreeNode | null => {
    if (!node) return null;
    return {
      value: node.value,
      state: node.state,
      left: cloneTree(node.left) ?? undefined,
      right: cloneTree(node.right) ?? undefined,
    };
  };

  const setNodeState = (tree: TreeNode | null, value: number, state: TreeNode['state']): TreeNode | null => {
    if (!tree) return null;
    const newTree = cloneTree(tree)!;
    const node = findNode(newTree, value);
    if (node) node.state = state;
    return newTree;
  };

  const runTraversal = async () => {
    const order: number[] = [];
    let currentTree = cloneTree(root);

    const inorder = async (node: TreeNode | null | undefined) => {
      if (!node || !runningRef.current) return;
      await inorder(findNode(currentTree, node.value)?.left ? node.left : null);
      if (!runningRef.current) return;

      currentTree = setNodeState(currentTree, node.value, 'current');
      setRoot(currentTree);
      await sleep(501 - speed * 5);

      order.push(node.value);
      setVisitOrder([...order]);

      currentTree = setNodeState(currentTree, node.value, 'visited');
      setRoot(currentTree);

      await inorder(node.right);
    };

    const preorder = async (node: TreeNode | null | undefined) => {
      if (!node || !runningRef.current) return;

      currentTree = setNodeState(currentTree, node.value, 'current');
      setRoot(currentTree);
      await sleep(501 - speed * 5);

      order.push(node.value);
      setVisitOrder([...order]);

      currentTree = setNodeState(currentTree, node.value, 'visited');
      setRoot(currentTree);

      await preorder(node.left);
      await preorder(node.right);
    };

    const postorder = async (node: TreeNode | null | undefined) => {
      if (!node || !runningRef.current) return;
      await postorder(node.left);
      await postorder(node.right);
      if (!runningRef.current) return;

      currentTree = setNodeState(currentTree, node.value, 'current');
      setRoot(currentTree);
      await sleep(501 - speed * 5);

      order.push(node.value);
      setVisitOrder([...order]);

      currentTree = setNodeState(currentTree, node.value, 'visited');
      setRoot(currentTree);
    };

    switch (traversal) {
      case 'inorder':
        await inorder(root);
        break;
      case 'preorder':
        await preorder(root);
        break;
      case 'postorder':
        await postorder(root);
        break;
    }
  };

  const startTraversal = async () => {
    setRunning(true);
    runningRef.current = true;
    setVisitOrder([]);

    const resetTree = (node: TreeNode | null | undefined): TreeNode | null => {
      if (!node) return null;
      return { ...node, state: 'default', left: resetTree(node.left) ?? undefined, right: resetTree(node.right) ?? undefined };
    };
    setRoot(resetTree(root));

    await sleep(100);
    await runTraversal();

    setRunning(false);
    runningRef.current = false;
  };

  const stopTraversal = () => {
    runningRef.current = false;
    setRunning(false);
  };

  const handleInsert = () => {
    const value = parseInt(insertValue);
    if (isNaN(value) || value < 1 || value > 99) return;
    setRoot(insertNode(root ? cloneTree(root)! : null, value));
    setInsertValue('');
    setVisitOrder([]);
  };

  return (
    <div>
      <h2 className="text-xl font-semibold text-content-primary mb-4">
        Binary Search Tree Visualizer
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <div className="bg-surface-tertiary rounded-lg p-4 overflow-x-auto">
            <svg ref={svgRef} width="100%" height="300" viewBox="0 0 600 300" />
          </div>

          <div className="mt-4 flex items-center justify-center space-x-4 text-sm text-content-secondary">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-blue-500 rounded-full" />
              <span>Unvisited</span>
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
                Traversal
              </label>
              <select
                value={traversal}
                onChange={(e) => setTraversal(e.target.value as Traversal)}
                disabled={running}
                className="w-full px-3 py-2 rounded-lg border border-edge-secondary dark:border-edge-secondary bg-surface-secondary text-content-primary"
              >
                <option value="inorder">In-order (LNR)</option>
                <option value="preorder">Pre-order (NLR)</option>
                <option value="postorder">Post-order (LRN)</option>
              </select>
            </div>

            <Slider
              label="Initial Nodes"
              value={nodeCount}
              onChange={(e) => setNodeCount(Number(e.target.value))}
              min={3}
              max={15}
              disabled={running}
            />

            <Slider
              label="Speed"
              value={speed}
              onChange={(e) => setSpeed(Number(e.target.value))}
              min={1}
              max={100}
            />

            <div className="flex space-x-2">
              <input
                type="number"
                value={insertValue}
                onChange={(e) => setInsertValue(e.target.value)}
                placeholder="1-99"
                min={1}
                max={99}
                disabled={running}
                className="flex-1 px-3 py-2 rounded-lg border border-edge-secondary dark:border-edge-secondary bg-surface-secondary text-content-primary"
              />
              <Button onClick={handleInsert} disabled={running} variant="secondary">
                Insert
              </Button>
            </div>

            <div className="flex flex-col space-y-2">
              {running ? (
                <Button onClick={stopTraversal} variant="primary">
                  Stop
                </Button>
              ) : (
                <Button onClick={startTraversal} variant="primary">
                  Traverse
                </Button>
              )}
              <Button onClick={generateTree} disabled={running} variant="outline">
                New Tree
              </Button>
            </div>
          </ControlPanel>

          <ControlPanel title="Visit Order">
            <div className="flex flex-wrap gap-2">
              {visitOrder.length > 0 ? (
                visitOrder.map((val, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-1 bg-green-500 text-white rounded text-sm font-medium"
                  >
                    {val}
                  </span>
                ))
              ) : (
                <span className="text-content-muted text-sm">Run traversal to see order</span>
              )}
            </div>
          </ControlPanel>
        </div>
      </div>
    </div>
  );
}
