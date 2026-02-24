'use client';

import { InputHTMLAttributes, forwardRef } from 'react';

interface SliderProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  showValue?: boolean;
}

const Slider = forwardRef<HTMLInputElement, SliderProps>(
  ({ className = '', label, showValue = true, value, min, max, ...props }, ref) => {
    return (
      <div className="w-full">
        {(label || showValue) && (
          <div className="flex items-center justify-between mb-2">
            {label && (
              <label className="text-sm font-medium text-content-secondary">
                {label}
              </label>
            )}
            {showValue && (
              <span className="text-sm font-mono text-accent-primary font-medium">
                {value}
              </span>
            )}
          </div>
        )}
        <input
          ref={ref}
          type="range"
          value={value}
          min={min}
          max={max}
          className={`w-full h-1.5 bg-edge-secondary rounded-full appearance-none cursor-pointer accent-brand-500 ${className}`}
          {...props}
        />
        {(min !== undefined || max !== undefined) && (
          <div className="flex justify-between mt-1.5">
            <span className="text-xs text-content-muted">{min}</span>
            <span className="text-xs text-content-muted">{max}</span>
          </div>
        )}
      </div>
    );
  }
);

Slider.displayName = 'Slider';

export default Slider;
