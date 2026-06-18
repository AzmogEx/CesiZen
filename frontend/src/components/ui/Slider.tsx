"use client";

import React from "react";

interface SliderProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  label?: string;
  showValue?: boolean;
}

export default function Slider({
  value,
  onChange,
  min = 1,
  max = 10,
  label,
  showValue = true,
}: SliderProps) {
  const rangeId = label
    ? `range-${label.toLowerCase().replace(/\s+/g, "-")}`
    : "range";

  return (
    <div className="fr-range-group">
      {(label || showValue) && (
        <label className="fr-label" htmlFor={rangeId}>
          {label}
          {showValue && (
            <span className="fr-hint-text">Valeur sélectionnée : {value}</span>
          )}
        </label>
      )}
      <div
        className="fr-range fr-range--sm"
        data-fr-js-range="true"
        data-fr-min={min}
        data-fr-max={max}
      >
        <span
          className="fr-range__output"
          aria-hidden="true"
        >{`${value}`}</span>
        <input
          id={rangeId}
          type="range"
          min={min}
          max={max}
          value={value}
          step={1}
          onChange={(e) => onChange(Number(e.target.value))}
        />
        <div className="fr-range__min" aria-hidden="true">
          {min}
        </div>
        <div className="fr-range__max" aria-hidden="true">
          {max}
        </div>
      </div>
    </div>
  );
}
