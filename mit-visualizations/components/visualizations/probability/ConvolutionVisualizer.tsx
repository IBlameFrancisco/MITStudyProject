'use client';

/**
 * Convolution Visualizer
 * =======================
 * Shows how PDFs convolve when adding independent random variables.
 * Demonstrates: Z = X + Y where X, Y are independent.
 */

import { useState, useEffect, useRef, useMemo } from 'react';
import * as d3 from 'd3';
import Slider from '@/components/ui/Slider';
import ControlPanel from '@/components/ui/ControlPanel';
import { LaTeX } from '@/components/ui/LaTeX';

type Distribution = 'uniform' | 'exponential' | 'normal';

export default function ConvolutionVisualizer() {
  const svgRef = useRef<SVGSVGElement>(null);

  const [distX, setDistX] = useState<Distribution>('uniform');
  const [distY, setDistY] = useState<Distribution>('uniform');
  const [numSamples, setNumSamples] = useState(1000);
  const [isAnimating, setIsAnimating] = useState(false);

  // Parameters
  const [uniformRangeX, setUniformRangeX] = useState(1);
  const [uniformRangeY, setUniformRangeY] = useState(1);
  const [expLambdaX, setExpLambdaX] = useState(1);
  const [expLambdaY, setExpLambdaY] = useState(1);
  const [normalMeanX, setNormalMeanX] = useState(0);
  const [normalStdX, setNormalStdX] = useState(1);
  const [normalMeanY, setNormalMeanY] = useState(0);
  const [normalStdY, setNormalStdY] = useState(1);

  // PDF for X
  const pdfX = (x: number): number => {
    if (distX === 'uniform') {
      return x >= 0 && x <= uniformRangeX ? 1 / uniformRangeX : 0;
    } else if (distX === 'exponential') {
      return x >= 0 ? expLambdaX * Math.exp(-expLambdaX * x) : 0;
    } else {
      const z = (x - normalMeanX) / normalStdX;
      return Math.exp(-0.5 * z * z) / (normalStdX * Math.sqrt(2 * Math.PI));
    }
  };

  // PDF for Y
  const pdfY = (y: number): number => {
    if (distY === 'uniform') {
      return y >= 0 && y <= uniformRangeY ? 1 / uniformRangeY : 0;
    } else if (distY === 'exponential') {
      return y >= 0 ? expLambdaY * Math.exp(-expLambdaY * y) : 0;
    } else {
      const z = (y - normalMeanY) / normalStdY;
      return Math.exp(-0.5 * z * z) / (normalStdY * Math.sqrt(2 * Math.PI));
    }
  };

  // Convolution PDF for Z = X + Y (numerical approximation)
  const pdfZ = useMemo(() => {
    const zMin = -4;
    const zMax = 8;
    const steps = 200;
    const dz = (zMax - zMin) / steps;
    const dt = 0.05; // Integration step

    const result: { z: number; density: number }[] = [];

    for (let i = 0; i <= steps; i++) {
      const z = zMin + i * dz;
      let density = 0;

      // Numerical convolution: f_Z(z) = ∫ f_X(t) * f_Y(z-t) dt
      for (let t = zMin; t <= zMax; t += dt) {
        density += pdfX(t) * pdfY(z - t) * dt;
      }

      result.push({ z, density: Math.max(0, density) });
    }

    return result;
  }, [distX, distY, uniformRangeX, uniformRangeY, expLambdaX, expLambdaY, normalMeanX, normalStdX, normalMeanY, normalStdY]);

  // Statistics for Z = X + Y
  const stats = useMemo(() => {
    // E[Z] = E[X] + E[Y]
    let eX, eY, varX, varY;

    if (distX === 'uniform') {
      eX = uniformRangeX / 2;
      varX = uniformRangeX * uniformRangeX / 12;
    } else if (distX === 'exponential') {
      eX = 1 / expLambdaX;
      varX = 1 / (expLambdaX * expLambdaX);
    } else {
      eX = normalMeanX;
      varX = normalStdX * normalStdX;
    }

    if (distY === 'uniform') {
      eY = uniformRangeY / 2;
      varY = uniformRangeY * uniformRangeY / 12;
    } else if (distY === 'exponential') {
      eY = 1 / expLambdaY;
      varY = 1 / (expLambdaY * expLambdaY);
    } else {
      eY = normalMeanY;
      varY = normalStdY * normalStdY;
    }

    return {
      eX, eY, varX, varY,
      eZ: eX + eY,
      varZ: varX + varY, // Independence!
      stdZ: Math.sqrt(varX + varY)
    };
  }, [distX, distY, uniformRangeX, uniformRangeY, expLambdaX, expLambdaY, normalMeanX, normalStdX, normalMeanY, normalStdY]);

  // Draw visualization
  useEffect(() => {
    if (!svgRef.current) return;

    const margin = { top: 30, right: 30, bottom: 50, left: 50 };
    const width = 700 - margin.left - margin.right;
    const height = 350 - margin.top - margin.bottom;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

    // Generate data for X and Y
    const xData: { x: number; y: number }[] = [];
    const yData: { x: number; y: number }[] = [];

    for (let x = -2; x <= 6; x += 0.05) {
      xData.push({ x, y: pdfX(x) });
      yData.push({ x, y: pdfY(x) });
    }

    // Scales
    const xScale = d3.scaleLinear().domain([-2, 8]).range([0, width]);
    const yMax = Math.max(
      d3.max(xData, d => d.y) || 1,
      d3.max(yData, d => d.y) || 1,
      d3.max(pdfZ, d => d.density) || 1
    );
    const yScale = d3.scaleLinear().domain([0, yMax * 1.1]).range([height, 0]);

    // Grid
    g.append('g')
      .attr('opacity', 0.1)
      .call(d3.axisLeft(yScale).tickSize(-width).tickFormat(() => ''));

    // Axes
    g.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(xScale));

    g.append('g').call(d3.axisLeft(yScale).ticks(5));

    // Line generator
    const line = d3.line<{ x: number; y: number }>()
      .x(d => xScale(d.x))
      .y(d => yScale(d.y))
      .curve(d3.curveMonotoneX);

    // PDF of X
    g.append('path')
      .datum(xData)
      .attr('fill', 'none')
      .attr('stroke', '#3b82f6')
      .attr('stroke-width', 2)
      .attr('stroke-dasharray', '5,5')
      .attr('d', line);

    // PDF of Y
    g.append('path')
      .datum(yData)
      .attr('fill', 'none')
      .attr('stroke', '#22c55e')
      .attr('stroke-width', 2)
      .attr('stroke-dasharray', '5,5')
      .attr('d', line);

    // PDF of Z (convolution result)
    const zLine = d3.line<{ z: number; density: number }>()
      .x(d => xScale(d.z))
      .y(d => yScale(d.density))
      .curve(d3.curveMonotoneX);

    // Area under Z
    const zArea = d3.area<{ z: number; density: number }>()
      .x(d => xScale(d.z))
      .y0(height)
      .y1(d => yScale(d.density))
      .curve(d3.curveMonotoneX);

    g.append('path')
      .datum(pdfZ)
      .attr('fill', 'rgba(217, 119, 6, 0.2)')
      .attr('d', zArea);

    g.append('path')
      .datum(pdfZ)
      .attr('fill', 'none')
      .attr('stroke', '#d97706')
      .attr('stroke-width', 3)
      .attr('d', zLine);

    // Mean lines
    g.append('line')
      .attr('x1', xScale(stats.eZ))
      .attr('x2', xScale(stats.eZ))
      .attr('y1', 0)
      .attr('y2', height)
      .attr('stroke', '#ef4444')
      .attr('stroke-width', 2)
      .attr('stroke-dasharray', '3,3');

    // Legend
    const legend = g.append('g').attr('transform', `translate(${width - 150}, 10)`);

    const legendItems = [
      { label: 'f_X(x)', color: '#3b82f6', dash: true },
      { label: 'f_Y(y)', color: '#22c55e', dash: true },
      { label: 'f_Z(z) = f_X * f_Y', color: '#d97706', dash: false },
    ];

    legendItems.forEach((item, i) => {
      const y = i * 20;
      legend.append('line')
        .attr('x1', 0)
        .attr('x2', 25)
        .attr('y1', y)
        .attr('y2', y)
        .attr('stroke', item.color)
        .attr('stroke-width', 2)
        .attr('stroke-dasharray', item.dash ? '5,5' : '0');

      legend.append('text')
        .attr('x', 30)
        .attr('y', y + 4)
        .attr('font-size', '11px')
        .attr('class', 'fill-current text-content-secondary')
        .text(item.label);
    });

    // Axis labels
    g.append('text')
      .attr('x', width / 2)
      .attr('y', height + 40)
      .attr('text-anchor', 'middle')
      .attr('class', 'text-sm fill-current text-content-secondary')
      .text('Value');

    g.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('x', -height / 2)
      .attr('y', -35)
      .attr('text-anchor', 'middle')
      .attr('class', 'text-sm fill-current text-content-secondary')
      .text('Density');

  }, [pdfZ, stats]);

  return (
    <div>
      <h2 className="text-xl font-semibold text-content-primary mb-2">
        Convolution of Distributions
      </h2>
      <p className="text-sm text-content-secondary mb-6">
        When Z = X + Y for independent X, Y: the PDF of Z is the convolution of PDFs
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 space-y-4">
          {/* Main Chart */}
          <div className="bg-surface-tertiary rounded-2xl p-4 border border-edge-primary">
            <svg ref={svgRef} width="100%" height="350" viewBox="0 0 700 350" className="text-content-secondary" />
          </div>

          {/* Key Formula */}
          <div className="bg-gradient-to-r from-brand-50 to-orange-50 dark:from-brand-900/20 dark:to-orange-900/20 rounded-xl p-4 border border-brand-200 dark:border-brand-800">
            <div className="text-center">
              <p className="text-sm text-content-secondary mb-2">
                Convolution Formula for Z = X + Y:
              </p>
              <div className="text-brand-600 dark:text-brand-400">
                <LaTeX math="f_Z(z) = \int_{-\infty}^{\infty} f_X(t) \cdot f_Y(z-t) \, dt = (f_X * f_Y)(z)" />
              </div>
            </div>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-3 border border-blue-200 dark:border-blue-800 text-center">
              <div className="text-xs text-blue-600 dark:text-blue-400 font-medium">
                <LaTeX math="E[X]" />
              </div>
              <div className="text-lg font-bold text-blue-700 dark:text-blue-300">{stats.eX.toFixed(3)}</div>
            </div>
            <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-xl p-3 border border-emerald-200 dark:border-emerald-800 text-center">
              <div className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                <LaTeX math="E[Y]" />
              </div>
              <div className="text-lg font-bold text-emerald-700 dark:text-emerald-300">{stats.eY.toFixed(3)}</div>
            </div>
            <div className="bg-brand-50 dark:bg-brand-900/20 rounded-xl p-3 border border-brand-200 dark:border-brand-800 text-center">
              <div className="text-xs text-brand-600 dark:text-brand-400 font-medium">
                <LaTeX math="E[Z] = E[X] + E[Y]" />
              </div>
              <div className="text-lg font-bold text-brand-700 dark:text-brand-300">{stats.eZ.toFixed(3)}</div>
            </div>
            <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-3 border border-purple-200 dark:border-purple-800 text-center">
              <div className="text-xs text-purple-600 dark:text-purple-400 font-medium">
                <LaTeX math="\text{Var}(Z) = \text{Var}(X) + \text{Var}(Y)" />
              </div>
              <div className="text-lg font-bold text-purple-700 dark:text-purple-300">{stats.varZ.toFixed(3)}</div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="space-y-4">
          <ControlPanel title="Distribution X">
            <select
              value={distX}
              onChange={(e) => setDistX(e.target.value as Distribution)}
              className="w-full px-3 py-2 rounded-xl border border-edge-primary bg-surface-secondary text-content-primary text-sm mb-2"
            >
              <option value="uniform">Uniform(0, a)</option>
              <option value="exponential">Exponential(λ)</option>
              <option value="normal">Normal(μ, σ)</option>
            </select>
            {distX === 'uniform' && (
              <Slider label="Range (a)" value={uniformRangeX} onChange={(e) => setUniformRangeX(Number(e.target.value))} min={0.5} max={3} step={0.1} />
            )}
            {distX === 'exponential' && (
              <Slider label="λ" value={expLambdaX} onChange={(e) => setExpLambdaX(Number(e.target.value))} min={0.5} max={3} step={0.1} />
            )}
            {distX === 'normal' && (
              <>
                <Slider label="μ" value={normalMeanX} onChange={(e) => setNormalMeanX(Number(e.target.value))} min={0} max={3} step={0.1} />
                <Slider label="σ" value={normalStdX} onChange={(e) => setNormalStdX(Number(e.target.value))} min={0.3} max={2} step={0.1} />
              </>
            )}
          </ControlPanel>

          <ControlPanel title="Distribution Y">
            <select
              value={distY}
              onChange={(e) => setDistY(e.target.value as Distribution)}
              className="w-full px-3 py-2 rounded-xl border border-edge-primary bg-surface-secondary text-content-primary text-sm mb-2"
            >
              <option value="uniform">Uniform(0, b)</option>
              <option value="exponential">Exponential(λ)</option>
              <option value="normal">Normal(μ, σ)</option>
            </select>
            {distY === 'uniform' && (
              <Slider label="Range (b)" value={uniformRangeY} onChange={(e) => setUniformRangeY(Number(e.target.value))} min={0.5} max={3} step={0.1} />
            )}
            {distY === 'exponential' && (
              <Slider label="λ" value={expLambdaY} onChange={(e) => setExpLambdaY(Number(e.target.value))} min={0.5} max={3} step={0.1} />
            )}
            {distY === 'normal' && (
              <>
                <Slider label="μ" value={normalMeanY} onChange={(e) => setNormalMeanY(Number(e.target.value))} min={0} max={3} step={0.1} />
                <Slider label="σ" value={normalStdY} onChange={(e) => setNormalStdY(Number(e.target.value))} min={0.3} max={2} step={0.1} />
              </>
            )}
          </ControlPanel>

          <div className="bg-amber-50 dark:bg-amber-900/20 rounded-xl p-4 border border-amber-200 dark:border-amber-800">
            <h4 className="text-sm font-semibold text-amber-800 dark:text-amber-200 mb-2">
              Key Properties
            </h4>
            <div className="text-xs text-amber-700 dark:text-amber-300 space-y-2">
              <div>• <LaTeX math="E[X+Y] = E[X] + E[Y]" /> (always)</div>
              <div>• <LaTeX math="\text{Var}(X+Y) = \text{Var}(X) + \text{Var}(Y)" /> (if independent)</div>
              <div>• Normal + Normal = Normal</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
