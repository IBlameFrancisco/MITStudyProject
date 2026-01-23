'use client';

import React, { useState, useCallback, useEffect } from 'react';

type DPProblem = 'fibonacci' | 'lcs' | 'lis' | 'knapsack' | 'matrix-chain';

interface DPCell {
  value: number | string;
  highlighted: boolean;
  computed: boolean;
  path: boolean;
}

export default function DPVisualizer() {
  const [problem, setProblem] = useState<DPProblem>('fibonacci');
  const [isRunning, setIsRunning] = useState(false);
  const [speed, setSpeed] = useState(500);
  const [step, setStep] = useState(0);

  // Fibonacci state
  const [fibN, setFibN] = useState(10);
  const [fibTable, setFibTable] = useState<DPCell[]>([]);

  // LCS state
  const [lcsStr1, setLcsStr1] = useState('ABCDGH');
  const [lcsStr2, setLcsStr2] = useState('AEDFHR');
  const [lcsTable, setLcsTable] = useState<DPCell[][]>([]);
  const [lcsResult, setLcsResult] = useState('');

  // LIS state
  const [lisArray, setLisArray] = useState([10, 22, 9, 33, 21, 50, 41, 60]);
  const [lisTable, setLisTable] = useState<DPCell[]>([]);
  const [lisResult, setLisResult] = useState<number[]>([]);

  // Knapsack state
  const [knapsackItems, setKnapsackItems] = useState([
    { weight: 2, value: 3 },
    { weight: 3, value: 4 },
    { weight: 4, value: 5 },
    { weight: 5, value: 6 },
  ]);
  const [knapsackCapacity, setKnapsackCapacity] = useState(8);
  const [knapsackTable, setKnapsackTable] = useState<DPCell[][]>([]);

  // Matrix Chain state
  const [matrixDims, setMatrixDims] = useState([30, 35, 15, 5, 10, 20, 25]);
  const [matrixTable, setMatrixTable] = useState<DPCell[][]>([]);
  const [matrixSplit, setMatrixSplit] = useState<number[][]>([]);

  const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  // Initialize Fibonacci
  const initFibonacci = useCallback(() => {
    const table: DPCell[] = Array(fibN + 1).fill(null).map(() => ({
      value: '-',
      highlighted: false,
      computed: false,
      path: false,
    }));
    setFibTable(table);
    setStep(0);
  }, [fibN]);

  // Run Fibonacci animation
  const runFibonacci = useCallback(async () => {
    setIsRunning(true);
    const table: DPCell[] = Array(fibN + 1).fill(null).map(() => ({
      value: '-',
      highlighted: false,
      computed: false,
      path: false,
    }));

    // Base cases
    table[0] = { value: 0, highlighted: true, computed: true, path: false };
    setFibTable([...table]);
    await sleep(speed);
    table[0].highlighted = false;

    if (fibN >= 1) {
      table[1] = { value: 1, highlighted: true, computed: true, path: false };
      setFibTable([...table]);
      await sleep(speed);
      table[1].highlighted = false;
    }

    // Fill table
    for (let i = 2; i <= fibN; i++) {
      table[i - 1].highlighted = true;
      table[i - 2].highlighted = true;
      setFibTable([...table]);
      await sleep(speed);

      const val = (table[i - 1].value as number) + (table[i - 2].value as number);
      table[i] = { value: val, highlighted: true, computed: true, path: false };
      table[i - 1].highlighted = false;
      table[i - 2].highlighted = false;
      setFibTable([...table]);
      await sleep(speed);
      table[i].highlighted = false;
      setStep(i);
    }

    setFibTable([...table]);
    setIsRunning(false);
  }, [fibN, speed]);

  // Initialize LCS
  const initLCS = useCallback(() => {
    const m = lcsStr1.length;
    const n = lcsStr2.length;
    const table: DPCell[][] = Array(m + 1).fill(null).map(() =>
      Array(n + 1).fill(null).map(() => ({
        value: '-',
        highlighted: false,
        computed: false,
        path: false,
      }))
    );
    setLcsTable(table);
    setLcsResult('');
    setStep(0);
  }, [lcsStr1, lcsStr2]);

  // Run LCS animation
  const runLCS = useCallback(async () => {
    setIsRunning(true);
    const m = lcsStr1.length;
    const n = lcsStr2.length;
    const table: DPCell[][] = Array(m + 1).fill(null).map(() =>
      Array(n + 1).fill(null).map(() => ({
        value: 0,
        highlighted: false,
        computed: false,
        path: false,
      }))
    );

    // Initialize first row and column
    for (let i = 0; i <= m; i++) {
      table[i][0] = { value: 0, highlighted: false, computed: true, path: false };
    }
    for (let j = 0; j <= n; j++) {
      table[0][j] = { value: 0, highlighted: false, computed: true, path: false };
    }
    setLcsTable([...table.map(row => [...row])]);
    await sleep(speed);

    // Fill table
    for (let i = 1; i <= m; i++) {
      for (let j = 1; j <= n; j++) {
        table[i][j].highlighted = true;
        setLcsTable([...table.map(row => [...row])]);
        await sleep(speed / 2);

        if (lcsStr1[i - 1] === lcsStr2[j - 1]) {
          table[i][j].value = (table[i - 1][j - 1].value as number) + 1;
        } else {
          table[i][j].value = Math.max(
            table[i - 1][j].value as number,
            table[i][j - 1].value as number
          );
        }
        table[i][j].computed = true;
        table[i][j].highlighted = false;
        setLcsTable([...table.map(row => [...row])]);
        setStep(i * n + j);
      }
    }

    // Backtrack to find LCS
    let i = m, j = n;
    let lcs = '';
    while (i > 0 && j > 0) {
      table[i][j].path = true;
      if (lcsStr1[i - 1] === lcsStr2[j - 1]) {
        lcs = lcsStr1[i - 1] + lcs;
        i--;
        j--;
      } else if ((table[i - 1][j].value as number) > (table[i][j - 1].value as number)) {
        i--;
      } else {
        j--;
      }
      setLcsTable([...table.map(row => [...row])]);
      await sleep(speed);
    }

    setLcsResult(lcs);
    setIsRunning(false);
  }, [lcsStr1, lcsStr2, speed]);

  // Initialize LIS
  const initLIS = useCallback(() => {
    const table: DPCell[] = lisArray.map(() => ({
      value: 1,
      highlighted: false,
      computed: false,
      path: false,
    }));
    setLisTable(table);
    setLisResult([]);
    setStep(0);
  }, [lisArray]);

  // Run LIS animation
  const runLIS = useCallback(async () => {
    setIsRunning(true);
    const n = lisArray.length;
    const dp: number[] = Array(n).fill(1);
    const parent: number[] = Array(n).fill(-1);
    const table: DPCell[] = lisArray.map(() => ({
      value: 1,
      highlighted: false,
      computed: true,
      path: false,
    }));
    setLisTable([...table]);
    await sleep(speed);

    for (let i = 1; i < n; i++) {
      table[i].highlighted = true;
      setLisTable([...table]);
      await sleep(speed / 2);

      for (let j = 0; j < i; j++) {
        if (lisArray[j] < lisArray[i] && dp[j] + 1 > dp[i]) {
          dp[i] = dp[j] + 1;
          parent[i] = j;
          table[i].value = dp[i];
          setLisTable([...table]);
          await sleep(speed / 3);
        }
      }
      table[i].highlighted = false;
      setStep(i);
    }

    // Find max and backtrack
    let maxIdx = 0;
    for (let i = 1; i < n; i++) {
      if (dp[i] > dp[maxIdx]) maxIdx = i;
    }

    const lis: number[] = [];
    let idx = maxIdx;
    while (idx !== -1) {
      table[idx].path = true;
      lis.unshift(lisArray[idx]);
      idx = parent[idx];
      setLisTable([...table]);
      await sleep(speed);
    }

    setLisResult(lis);
    setIsRunning(false);
  }, [lisArray, speed]);

  // Initialize Knapsack
  const initKnapsack = useCallback(() => {
    const n = knapsackItems.length;
    const W = knapsackCapacity;
    const table: DPCell[][] = Array(n + 1).fill(null).map(() =>
      Array(W + 1).fill(null).map(() => ({
        value: '-',
        highlighted: false,
        computed: false,
        path: false,
      }))
    );
    setKnapsackTable(table);
    setStep(0);
  }, [knapsackItems, knapsackCapacity]);

  // Run Knapsack animation
  const runKnapsack = useCallback(async () => {
    setIsRunning(true);
    const n = knapsackItems.length;
    const W = knapsackCapacity;
    const table: DPCell[][] = Array(n + 1).fill(null).map(() =>
      Array(W + 1).fill(null).map(() => ({
        value: 0,
        highlighted: false,
        computed: false,
        path: false,
      }))
    );

    // Initialize first row
    for (let w = 0; w <= W; w++) {
      table[0][w] = { value: 0, highlighted: false, computed: true, path: false };
    }
    setKnapsackTable([...table.map(row => [...row])]);
    await sleep(speed);

    // Fill table
    for (let i = 1; i <= n; i++) {
      for (let w = 0; w <= W; w++) {
        table[i][w].highlighted = true;
        setKnapsackTable([...table.map(row => [...row])]);
        await sleep(speed / 3);

        const item = knapsackItems[i - 1];
        if (item.weight <= w) {
          table[i][w].value = Math.max(
            table[i - 1][w].value as number,
            (table[i - 1][w - item.weight].value as number) + item.value
          );
        } else {
          table[i][w].value = table[i - 1][w].value;
        }
        table[i][w].computed = true;
        table[i][w].highlighted = false;
        setKnapsackTable([...table.map(row => [...row])]);
        setStep(i * (W + 1) + w);
      }
    }

    // Backtrack
    let w = W;
    for (let i = n; i > 0 && w > 0; i--) {
      if (table[i][w].value !== table[i - 1][w].value) {
        table[i][w].path = true;
        w -= knapsackItems[i - 1].weight;
      }
      setKnapsackTable([...table.map(row => [...row])]);
      await sleep(speed);
    }

    setIsRunning(false);
  }, [knapsackItems, knapsackCapacity, speed]);

  // Initialize based on problem
  useEffect(() => {
    switch (problem) {
      case 'fibonacci': initFibonacci(); break;
      case 'lcs': initLCS(); break;
      case 'lis': initLIS(); break;
      case 'knapsack': initKnapsack(); break;
    }
  }, [problem, initFibonacci, initLCS, initLIS, initKnapsack]);

  const runVisualization = () => {
    switch (problem) {
      case 'fibonacci': runFibonacci(); break;
      case 'lcs': runLCS(); break;
      case 'lis': runLIS(); break;
      case 'knapsack': runKnapsack(); break;
    }
  };

  const reset = () => {
    setIsRunning(false);
    switch (problem) {
      case 'fibonacci': initFibonacci(); break;
      case 'lcs': initLCS(); break;
      case 'lis': initLIS(); break;
      case 'knapsack': initKnapsack(); break;
    }
  };

  const getCellClass = (cell: DPCell) => {
    let base = 'w-10 h-10 flex items-center justify-center text-xs font-mono border transition-all duration-200 ';
    if (cell.path) return base + 'bg-green-500 text-white border-green-600';
    if (cell.highlighted) return base + 'bg-yellow-400 text-black border-yellow-500 scale-110';
    if (cell.computed) return base + 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 border-blue-300 dark:border-blue-700';
    return base + 'bg-gray-100 dark:bg-gray-800 text-gray-400 border-gray-300 dark:border-gray-600';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">
          Dynamic Programming Visualizer
        </h3>
      </div>

      {/* Problem Selection */}
      <div className="flex flex-wrap gap-2">
        {[
          { id: 'fibonacci', label: 'Fibonacci' },
          { id: 'lcs', label: 'LCS' },
          { id: 'lis', label: 'LIS' },
          { id: 'knapsack', label: 'Knapsack' },
        ].map(({ id, label }) => (
          <button
            key={id}
            onClick={() => setProblem(id as DPProblem)}
            disabled={isRunning}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              problem === id
                ? 'bg-green-600 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
            } disabled:opacity-50`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Controls */}
      <div className="flex flex-wrap gap-4 items-center">
        <button
          onClick={runVisualization}
          disabled={isRunning}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isRunning ? 'Running...' : 'Run'}
        </button>
        <button
          onClick={reset}
          disabled={isRunning}
          className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 transition-colors"
        >
          Reset
        </button>
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-600 dark:text-gray-400">Speed:</label>
          <input
            type="range"
            min="100"
            max="1000"
            step="100"
            value={1100 - speed}
            onChange={(e) => setSpeed(1100 - parseInt(e.target.value))}
            className="w-24"
          />
        </div>
      </div>

      {/* Problem-specific inputs */}
      {problem === 'fibonacci' && (
        <div className="flex items-center gap-4">
          <label className="text-sm text-gray-600 dark:text-gray-400">n =</label>
          <input
            type="number"
            min="2"
            max="20"
            value={fibN}
            onChange={(e) => setFibN(Math.min(20, Math.max(2, parseInt(e.target.value) || 2)))}
            disabled={isRunning}
            className="w-20 px-2 py-1 border rounded dark:bg-gray-800 dark:border-gray-600"
          />
        </div>
      )}

      {problem === 'lcs' && (
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600 dark:text-gray-400">String 1:</label>
            <input
              type="text"
              value={lcsStr1}
              onChange={(e) => setLcsStr1(e.target.value.toUpperCase().slice(0, 10))}
              disabled={isRunning}
              className="w-32 px-2 py-1 border rounded dark:bg-gray-800 dark:border-gray-600 font-mono"
            />
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600 dark:text-gray-400">String 2:</label>
            <input
              type="text"
              value={lcsStr2}
              onChange={(e) => setLcsStr2(e.target.value.toUpperCase().slice(0, 10))}
              disabled={isRunning}
              className="w-32 px-2 py-1 border rounded dark:bg-gray-800 dark:border-gray-600 font-mono"
            />
          </div>
        </div>
      )}

      {/* Visualization Area */}
      <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 overflow-x-auto">
        {problem === 'fibonacci' && (
          <div className="space-y-4">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              F(n) = F(n-1) + F(n-2), with F(0)=0, F(1)=1
            </div>
            <div className="flex gap-1 flex-wrap">
              {fibTable.map((cell, i) => (
                <div key={i} className="flex flex-col items-center">
                  <span className="text-xs text-gray-500 mb-1">F({i})</span>
                  <div className={getCellClass(cell)}>{cell.value}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {problem === 'lcs' && (
          <div className="space-y-4">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Finding longest common subsequence between "{lcsStr1}" and "{lcsStr2}"
            </div>
            <div className="inline-block">
              <div className="flex">
                <div className="w-10 h-10" />
                <div className="w-10 h-10" />
                {lcsStr2.split('').map((c, j) => (
                  <div key={j} className="w-10 h-10 flex items-center justify-center font-mono font-bold text-gray-700 dark:text-gray-300">
                    {c}
                  </div>
                ))}
              </div>
              {lcsTable.map((row, i) => (
                <div key={i} className="flex">
                  <div className="w-10 h-10 flex items-center justify-center font-mono font-bold text-gray-700 dark:text-gray-300">
                    {i === 0 ? '' : lcsStr1[i - 1]}
                  </div>
                  {row.map((cell, j) => (
                    <div key={j} className={getCellClass(cell)}>{cell.value}</div>
                  ))}
                </div>
              ))}
            </div>
            {lcsResult && (
              <div className="text-lg font-semibold text-green-600 dark:text-green-400">
                LCS: "{lcsResult}" (length: {lcsResult.length})
              </div>
            )}
          </div>
        )}

        {problem === 'lis' && (
          <div className="space-y-4">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Array: [{lisArray.join(', ')}]
            </div>
            <div className="flex gap-1 flex-wrap">
              {lisTable.map((cell, i) => (
                <div key={i} className="flex flex-col items-center">
                  <span className="text-xs text-gray-500 mb-1">{lisArray[i]}</span>
                  <div className={getCellClass(cell)}>{cell.value}</div>
                </div>
              ))}
            </div>
            {lisResult.length > 0 && (
              <div className="text-lg font-semibold text-green-600 dark:text-green-400">
                LIS: [{lisResult.join(', ')}] (length: {lisResult.length})
              </div>
            )}
          </div>
        )}

        {problem === 'knapsack' && (
          <div className="space-y-4">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Items: {knapsackItems.map((item, i) => `(w=${item.weight}, v=${item.value})`).join(', ')} | Capacity: {knapsackCapacity}
            </div>
            <div className="inline-block">
              <div className="flex">
                <div className="w-12 h-10" />
                {Array.from({ length: knapsackCapacity + 1 }, (_, w) => (
                  <div key={w} className="w-10 h-10 flex items-center justify-center text-xs text-gray-500">
                    w={w}
                  </div>
                ))}
              </div>
              {knapsackTable.map((row, i) => (
                <div key={i} className="flex">
                  <div className="w-12 h-10 flex items-center justify-center text-xs text-gray-500">
                    {i === 0 ? '0' : `i=${i}`}
                  </div>
                  {row.map((cell, j) => (
                    <div key={j} className={getCellClass(cell)}>{cell.value}</div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Explanation */}
      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
        <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">How it works</h4>
        {problem === 'fibonacci' && (
          <p className="text-sm text-blue-700 dark:text-blue-300">
            Bottom-up DP builds the solution from base cases F(0)=0 and F(1)=1. Each F(n) is computed
            by summing F(n-1) and F(n-2), which are already computed and stored in the table.
            Time: O(n), Space: O(n).
          </p>
        )}
        {problem === 'lcs' && (
          <p className="text-sm text-blue-700 dark:text-blue-300">
            LCS uses a 2D table where dp[i][j] represents the LCS length of the first i characters
            of string 1 and first j characters of string 2. If characters match, we add 1 to the
            diagonal; otherwise, we take the max of left and top. Time: O(mn), Space: O(mn).
          </p>
        )}
        {problem === 'lis' && (
          <p className="text-sm text-blue-700 dark:text-blue-300">
            LIS uses dp[i] to store the length of the longest increasing subsequence ending at index i.
            For each position, we check all previous positions with smaller values and take the maximum
            length + 1. Time: O(n²), Space: O(n). Can be optimized to O(n log n) with binary search.
          </p>
        )}
        {problem === 'knapsack' && (
          <p className="text-sm text-blue-700 dark:text-blue-300">
            0/1 Knapsack uses dp[i][w] to represent the maximum value achievable using the first i
            items with capacity w. For each item, we either include it (if it fits) or exclude it,
            taking the maximum value. Time: O(nW), Space: O(nW).
          </p>
        )}
      </div>
    </div>
  );
}
