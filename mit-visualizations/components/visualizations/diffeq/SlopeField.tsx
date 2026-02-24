'use client';

import { useState } from 'react';
import { Mafs, Coordinates, Plot, Vector, Theme, useMovablePoint } from 'mafs';
import 'mafs/core.css';
import Slider from '@/components/ui/Slider';
import ControlPanel from '@/components/ui/ControlPanel';

type EquationType = 'linear' | 'separable' | 'autonomous';

export default function SlopeField() {
  const [equationType, setEquationType] = useState<EquationType>('linear');
  const [a, setA] = useState(1);
  const [b, setB] = useState(-1);
  const [gridDensity, setGridDensity] = useState(15);

  // dy/dx functions for different equation types
  const getDyDx = (x: number, y: number): number => {
    switch (equationType) {
      case 'linear':
        // dy/dx = ay + bx
        return a * y + b * x;
      case 'separable':
        // dy/dx = xy
        return a * x * y;
      case 'autonomous':
        // dy/dx = y(1-y) (logistic)
        return a * y * (1 - y);
      default:
        return 0;
    }
  };

  const getEquationLabel = (): string => {
    switch (equationType) {
      case 'linear':
        return `dy/dx = ${a}y ${b >= 0 ? '+' : ''}${b}x`;
      case 'separable':
        return `dy/dx = ${a}xy`;
      case 'autonomous':
        return `dy/dx = ${a}y(1-y)`;
      default:
        return '';
    }
  };

  // Generate slope field vectors
  const slopeVectors: { x: number; y: number; dx: number; dy: number }[] = [];
  const range = 5;
  const step = (2 * range) / gridDensity;
  const vectorLength = 0.3;

  for (let x = -range; x <= range; x += step) {
    for (let y = -range; y <= range; y += step) {
      const slope = getDyDx(x, y);
      const angle = Math.atan(slope);
      const dx = vectorLength * Math.cos(angle);
      const dy = vectorLength * Math.sin(angle);

      slopeVectors.push({ x, y, dx, dy });
    }
  }

  // Movable point for solution curve
  const initialPoint = useMovablePoint([1, 1], {
    constrain: ([x, y]) => [
      Math.max(-5, Math.min(5, x)),
      Math.max(-5, Math.min(5, y)),
    ],
  });

  // Euler's method to approximate solution curve
  const solutionPoints: [number, number][] = [];
  const dt = 0.05;

  // Forward integration
  let [cx, cy] = initialPoint.point;
  for (let i = 0; i < 200 && Math.abs(cx) < 6 && Math.abs(cy) < 6; i++) {
    solutionPoints.push([cx, cy]);
    const slope = getDyDx(cx, cy);
    cx += dt;
    cy += slope * dt;
  }

  // Backward integration
  [cx, cy] = initialPoint.point;
  const backwardPoints: [number, number][] = [];
  for (let i = 0; i < 200 && Math.abs(cx) < 6 && Math.abs(cy) < 6; i++) {
    backwardPoints.push([cx, cy]);
    const slope = getDyDx(cx, cy);
    cx -= dt;
    cy -= slope * dt;
  }

  return (
    <div>
      <h2 className="text-xl font-semibold text-content-primary mb-4">
        Slope Field Visualizer
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <div className="bg-surface-secondary rounded-lg overflow-hidden border border-edge-primary">
            <Mafs viewBox={{ x: [-5, 5], y: [-5, 5] }} height={400}>
              <Coordinates.Cartesian />

              {/* Slope field vectors */}
              {slopeVectors.map((v, i) => (
                <Vector
                  key={i}
                  tail={[v.x - v.dx / 2, v.y - v.dy / 2]}
                  tip={[v.x + v.dx / 2, v.y + v.dy / 2]}
                  color="#94a3b8"
                />
              ))}

              {/* Solution curve (forward) */}
              <Plot.Parametric
                xy={(t) => {
                  const idx = Math.floor(t * (solutionPoints.length - 1));
                  return solutionPoints[Math.min(idx, solutionPoints.length - 1)] || [0, 0];
                }}
                t={[0, 1]}
                color={Theme.blue}
                weight={2}
              />

              {/* Solution curve (backward) */}
              <Plot.Parametric
                xy={(t) => {
                  const idx = Math.floor(t * (backwardPoints.length - 1));
                  return backwardPoints[Math.min(idx, backwardPoints.length - 1)] || [0, 0];
                }}
                t={[0, 1]}
                color={Theme.blue}
                weight={2}
              />

              {/* Initial condition point */}
              {initialPoint.element}
            </Mafs>
          </div>

          <div className="mt-4 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
            <h3 className="text-sm font-semibold text-purple-800 dark:text-purple-200 mb-2">
              Differential Equation
            </h3>
            <p className="text-lg text-purple-700 dark:text-purple-300 font-mono">
              {getEquationLabel()}
            </p>
            <p className="text-sm text-purple-600 dark:text-purple-400 mt-2">
              Drag the blue point to see different solution curves passing through that initial condition.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <ControlPanel title="Equation Type">
            <select
              value={equationType}
              onChange={(e) => setEquationType(e.target.value as EquationType)}
              className="w-full px-3 py-2 rounded-lg border border-edge-secondary dark:border-edge-secondary bg-surface-secondary text-content-primary"
            >
              <option value="linear">Linear: dy/dx = ay + bx</option>
              <option value="separable">Separable: dy/dx = axy</option>
              <option value="autonomous">Autonomous: dy/dx = ay(1-y)</option>
            </select>
          </ControlPanel>

          <ControlPanel title="Parameters">
            <Slider
              label="a"
              value={a}
              onChange={(e) => setA(Number(e.target.value))}
              min={-2}
              max={2}
              step={0.1}
            />
            {equationType === 'linear' && (
              <Slider
                label="b"
                value={b}
                onChange={(e) => setB(Number(e.target.value))}
                min={-2}
                max={2}
                step={0.1}
              />
            )}
            <Slider
              label="Grid Density"
              value={gridDensity}
              onChange={(e) => setGridDensity(Number(e.target.value))}
              min={5}
              max={25}
            />
          </ControlPanel>

          <ControlPanel title="Initial Condition">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-content-tertiary">x₀:</span>
                <span className="font-medium text-content-primary">
                  {initialPoint.point[0].toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-content-tertiary">y₀:</span>
                <span className="font-medium text-content-primary">
                  {initialPoint.point[1].toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-content-tertiary">dy/dx at (x₀,y₀):</span>
                <span className="font-medium text-blue-600">
                  {getDyDx(initialPoint.point[0], initialPoint.point[1]).toFixed(3)}
                </span>
              </div>
            </div>
          </ControlPanel>

          <ControlPanel title="About">
            <p className="text-sm text-content-tertiary">
              A slope field shows the direction of solution curves at each point.
              The blue curve is a numerical approximation of the solution through
              the selected initial condition.
            </p>
          </ControlPanel>
        </div>
      </div>
    </div>
  );
}
