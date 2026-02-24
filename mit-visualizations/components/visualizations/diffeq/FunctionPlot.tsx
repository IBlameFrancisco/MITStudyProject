'use client';

import { useState } from 'react';
import { Mafs, Coordinates, Plot, Theme } from 'mafs';
import 'mafs/core.css';
import Slider from '@/components/ui/Slider';
import ControlPanel from '@/components/ui/ControlPanel';

type SolutionType = 'exponential' | 'oscillatory' | 'damped' | 'logistic';

export default function FunctionPlot() {
  const [solutionType, setSolutionType] = useState<SolutionType>('exponential');
  const [param1, setParam1] = useState(1);
  const [param2, setParam2] = useState(1);
  const [param3, setParam3] = useState(0.5);
  const [y0, setY0] = useState(1);

  const getSolution = (t: number): number => {
    switch (solutionType) {
      case 'exponential':
        // y' = ky, y(0) = y0  =>  y = y0 * e^(kt)
        return y0 * Math.exp(param1 * t);
      case 'oscillatory':
        // y'' + omega^2 y = 0, y(0) = y0, y'(0) = v0
        // y = y0 * cos(omega*t) + (v0/omega) * sin(omega*t)
        return y0 * Math.cos(param1 * t) + (param2 / param1) * Math.sin(param1 * t);
      case 'damped':
        // y'' + 2*zeta*omega*y' + omega^2*y = 0 (underdamped case)
        // y = y0 * e^(-zeta*omega*t) * cos(omega_d*t)
        const zeta = param2;
        const omega = param1;
        const omegaD = omega * Math.sqrt(Math.max(0, 1 - zeta * zeta));
        if (zeta >= 1) {
          // Overdamped or critically damped
          return y0 * Math.exp(-omega * t);
        }
        return y0 * Math.exp(-zeta * omega * t) * Math.cos(omegaD * t);
      case 'logistic':
        // y' = ry(1 - y/K), y(0) = y0
        // y = K / (1 + ((K-y0)/y0) * e^(-rt))
        const r = param1;
        const K = param2;
        if (y0 <= 0) return 0;
        return K / (1 + ((K - y0) / y0) * Math.exp(-r * t));
      default:
        return 0;
    }
  };

  const getEquationInfo = (): { ode: string; solution: string; description: string } => {
    switch (solutionType) {
      case 'exponential':
        return {
          ode: `dy/dt = ${param1.toFixed(1)}y`,
          solution: `y(t) = ${y0.toFixed(1)} × e^(${param1.toFixed(1)}t)`,
          description: param1 > 0 ? 'Exponential growth' : param1 < 0 ? 'Exponential decay' : 'Constant',
        };
      case 'oscillatory':
        return {
          ode: `d²y/dt² + ${(param1*param1).toFixed(1)}y = 0`,
          solution: `y(t) = ${y0.toFixed(1)}cos(${param1.toFixed(1)}t) + ${(param2/param1).toFixed(1)}sin(${param1.toFixed(1)}t)`,
          description: 'Simple harmonic motion',
        };
      case 'damped':
        const damping = param2 < 1 ? 'Underdamped' : param2 === 1 ? 'Critically damped' : 'Overdamped';
        return {
          ode: `d²y/dt² + ${(2*param2*param1).toFixed(1)}dy/dt + ${(param1*param1).toFixed(1)}y = 0`,
          solution: `y(t) = ${y0.toFixed(1)} × e^(-${(param2*param1).toFixed(1)}t) × cos(ωdt)`,
          description: damping,
        };
      case 'logistic':
        return {
          ode: `dy/dt = ${param1.toFixed(1)}y(1 - y/${param2.toFixed(0)})`,
          solution: `y(t) = ${param2.toFixed(0)} / (1 + ${((param2-y0)/y0).toFixed(1)}e^(-${param1.toFixed(1)}t))`,
          description: `Carrying capacity K = ${param2.toFixed(0)}`,
        };
      default:
        return { ode: '', solution: '', description: '' };
    }
  };

  const info = getEquationInfo();

  return (
    <div>
      <h2 className="text-xl font-semibold text-content-primary mb-4">
        ODE Solution Plotter
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <div className="bg-surface-secondary rounded-lg overflow-hidden border border-edge-primary">
            <Mafs
              viewBox={{
                x: [-1, 10],
                y: solutionType === 'logistic' ? [-1, param2 * 1.5] : [-5, 5],
              }}
              height={400}
            >
              <Coordinates.Cartesian
                xAxis={{ labels: (x) => x.toFixed(0) }}
                yAxis={{ labels: (y) => y.toFixed(1) }}
              />

              {/* Solution curve */}
              <Plot.OfX
                y={getSolution}
                color={Theme.blue}
                weight={2}
              />

              {/* Equilibrium lines for logistic */}
              {solutionType === 'logistic' && (
                <>
                  <Plot.OfX y={() => 0} color="#94a3b8" weight={1} style="dashed" />
                  <Plot.OfX y={() => param2} color="#94a3b8" weight={1} style="dashed" />
                </>
              )}

              {/* Zero line for oscillatory */}
              {(solutionType === 'oscillatory' || solutionType === 'damped') && (
                <Plot.OfX y={() => 0} color="#94a3b8" weight={1} style="dashed" />
              )}

              {/* Envelope for damped oscillation */}
              {solutionType === 'damped' && param2 < 1 && (
                <>
                  <Plot.OfX
                    y={(t) => y0 * Math.exp(-param2 * param1 * t)}
                    color="#ef4444"
                    weight={1}
                    style="dashed"
                  />
                  <Plot.OfX
                    y={(t) => -y0 * Math.exp(-param2 * param1 * t)}
                    color="#ef4444"
                    weight={1}
                    style="dashed"
                  />
                </>
              )}
            </Mafs>
          </div>

          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <h3 className="text-xs font-semibold text-blue-800 dark:text-blue-200 mb-1">
                ODE
              </h3>
              <p className="text-sm text-blue-700 dark:text-blue-300 font-mono">
                {info.ode}
              </p>
            </div>
            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <h3 className="text-xs font-semibold text-green-800 dark:text-green-200 mb-1">
                Solution
              </h3>
              <p className="text-sm text-green-700 dark:text-green-300 font-mono break-all">
                {info.solution}
              </p>
            </div>
            <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <h3 className="text-xs font-semibold text-purple-800 dark:text-purple-200 mb-1">
                Behavior
              </h3>
              <p className="text-sm text-purple-700 dark:text-purple-300">
                {info.description}
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <ControlPanel title="Solution Type">
            <select
              value={solutionType}
              onChange={(e) => setSolutionType(e.target.value as SolutionType)}
              className="w-full px-3 py-2 rounded-lg border border-edge-secondary dark:border-edge-secondary bg-surface-secondary text-content-primary"
            >
              <option value="exponential">Exponential (1st order)</option>
              <option value="oscillatory">Oscillatory (2nd order)</option>
              <option value="damped">Damped (2nd order)</option>
              <option value="logistic">Logistic (nonlinear)</option>
            </select>
          </ControlPanel>

          <ControlPanel title="Parameters">
            {solutionType === 'exponential' && (
              <>
                <Slider
                  label="k (growth rate)"
                  value={param1}
                  onChange={(e) => setParam1(Number(e.target.value))}
                  min={-2}
                  max={2}
                  step={0.1}
                />
              </>
            )}

            {solutionType === 'oscillatory' && (
              <>
                <Slider
                  label="ω (frequency)"
                  value={param1}
                  onChange={(e) => setParam1(Number(e.target.value))}
                  min={0.1}
                  max={3}
                  step={0.1}
                />
                <Slider
                  label="v₀ (initial velocity)"
                  value={param2}
                  onChange={(e) => setParam2(Number(e.target.value))}
                  min={-3}
                  max={3}
                  step={0.1}
                />
              </>
            )}

            {solutionType === 'damped' && (
              <>
                <Slider
                  label="ω (natural freq)"
                  value={param1}
                  onChange={(e) => setParam1(Number(e.target.value))}
                  min={0.1}
                  max={3}
                  step={0.1}
                />
                <Slider
                  label="ζ (damping ratio)"
                  value={param2}
                  onChange={(e) => setParam2(Number(e.target.value))}
                  min={0}
                  max={2}
                  step={0.05}
                />
              </>
            )}

            {solutionType === 'logistic' && (
              <>
                <Slider
                  label="r (growth rate)"
                  value={param1}
                  onChange={(e) => setParam1(Number(e.target.value))}
                  min={0.1}
                  max={2}
                  step={0.1}
                />
                <Slider
                  label="K (carrying capacity)"
                  value={param2}
                  onChange={(e) => setParam2(Number(e.target.value))}
                  min={1}
                  max={10}
                  step={0.5}
                />
              </>
            )}
          </ControlPanel>

          <ControlPanel title="Initial Condition">
            <Slider
              label="y(0)"
              value={y0}
              onChange={(e) => setY0(Number(e.target.value))}
              min={solutionType === 'logistic' ? 0.1 : -3}
              max={solutionType === 'logistic' ? param2 * 1.5 : 3}
              step={0.1}
            />
          </ControlPanel>

          <ControlPanel title="About">
            <p className="text-sm text-content-tertiary">
              Explore closed-form solutions to common differential equations.
              Adjust parameters to see how they affect the solution behavior.
            </p>
          </ControlPanel>
        </div>
      </div>
    </div>
  );
}
