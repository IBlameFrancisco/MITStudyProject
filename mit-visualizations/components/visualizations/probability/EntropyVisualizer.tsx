'use client';

/**
 * Entropy and Information Theory Visualizer
 * ==========================================
 * Interactive visualization of Shannon entropy, mutual information,
 * and information-theoretic concepts.
 */

import { useState, useEffect, useRef, useMemo } from 'react';
import * as d3 from 'd3';
import Slider from '@/components/ui/Slider';
import ControlPanel from '@/components/ui/ControlPanel';
import { LaTeX } from '@/components/ui/LaTeX';

type VisualizationMode = 'binary-entropy' | 'joint-entropy' | 'channel-capacity';

export default function EntropyVisualizer() {
  const svgRef = useRef<SVGSVGElement>(null);
  const vennRef = useRef<SVGSVGElement>(null);

  const [mode, setMode] = useState<VisualizationMode>('binary-entropy');
  const [p, setP] = useState(0.5);
  const [epsilon, setEpsilon] = useState(0.1); // Channel error probability
  const [pX, setPX] = useState(0.5); // P(X=1) for joint entropy

  // Binary entropy function
  const H = (prob: number): number => {
    if (prob <= 0 || prob >= 1) return 0;
    return -prob * Math.log2(prob) - (1 - prob) * Math.log2(1 - prob);
  };

  // Current entropy value
  const currentEntropy = useMemo(() => H(p), [p]);

  // Channel capacity for BSC
  const channelCapacity = useMemo(() => 1 - H(epsilon), [epsilon]);

  // Joint entropy calculations
  const jointEntropyCalcs = useMemo(() => {
    // For binary symmetric channel
    const HX = H(pX);
    const HY_given_X = H(epsilon);
    const pY = pX * (1 - epsilon) + (1 - pX) * epsilon;
    const HY = H(pY);
    const HX_given_Y = HX + HY_given_X - HY; // Using chain rule
    const I_XY = HX - HX_given_Y;
    const HXY = HX + HY_given_X;

    return { HX, HY, HX_given_Y, HY_given_X, I_XY, HXY, pY };
  }, [pX, epsilon]);

  // Draw binary entropy curve
  useEffect(() => {
    if (!svgRef.current || mode !== 'binary-entropy') return;

    const margin = { top: 40, right: 30, bottom: 50, left: 60 };
    const width = 500 - margin.left - margin.right;
    const height = 320 - margin.top - margin.bottom;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

    // Generate entropy curve data
    const data: { p: number; h: number }[] = [];
    for (let prob = 0.001; prob <= 0.999; prob += 0.005) {
      data.push({ p: prob, h: H(prob) });
    }

    const xScale = d3.scaleLinear().domain([0, 1]).range([0, width]);
    const yScale = d3.scaleLinear().domain([0, 1.1]).range([height, 0]);

    // Grid lines
    g.append('g')
      .attr('opacity', 0.1)
      .call(d3.axisLeft(yScale).tickSize(-width).tickFormat(() => ''));

    g.append('g')
      .attr('opacity', 0.1)
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(xScale).tickSize(-height).tickFormat(() => ''));

    // Area under curve
    const area = d3.area<{ p: number; h: number }>()
      .x(d => xScale(d.p))
      .y0(height)
      .y1(d => yScale(d.h))
      .curve(d3.curveMonotoneX);

    g.append('path')
      .datum(data)
      .attr('fill', '#3b82f6')
      .attr('fill-opacity', 0.15)
      .attr('d', area);

    // Entropy curve
    const line = d3.line<{ p: number; h: number }>()
      .x(d => xScale(d.p))
      .y(d => yScale(d.h))
      .curve(d3.curveMonotoneX);

    g.append('path')
      .datum(data)
      .attr('fill', 'none')
      .attr('stroke', '#3b82f6')
      .attr('stroke-width', 3)
      .attr('d', line);

    // Current point marker
    g.append('circle')
      .attr('cx', xScale(p))
      .attr('cy', yScale(currentEntropy))
      .attr('r', 8)
      .attr('fill', '#ef4444')
      .attr('stroke', 'white')
      .attr('stroke-width', 2);

    // Vertical line to point
    g.append('line')
      .attr('x1', xScale(p))
      .attr('y1', height)
      .attr('x2', xScale(p))
      .attr('y2', yScale(currentEntropy))
      .attr('stroke', '#ef4444')
      .attr('stroke-width', 1.5)
      .attr('stroke-dasharray', '4,4');

    // Horizontal line from point
    g.append('line')
      .attr('x1', 0)
      .attr('y1', yScale(currentEntropy))
      .attr('x2', xScale(p))
      .attr('y2', yScale(currentEntropy))
      .attr('stroke', '#ef4444')
      .attr('stroke-width', 1.5)
      .attr('stroke-dasharray', '4,4');

    // Maximum entropy line
    g.append('line')
      .attr('x1', 0)
      .attr('y1', yScale(1))
      .attr('x2', width)
      .attr('y2', yScale(1))
      .attr('stroke', '#10b981')
      .attr('stroke-width', 1)
      .attr('stroke-dasharray', '6,3');

    g.append('text')
      .attr('x', width - 5)
      .attr('y', yScale(1) - 5)
      .attr('text-anchor', 'end')
      .attr('class', 'text-xs fill-current text-emerald-600')
      .text('Maximum (1 bit)');

    // Axes
    g.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(xScale).ticks(10));

    g.append('g').call(d3.axisLeft(yScale).ticks(5));

    // Labels
    g.append('text')
      .attr('x', width / 2)
      .attr('y', height + 40)
      .attr('text-anchor', 'middle')
      .attr('class', 'text-sm fill-current text-content-secondary')
      .text('Probability p');

    g.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('x', -height / 2)
      .attr('y', -45)
      .attr('text-anchor', 'middle')
      .attr('class', 'text-sm fill-current text-content-secondary')
      .text('H(p) in bits');

    // Title
    g.append('text')
      .attr('x', width / 2)
      .attr('y', -15)
      .attr('text-anchor', 'middle')
      .attr('class', 'text-base font-semibold fill-current text-content-primary')
      .text('Binary Entropy Function');

  }, [p, currentEntropy, mode]);

  // Draw channel capacity visualization
  useEffect(() => {
    if (!svgRef.current || mode !== 'channel-capacity') return;

    const margin = { top: 40, right: 30, bottom: 50, left: 60 };
    const width = 500 - margin.left - margin.right;
    const height = 320 - margin.top - margin.bottom;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

    // Generate capacity curve
    const data: { eps: number; c: number }[] = [];
    for (let eps = 0.001; eps <= 0.5; eps += 0.005) {
      data.push({ eps, c: 1 - H(eps) });
    }

    const xScale = d3.scaleLinear().domain([0, 0.5]).range([0, width]);
    const yScale = d3.scaleLinear().domain([0, 1.1]).range([height, 0]);

    // Grid
    g.append('g')
      .attr('opacity', 0.1)
      .call(d3.axisLeft(yScale).tickSize(-width).tickFormat(() => ''));

    // Area
    const area = d3.area<{ eps: number; c: number }>()
      .x(d => xScale(d.eps))
      .y0(height)
      .y1(d => yScale(d.c))
      .curve(d3.curveMonotoneX);

    g.append('path')
      .datum(data)
      .attr('fill', '#10b981')
      .attr('fill-opacity', 0.15)
      .attr('d', area);

    // Capacity curve
    const line = d3.line<{ eps: number; c: number }>()
      .x(d => xScale(d.eps))
      .y(d => yScale(d.c))
      .curve(d3.curveMonotoneX);

    g.append('path')
      .datum(data)
      .attr('fill', 'none')
      .attr('stroke', '#10b981')
      .attr('stroke-width', 3)
      .attr('d', line);

    // Current point
    g.append('circle')
      .attr('cx', xScale(epsilon))
      .attr('cy', yScale(channelCapacity))
      .attr('r', 8)
      .attr('fill', '#f59e0b')
      .attr('stroke', 'white')
      .attr('stroke-width', 2);

    // Reference lines
    g.append('line')
      .attr('x1', xScale(epsilon))
      .attr('y1', height)
      .attr('x2', xScale(epsilon))
      .attr('y2', yScale(channelCapacity))
      .attr('stroke', '#f59e0b')
      .attr('stroke-width', 1.5)
      .attr('stroke-dasharray', '4,4');

    // Axes
    g.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(xScale).ticks(10));

    g.append('g').call(d3.axisLeft(yScale).ticks(5));

    // Labels
    g.append('text')
      .attr('x', width / 2)
      .attr('y', height + 40)
      .attr('text-anchor', 'middle')
      .attr('class', 'text-sm fill-current text-content-secondary')
      .text('Error Probability ε');

    g.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('x', -height / 2)
      .attr('y', -45)
      .attr('text-anchor', 'middle')
      .attr('class', 'text-sm fill-current text-content-secondary')
      .text('Channel Capacity (bits)');

    g.append('text')
      .attr('x', width / 2)
      .attr('y', -15)
      .attr('text-anchor', 'middle')
      .attr('class', 'text-base font-semibold fill-current text-content-primary')
      .text('Binary Symmetric Channel Capacity');

  }, [epsilon, channelCapacity, mode]);

  // Draw Venn diagram for joint entropy
  useEffect(() => {
    if (!vennRef.current || mode !== 'joint-entropy') return;

    const svg = d3.select(vennRef.current);
    svg.selectAll('*').remove();

    const width = 400;
    const height = 250;
    const cx1 = width / 2 - 50;
    const cx2 = width / 2 + 50;
    const cy = height / 2;
    const r = 80;

    const g = svg.append('g');

    // H(X) circle
    g.append('circle')
      .attr('cx', cx1)
      .attr('cy', cy)
      .attr('r', r)
      .attr('fill', '#3b82f6')
      .attr('fill-opacity', 0.3)
      .attr('stroke', '#3b82f6')
      .attr('stroke-width', 2);

    // H(Y) circle
    g.append('circle')
      .attr('cx', cx2)
      .attr('cy', cy)
      .attr('r', r)
      .attr('fill', '#ef4444')
      .attr('fill-opacity', 0.3)
      .attr('stroke', '#ef4444')
      .attr('stroke-width', 2);

    // Labels
    g.append('text')
      .attr('x', cx1 - 40)
      .attr('y', cy)
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'middle')
      .attr('class', 'text-sm font-semibold fill-current text-blue-700')
      .text(`H(X|Y)`);

    g.append('text')
      .attr('x', cx2 + 40)
      .attr('y', cy)
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'middle')
      .attr('class', 'text-sm font-semibold fill-current text-red-700')
      .text(`H(Y|X)`);

    g.append('text')
      .attr('x', (cx1 + cx2) / 2)
      .attr('y', cy)
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'middle')
      .attr('class', 'text-sm font-bold fill-current text-purple-700')
      .text(`I(X;Y)`);

    // External labels
    g.append('text')
      .attr('x', cx1)
      .attr('y', cy - r - 15)
      .attr('text-anchor', 'middle')
      .attr('class', 'text-base font-semibold fill-current text-blue-600')
      .text('H(X)');

    g.append('text')
      .attr('x', cx2)
      .attr('y', cy - r - 15)
      .attr('text-anchor', 'middle')
      .attr('class', 'text-base font-semibold fill-current text-red-600')
      .text('H(Y)');

    // H(X,Y) bracket
    g.append('path')
      .attr('d', `M ${cx1 - r - 10} ${cy + r + 20} L ${cx1 - r - 10} ${cy + r + 30} L ${cx2 + r + 10} ${cy + r + 30} L ${cx2 + r + 10} ${cy + r + 20}`)
      .attr('fill', 'none')
      .attr('stroke', '#6b7280')
      .attr('stroke-width', 1.5);

    g.append('text')
      .attr('x', width / 2)
      .attr('y', cy + r + 50)
      .attr('text-anchor', 'middle')
      .attr('class', 'text-sm font-semibold fill-current text-content-tertiary')
      .text('H(X,Y)');

  }, [jointEntropyCalcs, mode]);

  return (
    <div>
      <h2 className="text-xl font-semibold text-content-primary mb-2">
        Entropy & Information Theory
      </h2>
      <p className="text-sm text-content-secondary mb-6">
        Explore Shannon entropy, mutual information, and channel capacity
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 space-y-4">
          {/* Main Visualization */}
          <div className="bg-surface-tertiary rounded-2xl p-4 border border-edge-primary">
            {mode !== 'joint-entropy' ? (
              <svg ref={svgRef} width="100%" height="320" viewBox="0 0 500 320" className="text-content-secondary" />
            ) : (
              <div className="flex flex-col items-center">
                <svg ref={vennRef} width="400" height="250" className="text-content-secondary" />

                {/* Joint Entropy Values */}
                <div className="grid grid-cols-3 gap-4 mt-4 w-full max-w-lg">
                  <div className="text-center p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <div className="text-xs text-blue-600 dark:text-blue-400">H(X)</div>
                    <div className="font-bold text-blue-700 dark:text-blue-300">{jointEntropyCalcs.HX.toFixed(3)}</div>
                  </div>
                  <div className="text-center p-2 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                    <div className="text-xs text-purple-600 dark:text-purple-400">I(X;Y)</div>
                    <div className="font-bold text-purple-700 dark:text-purple-300">{jointEntropyCalcs.I_XY.toFixed(3)}</div>
                  </div>
                  <div className="text-center p-2 bg-red-50 dark:bg-red-900/20 rounded-lg">
                    <div className="text-xs text-red-600 dark:text-red-400">H(Y)</div>
                    <div className="font-bold text-red-700 dark:text-red-300">{jointEntropyCalcs.HY.toFixed(3)}</div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Formula Display */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl p-4 border border-blue-200 dark:border-blue-800">
            {mode === 'binary-entropy' && (
              <div className="text-center space-y-3">
                <p className="text-sm text-content-secondary">Binary Entropy Function:</p>
                <div className="text-brand-600 dark:text-brand-400">
                  <LaTeX math="H(p) = -p \log_2(p) - (1-p) \log_2(1-p)" />
                </div>
                <div className="text-xs text-content-muted mt-2">
                  <LaTeX math={`H(${p.toFixed(2)}) = ${currentEntropy.toFixed(4)} \\text{ bits}`} />
                </div>
              </div>
            )}
            {mode === 'channel-capacity' && (
              <div className="text-center space-y-3">
                <p className="text-sm text-content-secondary">Binary Symmetric Channel Capacity:</p>
                <div className="text-emerald-600 dark:text-emerald-400">
                  <LaTeX math="C = 1 - H(\varepsilon) = 1 + \varepsilon \log_2(\varepsilon) + (1-\varepsilon) \log_2(1-\varepsilon)" />
                </div>
                <div className="text-xs text-content-muted mt-2">
                  <LaTeX math={`C(${epsilon.toFixed(2)}) = ${channelCapacity.toFixed(4)} \\text{ bits per channel use}`} />
                </div>
              </div>
            )}
            {mode === 'joint-entropy' && (
              <div className="text-center space-y-3">
                <p className="text-sm text-content-secondary">Chain Rule & Mutual Information:</p>
                <div className="text-purple-600 dark:text-purple-400">
                  <LaTeX math="I(X;Y) = H(X) - H(X|Y) = H(Y) - H(Y|X)" />
                </div>
                <div className="text-xs text-content-muted mt-2">
                  <LaTeX math="H(X,Y) = H(X) + H(Y|X) = H(Y) + H(X|Y)" />
                </div>
              </div>
            )}
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {mode === 'binary-entropy' && (
              <>
                <div className="bg-surface-secondary rounded-xl p-3 border border-edge-primary text-center">
                  <div className="text-xs text-content-muted">Probability p</div>
                  <div className="text-lg font-bold text-brand-600 dark:text-brand-400">{p.toFixed(3)}</div>
                </div>
                <div className="bg-surface-secondary rounded-xl p-3 border border-edge-primary text-center">
                  <div className="text-xs text-content-muted">Entropy H(p)</div>
                  <div className="text-lg font-bold text-brand-600 dark:text-brand-400">{currentEntropy.toFixed(4)}</div>
                </div>
                <div className="bg-surface-secondary rounded-xl p-3 border border-edge-primary text-center">
                  <div className="text-xs text-content-muted">Max Entropy</div>
                  <div className="text-lg font-bold text-emerald-600">1.0000</div>
                </div>
                <div className="bg-surface-secondary rounded-xl p-3 border border-edge-primary text-center">
                  <div className="text-xs text-content-muted">% of Maximum</div>
                  <div className="text-lg font-bold text-content-primary">{(currentEntropy * 100).toFixed(1)}%</div>
                </div>
              </>
            )}
            {mode === 'channel-capacity' && (
              <>
                <div className="bg-surface-secondary rounded-xl p-3 border border-edge-primary text-center">
                  <div className="text-xs text-content-muted">Error Rate <LaTeX math="\varepsilon" /></div>
                  <div className="text-lg font-bold text-amber-600">{epsilon.toFixed(3)}</div>
                </div>
                <div className="bg-surface-secondary rounded-xl p-3 border border-edge-primary text-center">
                  <div className="text-xs text-content-muted">Capacity C</div>
                  <div className="text-lg font-bold text-emerald-600">{channelCapacity.toFixed(4)}</div>
                </div>
                <div className="bg-surface-secondary rounded-xl p-3 border border-edge-primary text-center">
                  <div className="text-xs text-content-muted"><LaTeX math="H(\varepsilon)" /></div>
                  <div className="text-lg font-bold text-blue-600">{H(epsilon).toFixed(4)}</div>
                </div>
                <div className="bg-surface-secondary rounded-xl p-3 border border-edge-primary text-center">
                  <div className="text-xs text-content-muted">Info Loss</div>
                  <div className="text-lg font-bold text-red-600">{(H(epsilon) * 100).toFixed(1)}%</div>
                </div>
              </>
            )}
            {mode === 'joint-entropy' && (
              <>
                <div className="bg-surface-secondary rounded-xl p-3 border border-edge-primary text-center">
                  <div className="text-xs text-content-muted"><LaTeX math="H(X,Y)" /></div>
                  <div className="text-lg font-bold text-content-tertiary">{jointEntropyCalcs.HXY.toFixed(4)}</div>
                </div>
                <div className="bg-surface-secondary rounded-xl p-3 border border-edge-primary text-center">
                  <div className="text-xs text-content-muted"><LaTeX math="H(X|Y)" /></div>
                  <div className="text-lg font-bold text-blue-600">{jointEntropyCalcs.HX_given_Y.toFixed(4)}</div>
                </div>
                <div className="bg-surface-secondary rounded-xl p-3 border border-edge-primary text-center">
                  <div className="text-xs text-content-muted"><LaTeX math="H(Y|X)" /></div>
                  <div className="text-lg font-bold text-red-600">{jointEntropyCalcs.HY_given_X.toFixed(4)}</div>
                </div>
                <div className="bg-surface-secondary rounded-xl p-3 border border-edge-primary text-center">
                  <div className="text-xs text-content-muted"><LaTeX math="I(X;Y)" /></div>
                  <div className="text-lg font-bold text-purple-600">{jointEntropyCalcs.I_XY.toFixed(4)}</div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Controls */}
        <div className="space-y-4">
          <ControlPanel title="Visualization Mode">
            <select
              value={mode}
              onChange={(e) => setMode(e.target.value as VisualizationMode)}
              className="w-full px-3 py-2 rounded-xl border border-edge-primary bg-surface-secondary text-content-primary text-sm"
            >
              <option value="binary-entropy">Binary Entropy</option>
              <option value="channel-capacity">Channel Capacity</option>
              <option value="joint-entropy">Joint Entropy (Venn)</option>
            </select>
          </ControlPanel>

          <ControlPanel title="Parameters">
            {mode === 'binary-entropy' && (
              <Slider
                label="Probability p"
                value={p}
                onChange={(e) => setP(Number(e.target.value))}
                min={0.01}
                max={0.99}
                step={0.01}
              />
            )}
            {mode === 'channel-capacity' && (
              <Slider
                label="Error Probability ε"
                value={epsilon}
                onChange={(e) => setEpsilon(Number(e.target.value))}
                min={0.01}
                max={0.5}
                step={0.01}
              />
            )}
            {mode === 'joint-entropy' && (
              <>
                <Slider
                  label="P(X=1)"
                  value={pX}
                  onChange={(e) => setPX(Number(e.target.value))}
                  min={0.1}
                  max={0.9}
                  step={0.05}
                />
                <Slider
                  label="Channel Error ε"
                  value={epsilon}
                  onChange={(e) => setEpsilon(Number(e.target.value))}
                  min={0.01}
                  max={0.5}
                  step={0.01}
                />
              </>
            )}
          </ControlPanel>

          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 border border-blue-200 dark:border-blue-800">
            <h4 className="text-sm font-semibold text-blue-800 dark:text-blue-200 mb-2">
              Key Insights
            </h4>
            {mode === 'binary-entropy' && (
              <div className="text-xs text-blue-700 dark:text-blue-300 leading-relaxed space-y-2">
                <p>Entropy is maximized at <LaTeX math="p = 0.5" /> (1 bit) when uncertainty is greatest.</p>
                <p>Entropy is 0 when <LaTeX math="p = 0" /> or <LaTeX math="p = 1" /> (no uncertainty).</p>
              </div>
            )}
            {mode === 'channel-capacity' && (
              <div className="text-xs text-blue-700 dark:text-blue-300 leading-relaxed space-y-2">
                <p>At <LaTeX math="\varepsilon = 0" />, capacity = 1 bit (perfect channel).</p>
                <p>At <LaTeX math="\varepsilon = 0.5" />, capacity = 0 (pure noise).</p>
              </div>
            )}
            {mode === 'joint-entropy' && (
              <div className="text-xs text-blue-700 dark:text-blue-300 leading-relaxed space-y-2">
                <p>Mutual information <LaTeX math="I(X;Y)" /> is the overlap in the Venn diagram.</p>
                <p>If <LaTeX math="X \perp Y" />, then <LaTeX math="I(X;Y) = 0" />.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
