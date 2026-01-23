'use client';

/**
 * Joint Distribution Visualizer
 * ==============================
 * Interactive visualization of 2D joint distributions with marginals.
 */

import { useState, useEffect, useRef, useMemo } from 'react';
import * as d3 from 'd3';
import Slider from '@/components/ui/Slider';
import ControlPanel from '@/components/ui/ControlPanel';
import { LaTeX } from '@/components/ui/LaTeX';

type JointType = 'independent' | 'positiveCorr' | 'negativeCorr' | 'custom';

export default function JointDistribution() {
  const heatmapRef = useRef<SVGSVGElement>(null);
  const marginalXRef = useRef<SVGSVGElement>(null);
  const marginalYRef = useRef<SVGSVGElement>(null);

  const [jointType, setJointType] = useState<JointType>('independent');
  const [highlightX, setHighlightX] = useState<number | null>(null);
  const [highlightY, setHighlightY] = useState<number | null>(null);

  // Parameters for independent case
  const [pX, setPX] = useState([0.2, 0.3, 0.3, 0.2]); // P(X=1,2,3,4)
  const [pY, setPY] = useState([0.25, 0.25, 0.25, 0.25]); // P(Y=1,2,3,4)

  // Generate joint distribution based on type
  const jointPMF = useMemo(() => {
    const n = 4;
    const joint: number[][] = Array(n).fill(0).map(() => Array(n).fill(0));

    if (jointType === 'independent') {
      // P(X=x, Y=y) = P(X=x) * P(Y=y)
      for (let x = 0; x < n; x++) {
        for (let y = 0; y < n; y++) {
          joint[y][x] = pX[x] * pY[y];
        }
      }
    } else if (jointType === 'positiveCorr') {
      // Higher probability on diagonal (positive correlation)
      const base = 0.03;
      const diag = 0.15;
      for (let x = 0; x < n; x++) {
        for (let y = 0; y < n; y++) {
          joint[y][x] = x === y ? diag : base;
        }
      }
      // Normalize
      const sum = joint.flat().reduce((a, b) => a + b, 0);
      for (let x = 0; x < n; x++) {
        for (let y = 0; y < n; y++) {
          joint[y][x] /= sum;
        }
      }
    } else if (jointType === 'negativeCorr') {
      // Higher probability on anti-diagonal (negative correlation)
      const base = 0.03;
      const antiDiag = 0.15;
      for (let x = 0; x < n; x++) {
        for (let y = 0; y < n; y++) {
          joint[y][x] = x + y === n - 1 ? antiDiag : base;
        }
      }
      // Normalize
      const sum = joint.flat().reduce((a, b) => a + b, 0);
      for (let x = 0; x < n; x++) {
        for (let y = 0; y < n; y++) {
          joint[y][x] /= sum;
        }
      }
    } else {
      // Custom - bell-shaped centered
      for (let x = 0; x < n; x++) {
        for (let y = 0; y < n; y++) {
          const dist = Math.abs(x - 1.5) + Math.abs(y - 1.5);
          joint[y][x] = Math.exp(-dist);
        }
      }
      // Normalize
      const sum = joint.flat().reduce((a, b) => a + b, 0);
      for (let x = 0; x < n; x++) {
        for (let y = 0; y < n; y++) {
          joint[y][x] /= sum;
        }
      }
    }

    return joint;
  }, [jointType, pX, pY]);

  // Calculate marginal distributions
  const marginals = useMemo(() => {
    const n = 4;
    const marginalX: number[] = Array(n).fill(0);
    const marginalY: number[] = Array(n).fill(0);

    for (let x = 0; x < n; x++) {
      for (let y = 0; y < n; y++) {
        marginalX[x] += jointPMF[y][x];
        marginalY[y] += jointPMF[y][x];
      }
    }

    return { marginalX, marginalY };
  }, [jointPMF]);

  // Calculate covariance and correlation
  const stats = useMemo(() => {
    const n = 4;
    let eX = 0, eY = 0, eXY = 0, eX2 = 0, eY2 = 0;

    for (let x = 0; x < n; x++) {
      for (let y = 0; y < n; y++) {
        const p = jointPMF[y][x];
        eX += (x + 1) * p;
        eY += (y + 1) * p;
        eXY += (x + 1) * (y + 1) * p;
        eX2 += (x + 1) * (x + 1) * p;
        eY2 += (y + 1) * (y + 1) * p;
      }
    }

    const varX = eX2 - eX * eX;
    const varY = eY2 - eY * eY;
    const cov = eXY - eX * eY;
    const corr = varX > 0 && varY > 0 ? cov / Math.sqrt(varX * varY) : 0;

    return { eX, eY, varX, varY, cov, corr };
  }, [jointPMF]);

  // Draw heatmap
  useEffect(() => {
    if (!heatmapRef.current) return;

    const margin = { top: 20, right: 20, bottom: 40, left: 40 };
    const size = 280;
    const width = size - margin.left - margin.right;
    const height = size - margin.top - margin.bottom;
    const n = 4;

    const svg = d3.select(heatmapRef.current);
    svg.selectAll('*').remove();

    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

    const cellSize = width / n;
    const maxProb = Math.max(...jointPMF.flat());

    // Color scale
    const colorScale = d3.scaleSequential()
      .domain([0, maxProb])
      .interpolator(d3.interpolateOranges);

    // Draw cells
    for (let x = 0; x < n; x++) {
      for (let y = 0; y < n; y++) {
        const prob = jointPMF[y][x];
        const isHighlighted = highlightX === x || highlightY === y;

        g.append('rect')
          .attr('x', x * cellSize)
          .attr('y', y * cellSize)
          .attr('width', cellSize - 2)
          .attr('height', cellSize - 2)
          .attr('rx', 4)
          .attr('fill', colorScale(prob))
          .attr('stroke', isHighlighted ? '#ef4444' : 'rgba(255,255,255,0.3)')
          .attr('stroke-width', isHighlighted ? 2 : 1)
          .style('cursor', 'pointer')
          .on('mouseenter', () => {
            setHighlightX(x);
            setHighlightY(y);
          })
          .on('mouseleave', () => {
            setHighlightX(null);
            setHighlightY(null);
          });

        // Probability text
        g.append('text')
          .attr('x', x * cellSize + cellSize / 2)
          .attr('y', y * cellSize + cellSize / 2)
          .attr('text-anchor', 'middle')
          .attr('dominant-baseline', 'middle')
          .attr('font-size', '11px')
          .attr('font-weight', '500')
          .attr('fill', prob > maxProb * 0.5 ? 'white' : '#1c1917')
          .text(prob.toFixed(3));
      }
    }

    // X axis labels
    for (let x = 0; x < n; x++) {
      g.append('text')
        .attr('x', x * cellSize + cellSize / 2)
        .attr('y', height + 20)
        .attr('text-anchor', 'middle')
        .attr('font-size', '12px')
        .attr('class', 'fill-current text-content-secondary')
        .text(`X=${x + 1}`);
    }

    // Y axis labels
    for (let y = 0; y < n; y++) {
      g.append('text')
        .attr('x', -10)
        .attr('y', y * cellSize + cellSize / 2)
        .attr('text-anchor', 'end')
        .attr('dominant-baseline', 'middle')
        .attr('font-size', '12px')
        .attr('class', 'fill-current text-content-secondary')
        .text(`Y=${y + 1}`);
    }

  }, [jointPMF, highlightX, highlightY]);

  // Draw marginal X
  useEffect(() => {
    if (!marginalXRef.current) return;

    const margin = { top: 10, right: 20, bottom: 20, left: 40 };
    const width = 280 - margin.left - margin.right;
    const height = 80 - margin.top - margin.bottom;
    const n = 4;

    const svg = d3.select(marginalXRef.current);
    svg.selectAll('*').remove();

    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

    const barWidth = width / n - 4;
    const yScale = d3.scaleLinear().domain([0, Math.max(...marginals.marginalX) * 1.2]).range([height, 0]);

    g.selectAll('.bar')
      .data(marginals.marginalX)
      .join('rect')
      .attr('x', (_, i) => i * (width / n) + 2)
      .attr('y', (d) => yScale(d))
      .attr('width', barWidth)
      .attr('height', (d) => height - yScale(d))
      .attr('fill', (_, i) => highlightX === i ? '#ef4444' : '#3b82f6')
      .attr('fill-opacity', 0.7)
      .attr('rx', 3);

    // Labels
    g.selectAll('.label')
      .data(marginals.marginalX)
      .join('text')
      .attr('x', (_, i) => i * (width / n) + barWidth / 2 + 2)
      .attr('y', height + 15)
      .attr('text-anchor', 'middle')
      .attr('font-size', '10px')
      .attr('class', 'fill-current text-content-muted')
      .text((d) => d.toFixed(2));

  }, [marginals.marginalX, highlightX]);

  // Draw marginal Y
  useEffect(() => {
    if (!marginalYRef.current) return;

    const margin = { top: 20, right: 10, bottom: 40, left: 10 };
    const width = 80 - margin.left - margin.right;
    const height = 280 - margin.top - margin.bottom;
    const n = 4;

    const svg = d3.select(marginalYRef.current);
    svg.selectAll('*').remove();

    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

    const barHeight = height / n - 4;
    const xScale = d3.scaleLinear().domain([0, Math.max(...marginals.marginalY) * 1.2]).range([0, width]);

    g.selectAll('.bar')
      .data(marginals.marginalY)
      .join('rect')
      .attr('x', 0)
      .attr('y', (_, i) => i * (height / n) + 2)
      .attr('width', (d) => xScale(d))
      .attr('height', barHeight)
      .attr('fill', (_, i) => highlightY === i ? '#ef4444' : '#22c55e')
      .attr('fill-opacity', 0.7)
      .attr('rx', 3);

    // Labels
    g.selectAll('.label')
      .data(marginals.marginalY)
      .join('text')
      .attr('x', width + 5)
      .attr('y', (_, i) => i * (height / n) + barHeight / 2 + 2)
      .attr('dominant-baseline', 'middle')
      .attr('font-size', '10px')
      .attr('class', 'fill-current text-content-muted')
      .text((d) => d.toFixed(2));

  }, [marginals.marginalY, highlightY]);

  return (
    <div>
      <h2 className="text-xl font-semibold text-content-primary mb-2">
        Joint Distribution Visualizer
      </h2>
      <p className="text-sm text-content-secondary mb-6">
        Explore joint PMF and marginal distributions
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          {/* Main visualization area */}
          <div className="bg-surface-tertiary rounded-2xl p-6 border border-edge-primary">
            <div className="flex items-start gap-4">
              {/* Joint PMF heatmap */}
              <div>
                <h4 className="text-xs font-semibold text-content-muted mb-2 text-center">
                  Joint PMF: P(X=x, Y=y)
                </h4>
                <svg ref={heatmapRef} width="280" height="280" />
              </div>

              {/* Marginal Y */}
              <div>
                <h4 className="text-xs font-semibold text-content-muted mb-2 text-center">
                  P(Y=y)
                </h4>
                <svg ref={marginalYRef} width="80" height="280" />
              </div>
            </div>

            {/* Marginal X */}
            <div className="mt-4 ml-10">
              <h4 className="text-xs font-semibold text-content-muted mb-2">
                Marginal Distribution P(X=x)
              </h4>
              <svg ref={marginalXRef} width="280" height="80" />
            </div>
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-3 gap-4 mt-4">
            <div className="bg-surface-secondary rounded-xl p-4 border border-edge-primary text-center">
              <div className="text-xs text-content-muted mb-1">Covariance</div>
              <div className="text-xl font-bold text-content-primary">{stats.cov.toFixed(4)}</div>
              <div className="text-xs text-content-muted mt-1">
                <LaTeX math="\text{Cov}(X,Y)" />
              </div>
            </div>

            <div className={`rounded-xl p-4 border text-center ${
              stats.corr > 0.1
                ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800'
                : stats.corr < -0.1
                  ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
                  : 'bg-surface-secondary border-edge-primary'
            }`}>
              <div className="text-xs text-content-muted mb-1">Correlation</div>
              <div className={`text-xl font-bold ${
                stats.corr > 0.1 ? 'text-emerald-600 dark:text-emerald-400'
                : stats.corr < -0.1 ? 'text-red-600 dark:text-red-400'
                : 'text-content-primary'
              }`}>
                {stats.corr.toFixed(4)}
              </div>
              <div className="text-xs text-content-muted mt-1">
                <LaTeX math="\rho(X,Y)" />
              </div>
            </div>

            <div className="bg-surface-secondary rounded-xl p-4 border border-edge-primary text-center">
              <div className="text-xs text-content-muted mb-1">Independence?</div>
              <div className={`text-lg font-bold ${
                Math.abs(stats.corr) < 0.01 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'
              }`}>
                {Math.abs(stats.corr) < 0.01 ? 'Yes' : 'No'}
              </div>
              <div className="text-xs text-content-muted mt-1">
                <LaTeX math="\rho \approx 0" /> ?
              </div>
            </div>
          </div>

          {/* Conditional info */}
          {highlightX !== null && highlightY !== null && (
            <div className="mt-4 bg-brand-50 dark:bg-brand-900/20 rounded-xl p-4 border border-brand-200 dark:border-brand-800">
              <div className="text-sm text-brand-800 dark:text-brand-200">
                <span className="font-semibold">Selected: </span>
                P(X={highlightX + 1}, Y={highlightY + 1}) = {jointPMF[highlightY][highlightX].toFixed(4)}
              </div>
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="space-y-4">
          <ControlPanel title="Distribution Type">
            <select
              value={jointType}
              onChange={(e) => setJointType(e.target.value as JointType)}
              className="w-full px-3 py-2 rounded-xl border border-edge-primary bg-surface-secondary text-content-primary text-sm"
            >
              <option value="independent">Independent</option>
              <option value="positiveCorr">Positive Correlation</option>
              <option value="negativeCorr">Negative Correlation</option>
              <option value="custom">Custom (Bell-shaped)</option>
            </select>
          </ControlPanel>

          {jointType === 'independent' && (
            <ControlPanel title="Marginal P(X)">
              {pX.map((p, i) => (
                <Slider
                  key={i}
                  label={`P(X=${i + 1})`}
                  value={p}
                  onChange={(e) => {
                    const newPX = [...pX];
                    newPX[i] = Number(e.target.value);
                    setPX(newPX);
                  }}
                  min={0.05}
                  max={0.6}
                  step={0.01}
                />
              ))}
            </ControlPanel>
          )}

          <ControlPanel title="Statistics">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-content-secondary">E[X]:</span>
                <span className="font-mono text-content-primary">{stats.eX.toFixed(3)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-content-secondary">E[Y]:</span>
                <span className="font-mono text-content-primary">{stats.eY.toFixed(3)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-content-secondary">Var(X):</span>
                <span className="font-mono text-content-primary">{stats.varX.toFixed(3)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-content-secondary">Var(Y):</span>
                <span className="font-mono text-content-primary">{stats.varY.toFixed(3)}</span>
              </div>
            </div>
          </ControlPanel>

          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 border border-blue-200 dark:border-blue-800">
            <h4 className="text-sm font-semibold text-blue-800 dark:text-blue-200 mb-2">
              Key Relationships
            </h4>
            <div className="text-xs text-blue-700 dark:text-blue-300 space-y-2">
              <div><LaTeX math="P(X=x) = \sum_y P(X=x, Y=y)" /></div>
              <div><LaTeX math="P(Y=y) = \sum_x P(X=x, Y=y)" /></div>
              <div><LaTeX math="\text{Independent} \Rightarrow \rho = 0" /></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
