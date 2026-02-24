'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import Button from '@/components/ui/Button';
import Slider from '@/components/ui/Slider';
import ControlPanel from '@/components/ui/ControlPanel';

type SortAlgorithm = 'bubble' | 'merge' | 'quick';

interface ArrayBar {
  value: number;
  state: 'default' | 'comparing' | 'sorted' | 'pivot';
}

export default function SortingVisualizer() {
  const [array, setArray] = useState<ArrayBar[]>([]);
  const [arraySize, setArraySize] = useState(30);
  const [speed, setSpeed] = useState(50);
  const [algorithm, setAlgorithm] = useState<SortAlgorithm>('bubble');
  const [sorting, setSorting] = useState(false);
  const [comparisons, setComparisons] = useState(0);
  const [swaps, setSwaps] = useState(0);
  const sortingRef = useRef(false);

  const generateArray = useCallback(() => {
    const newArray: ArrayBar[] = [];
    for (let i = 0; i < arraySize; i++) {
      newArray.push({
        value: Math.floor(Math.random() * 100) + 5,
        state: 'default',
      });
    }
    setArray(newArray);
    setComparisons(0);
    setSwaps(0);
  }, [arraySize]);

  useEffect(() => {
    generateArray();
  }, [generateArray]);

  const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

  const bubbleSort = async () => {
    const arr = [...array];
    let comps = 0;
    let swp = 0;

    for (let i = 0; i < arr.length - 1 && sortingRef.current; i++) {
      for (let j = 0; j < arr.length - i - 1 && sortingRef.current; j++) {
        arr[j].state = 'comparing';
        arr[j + 1].state = 'comparing';
        setArray([...arr]);
        comps++;
        setComparisons(comps);

        await sleep(101 - speed);

        if (arr[j].value > arr[j + 1].value) {
          [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
          swp++;
          setSwaps(swp);
        }

        arr[j].state = 'default';
        arr[j + 1].state = 'default';
      }
      arr[arr.length - 1 - i].state = 'sorted';
      setArray([...arr]);
    }

    if (sortingRef.current) {
      arr[0].state = 'sorted';
      setArray([...arr]);
    }
  };

  const mergeSort = async () => {
    const arr = [...array];
    let comps = 0;
    let swp = 0;

    const merge = async (start: number, mid: number, end: number) => {
      const left = arr.slice(start, mid + 1);
      const right = arr.slice(mid + 1, end + 1);
      let i = 0, j = 0, k = start;

      while (i < left.length && j < right.length && sortingRef.current) {
        arr[k].state = 'comparing';
        setArray([...arr]);
        comps++;
        setComparisons(comps);
        await sleep(101 - speed);

        if (left[i].value <= right[j].value) {
          arr[k] = { ...left[i], state: 'default' };
          i++;
        } else {
          arr[k] = { ...right[j], state: 'default' };
          j++;
          swp++;
          setSwaps(swp);
        }
        k++;
        setArray([...arr]);
      }

      while (i < left.length && sortingRef.current) {
        arr[k] = { ...left[i], state: 'default' };
        i++;
        k++;
        setArray([...arr]);
        await sleep(101 - speed);
      }

      while (j < right.length && sortingRef.current) {
        arr[k] = { ...right[j], state: 'default' };
        j++;
        k++;
        setArray([...arr]);
        await sleep(101 - speed);
      }
    };

    const sort = async (start: number, end: number) => {
      if (start < end && sortingRef.current) {
        const mid = Math.floor((start + end) / 2);
        await sort(start, mid);
        await sort(mid + 1, end);
        await merge(start, mid, end);
      }
    };

    await sort(0, arr.length - 1);

    if (sortingRef.current) {
      arr.forEach((bar) => (bar.state = 'sorted'));
      setArray([...arr]);
    }
  };

  const quickSort = async () => {
    const arr = [...array];
    let comps = 0;
    let swp = 0;

    const partition = async (low: number, high: number): Promise<number> => {
      const pivot = arr[high];
      pivot.state = 'pivot';
      setArray([...arr]);
      let i = low - 1;

      for (let j = low; j < high && sortingRef.current; j++) {
        arr[j].state = 'comparing';
        setArray([...arr]);
        comps++;
        setComparisons(comps);
        await sleep(101 - speed);

        if (arr[j].value < pivot.value) {
          i++;
          [arr[i], arr[j]] = [arr[j], arr[i]];
          swp++;
          setSwaps(swp);
        }
        arr[j].state = 'default';
        setArray([...arr]);
      }

      [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
      arr[i + 1].state = 'sorted';
      setArray([...arr]);
      return i + 1;
    };

    const sort = async (low: number, high: number) => {
      if (low < high && sortingRef.current) {
        const pi = await partition(low, high);
        await sort(low, pi - 1);
        await sort(pi + 1, high);
      }
    };

    await sort(0, arr.length - 1);

    if (sortingRef.current) {
      arr.forEach((bar) => (bar.state = 'sorted'));
      setArray([...arr]);
    }
  };

  const startSorting = async () => {
    setSorting(true);
    sortingRef.current = true;
    setComparisons(0);
    setSwaps(0);

    switch (algorithm) {
      case 'bubble':
        await bubbleSort();
        break;
      case 'merge':
        await mergeSort();
        break;
      case 'quick':
        await quickSort();
        break;
    }

    setSorting(false);
    sortingRef.current = false;
  };

  const stopSorting = () => {
    sortingRef.current = false;
    setSorting(false);
  };

  const getBarColor = (state: ArrayBar['state']) => {
    switch (state) {
      case 'comparing':
        return 'bg-yellow-500';
      case 'sorted':
        return 'bg-green-500';
      case 'pivot':
        return 'bg-red-500';
      default:
        return 'bg-blue-500';
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold text-content-primary mb-4">
        Sorting Algorithm Visualizer
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <div className="bg-surface-tertiary rounded-lg p-4 h-80 flex items-end justify-center gap-1">
            {array.map((bar, idx) => (
              <motion.div
                key={idx}
                className={`${getBarColor(bar.state)} rounded-t`}
                style={{
                  height: `${bar.value}%`,
                  width: `${Math.max(100 / arraySize - 1, 2)}%`,
                }}
                layout
                transition={{ duration: 0.1 }}
              />
            ))}
          </div>

          <div className="mt-4 flex items-center justify-center space-x-4 text-sm text-content-secondary">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-blue-500 rounded" />
              <span>Unsorted</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-yellow-500 rounded" />
              <span>Comparing</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-red-500 rounded" />
              <span>Pivot</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-green-500 rounded" />
              <span>Sorted</span>
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
                onChange={(e) => setAlgorithm(e.target.value as SortAlgorithm)}
                disabled={sorting}
                className="w-full px-3 py-2 rounded-lg border border-edge-secondary dark:border-edge-secondary bg-surface-secondary text-content-primary"
              >
                <option value="bubble">Bubble Sort</option>
                <option value="merge">Merge Sort</option>
                <option value="quick">Quick Sort</option>
              </select>
            </div>

            <Slider
              label="Array Size"
              value={arraySize}
              onChange={(e) => setArraySize(Number(e.target.value))}
              min={10}
              max={100}
              disabled={sorting}
            />

            <Slider
              label="Speed"
              value={speed}
              onChange={(e) => setSpeed(Number(e.target.value))}
              min={1}
              max={100}
            />

            <div className="flex space-x-2">
              <Button onClick={generateArray} disabled={sorting} variant="secondary">
                New Array
              </Button>
              {sorting ? (
                <Button onClick={stopSorting} variant="primary">
                  Stop
                </Button>
              ) : (
                <Button onClick={startSorting} variant="primary">
                  Sort
                </Button>
              )}
            </div>
          </ControlPanel>

          <ControlPanel title="Statistics">
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-blue-600">{comparisons}</p>
                <p className="text-xs text-content-muted">Comparisons</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-green-600">{swaps}</p>
                <p className="text-xs text-content-muted">Swaps</p>
              </div>
            </div>
          </ControlPanel>
        </div>
      </div>
    </div>
  );
}
