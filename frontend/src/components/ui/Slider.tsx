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
  return (
    <div className="w-full">
      {(label || showValue) && (
        <div className="flex items-center justify-between mb-2">
          {label && (
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {label}
            </label>
          )}
          {showValue && (
            <span className="text-sm font-bold text-candlelight-600 dark:text-candlelight-400 bg-candlelight-50 dark:bg-candlelight-950 px-2 py-0.5 rounded-lg">
              {value}
            </span>
          )}
        </div>
      )}
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-2 rounded-full appearance-none cursor-pointer bg-gray-200 dark:bg-gray-700 accent-candlelight-500"
      />
      <div className="flex justify-between mt-1">
        <span className="text-xs text-gray-400 dark:text-gray-500">{min}</span>
        <span className="text-xs text-gray-400 dark:text-gray-500">{max}</span>
      </div>
    </div>
  );
}
