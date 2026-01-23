'use client';

/**
 * Binary Heap Visualizer
 * ======================
 * Interactive visualization of min/max heaps with heap operations.
 */

import { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ControlPanel from '@/components/ui/ControlPanel';
import { LaTeX } from '@/components/ui/LaTeX';

type HeapType = 'max' | 'min';

interface HeapNode {
  value: number;
  state: 'default' | 'comparing' | 'swapping' | 'inserted' | 'extracted';
}

export default function HeapVisualizer() {
  const [heap, setHeap] = useState<HeapNode[]>([]);
  const [heapType, setHeapType] = useState<HeapType>('max');
  const [inputValue, setInputValue] = useState('');
  const [operation, setOperation] = useState<string>('');
  const [isAnimating, setIsAnimating] = useState(false);
  const animationRef = useRef(false);

  const NODE_RADIUS = 24;
  const LEVEL_HEIGHT = 70;
  const SVG_WIDTH = 700;
  const SVG_HEIGHT = 320;

  const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  // Get parent, left child, right child indices
  const parent = (i: number) => Math.floor((i - 1) / 2);
  const leftChild = (i: number) => 2 * i + 1;
  const rightChild = (i: number) => 2 * i + 2;

  // Compare based on heap type
  const shouldSwap = (parentVal: number, childVal: number): boolean => {
    return heapType === 'max' ? parentVal < childVal : parentVal > childVal;
  };

  // Calculate node position for tree view
  const getNodePosition = (index: number): { x: number; y: number } => {
    const level = Math.floor(Math.log2(index + 1));
    const posInLevel = index - (Math.pow(2, level) - 1);
    const nodesInLevel = Math.pow(2, level);
    const levelWidth = SVG_WIDTH / Math.pow(2, level);

    return {
      x: levelWidth * (posInLevel + 0.5),
      y: 40 + level * LEVEL_HEIGHT,
    };
  };

  // Reset all states
  const resetStates = () => {
    setHeap(prev => prev.map(node => ({ ...node, state: 'default' as const })));
  };

  // Heapify up (for insertion)
  const heapifyUp = async (arr: HeapNode[], index: number): Promise<HeapNode[]> => {
    const newArr = [...arr];

    while (index > 0 && animationRef.current) {
      const parentIdx = parent(index);

      // Highlight comparing nodes
      newArr[index].state = 'comparing';
      newArr[parentIdx].state = 'comparing';
      setHeap([...newArr]);
      setOperation(`Comparing ${newArr[index].value} with parent ${newArr[parentIdx].value}`);
      await sleep(500);

      if (shouldSwap(newArr[parentIdx].value, newArr[index].value)) {
        // Swap
        newArr[index].state = 'swapping';
        newArr[parentIdx].state = 'swapping';
        setHeap([...newArr]);
        setOperation(`Swapping ${newArr[index].value} and ${newArr[parentIdx].value}`);
        await sleep(400);

        [newArr[index], newArr[parentIdx]] = [newArr[parentIdx], newArr[index]];
        setHeap([...newArr]);
        await sleep(300);

        newArr[index].state = 'default';
        index = parentIdx;
      } else {
        newArr[index].state = 'default';
        newArr[parentIdx].state = 'default';
        break;
      }
    }

    return newArr;
  };

  // Heapify down (for extraction)
  const heapifyDown = async (arr: HeapNode[], index: number): Promise<HeapNode[]> => {
    const newArr = [...arr];
    const size = newArr.length;

    while (leftChild(index) < size && animationRef.current) {
      let swapIdx = index;
      const left = leftChild(index);
      const right = rightChild(index);

      // Highlight comparing nodes
      newArr[index].state = 'comparing';
      if (left < size) newArr[left].state = 'comparing';
      if (right < size) newArr[right].state = 'comparing';
      setHeap([...newArr]);
      setOperation(`Comparing ${newArr[index].value} with children`);
      await sleep(500);

      if (left < size && shouldSwap(newArr[swapIdx].value, newArr[left].value)) {
        swapIdx = left;
      }
      if (right < size && shouldSwap(newArr[swapIdx].value, newArr[right].value)) {
        swapIdx = right;
      }

      if (swapIdx !== index) {
        // Swap
        newArr[index].state = 'swapping';
        newArr[swapIdx].state = 'swapping';
        if (left < size && left !== swapIdx) newArr[left].state = 'default';
        if (right < size && right !== swapIdx) newArr[right].state = 'default';
        setHeap([...newArr]);
        setOperation(`Swapping ${newArr[index].value} and ${newArr[swapIdx].value}`);
        await sleep(400);

        [newArr[index], newArr[swapIdx]] = [newArr[swapIdx], newArr[index]];
        setHeap([...newArr]);
        await sleep(300);

        newArr[index].state = 'default';
        index = swapIdx;
      } else {
        newArr[index].state = 'default';
        if (left < size) newArr[left].state = 'default';
        if (right < size) newArr[right].state = 'default';
        break;
      }
    }

    return newArr;
  };

  // Insert operation
  const insert = async (value: number) => {
    setIsAnimating(true);
    animationRef.current = true;
    setOperation(`Inserting ${value}...`);

    // Add new node at end
    const newNode: HeapNode = { value, state: 'inserted' };
    const newHeap = [...heap, newNode];
    setHeap(newHeap);
    await sleep(400);

    // Heapify up
    const finalHeap = await heapifyUp(newHeap, newHeap.length - 1);

    if (animationRef.current) {
      finalHeap.forEach(node => node.state = 'default');
      setHeap(finalHeap);
      setOperation(`Inserted ${value} - heap property restored`);
    }

    setIsAnimating(false);
    animationRef.current = false;
  };

  // Extract operation (remove root)
  const extract = async () => {
    if (heap.length === 0) return;

    setIsAnimating(true);
    animationRef.current = true;
    const extractedValue = heap[0].value;
    setOperation(`Extracting ${heapType === 'max' ? 'max' : 'min'}: ${extractedValue}`);

    const newHeap = [...heap];
    newHeap[0].state = 'extracted';
    setHeap([...newHeap]);
    await sleep(500);

    if (newHeap.length === 1) {
      setHeap([]);
      setOperation(`Extracted ${extractedValue} - heap is now empty`);
      setIsAnimating(false);
      animationRef.current = false;
      return;
    }

    // Move last element to root
    newHeap[0] = { ...newHeap[newHeap.length - 1], state: 'swapping' };
    newHeap.pop();
    setHeap([...newHeap]);
    setOperation(`Moved ${newHeap[0].value} to root`);
    await sleep(400);

    // Heapify down
    const finalHeap = await heapifyDown(newHeap, 0);

    if (animationRef.current) {
      finalHeap.forEach(node => node.state = 'default');
      setHeap(finalHeap);
      setOperation(`Extracted ${extractedValue} - heap property restored`);
    }

    setIsAnimating(false);
    animationRef.current = false;
  };

  const handleInsert = () => {
    const value = parseInt(inputValue);
    if (isNaN(value)) return;
    insert(value);
    setInputValue('');
  };

  const clearHeap = () => {
    setHeap([]);
    setOperation('');
  };

  const loadExample = () => {
    const values = heapType === 'max'
      ? [{ value: 90, state: 'default' as const }, { value: 80, state: 'default' as const }, { value: 70, state: 'default' as const }, { value: 60, state: 'default' as const }, { value: 50, state: 'default' as const }, { value: 65, state: 'default' as const }, { value: 30, state: 'default' as const }]
      : [{ value: 10, state: 'default' as const }, { value: 20, state: 'default' as const }, { value: 30, state: 'default' as const }, { value: 40, state: 'default' as const }, { value: 50, state: 'default' as const }, { value: 35, state: 'default' as const }, { value: 60, state: 'default' as const }];
    setHeap(values);
    setOperation(`Loaded example ${heapType}-heap`);
  };

  const switchHeapType = (type: HeapType) => {
    setHeapType(type);
    setHeap([]);
    setOperation('');
  };

  // Get node color based on state
  const getNodeColor = (state: HeapNode['state']) => {
    switch (state) {
      case 'comparing': return 'fill-yellow-500';
      case 'swapping': return 'fill-purple-500';
      case 'inserted': return 'fill-green-500';
      case 'extracted': return 'fill-red-500';
      default: return heapType === 'max' ? 'fill-blue-500' : 'fill-emerald-500';
    }
  };

  // Render tree visualization
  const renderTreeNode = (index: number): React.ReactNode => {
    if (index >= heap.length) return null;

    const node = heap[index];
    const pos = getNodePosition(index);
    const leftIdx = leftChild(index);
    const rightIdx = rightChild(index);

    return (
      <g key={index}>
        {/* Edge to left child */}
        {leftIdx < heap.length && (
          <line
            x1={pos.x}
            y1={pos.y}
            x2={getNodePosition(leftIdx).x}
            y2={getNodePosition(leftIdx).y}
            className="stroke-gray-400 dark:stroke-gray-600"
            strokeWidth={2}
          />
        )}
        {/* Edge to right child */}
        {rightIdx < heap.length && (
          <line
            x1={pos.x}
            y1={pos.y}
            x2={getNodePosition(rightIdx).x}
            y2={getNodePosition(rightIdx).y}
            className="stroke-gray-400 dark:stroke-gray-600"
            strokeWidth={2}
          />
        )}

        {/* Render children first */}
        {renderTreeNode(leftIdx)}
        {renderTreeNode(rightIdx)}

        {/* Node circle */}
        <motion.circle
          cx={pos.x}
          cy={pos.y}
          r={NODE_RADIUS}
          className={getNodeColor(node.state)}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 300 }}
        />

        {/* Node value */}
        <text
          x={pos.x}
          y={pos.y + 5}
          textAnchor="middle"
          className="fill-white font-mono text-sm font-bold"
        >
          {node.value}
        </text>

        {/* Index label */}
        <text
          x={pos.x}
          y={pos.y + NODE_RADIUS + 14}
          textAnchor="middle"
          className="fill-content-muted font-mono text-xs"
        >
          [{index}]
        </text>
      </g>
    );
  };

  return (
    <div>
      <h2 className="text-xl font-semibold text-content-primary mb-2">
        Binary Heap Visualizer
      </h2>
      <p className="text-sm text-content-secondary mb-6">
        Complete binary tree with heap property. Insert/Extract: <LaTeX math="O(\log n)" />, Find {heapType}: <LaTeX math="O(1)" />
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 space-y-4">
          {/* Heap Type Selection */}
          <div className="flex gap-4">
            <button
              onClick={() => switchHeapType('max')}
              disabled={isAnimating}
              className={`px-4 py-2 rounded-xl font-medium transition-all ${
                heapType === 'max'
                  ? 'bg-blue-500 text-white shadow-lg'
                  : 'bg-surface-tertiary text-content-secondary hover:bg-surface-accent border border-edge-primary'
              }`}
            >
              Max Heap
            </button>
            <button
              onClick={() => switchHeapType('min')}
              disabled={isAnimating}
              className={`px-4 py-2 rounded-xl font-medium transition-all ${
                heapType === 'min'
                  ? 'bg-emerald-500 text-white shadow-lg'
                  : 'bg-surface-tertiary text-content-secondary hover:bg-surface-accent border border-edge-primary'
              }`}
            >
              Min Heap
            </button>
          </div>

          {/* Tree Visualization */}
          <div className="bg-surface-tertiary rounded-2xl p-4 border border-edge-primary">
            <svg
              width="100%"
              height={SVG_HEIGHT}
              viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`}
              className="overflow-visible"
            >
              {heap.length > 0 ? renderTreeNode(0) : (
                <text x={SVG_WIDTH / 2} y={SVG_HEIGHT / 2} textAnchor="middle" className="fill-gray-400 text-sm">
                  Empty heap - insert values to begin
                </text>
              )}
            </svg>
          </div>

          {/* Array Representation */}
          <div className="bg-surface-secondary rounded-xl p-4 border border-edge-primary">
            <h4 className="text-sm font-semibold text-content-primary mb-3">Array Representation</h4>
            <div className="flex gap-1 flex-wrap">
              {heap.map((node, idx) => (
                <motion.div
                  key={idx}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="flex flex-col items-center"
                >
                  <div className={`w-10 h-10 flex items-center justify-center rounded-lg font-mono text-sm text-white ${getNodeColor(node.state).replace('fill-', 'bg-')}`}>
                    {node.value}
                  </div>
                  <span className="text-xs text-content-muted mt-1">[{idx}]</span>
                </motion.div>
              ))}
              {heap.length === 0 && (
                <span className="text-content-muted text-sm">[ ]</span>
              )}
            </div>
          </div>

          {/* Operation Status */}
          {operation && (
            <div className="bg-surface-secondary rounded-xl p-4 border border-edge-primary">
              <span className="text-sm text-content-primary font-mono">{operation}</span>
            </div>
          )}

          {/* Index Formulas */}
          <div className="bg-surface-secondary rounded-xl p-4 border border-edge-primary">
            <h4 className="text-sm font-semibold text-content-primary mb-2">Index Navigation (0-indexed)</h4>
            <div className="grid grid-cols-3 gap-4 text-sm text-content-secondary">
              <div>
                <LaTeX math="\text{parent}(i) = \lfloor(i-1)/2\rfloor" />
              </div>
              <div>
                <LaTeX math="\text{left}(i) = 2i + 1" />
              </div>
              <div>
                <LaTeX math="\text{right}(i) = 2i + 2" />
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
              <button
                onClick={extract}
                disabled={isAnimating || heap.length === 0}
                className="w-full px-3 py-2 rounded-lg bg-red-500 text-white text-sm font-medium hover:bg-red-600 disabled:opacity-50"
              >
                Extract {heapType === 'max' ? 'Max' : 'Min'}
              </button>

              <div className="flex gap-2 pt-2">
                <button
                  onClick={loadExample}
                  disabled={isAnimating}
                  className="flex-1 px-3 py-2 rounded-lg bg-surface-tertiary border border-edge-primary text-content-secondary text-sm font-medium hover:bg-surface-accent disabled:opacity-50"
                >
                  Example
                </button>
                <button
                  onClick={clearHeap}
                  disabled={isAnimating}
                  className="flex-1 px-3 py-2 rounded-lg bg-surface-tertiary border border-edge-primary text-content-secondary text-sm font-medium hover:bg-surface-accent disabled:opacity-50"
                >
                  Clear
                </button>
              </div>
            </div>
          </ControlPanel>

          <div className={`rounded-xl p-4 border ${heapType === 'max' ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800' : 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800'}`}>
            <h4 className={`text-sm font-semibold mb-2 ${heapType === 'max' ? 'text-blue-800 dark:text-blue-200' : 'text-emerald-800 dark:text-emerald-200'}`}>
              {heapType === 'max' ? 'Max Heap' : 'Min Heap'} Property
            </h4>
            <p className={`text-xs leading-relaxed ${heapType === 'max' ? 'text-blue-700 dark:text-blue-300' : 'text-emerald-700 dark:text-emerald-300'}`}>
              {heapType === 'max'
                ? 'Every parent ≥ its children. Root is the maximum element.'
                : 'Every parent ≤ its children. Root is the minimum element.'}
            </p>
          </div>

          <div className="bg-amber-50 dark:bg-amber-900/20 rounded-xl p-4 border border-amber-200 dark:border-amber-800">
            <h4 className="text-sm font-semibold text-amber-800 dark:text-amber-200 mb-2">
              Priority Queue
            </h4>
            <p className="text-xs text-amber-700 dark:text-amber-300">
              Heaps efficiently implement priority queues:
            </p>
            <ul className="text-xs text-amber-700 dark:text-amber-300 mt-1 space-y-1">
              <li>• Insert: <LaTeX math="O(\log n)" /></li>
              <li>• Extract-{heapType === 'max' ? 'Max' : 'Min'}: <LaTeX math="O(\log n)" /></li>
              <li>• Find-{heapType === 'max' ? 'Max' : 'Min'}: <LaTeX math="O(1)" /></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
