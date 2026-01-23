'use client';

/**
 * Black-Scholes Option Pricing Visualizer
 * ========================================
 * Interactive visualization of the Black-Scholes model,
 * option payoffs, and the Greeks.
 */

import { useState, useEffect, useRef, useMemo } from 'react';
import * as d3 from 'd3';
import Slider from '@/components/ui/Slider';
import ControlPanel from '@/components/ui/ControlPanel';
import { LaTeX } from '@/components/ui/LaTeX';

type VisualizationMode = 'option-payoff' | 'black-scholes' | 'greeks';

// Standard normal CDF approximation
function normalCDF(x: number): number {
  const a1 =  0.254829592;
  const a2 = -0.284496736;
  const a3 =  1.421413741;
  const a4 = -1.453152027;
  const a5 =  1.061405429;
  const p  =  0.3275911;

  const sign = x < 0 ? -1 : 1;
  x = Math.abs(x) / Math.sqrt(2);

  const t = 1.0 / (1.0 + p * x);
  const y = 1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);

  return 0.5 * (1.0 + sign * y);
}

// Standard normal PDF
function normalPDF(x: number): number {
  return Math.exp(-0.5 * x * x) / Math.sqrt(2 * Math.PI);
}

export default function BlackScholesVisualizer() {
  const svgRef = useRef<SVGSVGElement>(null);

  const [mode, setMode] = useState<VisualizationMode>('option-payoff');

  // Option parameters
  const [S, setS] = useState(100);     // Current stock price
  const [K, setK] = useState(100);     // Strike price
  const [T, setT] = useState(0.5);     // Time to expiry (years)
  const [r, setR] = useState(0.05);    // Risk-free rate
  const [sigma, setSigma] = useState(0.2); // Volatility
  const [optionType, setOptionType] = useState<'call' | 'put'>('call');

  // Black-Scholes calculations
  const bsCalcs = useMemo(() => {
    const sqrtT = Math.sqrt(T);
    const d1 = (Math.log(S / K) + (r + sigma * sigma / 2) * T) / (sigma * sqrtT);
    const d2 = d1 - sigma * sqrtT;

    const Nd1 = normalCDF(d1);
    const Nd2 = normalCDF(d2);
    const Nmd1 = normalCDF(-d1);
    const Nmd2 = normalCDF(-d2);

    const callPrice = S * Nd1 - K * Math.exp(-r * T) * Nd2;
    const putPrice = K * Math.exp(-r * T) * Nmd2 - S * Nmd1;

    // Greeks
    const delta = optionType === 'call' ? Nd1 : Nd1 - 1;
    const gamma = normalPDF(d1) / (S * sigma * sqrtT);
    const theta = optionType === 'call'
      ? (-S * normalPDF(d1) * sigma / (2 * sqrtT) - r * K * Math.exp(-r * T) * Nd2) / 365
      : (-S * normalPDF(d1) * sigma / (2 * sqrtT) + r * K * Math.exp(-r * T) * Nmd2) / 365;
    const vega = S * sqrtT * normalPDF(d1) / 100;
    const rho = optionType === 'call'
      ? K * T * Math.exp(-r * T) * Nd2 / 100
      : -K * T * Math.exp(-r * T) * Nmd2 / 100;

    return {
      d1, d2, callPrice, putPrice,
      price: optionType === 'call' ? callPrice : putPrice,
      delta, gamma, theta, vega, rho,
      intrinsic: optionType === 'call'
        ? Math.max(0, S - K)
        : Math.max(0, K - S),
      timeValue: (optionType === 'call' ? callPrice : putPrice) -
        (optionType === 'call' ? Math.max(0, S - K) : Math.max(0, K - S))
    };
  }, [S, K, T, r, sigma, optionType]);

  // Draw option payoff diagram
  useEffect(() => {
    if (!svgRef.current || mode !== 'option-payoff') return;

    const margin = { top: 40, right: 30, bottom: 50, left: 60 };
    const width = 550 - margin.left - margin.right;
    const height = 320 - margin.top - margin.bottom;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

    // Generate payoff data
    const sMin = K * 0.5;
    const sMax = K * 1.5;
    const data: { s: number; payoff: number; profit: number }[] = [];
    const premium = bsCalcs.price;

    for (let s = sMin; s <= sMax; s += (sMax - sMin) / 100) {
      const payoff = optionType === 'call'
        ? Math.max(0, s - K)
        : Math.max(0, K - s);
      data.push({
        s,
        payoff,
        profit: payoff - premium
      });
    }

    const xScale = d3.scaleLinear().domain([sMin, sMax]).range([0, width]);
    const yMax = Math.max(...data.map(d => d.payoff), premium * 2);
    const yMin = -premium * 1.5;
    const yScale = d3.scaleLinear().domain([yMin, yMax]).range([height, 0]);

    // Grid
    g.append('g')
      .attr('opacity', 0.1)
      .call(d3.axisLeft(yScale).tickSize(-width).tickFormat(() => ''));

    // Zero profit line
    g.append('line')
      .attr('x1', 0)
      .attr('y1', yScale(0))
      .attr('x2', width)
      .attr('y2', yScale(0))
      .attr('stroke', '#6b7280')
      .attr('stroke-width', 1)
      .attr('stroke-dasharray', '5,5');

    // Strike price vertical line
    g.append('line')
      .attr('x1', xScale(K))
      .attr('y1', 0)
      .attr('x2', xScale(K))
      .attr('y2', height)
      .attr('stroke', '#9333ea')
      .attr('stroke-width', 1.5)
      .attr('stroke-dasharray', '4,4');

    g.append('text')
      .attr('x', xScale(K))
      .attr('y', -5)
      .attr('text-anchor', 'middle')
      .attr('class', 'text-xs fill-current text-purple-600')
      .text(`K = $${K}`);

    // Payoff curve (at expiry)
    const payoffLine = d3.line<{ s: number; payoff: number }>()
      .x(d => xScale(d.s))
      .y(d => yScale(d.payoff));

    g.append('path')
      .datum(data)
      .attr('fill', 'none')
      .attr('stroke', '#3b82f6')
      .attr('stroke-width', 3)
      .attr('d', payoffLine);

    // Profit/Loss curve
    const profitLine = d3.line<{ s: number; profit: number }>()
      .x(d => xScale(d.s))
      .y(d => yScale(d.profit));

    g.append('path')
      .datum(data)
      .attr('fill', 'none')
      .attr('stroke', '#10b981')
      .attr('stroke-width', 2)
      .attr('stroke-dasharray', '6,3')
      .attr('d', profitLine);

    // Current stock price marker
    g.append('line')
      .attr('x1', xScale(S))
      .attr('y1', 0)
      .attr('x2', xScale(S))
      .attr('y2', height)
      .attr('stroke', '#ef4444')
      .attr('stroke-width', 2);

    const currentPayoff = optionType === 'call' ? Math.max(0, S - K) : Math.max(0, K - S);
    g.append('circle')
      .attr('cx', xScale(S))
      .attr('cy', yScale(currentPayoff))
      .attr('r', 6)
      .attr('fill', '#ef4444')
      .attr('stroke', 'white')
      .attr('stroke-width', 2);

    // Legend
    const legend = g.append('g').attr('transform', `translate(${width - 150}, 10)`);

    legend.append('line').attr('x1', 0).attr('y1', 0).attr('x2', 20).attr('y2', 0)
      .attr('stroke', '#3b82f6').attr('stroke-width', 3);
    legend.append('text').attr('x', 25).attr('y', 4).attr('class', 'text-xs fill-current text-content-secondary')
      .text('Payoff at Expiry');

    legend.append('line').attr('x1', 0).attr('y1', 20).attr('x2', 20).attr('y2', 20)
      .attr('stroke', '#10b981').attr('stroke-width', 2).attr('stroke-dasharray', '6,3');
    legend.append('text').attr('x', 25).attr('y', 24).attr('class', 'text-xs fill-current text-content-secondary')
      .text('Profit/Loss');

    // Axes
    g.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(xScale).ticks(8).tickFormat(d => `$${d}`));

    g.append('g').call(d3.axisLeft(yScale).ticks(8).tickFormat(d => `$${d}`));

    // Labels
    g.append('text')
      .attr('x', width / 2)
      .attr('y', height + 40)
      .attr('text-anchor', 'middle')
      .attr('class', 'text-sm fill-current text-content-secondary')
      .text('Stock Price at Expiry (Sᴛ)');

    g.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('x', -height / 2)
      .attr('y', -45)
      .attr('text-anchor', 'middle')
      .attr('class', 'text-sm fill-current text-content-secondary')
      .text('Payoff / Profit ($)');

    g.append('text')
      .attr('x', width / 2)
      .attr('y', -15)
      .attr('text-anchor', 'middle')
      .attr('class', 'text-base font-semibold fill-current text-content-primary')
      .text(`${optionType === 'call' ? 'Call' : 'Put'} Option Payoff Diagram`);

  }, [mode, S, K, optionType, bsCalcs.price]);

  // Draw Black-Scholes price surface
  useEffect(() => {
    if (!svgRef.current || mode !== 'black-scholes') return;

    const margin = { top: 40, right: 30, bottom: 50, left: 60 };
    const width = 550 - margin.left - margin.right;
    const height = 320 - margin.top - margin.bottom;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

    // Generate price curve for different stock prices
    const sMin = K * 0.5;
    const sMax = K * 1.5;
    const data: { s: number; price: number }[] = [];

    for (let s = sMin; s <= sMax; s += (sMax - sMin) / 100) {
      const sqrtT = Math.sqrt(T);
      const d1 = (Math.log(s / K) + (r + sigma * sigma / 2) * T) / (sigma * sqrtT);
      const d2 = d1 - sigma * sqrtT;

      let price;
      if (optionType === 'call') {
        price = s * normalCDF(d1) - K * Math.exp(-r * T) * normalCDF(d2);
      } else {
        price = K * Math.exp(-r * T) * normalCDF(-d2) - s * normalCDF(-d1);
      }
      data.push({ s, price: Math.max(0, price) });
    }

    // Intrinsic value
    const intrinsicData: { s: number; intrinsic: number }[] = [];
    for (let s = sMin; s <= sMax; s += (sMax - sMin) / 100) {
      const intrinsic = optionType === 'call' ? Math.max(0, s - K) : Math.max(0, K - s);
      intrinsicData.push({ s, intrinsic });
    }

    const xScale = d3.scaleLinear().domain([sMin, sMax]).range([0, width]);
    const yMax = Math.max(...data.map(d => d.price)) * 1.1;
    const yScale = d3.scaleLinear().domain([0, yMax]).range([height, 0]);

    // Grid
    g.append('g')
      .attr('opacity', 0.1)
      .call(d3.axisLeft(yScale).tickSize(-width).tickFormat(() => ''));

    // Strike line
    g.append('line')
      .attr('x1', xScale(K))
      .attr('y1', 0)
      .attr('x2', xScale(K))
      .attr('y2', height)
      .attr('stroke', '#9333ea')
      .attr('stroke-width', 1)
      .attr('stroke-dasharray', '4,4');

    // Intrinsic value
    const intrinsicLine = d3.line<{ s: number; intrinsic: number }>()
      .x(d => xScale(d.s))
      .y(d => yScale(d.intrinsic));

    g.append('path')
      .datum(intrinsicData)
      .attr('fill', 'none')
      .attr('stroke', '#f59e0b')
      .attr('stroke-width', 2)
      .attr('stroke-dasharray', '4,4')
      .attr('d', intrinsicLine);

    // BS Price curve
    const priceLine = d3.line<{ s: number; price: number }>()
      .x(d => xScale(d.s))
      .y(d => yScale(d.price))
      .curve(d3.curveMonotoneX);

    // Area between curves (time value)
    const areaGenerator = d3.area<{ s: number; price: number }>()
      .x(d => xScale(d.s))
      .y0((d, i) => yScale(intrinsicData[i].intrinsic))
      .y1(d => yScale(d.price))
      .curve(d3.curveMonotoneX);

    g.append('path')
      .datum(data)
      .attr('fill', '#3b82f6')
      .attr('fill-opacity', 0.15)
      .attr('d', areaGenerator);

    g.append('path')
      .datum(data)
      .attr('fill', 'none')
      .attr('stroke', '#3b82f6')
      .attr('stroke-width', 3)
      .attr('d', priceLine);

    // Current point
    g.append('circle')
      .attr('cx', xScale(S))
      .attr('cy', yScale(bsCalcs.price))
      .attr('r', 8)
      .attr('fill', '#ef4444')
      .attr('stroke', 'white')
      .attr('stroke-width', 2);

    // Legend
    const legend = g.append('g').attr('transform', `translate(10, 10)`);

    legend.append('line').attr('x1', 0).attr('y1', 0).attr('x2', 20).attr('y2', 0)
      .attr('stroke', '#3b82f6').attr('stroke-width', 3);
    legend.append('text').attr('x', 25).attr('y', 4).attr('class', 'text-xs fill-current text-content-secondary')
      .text('Black-Scholes Price');

    legend.append('line').attr('x1', 0).attr('y1', 20).attr('x2', 20).attr('y2', 20)
      .attr('stroke', '#f59e0b').attr('stroke-width', 2).attr('stroke-dasharray', '4,4');
    legend.append('text').attr('x', 25).attr('y', 24).attr('class', 'text-xs fill-current text-content-secondary')
      .text('Intrinsic Value');

    legend.append('rect').attr('x', 0).attr('y', 35).attr('width', 20).attr('height', 10)
      .attr('fill', '#3b82f6').attr('fill-opacity', 0.3);
    legend.append('text').attr('x', 25).attr('y', 44).attr('class', 'text-xs fill-current text-content-secondary')
      .text('Time Value');

    // Axes
    g.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(xScale).ticks(8).tickFormat(d => `$${d}`));

    g.append('g').call(d3.axisLeft(yScale).ticks(8).tickFormat(d => `$${d}`));

    // Labels
    g.append('text')
      .attr('x', width / 2)
      .attr('y', height + 40)
      .attr('text-anchor', 'middle')
      .attr('class', 'text-sm fill-current text-content-secondary')
      .text('Stock Price (S)');

    g.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('x', -height / 2)
      .attr('y', -45)
      .attr('text-anchor', 'middle')
      .attr('class', 'text-sm fill-current text-content-secondary')
      .text('Option Price ($)');

    g.append('text')
      .attr('x', width / 2)
      .attr('y', -15)
      .attr('text-anchor', 'middle')
      .attr('class', 'text-base font-semibold fill-current text-content-primary')
      .text(`Black-Scholes ${optionType === 'call' ? 'Call' : 'Put'} Price`);

  }, [mode, S, K, T, r, sigma, optionType, bsCalcs.price]);

  // Draw Greeks
  useEffect(() => {
    if (!svgRef.current || mode !== 'greeks') return;

    const margin = { top: 40, right: 30, bottom: 50, left: 60 };
    const width = 550 - margin.left - margin.right;
    const height = 320 - margin.top - margin.bottom;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

    // Generate delta curve
    const sMin = K * 0.5;
    const sMax = K * 1.5;
    const deltaData: { s: number; delta: number }[] = [];
    const gammaData: { s: number; gamma: number }[] = [];

    for (let s = sMin; s <= sMax; s += (sMax - sMin) / 100) {
      const sqrtT = Math.sqrt(T);
      const d1 = (Math.log(s / K) + (r + sigma * sigma / 2) * T) / (sigma * sqrtT);

      const delta = optionType === 'call' ? normalCDF(d1) : normalCDF(d1) - 1;
      const gamma = normalPDF(d1) / (s * sigma * sqrtT);

      deltaData.push({ s, delta });
      gammaData.push({ s, gamma });
    }

    const xScale = d3.scaleLinear().domain([sMin, sMax]).range([0, width]);
    const yScaleDelta = d3.scaleLinear()
      .domain(optionType === 'call' ? [0, 1] : [-1, 0])
      .range([height, 0]);

    // Grid
    g.append('g')
      .attr('opacity', 0.1)
      .call(d3.axisLeft(yScaleDelta).tickSize(-width).tickFormat(() => ''));

    // Strike line
    g.append('line')
      .attr('x1', xScale(K))
      .attr('y1', 0)
      .attr('x2', xScale(K))
      .attr('y2', height)
      .attr('stroke', '#9333ea')
      .attr('stroke-width', 1)
      .attr('stroke-dasharray', '4,4');

    // Delta = 0.5 line (for calls)
    if (optionType === 'call') {
      g.append('line')
        .attr('x1', 0)
        .attr('y1', yScaleDelta(0.5))
        .attr('x2', width)
        .attr('y2', yScaleDelta(0.5))
        .attr('stroke', '#6b7280')
        .attr('stroke-width', 1)
        .attr('stroke-dasharray', '3,3');
    }

    // Delta curve
    const deltaLine = d3.line<{ s: number; delta: number }>()
      .x(d => xScale(d.s))
      .y(d => yScaleDelta(d.delta))
      .curve(d3.curveMonotoneX);

    g.append('path')
      .datum(deltaData)
      .attr('fill', 'none')
      .attr('stroke', '#3b82f6')
      .attr('stroke-width', 3)
      .attr('d', deltaLine);

    // Current delta marker
    g.append('circle')
      .attr('cx', xScale(S))
      .attr('cy', yScaleDelta(bsCalcs.delta))
      .attr('r', 8)
      .attr('fill', '#ef4444')
      .attr('stroke', 'white')
      .attr('stroke-width', 2);

    // Axes
    g.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(xScale).ticks(8).tickFormat(d => `$${d}`));

    g.append('g').call(d3.axisLeft(yScaleDelta).ticks(10));

    // Labels
    g.append('text')
      .attr('x', width / 2)
      .attr('y', height + 40)
      .attr('text-anchor', 'middle')
      .attr('class', 'text-sm fill-current text-content-secondary')
      .text('Stock Price (S)');

    g.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('x', -height / 2)
      .attr('y', -45)
      .attr('text-anchor', 'middle')
      .attr('class', 'text-sm fill-current text-content-secondary')
      .text('Delta (Δ)');

    g.append('text')
      .attr('x', width / 2)
      .attr('y', -15)
      .attr('text-anchor', 'middle')
      .attr('class', 'text-base font-semibold fill-current text-content-primary')
      .text(`${optionType === 'call' ? 'Call' : 'Put'} Delta vs Stock Price`);

  }, [mode, S, K, T, r, sigma, optionType, bsCalcs.delta]);

  return (
    <div>
      <h2 className="text-xl font-semibold text-content-primary mb-2">
        Black-Scholes Option Pricing
      </h2>
      <p className="text-sm text-content-secondary mb-6">
        Explore option payoffs, Black-Scholes pricing, and the Greeks
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 space-y-4">
          {/* Main Visualization */}
          <div className="bg-surface-tertiary rounded-2xl p-4 border border-edge-primary">
            <svg ref={svgRef} width="100%" height="320" viewBox="0 0 550 320" className="text-content-secondary" />
          </div>

          {/* Formula Display */}
          <div className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-xl p-4 border border-emerald-200 dark:border-emerald-800">
            <div className="text-center space-y-3">
              <p className="text-sm text-content-secondary">Black-Scholes Formula ({optionType === 'call' ? 'Call' : 'Put'}):</p>
              {optionType === 'call' ? (
                <div className="text-emerald-700 dark:text-emerald-400">
                  <LaTeX math="C = S_0 N(d_1) - Ke^{-rT} N(d_2)" />
                </div>
              ) : (
                <div className="text-emerald-700 dark:text-emerald-400">
                  <LaTeX math="P = Ke^{-rT} N(-d_2) - S_0 N(-d_1)" />
                </div>
              )}
              <div className="text-xs text-content-muted mt-2 space-y-1">
                <div><LaTeX math={`d_1 = \\frac{\\ln(S/K) + (r + \\sigma^2/2)T}{\\sigma\\sqrt{T}} = ${bsCalcs.d1.toFixed(4)}`} /></div>
                <div><LaTeX math={`d_2 = d_1 - \\sigma\\sqrt{T} = ${bsCalcs.d2.toFixed(4)}`} /></div>
              </div>
            </div>
          </div>

          {/* Greeks Display */}
          <div className="grid grid-cols-5 gap-3">
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-3 border border-blue-200 dark:border-blue-800 text-center">
              <div className="text-xs text-blue-600 dark:text-blue-400"><LaTeX math="\Delta" /> Delta</div>
              <div className="text-lg font-bold text-blue-700 dark:text-blue-300">{bsCalcs.delta.toFixed(4)}</div>
              <div className="text-xs text-blue-500"><LaTeX math="\partial V / \partial S" /></div>
            </div>
            <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-3 border border-purple-200 dark:border-purple-800 text-center">
              <div className="text-xs text-purple-600 dark:text-purple-400"><LaTeX math="\Gamma" /> Gamma</div>
              <div className="text-lg font-bold text-purple-700 dark:text-purple-300">{bsCalcs.gamma.toFixed(4)}</div>
              <div className="text-xs text-purple-500"><LaTeX math="\partial^2 V / \partial S^2" /></div>
            </div>
            <div className="bg-red-50 dark:bg-red-900/20 rounded-xl p-3 border border-red-200 dark:border-red-800 text-center">
              <div className="text-xs text-red-600 dark:text-red-400"><LaTeX math="\Theta" /> Theta</div>
              <div className="text-lg font-bold text-red-700 dark:text-red-300">{bsCalcs.theta.toFixed(4)}</div>
              <div className="text-xs text-red-500">$/day decay</div>
            </div>
            <div className="bg-amber-50 dark:bg-amber-900/20 rounded-xl p-3 border border-amber-200 dark:border-amber-800 text-center">
              <div className="text-xs text-amber-600 dark:text-amber-400"><LaTeX math="\mathcal{V}" /> Vega</div>
              <div className="text-lg font-bold text-amber-700 dark:text-amber-300">{bsCalcs.vega.toFixed(4)}</div>
              <div className="text-xs text-amber-500">$/1% <LaTeX math="\sigma" /></div>
            </div>
            <div className="bg-teal-50 dark:bg-teal-900/20 rounded-xl p-3 border border-teal-200 dark:border-teal-800 text-center">
              <div className="text-xs text-teal-600 dark:text-teal-400"><LaTeX math="\rho" /> Rho</div>
              <div className="text-lg font-bold text-teal-700 dark:text-teal-300">{bsCalcs.rho.toFixed(4)}</div>
              <div className="text-xs text-teal-500">$/1% r</div>
            </div>
          </div>

          {/* Price Breakdown */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-surface-secondary rounded-xl p-4 border border-edge-primary text-center">
              <div className="text-xs text-content-muted">Option Price</div>
              <div className="text-2xl font-bold text-brand-600">${bsCalcs.price.toFixed(2)}</div>
            </div>
            <div className="bg-surface-secondary rounded-xl p-4 border border-edge-primary text-center">
              <div className="text-xs text-content-muted">Intrinsic Value</div>
              <div className="text-2xl font-bold text-amber-600">${bsCalcs.intrinsic.toFixed(2)}</div>
            </div>
            <div className="bg-surface-secondary rounded-xl p-4 border border-edge-primary text-center">
              <div className="text-xs text-content-muted">Time Value</div>
              <div className="text-2xl font-bold text-blue-600">${bsCalcs.timeValue.toFixed(2)}</div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="space-y-4">
          <ControlPanel title="Visualization">
            <select
              value={mode}
              onChange={(e) => setMode(e.target.value as VisualizationMode)}
              className="w-full px-3 py-2 rounded-xl border border-edge-primary bg-surface-secondary text-content-primary text-sm mb-2"
            >
              <option value="option-payoff">Option Payoff</option>
              <option value="black-scholes">BS Price Curve</option>
              <option value="greeks">Delta Curve</option>
            </select>
            <div className="flex gap-2 mt-2">
              <button
                onClick={() => setOptionType('call')}
                className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                  optionType === 'call'
                    ? 'bg-brand-500 text-white'
                    : 'bg-surface-tertiary border border-edge-primary text-content-secondary'
                }`}
              >
                Call
              </button>
              <button
                onClick={() => setOptionType('put')}
                className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                  optionType === 'put'
                    ? 'bg-brand-500 text-white'
                    : 'bg-surface-tertiary border border-edge-primary text-content-secondary'
                }`}
              >
                Put
              </button>
            </div>
          </ControlPanel>

          <ControlPanel title="Option Parameters">
            <Slider
              label="Stock Price (S)"
              value={S}
              onChange={(e) => setS(Number(e.target.value))}
              min={50}
              max={150}
              step={1}
            />
            <Slider
              label="Strike Price (K)"
              value={K}
              onChange={(e) => setK(Number(e.target.value))}
              min={50}
              max={150}
              step={5}
            />
            <Slider
              label="Time to Expiry (T)"
              value={T}
              onChange={(e) => setT(Number(e.target.value))}
              min={0.1}
              max={2}
              step={0.1}
            />
            <Slider
              label="Volatility (σ)"
              value={sigma}
              onChange={(e) => setSigma(Number(e.target.value))}
              min={0.1}
              max={0.5}
              step={0.05}
            />
            <Slider
              label="Risk-free Rate (r)"
              value={r}
              onChange={(e) => setR(Number(e.target.value))}
              min={0.01}
              max={0.1}
              step={0.01}
            />
          </ControlPanel>

          <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-xl p-4 border border-emerald-200 dark:border-emerald-800">
            <h4 className="text-sm font-semibold text-emerald-800 dark:text-emerald-200 mb-2">
              Key Insight
            </h4>
            <div className="text-xs text-emerald-700 dark:text-emerald-300 leading-relaxed space-y-1">
              <p>Option value = Intrinsic + Time value</p>
              <p><LaTeX math="\Delta" /> measures hedge ratio (shares per option)</p>
              <p>ATM options have <LaTeX math="\Delta \approx 0.5" /> for calls</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
