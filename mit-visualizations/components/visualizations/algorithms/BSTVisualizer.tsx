'use client';

/**
 * Binary Search Tree Visualizer
 * =============================
 * Interactive visualization of BST operations and properties.
 */

import { useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ControlPanel from '@/components/ui/ControlPanel';
import { LaTeX } from '@/components/ui/LaTeX';

interface TreeNode {
  value: number;
  left: TreeNode | null;
  right: TreeNode | null;
  x: number;
  y: number;
  state: 'default' | 'visiting' | 'found' | 'inserting' | 'path';
}

export default function BSTVisualizer() {
  const [root, setRoot] = useState<TreeNode | null>(null);
  const [inputValue, setInputValue] = useState('');
  const [operation, setOperation] = useState<string>('');
  const [traversalResult, setTraversalResult] = useState<number[]>([]);
  const [isAnimating, setIsAnimating] = useState(false);
  const svgRef = useRef<SVGSVGElement>(null);
  const animationRef = useRef(false);

  const NODE_RADIUS = 22;
  const LEVEL_HEIGHT = 70;
  const SVG_WIDTH = 700;
  const SVG_HEIGHT = 350;

  // Calculate node positions using in-order traversal for x-coordinates
  const calculatePositions = useCallback((node: TreeNode | null, depth: number = 0, positions: { min: number; max: number } = { min: 0, max: SVG_WIDTH }): void => {
    if (!node) return;

    const mid = (positions.min + positions.max) / 2;
    node.x = mid;
    node.y = 40 + depth * LEVEL_HEIGHT;

    calculatePositions(node.left, depth + 1, { min: positions.min, max: mid });
    calculatePositions(node.right, depth + 1, { min: mid, max: positions.max });
  }, []);

  // Clone tree for immutable updates
  const cloneTree = (node: TreeNode | null): TreeNode | null => {
    if (!node) return null;
    return {
      ...node,
      left: cloneTree(node.left),
      right: cloneTree(node.right),
    };
  };

  // Reset all node states
  const resetStates = (node: TreeNode | null): void => {
    if (!node) return;
    node.state = 'default';
    resetStates(node.left);
    resetStates(node.right);
  };

  const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  // Insert operation
  const insert = async (value: number) => {
    setIsAnimating(true);
    animationRef.current = true;
    setOperation(`Inserting ${value}...`);

    const insertNode = async (node: TreeNode | null, val: number, depth: number = 0): Promise<TreeNode> => {
      if (!node) {
        return {
          value: val,
          left: null,
          right: null,
          x: 0,
          y: 0,
          state: 'inserting',
        };
      }

      const newNode = { ...node, state: 'visiting' as const };
      const newTree = cloneTree(root);

      // Find and update the current node in the tree
      const updateNodeInTree = (treeNode: TreeNode | null, target: number): void => {
        if (!treeNode) return;
        if (treeNode.value === node.value) {
          treeNode.state = 'visiting';
        }
        updateNodeInTree(treeNode.left, target);
        updateNodeInTree(treeNode.right, target);
      };

      if (newTree) {
        resetStates(newTree);
        updateNodeInTree(newTree, node.value);
        calculatePositions(newTree);
        setRoot(newTree);
      }

      await sleep(500);
      if (!animationRef.current) return node;

      if (val < node.value) {
        newNode.left = await insertNode(node.left, val, depth + 1);
      } else if (val > node.value) {
        newNode.right = await insertNode(node.right, val, depth + 1);
      }

      return newNode;
    };

    if (!root) {
      const newNode: TreeNode = {
        value,
        left: null,
        right: null,
        x: SVG_WIDTH / 2,
        y: 40,
        state: 'inserting',
      };
      setRoot(newNode);
    } else {
      const newTree = await insertNode(root, value);
      if (animationRef.current) {
        resetStates(newTree);
        calculatePositions(newTree);
        setRoot(newTree);
      }
    }

    setOperation(`Inserted ${value}`);
    setIsAnimating(false);
    animationRef.current = false;
  };

  // Search operation
  const search = async (value: number) => {
    setIsAnimating(true);
    animationRef.current = true;
    setOperation(`Searching for ${value}...`);

    const searchNode = async (node: TreeNode | null): Promise<boolean> => {
      if (!node || !animationRef.current) return false;

      const newTree = cloneTree(root);
      const markNode = (treeNode: TreeNode | null): void => {
        if (!treeNode) return;
        if (treeNode.value === node.value) {
          treeNode.state = 'visiting';
        }
        markNode(treeNode.left);
        markNode(treeNode.right);
      };

      if (newTree) {
        resetStates(newTree);
        markNode(newTree);
        calculatePositions(newTree);
        setRoot(newTree);
      }

      await sleep(600);

      if (value === node.value) {
        const foundTree = cloneTree(root);
        const markFound = (treeNode: TreeNode | null): void => {
          if (!treeNode) return;
          if (treeNode.value === node.value) {
            treeNode.state = 'found';
          }
          markFound(treeNode.left);
          markFound(treeNode.right);
        };
        if (foundTree) {
          resetStates(foundTree);
          markFound(foundTree);
          calculatePositions(foundTree);
          setRoot(foundTree);
        }
        return true;
      }

      if (value < node.value) {
        return searchNode(node.left);
      } else {
        return searchNode(node.right);
      }
    };

    const found = await searchNode(root);
    setOperation(found ? `Found ${value}!` : `${value} not found`);
    setIsAnimating(false);
    animationRef.current = false;
  };

  // Traversal operations
  const traverse = async (type: 'inorder' | 'preorder' | 'postorder') => {
    setIsAnimating(true);
    animationRef.current = true;
    setTraversalResult([]);
    setOperation(`${type.charAt(0).toUpperCase() + type.slice(1)} traversal...`);

    const result: number[] = [];

    const visit = async (node: TreeNode | null): Promise<void> => {
      if (!node || !animationRef.current) return;

      const markVisiting = () => {
        const newTree = cloneTree(root);
        const mark = (treeNode: TreeNode | null): void => {
          if (!treeNode) return;
          if (treeNode.value === node.value) {
            treeNode.state = 'visiting';
          }
          mark(treeNode.left);
          mark(treeNode.right);
        };
        if (newTree) {
          resetStates(newTree);
          mark(newTree);
          calculatePositions(newTree);
          setRoot(newTree);
        }
      };

      if (type === 'preorder') {
        markVisiting();
        await sleep(400);
        result.push(node.value);
        setTraversalResult([...result]);
      }

      await visit(node.left);

      if (type === 'inorder') {
        markVisiting();
        await sleep(400);
        result.push(node.value);
        setTraversalResult([...result]);
      }

      await visit(node.right);

      if (type === 'postorder') {
        markVisiting();
        await sleep(400);
        result.push(node.value);
        setTraversalResult([...result]);
      }
    };

    await visit(root);

    if (animationRef.current && root) {
      const newTree = cloneTree(root);
      resetStates(newTree);
      calculatePositions(newTree);
      setRoot(newTree);
    }

    setOperation(`${type.charAt(0).toUpperCase() + type.slice(1)}: [${result.join(', ')}]`);
    setIsAnimating(false);
    animationRef.current = false;
  };

  const handleOperation = (op: 'insert' | 'search') => {
    const value = parseInt(inputValue);
    if (isNaN(value)) return;

    if (op === 'insert') {
      insert(value);
    } else {
      search(value);
    }
    setInputValue('');
  };

  const clearTree = () => {
    setRoot(null);
    setOperation('');
    setTraversalResult([]);
  };

  const loadExample = () => {
    const values = [50, 30, 70, 20, 40, 60, 80];
    let newRoot: TreeNode | null = null;

    const insertSync = (node: TreeNode | null, val: number): TreeNode => {
      if (!node) {
        return { value: val, left: null, right: null, x: 0, y: 0, state: 'default' };
      }
      if (val < node.value) {
        node.left = insertSync(node.left, val);
      } else if (val > node.value) {
        node.right = insertSync(node.right, val);
      }
      return node;
    };

    for (const val of values) {
      newRoot = insertSync(newRoot, val);
    }

    calculatePositions(newRoot);
    setRoot(newRoot);
    setOperation('Loaded example BST');
  };

  // Render tree
  const renderTree = (node: TreeNode | null): React.ReactNode => {
    if (!node) return null;

    const getNodeColor = () => {
      switch (node.state) {
        case 'visiting': return 'fill-yellow-500';
        case 'found': return 'fill-green-500';
        case 'inserting': return 'fill-blue-500';
        case 'path': return 'fill-purple-500';
        default: return 'fill-brand-500';
      }
    };

    return (
      <g key={node.value}>
        {/* Edges to children */}
        {node.left && (
          <line
            x1={node.x}
            y1={node.y}
            x2={node.left.x}
            y2={node.left.y}
            className="stroke-gray-400 dark:stroke-gray-600"
            strokeWidth={2}
          />
        )}
        {node.right && (
          <line
            x1={node.x}
            y1={node.y}
            x2={node.right.x}
            y2={node.right.y}
            className="stroke-gray-400 dark:stroke-gray-600"
            strokeWidth={2}
          />
        )}

        {/* Render children */}
        {renderTree(node.left)}
        {renderTree(node.right)}

        {/* Node circle */}
        <motion.circle
          cx={node.x}
          cy={node.y}
          r={NODE_RADIUS}
          className={getNodeColor()}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 300 }}
        />

        {/* Node value */}
        <text
          x={node.x}
          y={node.y + 5}
          textAnchor="middle"
          className="fill-white font-mono text-sm font-bold"
        >
          {node.value}
        </text>
      </g>
    );
  };

  // Calculate tree height
  const getHeight = (node: TreeNode | null): number => {
    if (!node) return -1;
    return 1 + Math.max(getHeight(node.left), getHeight(node.right));
  };

  // Count nodes
  const countNodes = (node: TreeNode | null): number => {
    if (!node) return 0;
    return 1 + countNodes(node.left) + countNodes(node.right);
  };

  return (
    <div>
      <h2 className="text-xl font-semibold text-content-primary mb-2">
        Binary Search Tree Visualizer
      </h2>
      <p className="text-sm text-content-secondary mb-6">
        BST Property: Left subtree {'<'} Root {'<'} Right subtree. Operations: <LaTeX math="O(h)" /> where h = height
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 space-y-4">
          {/* Tree Visualization */}
          <div className="bg-surface-tertiary rounded-2xl p-4 border border-edge-primary">
            <svg
              ref={svgRef}
              width="100%"
              height={SVG_HEIGHT}
              viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`}
              className="overflow-visible"
            >
              {root ? renderTree(root) : (
                <text x={SVG_WIDTH / 2} y={SVG_HEIGHT / 2} textAnchor="middle" className="fill-gray-400 text-sm">
                  Empty tree - insert nodes to begin
                </text>
              )}
            </svg>
          </div>

          {/* Operation Status */}
          {operation && (
            <div className="bg-surface-secondary rounded-xl p-4 border border-edge-primary">
              <span className="text-sm text-content-primary font-mono">{operation}</span>
            </div>
          )}

          {/* Traversal Result */}
          {traversalResult.length > 0 && (
            <div className="bg-surface-secondary rounded-xl p-4 border border-edge-primary">
              <h4 className="text-sm font-semibold text-content-primary mb-2">Traversal Order</h4>
              <div className="flex gap-2 flex-wrap">
                {traversalResult.map((val, idx) => (
                  <motion.span
                    key={idx}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="px-3 py-1 bg-brand-500 text-white rounded-lg font-mono text-sm"
                  >
                    {val}
                  </motion.span>
                ))}
              </div>
            </div>
          )}

          {/* Tree Statistics */}
          <div className="bg-surface-secondary rounded-xl p-4 border border-edge-primary">
            <h4 className="text-sm font-semibold text-content-primary mb-2">Tree Statistics</h4>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <span className="text-content-muted">Nodes:</span>
                <span className="ml-2 font-mono text-content-primary">{countNodes(root)}</span>
              </div>
              <div>
                <span className="text-content-muted">Height:</span>
                <span className="ml-2 font-mono text-content-primary">{getHeight(root)}</span>
              </div>
              <div>
                <span className="text-content-muted">Ideal height:</span>
                <span className="ml-2 font-mono text-content-primary">
                  {countNodes(root) > 0 ? Math.floor(Math.log2(countNodes(root))) : 0}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="space-y-4">
          <ControlPanel title="Operations">
            <div className="space-y-3">
              <input
                type="number"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Enter value"
                disabled={isAnimating}
                className="w-full px-3 py-2 rounded-lg border border-edge-primary bg-surface-secondary text-content-primary disabled:opacity-50"
              />
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => handleOperation('insert')}
                  disabled={isAnimating || !inputValue}
                  className="px-3 py-2 rounded-lg bg-green-500 text-white text-sm font-medium hover:bg-green-600 disabled:opacity-50"
                >
                  Insert
                </button>
                <button
                  onClick={() => handleOperation('search')}
                  disabled={isAnimating || !inputValue || !root}
                  className="px-3 py-2 rounded-lg bg-blue-500 text-white text-sm font-medium hover:bg-blue-600 disabled:opacity-50"
                >
                  Search
                </button>
              </div>

              <div className="border-t border-edge-primary pt-3">
                <p className="text-xs text-content-muted mb-2">Traversals</p>
                <div className="grid grid-cols-3 gap-1">
                  <button
                    onClick={() => traverse('inorder')}
                    disabled={isAnimating || !root}
                    className="px-2 py-1.5 rounded-lg bg-purple-500 text-white text-xs font-medium hover:bg-purple-600 disabled:opacity-50"
                  >
                    In
                  </button>
                  <button
                    onClick={() => traverse('preorder')}
                    disabled={isAnimating || !root}
                    className="px-2 py-1.5 rounded-lg bg-purple-500 text-white text-xs font-medium hover:bg-purple-600 disabled:opacity-50"
                  >
                    Pre
                  </button>
                  <button
                    onClick={() => traverse('postorder')}
                    disabled={isAnimating || !root}
                    className="px-2 py-1.5 rounded-lg bg-purple-500 text-white text-xs font-medium hover:bg-purple-600 disabled:opacity-50"
                  >
                    Post
                  </button>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={loadExample}
                  disabled={isAnimating}
                  className="flex-1 px-3 py-2 rounded-lg bg-surface-tertiary border border-edge-primary text-content-secondary text-sm font-medium hover:bg-surface-accent disabled:opacity-50"
                >
                  Example
                </button>
                <button
                  onClick={clearTree}
                  disabled={isAnimating}
                  className="flex-1 px-3 py-2 rounded-lg bg-red-500 text-white text-sm font-medium hover:bg-red-600 disabled:opacity-50"
                >
                  Clear
                </button>
              </div>
            </div>
          </ControlPanel>

          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 border border-blue-200 dark:border-blue-800">
            <h4 className="text-sm font-semibold text-blue-800 dark:text-blue-200 mb-2">
              BST Property
            </h4>
            <p className="text-xs text-blue-700 dark:text-blue-300 leading-relaxed">
              For every node: all values in left subtree are smaller, all values in right subtree are larger.
              This enables <LaTeX math="O(\log n)" /> search in balanced trees.
            </p>
          </div>

          <div className="bg-amber-50 dark:bg-amber-900/20 rounded-xl p-4 border border-amber-200 dark:border-amber-800">
            <h4 className="text-sm font-semibold text-amber-800 dark:text-amber-200 mb-2">
              Traversal Orders
            </h4>
            <ul className="text-xs text-amber-700 dark:text-amber-300 space-y-1">
              <li><strong>In-order:</strong> Left → Root → Right (sorted!)</li>
              <li><strong>Pre-order:</strong> Root → Left → Right</li>
              <li><strong>Post-order:</strong> Left → Right → Root</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
