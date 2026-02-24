'use client';

import { useState, useEffect, useRef } from 'react';
import * as d3 from 'd3';
import Slider from '@/components/ui/Slider';
import ControlPanel from '@/components/ui/ControlPanel';

interface TreeNode {
  name: string;
  probability: number;
  cumulativeProbability: number;
  children?: TreeNode[];
  x?: number;
  y?: number;
}

export default function ProbabilityTree() {
  const svgRef = useRef<SVGSVGElement>(null);
  const [p1, setP1] = useState(0.6); // Probability of first event (e.g., rain)
  const [p2GivenE1, setP2GivenE1] = useState(0.7); // P(E2|E1)
  const [p2GivenNotE1, setP2GivenNotE1] = useState(0.3); // P(E2|not E1)
  const [selectedPath, setSelectedPath] = useState<string | null>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const width = 700;
    const height = 400;
    const margin = { top: 40, right: 120, bottom: 40, left: 60 };

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    // Build tree data
    const treeData: TreeNode = {
      name: 'Start',
      probability: 1,
      cumulativeProbability: 1,
      children: [
        {
          name: 'E₁',
          probability: p1,
          cumulativeProbability: p1,
          children: [
            {
              name: 'E₂|E₁',
              probability: p2GivenE1,
              cumulativeProbability: p1 * p2GivenE1,
            },
            {
              name: '¬E₂|E₁',
              probability: 1 - p2GivenE1,
              cumulativeProbability: p1 * (1 - p2GivenE1),
            },
          ],
        },
        {
          name: '¬E₁',
          probability: 1 - p1,
          cumulativeProbability: 1 - p1,
          children: [
            {
              name: 'E₂|¬E₁',
              probability: p2GivenNotE1,
              cumulativeProbability: (1 - p1) * p2GivenNotE1,
            },
            {
              name: '¬E₂|¬E₁',
              probability: 1 - p2GivenNotE1,
              cumulativeProbability: (1 - p1) * (1 - p2GivenNotE1),
            },
          ],
        },
      ],
    };

    const g = svg
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    const treeLayout = d3.tree<TreeNode>().size([
      height - margin.top - margin.bottom,
      width - margin.left - margin.right,
    ]);

    const root = d3.hierarchy(treeData);
    const treeNodes = treeLayout(root);

    // Draw links
    g.selectAll('.link')
      .data(treeNodes.links())
      .join('path')
      .attr('class', 'link')
      .attr('fill', 'none')
      .attr('stroke', (d) => {
        const targetName = d.target.data.name;
        if (selectedPath && targetName.includes(selectedPath)) {
          return '#3b82f6';
        }
        return '#94a3b8';
      })
      .attr('stroke-width', (d) => {
        const targetName = d.target.data.name;
        if (selectedPath && targetName.includes(selectedPath)) {
          return 3;
        }
        return 2;
      })
      .attr('d', (d) => {
        return `M${d.source.y},${d.source.x}
                C${(d.source.y + d.target.y) / 2},${d.source.x}
                 ${(d.source.y + d.target.y) / 2},${d.target.x}
                 ${d.target.y},${d.target.x}`;
      });

    // Add probability labels on edges
    g.selectAll('.edge-label')
      .data(treeNodes.links())
      .join('text')
      .attr('class', 'edge-label')
      .attr('x', (d) => (d.source.y + d.target.y) / 2)
      .attr('y', (d) => (d.source.x + d.target.x) / 2 - 10)
      .attr('text-anchor', 'middle')
      .attr('fill', '#374151')
      .attr('font-size', '12px')
      .attr('font-weight', 'bold')
      .text((d) => d.target.data.probability.toFixed(2));

    // Draw nodes
    const nodeGroups = g
      .selectAll('.node')
      .data(treeNodes.descendants())
      .join('g')
      .attr('class', 'node')
      .attr('transform', (d) => `translate(${d.y},${d.x})`);

    nodeGroups
      .append('circle')
      .attr('r', 25)
      .attr('fill', (d) => {
        if (d.data.name === 'Start') return '#6b7280';
        if (d.data.name.includes('¬')) return '#ef4444';
        return '#22c55e';
      })
      .attr('stroke', '#1e293b')
      .attr('stroke-width', 2);

    nodeGroups
      .append('text')
      .attr('dy', '0.35em')
      .attr('text-anchor', 'middle')
      .attr('fill', 'white')
      .attr('font-weight', 'bold')
      .attr('font-size', '11px')
      .text((d) => d.data.name);

    // Add cumulative probability for leaf nodes
    nodeGroups
      .filter((d) => !d.children)
      .append('text')
      .attr('x', 35)
      .attr('dy', '0.35em')
      .attr('fill', '#374151')
      .attr('font-size', '12px')
      .text((d) => `P = ${d.data.cumulativeProbability.toFixed(4)}`);

  }, [p1, p2GivenE1, p2GivenNotE1, selectedPath]);

  // Calculate total probability of E2
  const pE2 = p1 * p2GivenE1 + (1 - p1) * p2GivenNotE1;

  // Calculate P(E1|E2) using Bayes' theorem
  const pE1GivenE2 = (p2GivenE1 * p1) / pE2;

  return (
    <div>
      <h2 className="text-xl font-semibold text-content-primary mb-4">
        Probability Tree & Bayes Theorem
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <div className="bg-surface-tertiary rounded-lg p-4 overflow-x-auto">
            <svg
              ref={svgRef}
              width="100%"
              height="400"
              viewBox="0 0 700 400"
              className="text-content-secondary"
            />
          </div>

          <div className="mt-4 grid grid-cols-2 gap-4">
            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <h3 className="text-sm font-semibold text-green-800 dark:text-green-200 mb-2">
                Law of Total Probability
              </h3>
              <p className="text-sm text-green-700 dark:text-green-300 font-mono">
                P(E₂) = P(E₂|E₁)P(E₁) + P(E₂|¬E₁)P(¬E₁)
              </p>
              <p className="text-sm text-green-700 dark:text-green-300 mt-1">
                P(E₂) = {p2GivenE1.toFixed(2)} × {p1.toFixed(2)} + {p2GivenNotE1.toFixed(2)} × {(1-p1).toFixed(2)} = <strong>{pE2.toFixed(4)}</strong>
              </p>
            </div>
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <h3 className="text-sm font-semibold text-blue-800 dark:text-blue-200 mb-2">
                Bayes&apos; Theorem
              </h3>
              <p className="text-sm text-blue-700 dark:text-blue-300 font-mono">
                P(E₁|E₂) = P(E₂|E₁)P(E₁) / P(E₂)
              </p>
              <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                P(E₁|E₂) = {p2GivenE1.toFixed(2)} × {p1.toFixed(2)} / {pE2.toFixed(4)} = <strong>{pE1GivenE2.toFixed(4)}</strong>
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <ControlPanel title="Probabilities">
            <Slider
              label="P(E₁)"
              value={p1}
              onChange={(e) => setP1(Number(e.target.value))}
              min={0.01}
              max={0.99}
              step={0.01}
            />
            <Slider
              label="P(E₂|E₁)"
              value={p2GivenE1}
              onChange={(e) => setP2GivenE1(Number(e.target.value))}
              min={0.01}
              max={0.99}
              step={0.01}
            />
            <Slider
              label="P(E₂|¬E₁)"
              value={p2GivenNotE1}
              onChange={(e) => setP2GivenNotE1(Number(e.target.value))}
              min={0.01}
              max={0.99}
              step={0.01}
            />
          </ControlPanel>

          <ControlPanel title="Joint Probabilities">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-green-600">P(E₁ ∩ E₂):</span>
                <span className="font-medium">{(p1 * p2GivenE1).toFixed(4)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-red-600">P(E₁ ∩ ¬E₂):</span>
                <span className="font-medium">{(p1 * (1 - p2GivenE1)).toFixed(4)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-green-600">P(¬E₁ ∩ E₂):</span>
                <span className="font-medium">{((1 - p1) * p2GivenNotE1).toFixed(4)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-red-600">P(¬E₁ ∩ ¬E₂):</span>
                <span className="font-medium">{((1 - p1) * (1 - p2GivenNotE1)).toFixed(4)}</span>
              </div>
              <hr className="border-edge-primary" />
              <div className="flex justify-between font-medium">
                <span>Sum:</span>
                <span>1.0000</span>
              </div>
            </div>
          </ControlPanel>

          <ControlPanel title="Legend">
            <div className="space-y-2 text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-green-500 rounded-full" />
                <span className="text-content-secondary">Event occurs</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-red-500 rounded-full" />
                <span className="text-content-secondary">Event doesn&apos;t occur</span>
              </div>
            </div>
          </ControlPanel>
        </div>
      </div>
    </div>
  );
}
