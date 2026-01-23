'use client';

/**
 * Hash Table Visualizer
 * =====================
 * Interactive visualization of hash tables with chaining and open addressing.
 */

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ControlPanel from '@/components/ui/ControlPanel';
import { LaTeX } from '@/components/ui/LaTeX';

type CollisionMethod = 'chaining' | 'linear' | 'quadratic';
type SlotState = 'empty' | 'occupied' | 'deleted' | 'probing' | 'found';

interface ChainNode {
  key: number;
  id: number;
}

interface TableSlot {
  chains: ChainNode[];  // For chaining
  key: number | null;   // For open addressing
  state: SlotState;
}

export default function HashTableVisualizer() {
  const [tableSize, setTableSize] = useState(11);
  const [method, setMethod] = useState<CollisionMethod>('chaining');
  const [table, setTable] = useState<TableSlot[]>(() =>
    Array(11).fill(null).map(() => ({ chains: [], key: null, state: 'empty' }))
  );
  const [inputKey, setInputKey] = useState('');
  const [lastOperation, setLastOperation] = useState<string>('');
  const [probeSequence, setProbeSequence] = useState<number[]>([]);
  const [nextId, setNextId] = useState(1);

  const hash = (key: number): number => key % tableSize;

  const resetTable = useCallback(() => {
    setTable(Array(tableSize).fill(null).map(() => ({
      chains: [],
      key: null,
      state: 'empty'
    })));
    setLastOperation('');
    setProbeSequence([]);
  }, [tableSize]);

  const insert = async (key: number) => {
    const newTable: TableSlot[] = [...table.map(s => ({ ...s, chains: [...s.chains], state: 'empty' as SlotState }))];
    const h = hash(key);
    const probes: number[] = [];

    if (method === 'chaining') {
      probes.push(h);
      newTable[h].chains.push({ key, id: nextId });
      setNextId(prev => prev + 1);
      newTable[h].state = 'found' as SlotState;
      setLastOperation(`Insert ${key}: h(${key}) = ${key} mod ${tableSize} = ${h}`);
    } else {
      // Open addressing
      let i = 0;
      let slot = h;

      while (newTable[slot].key !== null && newTable[slot].state !== 'deleted' && i < tableSize) {
        probes.push(slot);
        newTable[slot].state = 'probing' as SlotState;

        i++;
        if (method === 'linear') {
          slot = (h + i) % tableSize;
        } else {
          slot = (h + i * i) % tableSize;
        }
      }

      if (i < tableSize) {
        probes.push(slot);
        newTable[slot].key = key;
        newTable[slot].state = 'found' as SlotState;
        setLastOperation(`Insert ${key}: h(${key}) = ${h}, ${i > 0 ? `${i} collisions, ` : ''}placed at slot ${slot}`);
      } else {
        setLastOperation(`Insert ${key}: Table full!`);
      }
    }

    setProbeSequence(probes);
    setTable(newTable);
  };

  const search = async (key: number) => {
    const newTable: TableSlot[] = [...table.map(s => ({ ...s, chains: [...s.chains], state: 'empty' as SlotState }))];
    const h = hash(key);
    const probes: number[] = [];
    let found = false;

    if (method === 'chaining') {
      probes.push(h);
      const chainItem = newTable[h].chains.find(item => item.key === key);
      if (chainItem) {
        found = true;
        newTable[h].state = 'found' as SlotState;
      } else {
        newTable[h].state = 'probing' as SlotState;
      }
      setLastOperation(`Search ${key}: h(${key}) = ${h}, ${found ? 'FOUND' : 'NOT FOUND'}`);
    } else {
      let i = 0;
      let slot = h;

      while (i < tableSize) {
        probes.push(slot);

        if (newTable[slot].key === null && newTable[slot].state !== 'deleted') {
          newTable[slot].state = 'probing' as SlotState;
          break; // Empty slot - key not in table
        }

        if (newTable[slot].key === key) {
          found = true;
          newTable[slot].state = 'found' as SlotState;
          break;
        }

        newTable[slot].state = 'probing' as SlotState;
        i++;
        if (method === 'linear') {
          slot = (h + i) % tableSize;
        } else {
          slot = (h + i * i) % tableSize;
        }
      }

      setLastOperation(`Search ${key}: h(${key}) = ${h}, probed ${probes.length} slot(s), ${found ? 'FOUND' : 'NOT FOUND'}`);
    }

    setProbeSequence(probes);
    setTable(newTable);
  };

  const deleteKey = async (key: number) => {
    const newTable: TableSlot[] = [...table.map(s => ({ ...s, chains: [...s.chains], state: 'empty' as SlotState }))];
    const h = hash(key);
    const probes: number[] = [];
    let deleted = false;

    if (method === 'chaining') {
      probes.push(h);
      const idx = newTable[h].chains.findIndex(item => item.key === key);
      if (idx !== -1) {
        newTable[h].chains.splice(idx, 1);
        deleted = true;
        newTable[h].state = 'found' as SlotState;
      } else {
        newTable[h].state = 'probing' as SlotState;
      }
      setLastOperation(`Delete ${key}: h(${key}) = ${h}, ${deleted ? 'DELETED' : 'NOT FOUND'}`);
    } else {
      let i = 0;
      let slot = h;

      while (i < tableSize) {
        probes.push(slot);

        if (newTable[slot].key === null && newTable[slot].state !== 'deleted') {
          break;
        }

        if (newTable[slot].key === key) {
          newTable[slot].key = null;
          newTable[slot].state = 'deleted' as SlotState;
          deleted = true;
          break;
        }

        newTable[slot].state = 'probing' as SlotState;
        i++;
        if (method === 'linear') {
          slot = (h + i) % tableSize;
        } else {
          slot = (h + i * i) % tableSize;
        }
      }

      setLastOperation(`Delete ${key}: ${deleted ? 'DELETED' : 'NOT FOUND'}`);
    }

    setProbeSequence(probes);
    setTable(newTable);
  };

  const handleOperation = (op: 'insert' | 'search' | 'delete') => {
    const key = parseInt(inputKey);
    if (isNaN(key) || key < 0) return;

    if (op === 'insert') insert(key);
    else if (op === 'search') search(key);
    else deleteKey(key);

    setInputKey('');
  };

  const loadFactor = table.reduce((acc, slot) =>
    acc + (method === 'chaining' ? slot.chains.length : (slot.key !== null ? 1 : 0)), 0
  ) / tableSize;

  return (
    <div>
      <h2 className="text-xl font-semibold text-content-primary mb-2">
        Hash Table Visualizer
      </h2>
      <p className="text-sm text-content-secondary mb-6">
        Explore collision resolution with chaining and open addressing
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 space-y-4">
          {/* Method Selection */}
          <div className="flex gap-2 flex-wrap">
            {(['chaining', 'linear', 'quadratic'] as const).map((m) => (
              <button
                key={m}
                onClick={() => { setMethod(m); resetTable(); }}
                className={`px-4 py-2 rounded-xl font-medium text-sm transition-all ${
                  method === m
                    ? 'bg-green-500 text-white shadow-lg'
                    : 'bg-surface-tertiary text-content-secondary hover:bg-surface-accent border border-edge-primary'
                }`}
              >
                {m === 'chaining' ? 'Chaining' : m === 'linear' ? 'Linear Probing' : 'Quadratic Probing'}
              </button>
            ))}
          </div>

          {/* Hash Table Visualization */}
          <div className="bg-surface-tertiary rounded-2xl p-6 border border-edge-primary">
            <div className="space-y-2">
              {table.map((slot, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <span className="w-8 text-xs font-mono text-content-muted">[{idx}]</span>
                  <motion.div
                    className={`flex-1 min-h-[40px] rounded-lg border-2 flex items-center px-3 transition-colors ${
                      slot.state === 'found' ? 'bg-green-100 dark:bg-green-900/30 border-green-500' :
                      slot.state === 'probing' ? 'bg-yellow-100 dark:bg-yellow-900/30 border-yellow-500' :
                      slot.state === 'deleted' ? 'bg-red-100 dark:bg-red-900/30 border-red-400' :
                      'bg-surface-secondary border-edge-primary'
                    }`}
                  >
                    {method === 'chaining' ? (
                      <div className="flex items-center gap-2">
                        <AnimatePresence>
                          {slot.chains.map((item, i) => (
                            <motion.div
                              key={item.id}
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              exit={{ scale: 0 }}
                              className="flex items-center"
                            >
                              <span className="px-3 py-1 bg-green-500 text-white rounded font-mono text-sm">
                                {item.key}
                              </span>
                              {i < slot.chains.length - 1 && (
                                <span className="mx-1 text-content-muted">→</span>
                              )}
                            </motion.div>
                          ))}
                        </AnimatePresence>
                        {slot.chains.length === 0 && (
                          <span className="text-content-muted text-sm">empty</span>
                        )}
                      </div>
                    ) : (
                      <span className={`font-mono ${slot.key !== null ? 'text-content-primary' : 'text-content-muted'}`}>
                        {slot.state === 'deleted' ? 'DELETED' : slot.key !== null ? slot.key : 'empty'}
                      </span>
                    )}
                  </motion.div>
                </div>
              ))}
            </div>
          </div>

          {/* Operation Result */}
          {lastOperation && (
            <div className="bg-surface-secondary rounded-xl p-4 border border-edge-primary">
              <span className="text-sm text-content-primary font-mono">{lastOperation}</span>
              {probeSequence.length > 1 && (
                <div className="mt-2 text-xs text-content-muted">
                  Probe sequence: [{probeSequence.join(' → ')}]
                </div>
              )}
            </div>
          )}

          {/* Hash Function Display */}
          <div className="bg-surface-secondary rounded-xl p-4 border border-edge-primary">
            <h4 className="text-sm font-semibold text-content-primary mb-2">Hash Function</h4>
            <div className="flex items-center gap-4">
              <LaTeX math={`h(k) = k \\mod ${tableSize}`} />
              <span className="text-sm text-content-muted">
                Load factor α = {loadFactor.toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="space-y-4">
          <ControlPanel title="Operations">
            <div className="space-y-3">
              <input
                type="number"
                value={inputKey}
                onChange={(e) => setInputKey(e.target.value)}
                placeholder="Enter key (integer)"
                className="w-full px-3 py-2 rounded-lg border border-edge-primary bg-surface-secondary text-content-primary"
              />
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => handleOperation('insert')}
                  className="px-3 py-2 rounded-lg bg-green-500 text-white text-sm font-medium hover:bg-green-600"
                >
                  Insert
                </button>
                <button
                  onClick={() => handleOperation('search')}
                  className="px-3 py-2 rounded-lg bg-blue-500 text-white text-sm font-medium hover:bg-blue-600"
                >
                  Search
                </button>
                <button
                  onClick={() => handleOperation('delete')}
                  className="px-3 py-2 rounded-lg bg-red-500 text-white text-sm font-medium hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
              <button
                onClick={resetTable}
                className="w-full px-3 py-2 rounded-lg bg-surface-tertiary border border-edge-primary text-content-secondary text-sm font-medium hover:bg-surface-accent"
              >
                Clear Table
              </button>
            </div>
          </ControlPanel>

          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 border border-blue-200 dark:border-blue-800">
            <h4 className="text-sm font-semibold text-blue-800 dark:text-blue-200 mb-2">
              {method === 'chaining' ? 'Chaining' : method === 'linear' ? 'Linear Probing' : 'Quadratic Probing'}
            </h4>
            <p className="text-xs text-blue-700 dark:text-blue-300 leading-relaxed">
              {method === 'chaining'
                ? 'Each slot holds a linked list. Collisions are resolved by appending to the list.'
                : method === 'linear'
                ? 'h(k,i) = (h(k) + i) mod m. Can cause primary clustering.'
                : 'h(k,i) = (h(k) + i²) mod m. Reduces clustering but may not probe all slots.'}
            </p>
          </div>

          <div className="bg-amber-50 dark:bg-amber-900/20 rounded-xl p-4 border border-amber-200 dark:border-amber-800">
            <h4 className="text-sm font-semibold text-amber-800 dark:text-amber-200 mb-2">
              Time Complexity
            </h4>
            <p className="text-xs text-amber-700 dark:text-amber-300">
              Expected: <LaTeX math="O(1 + \alpha)" /> where <LaTeX math="\alpha = n/m" />
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
