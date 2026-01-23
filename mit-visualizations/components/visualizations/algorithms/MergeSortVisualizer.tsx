'use client';

/**
 * Merge Sort Visualizer
 * =====================
 * Interactive visualization of the merge sort algorithm showing
 * divide and conquer paradigm with recurrence tree visualization.
 */

import { useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ControlPanel from '@/components/ui/ControlPanel';
import Slider from '@/components/ui/Slider';
import { LaTeX } from '@/components/ui/LaTeX';

interface ArrayElement {
  value: number;
  id: number;
  state: 'default' | 'comparing' | 'sorted' | 'merging';
  level: number;
  position: 'left' | 'right' | 'merged';
}

interface RecursionStep {
  array: number[];
  left: number;
  right: number;
  level: number;
  phase: 'divide' | 'merge';
  merged?: number[];
}

export default function MergeSortVisualizer() {
  const [array, setArray] = useState<ArrayElement[]>([]);
  const [arraySize, setArraySize] = useState(8);
  const [speed, setSpeed] = useState(50);
  const [sorting, setSorting] = useState(false);
  const [recursionSteps, setRecursionSteps] = useState<RecursionStep[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [comparisons, setComparisons] = useState(0);
  const [mergeOps, setMergeOps] = useState(0);
  const [showRecursionTree, setShowRecursionTree] = useState(true);
  const sortingRef = useRef(false);

  const generateArray = useCallback(() => {
    const newArray: ArrayElement[] = [];
    for (let i = 0; i < arraySize; i++) {
      newArray.push({
        value: Math.floor(Math.random() * 100) + 5,
        id: i,
        state: 'default',
        level: 0,
        position: 'merged',
      });
    }
    setArray(newArray);
    setRecursionSteps([]);
    setCurrentStep(0);
    setComparisons(0);
    setMergeOps(0);
  }, [arraySize]);

  useEffect(() => {
    generateArray();
  }, [generateArray]);

  const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

  const mergeSort = async () => {
    const arr = array.map(el => ({ ...el }));
    const values = arr.map(el => el.value);
    let comps = 0;
    let merges = 0;
    const steps: RecursionStep[] = [];

    const merge = async (left: number, mid: number, right: number, level: number) => {
      const leftArr = values.slice(left, mid + 1);
      const rightArr = values.slice(mid + 1, right + 1);
      let i = 0, j = 0, k = left;

      // Highlight merging section
      setArray(prev => prev.map((el, idx) => ({
        ...el,
        state: idx >= left && idx <= right ? 'merging' : el.state,
        level,
        position: idx >= left && idx <= mid ? 'left' : idx > mid && idx <= right ? 'right' : el.position,
      })));

      steps.push({
        array: [...values],
        left,
        right,
        level,
        phase: 'merge',
      });

      await sleep(Math.max(50, 200 - speed * 2));

      while (i < leftArr.length && j < rightArr.length && sortingRef.current) {
        comps++;
        setComparisons(comps);

        if (leftArr[i] <= rightArr[j]) {
          values[k] = leftArr[i];
          i++;
        } else {
          values[k] = rightArr[j];
          j++;
        }
        k++;
        merges++;
        setMergeOps(merges);

        // Update visualization
        setArray(prev => prev.map((el, idx) => ({
          ...el,
          value: values[idx],
          state: idx === k - 1 ? 'comparing' : idx >= left && idx <= right ? 'merging' : el.state,
        })));

        await sleep(Math.max(30, 150 - speed * 1.5));
      }

      while (i < leftArr.length && sortingRef.current) {
        values[k] = leftArr[i];
        i++;
        k++;
        merges++;
        setMergeOps(merges);
        setArray(prev => prev.map((el, idx) => ({
          ...el,
          value: values[idx],
        })));
        await sleep(Math.max(20, 100 - speed));
      }

      while (j < rightArr.length && sortingRef.current) {
        values[k] = rightArr[j];
        j++;
        k++;
        merges++;
        setMergeOps(merges);
        setArray(prev => prev.map((el, idx) => ({
          ...el,
          value: values[idx],
        })));
        await sleep(Math.max(20, 100 - speed));
      }

      // Mark merged section as sorted
      setArray(prev => prev.map((el, idx) => ({
        ...el,
        state: idx >= left && idx <= right ? 'sorted' : el.state,
      })));

      steps.push({
        array: [...values],
        left,
        right,
        level,
        phase: 'merge',
        merged: values.slice(left, right + 1),
      });
    };

    const sort = async (left: number, right: number, level: number) => {
      if (left >= right || !sortingRef.current) return;

      const mid = Math.floor((left + right) / 2);

      // Record divide step
      steps.push({
        array: values.slice(left, right + 1),
        left,
        right,
        level,
        phase: 'divide',
      });
      setRecursionSteps([...steps]);

      // Highlight current subarray
      setArray(prev => prev.map((el, idx) => ({
        ...el,
        level,
        position: idx >= left && idx <= mid ? 'left' : idx > mid && idx <= right ? 'right' : 'merged',
      })));

      await sleep(Math.max(50, 200 - speed * 2));

      // Recurse left
      await sort(left, mid, level + 1);
      // Recurse right
      await sort(mid + 1, right, level + 1);
      // Merge
      await merge(left, mid, right, level);
      setRecursionSteps([...steps]);
    };

    await sort(0, values.length - 1, 0);

    if (sortingRef.current) {
      setArray(prev => prev.map(el => ({ ...el, state: 'sorted' })));
    }
  };

  const startSorting = async () => {
    setSorting(true);
    sortingRef.current = true;
    setRecursionSteps([]);
    setCurrentStep(0);
    setComparisons(0);
    setMergeOps(0);

    await mergeSort();

    setSorting(false);
    sortingRef.current = false;
  };

  const stopSorting = () => {
    sortingRef.current = false;
    setSorting(false);
  };

  const getBarColor = (state: ArrayElement['state']) => {
    switch (state) {
      case 'comparing':
        return 'bg-yellow-500';
      case 'sorted':
        return 'bg-green-500';
      case 'merging':
        return 'bg-blue-400';
      default:
        return 'bg-brand-500';
    }
  };

  // Calculate recursion tree depth
  const treeDepth = Math.ceil(Math.log2(arraySize)) + 1;

  return (
    <div>
      <h2 className="text-xl font-semibold text-content-primary mb-2">
        Merge Sort Visualizer
      </h2>
      <p className="text-sm text-content-secondary mb-6">
        Divide and conquer algorithm with <LaTeX math="O(n \log n)" /> time complexity
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 space-y-4">
          {/* Array Visualization */}
          <div className="bg-surface-tertiary rounded-2xl p-4 border border-edge-primary">
            <div className="h-64 flex items-end justify-center gap-1">
              <AnimatePresence>
                {array.map((el, idx) => (
                  <motion.div
                    key={el.id}
                    layout
                    className={`${getBarColor(el.state)} rounded-t relative`}
                    style={{
                      height: `${el.value}%`,
                      width: `${Math.max(100 / arraySize - 2, 8)}%`,
                      maxWidth: '60px',
                    }}
                    transition={{ duration: 0.15 }}
                  >
                    <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs font-mono text-content-muted">
                      {el.value}
                    </span>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Legend */}
            <div className="mt-10 flex items-center justify-center space-x-4 text-xs text-content-secondary">
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 bg-brand-500 rounded" />
                <span>Unsorted</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 bg-blue-400 rounded" />
                <span>Merging</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 bg-yellow-500 rounded" />
                <span>Comparing</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 bg-green-500 rounded" />
                <span>Sorted</span>
              </div>
            </div>
          </div>

          {/* Recurrence Relation */}
          <div className="bg-surface-secondary rounded-xl p-4 border border-edge-primary">
            <h4 className="text-sm font-semibold text-content-primary mb-3">
              Recurrence Relation
            </h4>
            <div className="bg-surface-tertiary rounded-lg p-4">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="text-center">
                  <LaTeX math="T(n) = 2T(n/2) + \Theta(n)" block />
                </div>
                <div className="text-sm text-content-secondary">
                  <ul className="space-y-1">
                    <li>• <LaTeX math="2T(n/2)" />: Two recursive calls on half-sized arrays</li>
                    <li>• <LaTeX math="\Theta(n)" />: Merge step scans all n elements</li>
                  </ul>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-edge-primary text-center">
                <span className="text-content-muted">Solution by Master Theorem:</span>
                <span className="ml-2 font-semibold text-green-600 dark:text-green-400">
                  <LaTeX math="T(n) = \Theta(n \log n)" />
                </span>
              </div>
            </div>
          </div>

          {/* Recursion Tree Visualization */}
          {showRecursionTree && (
            <div className="bg-surface-secondary rounded-xl p-4 border border-edge-primary">
              <h4 className="text-sm font-semibold text-content-primary mb-3">
                Recursion Tree (Work per Level)
              </h4>
              <div className="space-y-3">
                {Array.from({ length: Math.min(treeDepth, 4) }, (_, level) => {
                  const numNodes = Math.pow(2, level);
                  const sizePerNode = Math.ceil(arraySize / numNodes);
                  const workPerLevel = arraySize; // cn work at each level

                  return (
                    <div key={level} className="flex items-center gap-4">
                      <span className="text-xs text-content-muted w-16">Level {level}:</span>
                      <div className="flex-1 flex items-center gap-1 justify-center">
                        {Array.from({ length: Math.min(numNodes, 8) }, (_, i) => (
                          <div
                            key={i}
                            className="h-6 bg-blue-100 dark:bg-blue-900/30 border border-blue-300 dark:border-blue-700 rounded text-xs flex items-center justify-center text-blue-700 dark:text-blue-300"
                            style={{ width: `${Math.max(40, 200 / numNodes)}px` }}
                          >
                            {sizePerNode > 1 ? `n/${numNodes}` : '1'}
                          </div>
                        ))}
                        {numNodes > 8 && <span className="text-xs text-content-muted">...</span>}
                      </div>
                      <span className="text-xs font-mono text-brand-600 dark:text-brand-400 w-16 text-right">
                        = cn
                      </span>
                    </div>
                  );
                })}
                <div className="pt-2 border-t border-edge-primary flex items-center gap-4">
                  <span className="text-xs text-content-muted w-16">Total:</span>
                  <div className="flex-1 text-center text-sm text-content-secondary">
                    <LaTeX math={`\\log_2 n = ${Math.ceil(Math.log2(arraySize))}`} /> levels
                  </div>
                  <span className="text-xs font-mono font-semibold text-green-600 dark:text-green-400 w-16 text-right">
                    cn log n
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Algorithm Properties */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-surface-secondary rounded-xl p-4 border border-edge-primary text-center">
              <div className="text-2xl font-bold text-content-primary">{comparisons}</div>
              <div className="text-xs text-content-muted">Comparisons</div>
            </div>
            <div className="bg-surface-secondary rounded-xl p-4 border border-edge-primary text-center">
              <div className="text-2xl font-bold text-content-primary">{mergeOps}</div>
              <div className="text-xs text-content-muted">Merge Operations</div>
            </div>
            <div className="bg-surface-secondary rounded-xl p-4 border border-edge-primary text-center">
              <div className="text-lg font-bold text-green-600 dark:text-green-400">
                <LaTeX math="O(n \log n)" />
              </div>
              <div className="text-xs text-content-muted">Time (all cases)</div>
            </div>
            <div className="bg-surface-secondary rounded-xl p-4 border border-edge-primary text-center">
              <div className="text-lg font-bold text-amber-600 dark:text-amber-400">
                <LaTeX math="O(n)" />
              </div>
              <div className="text-xs text-content-muted">Extra Space</div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="space-y-4">
          <ControlPanel title="Controls">
            <Slider
              label="Array Size"
              value={arraySize}
              onChange={(e) => setArraySize(Number(e.target.value))}
              min={4}
              max={32}
              step={2}
              disabled={sorting}
            />

            <Slider
              label="Speed"
              value={speed}
              onChange={(e) => setSpeed(Number(e.target.value))}
              min={1}
              max={100}
            />

            <div className="flex gap-2 mt-4">
              <button
                onClick={generateArray}
                disabled={sorting}
                className="flex-1 px-3 py-2 rounded-xl font-medium text-sm bg-surface-tertiary border border-edge-primary text-content-secondary hover:bg-surface-accent transition-colors disabled:opacity-50"
              >
                New Array
              </button>
              {sorting ? (
                <button
                  onClick={stopSorting}
                  className="flex-1 px-3 py-2 rounded-xl font-medium text-sm bg-red-500 text-white hover:bg-red-600 transition-colors"
                >
                  Stop
                </button>
              ) : (
                <button
                  onClick={startSorting}
                  className="flex-1 px-3 py-2 rounded-xl font-medium text-sm bg-brand-500 text-white hover:bg-brand-600 transition-colors"
                >
                  Sort
                </button>
              )}
            </div>

            <label className="flex items-center gap-2 mt-4 cursor-pointer">
              <input
                type="checkbox"
                checked={showRecursionTree}
                onChange={(e) => setShowRecursionTree(e.target.checked)}
                className="rounded border-edge-primary text-brand-500"
              />
              <span className="text-sm text-content-secondary">Show recursion tree</span>
            </label>
          </ControlPanel>

          <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-4 border border-purple-200 dark:border-purple-800">
            <h4 className="text-sm font-semibold text-purple-800 dark:text-purple-200 mb-2">
              Divide and Conquer
            </h4>
            <ol className="text-xs text-purple-700 dark:text-purple-300 leading-relaxed space-y-1 list-decimal list-inside">
              <li><strong>Divide:</strong> Split array in half</li>
              <li><strong>Conquer:</strong> Recursively sort halves</li>
              <li><strong>Combine:</strong> Merge sorted halves</li>
            </ol>
          </div>

          <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-xl p-4 border border-emerald-200 dark:border-emerald-800">
            <h4 className="text-sm font-semibold text-emerald-800 dark:text-emerald-200 mb-2">
              Properties
            </h4>
            <ul className="text-xs text-emerald-700 dark:text-emerald-300 leading-relaxed space-y-1">
              <li>• <strong>Stable:</strong> Equal keys maintain order</li>
              <li>• <strong>Not in-place:</strong> Requires O(n) extra space</li>
              <li>• <strong>Optimal:</strong> Matches Ω(n log n) lower bound</li>
            </ul>
          </div>

          <div className="bg-amber-50 dark:bg-amber-900/20 rounded-xl p-4 border border-amber-200 dark:border-amber-800">
            <h4 className="text-sm font-semibold text-amber-800 dark:text-amber-200 mb-2">
              Lower Bound
            </h4>
            <p className="text-xs text-amber-700 dark:text-amber-300 leading-relaxed">
              Any comparison-based sort needs <LaTeX math="\Omega(n \log n)" /> comparisons.
              Merge sort is asymptotically optimal!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
