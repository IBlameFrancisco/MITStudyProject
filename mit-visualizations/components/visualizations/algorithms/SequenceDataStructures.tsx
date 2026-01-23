'use client';

/**
 * Sequence Data Structures Visualizer
 * ====================================
 * Interactive visualization comparing Array and Linked List operations.
 * Shows time complexity differences for various sequence operations.
 */

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ControlPanel from '@/components/ui/ControlPanel';
import { LaTeX } from '@/components/ui/LaTeX';

type DataStructure = 'array' | 'linkedlist';
type Operation = 'get_at' | 'set_at' | 'insert_first' | 'insert_last' | 'delete_first' | 'delete_last' | 'insert_at';

type ElementState = 'default' | 'active' | 'highlight' | 'inserting' | 'deleting';

interface Element {
  id: number;
  value: number;
  state: ElementState;
}

export default function SequenceDataStructures() {
  const [dataStructure, setDataStructure] = useState<DataStructure>('array');
  const [elements, setElements] = useState<Element[]>([
    { id: 1, value: 42, state: 'default' },
    { id: 2, value: 17, state: 'default' },
    { id: 3, value: 89, state: 'default' },
    { id: 4, value: 31, state: 'default' },
    { id: 5, value: 56, state: 'default' },
  ]);
  const [selectedIndex, setSelectedIndex] = useState(2);
  const [isAnimating, setIsAnimating] = useState(false);
  const [operationLog, setOperationLog] = useState<string[]>([]);
  const [stepsCount, setStepsCount] = useState(0);

  const addLog = (message: string) => {
    setOperationLog(prev => [message, ...prev.slice(0, 4)]);
  };

  const resetStates = useCallback(() => {
    setElements(prev => prev.map(el => ({ ...el, state: 'default' as ElementState })));
  }, []);

  const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  // Animate get_at operation
  const animateGetAt = async (index: number) => {
    setIsAnimating(true);
    setStepsCount(0);
    resetStates();

    if (dataStructure === 'array') {
      // Array: O(1) - direct access
      await sleep(200);
      setElements(prev => prev.map((el, i) =>
        i === index ? { ...el, state: 'highlight' as ElementState } : el
      ));
      setStepsCount(1);
      addLog(`Array: Direct access to index ${index} - O(1)`);
    } else {
      // Linked List: O(n) - traverse from head
      for (let i = 0; i <= index; i++) {
        setElements(prev => prev.map((el, j) =>
          j === i ? { ...el, state: 'active' as ElementState } : j < i ? { ...el, state: 'default' as ElementState } : el
        ));
        setStepsCount(i + 1);
        await sleep(300);
      }
      setElements(prev => prev.map((el, i) =>
        i === index ? { ...el, state: 'highlight' as ElementState } : { ...el, state: 'default' as ElementState }
      ));
      addLog(`Linked List: Traversed ${index + 1} nodes - O(n)`);
    }

    setIsAnimating(false);
  };

  // Animate insert_first operation
  const animateInsertFirst = async () => {
    setIsAnimating(true);
    setStepsCount(0);
    resetStates();

    const newValue = Math.floor(Math.random() * 100);
    const newId = Math.max(...elements.map(e => e.id)) + 1;

    if (dataStructure === 'array') {
      // Array: O(n) - shift all elements
      for (let i = elements.length - 1; i >= 0; i--) {
        setElements(prev => prev.map((el, j) =>
          j === i ? { ...el, state: 'active' as ElementState } : el
        ));
        setStepsCount(elements.length - i);
        await sleep(200);
      }
      setElements(prev => [
        { id: newId, value: newValue, state: 'inserting' as ElementState },
        ...prev.map(el => ({ ...el, state: 'default' as ElementState }))
      ]);
      await sleep(300);
      setElements(prev => prev.map(el => ({ ...el, state: 'default' as ElementState })));
      addLog(`Array: Shifted ${elements.length} elements, inserted ${newValue} - O(n)`);
    } else {
      // Linked List: O(1) - update head pointer
      setStepsCount(1);
      setElements(prev => [
        { id: newId, value: newValue, state: 'inserting' as ElementState },
        ...prev
      ]);
      await sleep(300);
      setElements(prev => prev.map(el => ({ ...el, state: 'default' as ElementState })));
      addLog(`Linked List: Updated head pointer, inserted ${newValue} - O(1)`);
    }

    setIsAnimating(false);
  };

  // Animate insert_last operation
  const animateInsertLast = async () => {
    setIsAnimating(true);
    setStepsCount(0);
    resetStates();

    const newValue = Math.floor(Math.random() * 100);
    const newId = Math.max(...elements.map(e => e.id)) + 1;

    if (dataStructure === 'array') {
      // Array: O(1) amortized - append to end
      setStepsCount(1);
      setElements(prev => [
        ...prev,
        { id: newId, value: newValue, state: 'inserting' as ElementState }
      ]);
      await sleep(300);
      setElements(prev => prev.map(el => ({ ...el, state: 'default' as ElementState })));
      addLog(`Array: Appended ${newValue} at end - O(1) amortized`);
    } else {
      // Linked List with tail pointer: O(1)
      // Without tail pointer would be O(n)
      setStepsCount(1);
      setElements(prev => [
        ...prev.map((el, i) => i === prev.length - 1 ? { ...el, state: 'active' as ElementState } : el),
        { id: newId, value: newValue, state: 'inserting' as ElementState }
      ]);
      await sleep(300);
      setElements(prev => prev.map(el => ({ ...el, state: 'default' as ElementState })));
      addLog(`Linked List: Updated tail pointer, inserted ${newValue} - O(1)`);
    }

    setIsAnimating(false);
  };

  // Animate delete_first operation
  const animateDeleteFirst = async () => {
    if (elements.length === 0) return;

    setIsAnimating(true);
    setStepsCount(0);
    resetStates();

    setElements(prev => prev.map((el, i) =>
      i === 0 ? { ...el, state: 'deleting' as ElementState } : el
    ));
    await sleep(300);

    if (dataStructure === 'array') {
      // Array: O(n) - shift all elements
      for (let i = 1; i < elements.length; i++) {
        setElements(prev => prev.map((el, j) =>
          j === i ? { ...el, state: 'active' as ElementState } : el
        ));
        setStepsCount(i);
        await sleep(200);
      }
      addLog(`Array: Shifted ${elements.length - 1} elements - O(n)`);
    } else {
      // Linked List: O(1) - update head
      setStepsCount(1);
      addLog(`Linked List: Updated head pointer - O(1)`);
    }

    setElements(prev => prev.slice(1).map(el => ({ ...el, state: 'default' as ElementState })));
    setIsAnimating(false);
  };

  // Animate insert_at operation
  const animateInsertAt = async (index: number) => {
    setIsAnimating(true);
    setStepsCount(0);
    resetStates();

    const newValue = Math.floor(Math.random() * 100);
    const newId = Math.max(...elements.map(e => e.id)) + 1;

    if (dataStructure === 'array') {
      // Array: O(n) - shift elements after index
      for (let i = elements.length - 1; i >= index; i--) {
        setElements(prev => prev.map((el, j) =>
          j === i ? { ...el, state: 'active' as ElementState } : el
        ));
        setStepsCount(elements.length - i);
        await sleep(200);
      }
      const newElements = [...elements];
      newElements.splice(index, 0, { id: newId, value: newValue, state: 'inserting' as ElementState });
      setElements(newElements);
      await sleep(300);
      setElements(prev => prev.map(el => ({ ...el, state: 'default' as ElementState })));
      addLog(`Array: Shifted ${elements.length - index} elements, inserted at index ${index} - O(n)`);
    } else {
      // Linked List: O(n) to find position, O(1) to insert
      for (let i = 0; i < index; i++) {
        setElements(prev => prev.map((el, j) =>
          j === i ? { ...el, state: 'active' as ElementState } : j < i ? { ...el, state: 'default' as ElementState } : el
        ));
        setStepsCount(i + 1);
        await sleep(200);
      }
      const newElements = [...elements];
      newElements.splice(index, 0, { id: newId, value: newValue, state: 'inserting' as ElementState });
      setElements(newElements);
      await sleep(300);
      setElements(prev => prev.map(el => ({ ...el, state: 'default' as ElementState })));
      addLog(`Linked List: Traversed ${index} nodes, inserted at index ${index} - O(n)`);
    }

    setIsAnimating(false);
  };

  const complexityTable = [
    { op: 'get_at(i)', array: 'O(1)', linkedList: 'O(n)', best: 'array' },
    { op: 'set_at(i, x)', array: 'O(1)', linkedList: 'O(n)', best: 'array' },
    { op: 'insert_first(x)', array: 'O(n)', linkedList: 'O(1)', best: 'linkedlist' },
    { op: 'delete_first()', array: 'O(n)', linkedList: 'O(1)', best: 'linkedlist' },
    { op: 'insert_last(x)', array: 'O(1)*', linkedList: 'O(1)', best: 'both' },
    { op: 'delete_last()', array: 'O(1)', linkedList: 'O(1)†', best: 'both' },
    { op: 'insert_at(i, x)', array: 'O(n)', linkedList: 'O(n)', best: 'both' },
  ];

  return (
    <div>
      <h2 className="text-xl font-semibold text-content-primary mb-2">
        Sequence Data Structures
      </h2>
      <p className="text-sm text-content-secondary mb-6">
        Compare Array and Linked List operations with animated complexity analysis
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Visualization */}
        <div className="lg:col-span-3 space-y-4">
          {/* Data Structure Toggle */}
          <div className="flex gap-4 mb-4">
            <button
              onClick={() => { setDataStructure('array'); resetStates(); }}
              className={`px-4 py-2 rounded-xl font-medium transition-all ${
                dataStructure === 'array'
                  ? 'bg-blue-500 text-white shadow-lg'
                  : 'bg-surface-tertiary text-content-secondary hover:bg-surface-accent border border-edge-primary'
              }`}
            >
              Static Array
            </button>
            <button
              onClick={() => { setDataStructure('linkedlist'); resetStates(); }}
              className={`px-4 py-2 rounded-xl font-medium transition-all ${
                dataStructure === 'linkedlist'
                  ? 'bg-green-500 text-white shadow-lg'
                  : 'bg-surface-tertiary text-content-secondary hover:bg-surface-accent border border-edge-primary'
              }`}
            >
              Linked List
            </button>
          </div>

          {/* Visualization Area */}
          <div className="bg-surface-tertiary rounded-2xl p-6 border border-edge-primary min-h-[200px]">
            <div className="flex items-center justify-center gap-2">
              <AnimatePresence mode="popLayout">
                {elements.map((el, idx) => (
                  <motion.div
                    key={el.id}
                    layout
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    className="flex items-center"
                  >
                    <motion.div
                      className={`relative flex flex-col items-center justify-center w-16 h-16 rounded-lg border-2 transition-colors ${
                        el.state === 'active'
                          ? 'bg-yellow-100 dark:bg-yellow-900/30 border-yellow-500'
                          : el.state === 'highlight'
                          ? 'bg-green-100 dark:bg-green-900/30 border-green-500'
                          : el.state === 'inserting'
                          ? 'bg-blue-100 dark:bg-blue-900/30 border-blue-500'
                          : el.state === 'deleting'
                          ? 'bg-red-100 dark:bg-red-900/30 border-red-500'
                          : 'bg-surface-secondary border-edge-primary'
                      }`}
                    >
                      <span className="text-lg font-bold text-content-primary">{el.value}</span>
                      <span className="text-xs text-content-muted">[{idx}]</span>
                    </motion.div>

                    {/* Arrow for linked list */}
                    {dataStructure === 'linkedlist' && idx < elements.length - 1 && (
                      <div className="flex items-center mx-1">
                        <div className="w-6 h-0.5 bg-content-muted"></div>
                        <div className="w-0 h-0 border-t-4 border-b-4 border-l-6 border-t-transparent border-b-transparent border-l-content-muted"></div>
                      </div>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* Null terminator for linked list */}
              {dataStructure === 'linkedlist' && elements.length > 0 && (
                <div className="flex items-center ml-2">
                  <div className="w-6 h-0.5 bg-content-muted"></div>
                  <span className="text-content-muted font-mono text-sm">null</span>
                </div>
              )}
            </div>

            {/* Memory representation hint */}
            <div className="mt-6 text-center text-xs text-content-muted">
              {dataStructure === 'array' ? (
                <span>Contiguous memory: Address of A[i] = base + i × word_size</span>
              ) : (
                <span>Non-contiguous: Each node stores value + pointer to next</span>
              )}
            </div>
          </div>

          {/* Steps Counter */}
          {stepsCount > 0 && (
            <div className="bg-surface-secondary rounded-xl p-4 border border-edge-primary">
              <div className="flex items-center justify-between">
                <span className="text-sm text-content-secondary">Operations performed:</span>
                <span className="font-mono font-bold text-lg text-brand-600 dark:text-brand-400">
                  {stepsCount} step{stepsCount !== 1 ? 's' : ''}
                </span>
              </div>
            </div>
          )}

          {/* Complexity Comparison Table */}
          <div className="bg-surface-secondary rounded-xl p-4 border border-edge-primary overflow-x-auto">
            <h4 className="text-sm font-semibold text-content-primary mb-3">
              Time Complexity Comparison
            </h4>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-edge-primary">
                  <th className="text-left py-2 px-3 text-content-muted font-medium">Operation</th>
                  <th className="text-center py-2 px-3 text-blue-600 dark:text-blue-400 font-medium">Array</th>
                  <th className="text-center py-2 px-3 text-green-600 dark:text-green-400 font-medium">Linked List</th>
                </tr>
              </thead>
              <tbody>
                {complexityTable.map((row) => (
                  <tr key={row.op} className="border-b border-edge-secondary last:border-0">
                    <td className="py-2 px-3 font-mono text-content-primary">{row.op}</td>
                    <td className={`text-center py-2 px-3 font-mono ${
                      row.best === 'array' || row.best === 'both'
                        ? 'text-blue-600 dark:text-blue-400 font-semibold'
                        : 'text-content-muted'
                    }`}>
                      {row.array}
                    </td>
                    <td className={`text-center py-2 px-3 font-mono ${
                      row.best === 'linkedlist' || row.best === 'both'
                        ? 'text-green-600 dark:text-green-400 font-semibold'
                        : 'text-content-muted'
                    }`}>
                      {row.linkedList}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="mt-2 text-xs text-content-muted">
              * Amortized with dynamic array &nbsp;&nbsp; † With doubly-linked list and tail pointer
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="space-y-4">
          <ControlPanel title="Operations">
            <div className="space-y-2">
              <button
                onClick={() => animateGetAt(selectedIndex)}
                disabled={isAnimating}
                className="w-full px-3 py-2 rounded-xl font-medium text-sm bg-surface-tertiary border border-edge-primary text-content-primary hover:bg-surface-accent transition-colors disabled:opacity-50"
              >
                get_at({selectedIndex})
              </button>
              <button
                onClick={animateInsertFirst}
                disabled={isAnimating}
                className="w-full px-3 py-2 rounded-xl font-medium text-sm bg-surface-tertiary border border-edge-primary text-content-primary hover:bg-surface-accent transition-colors disabled:opacity-50"
              >
                insert_first(random)
              </button>
              <button
                onClick={animateInsertLast}
                disabled={isAnimating}
                className="w-full px-3 py-2 rounded-xl font-medium text-sm bg-surface-tertiary border border-edge-primary text-content-primary hover:bg-surface-accent transition-colors disabled:opacity-50"
              >
                insert_last(random)
              </button>
              <button
                onClick={animateDeleteFirst}
                disabled={isAnimating || elements.length === 0}
                className="w-full px-3 py-2 rounded-xl font-medium text-sm bg-surface-tertiary border border-edge-primary text-content-primary hover:bg-surface-accent transition-colors disabled:opacity-50"
              >
                delete_first()
              </button>
              <button
                onClick={() => animateInsertAt(selectedIndex)}
                disabled={isAnimating}
                className="w-full px-3 py-2 rounded-xl font-medium text-sm bg-surface-tertiary border border-edge-primary text-content-primary hover:bg-surface-accent transition-colors disabled:opacity-50"
              >
                insert_at({selectedIndex}, random)
              </button>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-content-secondary mb-2">
                Index: {selectedIndex}
              </label>
              <input
                type="range"
                value={selectedIndex}
                onChange={(e) => setSelectedIndex(Number(e.target.value))}
                min={0}
                max={Math.max(0, elements.length - 1)}
                className="w-full"
              />
            </div>
          </ControlPanel>

          <ControlPanel title="Operation Log">
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {operationLog.length === 0 ? (
                <p className="text-xs text-content-muted">
                  Run an operation to see the log
                </p>
              ) : (
                operationLog.map((log, i) => (
                  <div
                    key={i}
                    className={`text-xs p-2 rounded-lg ${
                      i === 0
                        ? 'bg-brand-50 dark:bg-brand-900/20 text-brand-700 dark:text-brand-300'
                        : 'bg-surface-tertiary text-content-muted'
                    }`}
                  >
                    {log}
                  </div>
                ))
              )}
            </div>
          </ControlPanel>

          <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-xl p-4 border border-emerald-200 dark:border-emerald-800">
            <h4 className="text-sm font-semibold text-emerald-800 dark:text-emerald-200 mb-2">
              When to Use
            </h4>
            <p className="text-xs text-emerald-700 dark:text-emerald-300 leading-relaxed">
              <strong>Array:</strong> Random access, known size, cache efficiency<br/>
              <strong>Linked List:</strong> Frequent insertions/deletions at ends
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
