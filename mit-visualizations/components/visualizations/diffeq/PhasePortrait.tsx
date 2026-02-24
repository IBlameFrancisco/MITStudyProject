'use client';

import { useState, useEffect, useRef } from 'react';
import * as d3 from 'd3';
import Slider from '@/components/ui/Slider';
import ControlPanel from '@/components/ui/ControlPanel';
import Button from '@/components/ui/Button';

type SystemType = 'harmonic' | 'damped' | 'vanderpol' | 'predatorprey';

export default function PhasePortrait() {
  const svgRef = useRef<SVGSVGElement>(null);
  const [systemType, setSystemType] = useState<SystemType>('harmonic');
  const [param1, setParam1] = useState(1);
  const [param2, setParam2] = useState(0.5);
  const [trajectories, setTrajectories] = useState<[number, number][][]>([]);

  const getSystemEquations = (x: number, y: number): [number, number] => {
    switch (systemType) {
      case 'harmonic':
        // dx/dt = y, dy/dt = -omega^2 * x
        return [y, -param1 * param1 * x];
      case 'damped':
        // dx/dt = y, dy/dt = -2*zeta*omega*y - omega^2*x
        return [y, -2 * param2 * param1 * y - param1 * param1 * x];
      case 'vanderpol':
        // dx/dt = y, dy/dt = mu*(1-x^2)*y - x
        return [y, param1 * (1 - x * x) * y - x];
      case 'predatorprey':
        // Lotka-Volterra: dx/dt = ax - bxy, dy/dt = -cy + dxy
        const a = param1, b = 0.5, c = param2, dd = 0.5;
        return [a * x - b * x * y, -c * y + dd * x * y];
      default:
        return [0, 0];
    }
  };

  const getSystemLabel = (): { title: string; equations: string[] } => {
    switch (systemType) {
      case 'harmonic':
        return {
          title: 'Simple Harmonic Oscillator',
          equations: [`dx/dt = y`, `dy/dt = -ω²x  (ω = ${param1.toFixed(1)})`],
        };
      case 'damped':
        return {
          title: 'Damped Harmonic Oscillator',
          equations: [`dx/dt = y`, `dy/dt = -2ζωy - ω²x  (ω=${param1.toFixed(1)}, ζ=${param2.toFixed(1)})`],
        };
      case 'vanderpol':
        return {
          title: 'Van der Pol Oscillator',
          equations: [`dx/dt = y`, `dy/dt = μ(1-x²)y - x  (μ = ${param1.toFixed(1)})`],
        };
      case 'predatorprey':
        return {
          title: 'Lotka-Volterra (Predator-Prey)',
          equations: [`dx/dt = αx - βxy  (α = ${param1.toFixed(1)})`, `dy/dt = -γy + δxy  (γ = ${param2.toFixed(1)})`],
        };
      default:
        return { title: '', equations: [] };
    }
  };

  useEffect(() => {
    if (!svgRef.current) return;

    const width = 500;
    const height = 500;
    const margin = 40;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const g = svg.append('g').attr('transform', `translate(${margin}, ${margin})`);

    const plotSize = width - 2 * margin;
    const range = systemType === 'predatorprey' ? 5 : 4;

    const xScale = d3.scaleLinear().domain([-range, range]).range([0, plotSize]);
    const yScale = d3.scaleLinear().domain([-range, range]).range([plotSize, 0]);

    // Axes
    g.append('g')
      .attr('transform', `translate(0, ${plotSize / 2})`)
      .call(d3.axisBottom(xScale).ticks(8))
      .attr('color', '#6b7280');

    g.append('g')
      .attr('transform', `translate(${plotSize / 2}, 0)`)
      .call(d3.axisLeft(yScale).ticks(8))
      .attr('color', '#6b7280');

    // Axis labels
    g.append('text')
      .attr('x', plotSize)
      .attr('y', plotSize / 2 - 10)
      .attr('text-anchor', 'end')
      .attr('fill', '#374151')
      .text('x');

    g.append('text')
      .attr('x', plotSize / 2 + 15)
      .attr('y', 15)
      .attr('fill', '#374151')
      .text('y');

    // Vector field
    const gridSize = 20;
    const arrowLength = 15;

    for (let i = 0; i <= gridSize; i++) {
      for (let j = 0; j <= gridSize; j++) {
        const x = -range + (2 * range * i) / gridSize;
        const y = -range + (2 * range * j) / gridSize;

        if (systemType === 'predatorprey' && (x <= 0 || y <= 0)) continue;

        const [dx, dy] = getSystemEquations(x, y);
        const magnitude = Math.sqrt(dx * dx + dy * dy);

        if (magnitude > 0.01) {
          const scale = arrowLength / Math.max(magnitude, 1);
          const endX = x + dx * scale * (range / plotSize) * 2;
          const endY = y + dy * scale * (range / plotSize) * 2;

          g.append('line')
            .attr('x1', xScale(x))
            .attr('y1', yScale(y))
            .attr('x2', xScale(endX))
            .attr('y2', yScale(endY))
            .attr('stroke', '#94a3b8')
            .attr('stroke-width', 1)
            .attr('marker-end', 'url(#arrowhead)');
        }
      }
    }

    // Arrow marker
    svg.append('defs').append('marker')
      .attr('id', 'arrowhead')
      .attr('viewBox', '0 -5 10 10')
      .attr('refX', 8)
      .attr('refY', 0)
      .attr('markerWidth', 4)
      .attr('markerHeight', 4)
      .attr('orient', 'auto')
      .append('path')
      .attr('d', 'M0,-5L10,0L0,5')
      .attr('fill', '#94a3b8');

    // Draw trajectories
    const line = d3.line<[number, number]>()
      .x((d) => xScale(d[0]))
      .y((d) => yScale(d[1]));

    const colors = ['#3b82f6', '#22c55e', '#ef4444', '#f59e0b', '#8b5cf6'];

    trajectories.forEach((traj, idx) => {
      g.append('path')
        .datum(traj)
        .attr('fill', 'none')
        .attr('stroke', colors[idx % colors.length])
        .attr('stroke-width', 2)
        .attr('d', line);

      // Starting point
      if (traj.length > 0) {
        g.append('circle')
          .attr('cx', xScale(traj[0][0]))
          .attr('cy', yScale(traj[0][1]))
          .attr('r', 5)
          .attr('fill', colors[idx % colors.length]);
      }
    });

  }, [systemType, param1, param2, trajectories]);

  const addTrajectory = () => {
    const range = systemType === 'predatorprey' ? 4 : 3;
    let x0, y0;

    if (systemType === 'predatorprey') {
      x0 = 0.5 + Math.random() * range;
      y0 = 0.5 + Math.random() * range;
    } else {
      x0 = (Math.random() - 0.5) * 2 * range;
      y0 = (Math.random() - 0.5) * 2 * range;
    }

    const trajectory: [number, number][] = [];
    let x = x0, y = y0;
    const dt = 0.01;
    const steps = 2000;

    for (let i = 0; i < steps; i++) {
      trajectory.push([x, y]);
      const [dx, dy] = getSystemEquations(x, y);
      x += dx * dt;
      y += dy * dt;

      if (Math.abs(x) > 10 || Math.abs(y) > 10) break;
      if (systemType === 'predatorprey' && (x < 0 || y < 0)) break;
    }

    setTrajectories((prev) => [...prev.slice(-4), trajectory]);
  };

  const clearTrajectories = () => {
    setTrajectories([]);
  };

  const systemInfo = getSystemLabel();

  return (
    <div>
      <h2 className="text-xl font-semibold text-content-primary mb-4">
        Phase Portrait Visualizer
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <div className="bg-surface-tertiary rounded-lg p-4 flex justify-center">
            <svg ref={svgRef} width="500" height="500" viewBox="0 0 500 500" />
          </div>

          <div className="mt-4 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
            <h3 className="text-sm font-semibold text-purple-800 dark:text-purple-200 mb-2">
              {systemInfo.title}
            </h3>
            <div className="space-y-1">
              {systemInfo.equations.map((eq, i) => (
                <p key={i} className="text-sm text-purple-700 dark:text-purple-300 font-mono">
                  {eq}
                </p>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <ControlPanel title="System Type">
            <select
              value={systemType}
              onChange={(e) => {
                setSystemType(e.target.value as SystemType);
                setTrajectories([]);
              }}
              className="w-full px-3 py-2 rounded-lg border border-edge-secondary dark:border-edge-secondary bg-surface-secondary text-content-primary"
            >
              <option value="harmonic">Harmonic Oscillator</option>
              <option value="damped">Damped Oscillator</option>
              <option value="vanderpol">Van der Pol</option>
              <option value="predatorprey">Predator-Prey</option>
            </select>
          </ControlPanel>

          <ControlPanel title="Parameters">
            <Slider
              label={systemType === 'harmonic' || systemType === 'damped' ? 'ω (frequency)' : systemType === 'vanderpol' ? 'μ (nonlinearity)' : 'α (prey growth)'}
              value={param1}
              onChange={(e) => setParam1(Number(e.target.value))}
              min={0.1}
              max={3}
              step={0.1}
            />
            {(systemType === 'damped' || systemType === 'predatorprey') && (
              <Slider
                label={systemType === 'damped' ? 'ζ (damping)' : 'γ (predator death)'}
                value={param2}
                onChange={(e) => setParam2(Number(e.target.value))}
                min={0.1}
                max={2}
                step={0.1}
              />
            )}
          </ControlPanel>

          <ControlPanel title="Trajectories">
            <div className="flex flex-col space-y-2">
              <Button onClick={addTrajectory} variant="primary">
                Add Trajectory
              </Button>
              <Button onClick={clearTrajectories} variant="secondary">
                Clear All
              </Button>
            </div>
            <p className="text-xs text-content-muted mt-2">
              {trajectories.length} trajectory(ies) shown
            </p>
          </ControlPanel>

          <ControlPanel title="About">
            <p className="text-sm text-content-tertiary">
              A phase portrait shows how a 2D dynamical system evolves over time.
              Arrows indicate the direction of motion, and colored curves are
              solution trajectories from random initial conditions.
            </p>
          </ControlPanel>
        </div>
      </div>
    </div>
  );
}
