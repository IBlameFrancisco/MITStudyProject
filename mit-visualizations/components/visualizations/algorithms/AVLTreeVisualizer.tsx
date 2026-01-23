'use client';

/**
 * AVL Tree Visualizer
 * ====================
 * Interactive visualization of self-balancing AVL trees with rotations.
 */

import { useState, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import ControlPanel from '@/components/ui/ControlPanel';
import { LaTeX } from '@/components/ui/LaTeX';

interface AVLNode {
  value: number;
  left: AVLNode | null;
  right: AVLNode | null;
  height: number;
  x: number;
  y: number;
  state: 'default' | 'visiting' | 'rotating' | 'unbalanced' | 'balanced';
}

type RotationType = 'LL' | 'RR' | 'LR' | 'RL' | null;

export default function AVLTreeVisualizer() {
  const [root, setRoot] = useState<AVLNode | null>(null);
  const [inputValue, setInputValue] = useState('');
  const [operation, setOperation] = useState<string>('');
  const [lastRotation, setLastRotation] = useState<RotationType>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const animationRef = useRef(false);

  const NODE_RADIUS = 22;
  const LEVEL_HEIGHT = 70;
  const SVG_WIDTH = 700;
  const SVG_HEIGHT = 380;

  // Get height of node
  const height = (node: AVLNode | null): number => {
    return node ? node.height : -1;
  };

  // Get balance factor
  const getBalance = (node: AVLNode | null): number => {
    return node ? height(node.left) - height(node.right) : 0;
  };

  // Update height
  const updateHeight = (node: AVLNode): void => {
    node.height = 1 + Math.max(height(node.left), height(node.right));
  };

  // Calculate positions
  const calculatePositions = useCallback((node: AVLNode | null, depth: number = 0, positions: { min: number; max: number } = { min: 0, max: SVG_WIDTH }): void => {
    if (!node) return;

    const mid = (positions.min + positions.max) / 2;
    node.x = mid;
    node.y = 50 + depth * LEVEL_HEIGHT;

    calculatePositions(node.left, depth + 1, { min: positions.min, max: mid });
    calculatePositions(node.right, depth + 1, { min: mid, max: positions.max });
  }, []);

  // Clone tree
  const cloneTree = (node: AVLNode | null): AVLNode | null => {
    if (!node) return null;
    return {
      ...node,
      left: cloneTree(node.left),
      right: cloneTree(node.right),
    };
  };

  // Reset states
  const resetStates = (node: AVLNode | null): void => {
    if (!node) return;
    node.state = 'default';
    resetStates(node.left);
    resetStates(node.right);
  };

  const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  // Right rotation (LL case)
  const rightRotate = (y: AVLNode): AVLNode => {
    const x = y.left!;
    const T2 = x.right;

    x.right = y;
    y.left = T2;

    updateHeight(y);
    updateHeight(x);

    return x;
  };

  // Left rotation (RR case)
  const leftRotate = (x: AVLNode): AVLNode => {
    const y = x.right!;
    const T2 = y.left;

    y.left = x;
    x.right = T2;

    updateHeight(x);
    updateHeight(y);

    return y;
  };

  // Insert with animation
  const insert = async (value: number) => {
    setIsAnimating(true);
    animationRef.current = true;
    setOperation(`Inserting ${value}...`);
    setLastRotation(null);

    const insertNode = (node: AVLNode | null, val: number): AVLNode => {
      // Standard BST insertion
      if (!node) {
        return {
          value: val,
          left: null,
          right: null,
          height: 0,
          x: 0,
          y: 0,
          state: 'default',
        };
      }

      if (val < node.value) {
        node.left = insertNode(node.left, val);
      } else if (val > node.value) {
        node.right = insertNode(node.right, val);
      } else {
        return node; // Duplicate
      }

      // Update height
      updateHeight(node);

      // Get balance factor
      const balance = getBalance(node);

      // Left Left Case
      if (balance > 1 && val < node.left!.value) {
        setLastRotation('LL');
        return rightRotate(node);
      }

      // Right Right Case
      if (balance < -1 && val > node.right!.value) {
        setLastRotation('RR');
        return leftRotate(node);
      }

      // Left Right Case
      if (balance > 1 && val > node.left!.value) {
        setLastRotation('LR');
        node.left = leftRotate(node.left!);
        return rightRotate(node);
      }

      // Right Left Case
      if (balance < -1 && val < node.right!.value) {
        setLastRotation('RL');
        node.right = rightRotate(node.right!);
        return leftRotate(node);
      }

      return node;
    };

    // Animated insertion
    const animatedInsert = async (node: AVLNode | null, val: number): Promise<AVLNode> => {
      if (!node) {
        return {
          value: val,
          left: null,
          right: null,
          height: 0,
          x: 0,
          y: 0,
          state: 'visiting',
        };
      }

      // Mark current node as visiting
      const newTree = cloneTree(root);
      const markVisiting = (treeNode: AVLNode | null): void => {
        if (!treeNode) return;
        if (treeNode.value === node.value) {
          treeNode.state = 'visiting';
        }
        markVisiting(treeNode.left);
        markVisiting(treeNode.right);
      };
      if (newTree) {
        resetStates(newTree);
        markVisiting(newTree);
        calculatePositions(newTree);
        setRoot(newTree);
      }
      await sleep(400);

      if (!animationRef.current) return node;

      if (val < node.value) {
        node.left = await animatedInsert(node.left, val);
      } else if (val > node.value) {
        node.right = await animatedInsert(node.right, val);
      } else {
        return node;
      }

      updateHeight(node);
      const balance = getBalance(node);

      // Check for imbalance and rotate
      if (Math.abs(balance) > 1) {
        node.state = 'unbalanced';
        const tempTree = cloneTree(root);
        if (tempTree) {
          calculatePositions(tempTree);
          setRoot(tempTree);
        }
        setOperation(`Node ${node.value} is unbalanced (balance = ${balance})`);
        await sleep(800);

        if (balance > 1 && val < node.left!.value) {
          setLastRotation('LL');
          setOperation('Performing Right Rotation (LL case)');
          await sleep(600);
          return rightRotate(node);
        }
        if (balance < -1 && val > node.right!.value) {
          setLastRotation('RR');
          setOperation('Performing Left Rotation (RR case)');
          await sleep(600);
          return leftRotate(node);
        }
        if (balance > 1 && val > node.left!.value) {
          setLastRotation('LR');
          setOperation('Performing Left-Right Rotation (LR case)');
          await sleep(600);
          node.left = leftRotate(node.left!);
          return rightRotate(node);
        }
        if (balance < -1 && val < node.right!.value) {
          setLastRotation('RL');
          setOperation('Performing Right-Left Rotation (RL case)');
          await sleep(600);
          node.right = rightRotate(node.right!);
          return leftRotate(node);
        }
      }

      return node;
    };

    let newRoot: AVLNode;
    if (!root) {
      newRoot = insertNode(null, value);
    } else {
      newRoot = await animatedInsert(cloneTree(root)!, value);
    }

    resetStates(newRoot);
    calculatePositions(newRoot);
    setRoot(newRoot);
    setOperation(lastRotation ? `Inserted ${value} with ${lastRotation} rotation` : `Inserted ${value}`);
    setIsAnimating(false);
    animationRef.current = false;
  };

  const handleInsert = () => {
    const value = parseInt(inputValue);
    if (isNaN(value)) return;
    insert(value);
    setInputValue('');
  };

  const clearTree = () => {
    setRoot(null);
    setOperation('');
    setLastRotation(null);
  };

  const loadExample = () => {
    // Insert values that cause all rotation types
    const values = [30, 20, 40, 10, 25, 35, 50];
    let newRoot: AVLNode | null = null;

    const insertSync = (node: AVLNode | null, val: number): AVLNode => {
      if (!node) {
        return { value: val, left: null, right: null, height: 0, x: 0, y: 0, state: 'default' };
      }

      if (val < node.value) {
        node.left = insertSync(node.left, val);
      } else if (val > node.value) {
        node.right = insertSync(node.right, val);
      }

      updateHeight(node);
      const balance = getBalance(node);

      if (balance > 1 && val < node.left!.value) return rightRotate(node);
      if (balance < -1 && val > node.right!.value) return leftRotate(node);
      if (balance > 1 && val > node.left!.value) {
        node.left = leftRotate(node.left!);
        return rightRotate(node);
      }
      if (balance < -1 && val < node.right!.value) {
        node.right = rightRotate(node.right!);
        return leftRotate(node);
      }

      return node;
    };

    for (const val of values) {
      newRoot = insertSync(newRoot, val);
    }

    calculatePositions(newRoot);
    setRoot(newRoot);
    setOperation('Loaded balanced AVL tree');
  };

  // Load unbalanced example to show rotations
  const loadUnbalancedExample = async () => {
    clearTree();
    setOperation('Insert sequence: 3, 2, 1 (will trigger LL rotation)');
    await sleep(1000);

    await insert(3);
    await sleep(500);
    await insert(2);
    await sleep(500);
    await insert(1);
  };

  // Render tree
  const renderTree = (node: AVLNode | null): React.ReactNode => {
    if (!node) return null;

    const balance = getBalance(node);

    const getNodeColor = () => {
      switch (node.state) {
        case 'visiting': return 'fill-yellow-500';
        case 'rotating': return 'fill-purple-500';
        case 'unbalanced': return 'fill-red-500';
        case 'balanced': return 'fill-green-500';
        default: return Math.abs(balance) > 1 ? 'fill-red-500' : 'fill-brand-500';
      }
    };

    return (
      <g key={node.value}>
        {/* Edges */}
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

        {renderTree(node.left)}
        {renderTree(node.right)}

        {/* Node */}
        <motion.circle
          cx={node.x}
          cy={node.y}
          r={NODE_RADIUS}
          className={getNodeColor()}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
        />

        {/* Value */}
        <text
          x={node.x}
          y={node.y + 5}
          textAnchor="middle"
          className="fill-white font-mono text-sm font-bold"
        >
          {node.value}
        </text>

        {/* Balance factor */}
        <text
          x={node.x + NODE_RADIUS + 5}
          y={node.y - NODE_RADIUS + 5}
          className={`font-mono text-xs ${Math.abs(balance) > 1 ? 'fill-red-500' : 'fill-content-muted'}`}
        >
          {balance >= 0 ? `+${balance}` : balance}
        </text>

        {/* Height */}
        <text
          x={node.x}
          y={node.y + NODE_RADIUS + 15}
          textAnchor="middle"
          className="fill-content-muted font-mono text-xs"
        >
          h={node.height}
        </text>
      </g>
    );
  };

  return (
    <div>
      <h2 className="text-xl font-semibold text-content-primary mb-2">
        AVL Tree Visualizer
      </h2>
      <p className="text-sm text-content-secondary mb-6">
        Self-balancing BST with <LaTeX math="|balance| \leq 1" /> invariant. All operations: <LaTeX math="O(\log n)" />
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 space-y-4">
          {/* Tree Visualization */}
          <div className="bg-surface-tertiary rounded-2xl p-4 border border-edge-primary">
            <svg
              width="100%"
              height={SVG_HEIGHT}
              viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`}
              className="overflow-visible"
            >
              {root ? renderTree(root) : (
                <text x={SVG_WIDTH / 2} y={SVG_HEIGHT / 2} textAnchor="middle" className="fill-gray-400 text-sm">
                  Empty AVL tree - insert nodes to begin
                </text>
              )}
            </svg>

            {/* Legend */}
            <div className="mt-2 flex items-center justify-center gap-6 text-xs text-content-muted">
              <span>Numbers on nodes = values</span>
              <span>+/- numbers = balance factors</span>
              <span>h = height</span>
            </div>
          </div>

          {/* Operation Status */}
          {operation && (
            <div className="bg-surface-secondary rounded-xl p-4 border border-edge-primary">
              <span className="text-sm text-content-primary font-mono">{operation}</span>
              {lastRotation && (
                <span className="ml-2 px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded text-xs">
                  {lastRotation} Rotation
                </span>
              )}
            </div>
          )}

          {/* Rotation Diagrams */}
          <div className="bg-surface-secondary rounded-xl p-4 border border-edge-primary">
            <h4 className="text-sm font-semibold text-content-primary mb-3">AVL Rotations</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
              <div className={`p-3 rounded-lg border ${lastRotation === 'LL' ? 'bg-purple-100 dark:bg-purple-900/30 border-purple-400' : 'bg-surface-tertiary border-edge-primary'}`}>
                <strong className="text-content-primary">LL (Right Rotate)</strong>
                <p className="text-content-muted mt-1">Left-heavy left child</p>
                <pre className="mt-2 text-content-secondary">
{`  z           y
 /           / \\
y    →      x   z
/
x`}
                </pre>
              </div>
              <div className={`p-3 rounded-lg border ${lastRotation === 'RR' ? 'bg-purple-100 dark:bg-purple-900/30 border-purple-400' : 'bg-surface-tertiary border-edge-primary'}`}>
                <strong className="text-content-primary">RR (Left Rotate)</strong>
                <p className="text-content-muted mt-1">Right-heavy right child</p>
                <pre className="mt-2 text-content-secondary">
{`z               y
 \\             / \\
  y    →      z   x
   \\
    x`}
                </pre>
              </div>
              <div className={`p-3 rounded-lg border ${lastRotation === 'LR' ? 'bg-purple-100 dark:bg-purple-900/30 border-purple-400' : 'bg-surface-tertiary border-edge-primary'}`}>
                <strong className="text-content-primary">LR (Left-Right)</strong>
                <p className="text-content-muted mt-1">Right-heavy left child</p>
                <pre className="mt-2 text-content-secondary">
{`    z         z         x
   /         /         / \\
  y    →    x    →    y   z
   \\       /
    x     y`}
                </pre>
              </div>
              <div className={`p-3 rounded-lg border ${lastRotation === 'RL' ? 'bg-purple-100 dark:bg-purple-900/30 border-purple-400' : 'bg-surface-tertiary border-edge-primary'}`}>
                <strong className="text-content-primary">RL (Right-Left)</strong>
                <p className="text-content-muted mt-1">Left-heavy right child</p>
                <pre className="mt-2 text-content-secondary">
{`z         z             x
 \\         \\           / \\
  y   →     x    →    z   y
 /           \\
x             y`}
                </pre>
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
              <button
                onClick={handleInsert}
                disabled={isAnimating || !inputValue}
                className="w-full px-3 py-2 rounded-lg bg-green-500 text-white text-sm font-medium hover:bg-green-600 disabled:opacity-50"
              >
                Insert
              </button>

              <div className="border-t border-edge-primary pt-3 space-y-2">
                <button
                  onClick={loadExample}
                  disabled={isAnimating}
                  className="w-full px-3 py-2 rounded-lg bg-surface-tertiary border border-edge-primary text-content-secondary text-sm font-medium hover:bg-surface-accent disabled:opacity-50"
                >
                  Load Balanced Tree
                </button>
                <button
                  onClick={loadUnbalancedExample}
                  disabled={isAnimating}
                  className="w-full px-3 py-2 rounded-lg bg-purple-500 text-white text-sm font-medium hover:bg-purple-600 disabled:opacity-50"
                >
                  Demo LL Rotation
                </button>
                <button
                  onClick={clearTree}
                  disabled={isAnimating}
                  className="w-full px-3 py-2 rounded-lg bg-red-500 text-white text-sm font-medium hover:bg-red-600 disabled:opacity-50"
                >
                  Clear Tree
                </button>
              </div>
            </div>
          </ControlPanel>

          <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-xl p-4 border border-emerald-200 dark:border-emerald-800">
            <h4 className="text-sm font-semibold text-emerald-800 dark:text-emerald-200 mb-2">
              AVL Invariant
            </h4>
            <p className="text-xs text-emerald-700 dark:text-emerald-300 leading-relaxed">
              <LaTeX math="|h_L - h_R| \leq 1" /> for every node.
              This ensures the tree height is always <LaTeX math="O(\log n)" />,
              guaranteeing efficient operations.
            </p>
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 border border-blue-200 dark:border-blue-800">
            <h4 className="text-sm font-semibold text-blue-800 dark:text-blue-200 mb-2">
              Balance Factor
            </h4>
            <p className="text-xs text-blue-700 dark:text-blue-300">
              Balance = height(left) - height(right)
            </p>
            <ul className="text-xs text-blue-700 dark:text-blue-300 mt-2 space-y-1">
              <li>• +2: Left-heavy → rotate right</li>
              <li>• -2: Right-heavy → rotate left</li>
              <li>• -1, 0, +1: Balanced ✓</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
