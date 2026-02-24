'use client';

/**
 * Linear Sorting Visualizer
 * =========================
 * Visualization of counting sort and radix sort algorithms.
 */

import { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ControlPanel from '@/components/ui/ControlPanel';
import Slider from '@/components/ui/Slider';
import { LaTeX } from '@/components/ui/LaTeX';

type Algorithm = 'counting' | 'radix';

interface ArrayElement {
  value: number;
  id: number;
  state: 'default' | 'counting' | 'placing' | 'sorted';
  digit?: number;
}

export default function LinearSortingVisualizer() {
  const [array, setArray] = useState<ArrayElement[]>([]);
  const [algorithm, setAlgorithm] = useState<Algorithm>('counting');
  const [maxValue, setMaxValue] = useState(9);
  const [arraySize, setArraySize] = useState(12);
  const [speed, setSpeed] = useState(50);
  const [sorting, setSorting] = useState(false);
  const [countArray, setCountArray] = useState<number[]>([]);
  const [currentDigit, setCurrentDigit] = useState<number | null>(null);
  const sortingRef = useRef(false);

  const generateArray = useCallback(() => {
    const newArray: ArrayElement[] = [];
    const max = algorithm === 'counting' ? maxValue : 999;
    for (let i = 0; i < arraySize; i++) {
      newArray.push({
        value: Math.floor(Math.random() * (max + 1)),
        id: i,
        state: 'default',
      });
    }
    setArray(newArray);
    setCountArray([]);
    setCurrentDigit(null);
  }, [arraySize, maxValue, algorithm]);

  useState(() => {
    generateArray();
  });

  const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const countingSort = async (arr: ArrayElement[], digit?: number) => {
    const max = digit !== undefined ? 9 : maxValue;
    const count = new Array(max + 1).fill(0);

    // Counting phase
    for (let i = 0; i < arr.length && sortingRef.current; i++) {
      const val = digit !== undefined
        ? Math.floor(arr[i].value / Math.pow(10, digit)) % 10
        : arr[i].value;

      arr[i].state = 'counting';
      arr[i].digit = val;
      setArray([...arr]);
      count[val]++;
      setCountArray([...count]);
      await sleep(150 - speed);
      arr[i].state = 'default';
    }

    // Cumulative count
    for (let i = 1; i <= max; i++) {
      count[i] += count[i - 1];
    }
    setCountArray([...count]);
    await sleep(300 - speed * 2);

    // Placement phase (backwards for stability)
    const output: ArrayElement[] = new Array(arr.length);
    for (let i = arr.length - 1; i >= 0 && sortingRef.current; i--) {
      const val = digit !== undefined
        ? Math.floor(arr[i].value / Math.pow(10, digit)) % 10
        : arr[i].value;

      arr[i].state = 'placing';
      setArray([...arr]);
      await sleep(100 - speed * 0.8);

      count[val]--;
      output[count[val]] = { ...arr[i], state: 'sorted' };
      arr[i].state = 'default';
    }

    return output;
  };

  const radixSort = async () => {
    let arr = [...array];
    const maxNum = Math.max(...arr.map(a => a.value));
    const numDigits = maxNum === 0 ? 1 : Math.floor(Math.log10(maxNum)) + 1;

    for (let digit = 0; digit < numDigits && sortingRef.current; digit++) {
      setCurrentDigit(digit);
      arr = await countingSort(arr, digit);
      setArray(arr.map(el => ({ ...el, state: 'default' })));
      await sleep(500 - speed * 4);
    }

    setArray(arr.map(el => ({ ...el, state: 'sorted' })));
    setCurrentDigit(null);
  };

  const startSorting = async () => {
    setSorting(true);
    sortingRef.current = true;
    setCountArray([]);

    if (algorithm === 'counting') {
      const result = await countingSort([...array]);
      if (sortingRef.current) {
        setArray(result);
      }
    } else {
      await radixSort();
    }

    setSorting(false);
    sortingRef.current = false;
  };

  const stopSorting = () => {
    sortingRef.current = false;
    setSorting(false);
  };

  const getBarColor = (state: ArrayElement['state']) => {
    switch (state) {
      case 'counting': return 'bg-yellow-500';
      case 'placing': return 'bg-blue-500';
      case 'sorted': return 'bg-green-500';
      default: return 'bg-brand-500';
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold text-content-primary mb-2">
        Linear Sorting Visualizer
      </h2>
      <p className="text-sm text-content-secondary mb-6">
        Non-comparison sorting: <LaTeX math="O(n + k)" /> counting sort and <LaTeX math="O(d(n + b))" /> radix sort
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 space-y-4">
          {/* Algorithm Selection */}
          <div className="flex gap-4">
            <button
              onClick={() => { setAlgorithm('counting'); generateArray(); }}
              disabled={sorting}
              className={`px-4 py-2 rounded-xl font-medium transition-all ${
                algorithm === 'counting'
                  ? 'bg-purple-500 text-white shadow-soft-lg'
                  : 'bg-surface-tertiary text-content-secondary hover:bg-surface-accent border border-edge-primary'
              }`}
            >
              Counting Sort
            </button>
            <button
              onClick={() => { setAlgorithm('radix'); generateArray(); }}
              disabled={sorting}
              className={`px-4 py-2 rounded-xl font-medium transition-all ${
                algorithm === 'radix'
                  ? 'bg-purple-500 text-white shadow-soft-lg'
                  : 'bg-surface-tertiary text-content-secondary hover:bg-surface-accent border border-edge-primary'
              }`}
            >
              Radix Sort (LSD)
            </button>
          </div>

          {/* Array Visualization */}
          <div className="bg-surface-tertiary rounded-2xl p-4 border border-edge-primary">
            <div className="h-48 flex items-end justify-center gap-1">
              <AnimatePresence>
                {array.map((el) => (
                  <motion.div
                    key={el.id}
                    layout
                    className={`${getBarColor(el.state)} rounded-t relative flex flex-col items-center justify-end`}
                    style={{
                      height: `${(el.value / (algorithm === 'counting' ? maxValue : 999)) * 100 + 10}%`,
                      width: `${Math.max(100 / arraySize - 2, 12)}%`,
                      maxWidth: '50px',
                    }}
                    transition={{ duration: 0.2 }}
                  >
                    <span className="text-white text-xs font-mono mb-1">
                      {el.value}
                    </span>
                    {el.digit !== undefined && (
                      <span className="absolute -top-6 text-xs font-mono text-yellow-600 dark:text-yellow-400">
                        [{el.digit}]
                      </span>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Legend */}
            <div className="mt-4 flex items-center justify-center space-x-4 text-xs text-content-secondary">
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 bg-brand-500 rounded" />
                <span>Unsorted</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 bg-yellow-500 rounded" />
                <span>Counting</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 bg-blue-500 rounded" />
                <span>Placing</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 bg-green-500 rounded" />
                <span>Sorted</span>
              </div>
            </div>
          </div>

          {/* Count Array Visualization */}
          {countArray.length > 0 && (
            <div className="bg-surface-secondary rounded-xl p-4 border border-edge-primary">
              <h4 className="text-sm font-semibold text-content-primary mb-3">
                Count Array {currentDigit !== null && `(digit ${currentDigit}: ${['ones', 'tens', 'hundreds'][currentDigit]})`}
              </h4>
              <div className="flex gap-1 flex-wrap">
                {countArray.map((count, idx) => (
                  <div key={idx} className="flex flex-col items-center">
                    <span className="w-10 h-10 flex items-center justify-center bg-purple-100 dark:bg-purple-900/30 border border-purple-300 dark:border-purple-700 rounded font-mono text-sm">
                      {count}
                    </span>
                    <span className="text-xs text-content-muted mt-1">{idx}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Complexity Info */}
          <div className="bg-surface-secondary rounded-xl p-4 border border-edge-primary">
            <h4 className="text-sm font-semibold text-content-primary mb-2">Time Complexity</h4>
            {algorithm === 'counting' ? (
              <div className="text-sm text-content-secondary">
                <LaTeX math={`O(n + k) = O(${arraySize} + ${maxValue + 1}) = O(${arraySize + maxValue + 1})`} />
                <p className="mt-1 text-xs text-content-muted">where k = range of values (0 to {maxValue})</p>
              </div>
            ) : (
              <div className="text-sm text-content-secondary">
                <LaTeX math="O(d(n + b))" /> where d = digits, b = base (10)
                <p className="mt-1 text-xs text-content-muted">Linear when d is constant!</p>
              </div>
            )}
          </div>
        </div>

        {/* Controls */}
        <div className="space-y-4">
          <ControlPanel title="Controls">
            {algorithm === 'counting' && (
              <Slider
                label={`Max Value (0-${maxValue})`}
                value={maxValue}
                onChange={(e) => setMaxValue(Number(e.target.value))}
                min={5}
                max={20}
                disabled={sorting}
              />
            )}
            <Slider
              label="Array Size"
              value={arraySize}
              onChange={(e) => setArraySize(Number(e.target.value))}
              min={5}
              max={20}
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
                className="flex-1 px-3 py-2 rounded-xl font-medium text-sm bg-surface-tertiary border border-edge-primary text-content-secondary hover:bg-surface-accent disabled:opacity-50"
              >
                New Array
              </button>
              {sorting ? (
                <button
                  onClick={stopSorting}
                  className="flex-1 px-3 py-2 rounded-xl font-medium text-sm bg-red-500 text-white hover:bg-red-600"
                >
                  Stop
                </button>
              ) : (
                <button
                  onClick={startSorting}
                  className="flex-1 px-3 py-2 rounded-xl font-medium text-sm bg-brand-500 text-white hover:bg-brand-600"
                >
                  Sort
                </button>
              )}
            </div>
          </ControlPanel>

          <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-xl p-4 border border-emerald-200 dark:border-emerald-800">
            <h4 className="text-sm font-semibold text-emerald-800 dark:text-emerald-200 mb-2">
              Key Insight
            </h4>
            <p className="text-xs text-emerald-700 dark:text-emerald-300 leading-relaxed">
              {algorithm === 'counting'
                ? 'Counting sort uses key values directly as array indices - no comparisons needed!'
                : 'Radix sort processes one digit at a time using counting sort. LSD (least significant digit) first ensures stability.'}
            </p>
          </div>

          <div className="bg-amber-50 dark:bg-amber-900/20 rounded-xl p-4 border border-amber-200 dark:border-amber-800">
            <h4 className="text-sm font-semibold text-amber-800 dark:text-amber-200 mb-2">
              Stable Sorting
            </h4>
            <p className="text-xs text-amber-700 dark:text-amber-300">
              Both algorithms are stable - equal keys maintain their relative order.
              Radix sort requires stability!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
