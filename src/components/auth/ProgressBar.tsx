
import React from "react";

type ProgressBarProps = {
  step: number;
  onStepClick?: (idx: number) => void;
  maxStep?: number;
  steps: string[];
}

const ProgressBar = ({ step, onStepClick, maxStep, steps }: ProgressBarProps) => (
  <div className="flex items-center justify-center mb-6">
    {steps.map((label, idx) => (
      <div key={label} className="flex items-center">
        <button
          type="button"
          className={`rounded-full border-2 w-8 h-8 flex items-center justify-center font-bold text-lg transition-all duration-200 focus:outline-none ${step === idx + 1 ? 'border-blue-600 text-blue-600 bg-white' : step > idx + 1 ? 'border-blue-400 text-blue-400 bg-white' : 'border-gray-300 text-gray-400 bg-white'} ${onStepClick && idx + 1 < step ? 'cursor-pointer hover:border-blue-600' : 'cursor-default'}`}
          onClick={() => onStepClick && idx + 1 < step && onStepClick(idx + 1)}
          disabled={!onStepClick || idx + 1 >= step}
          aria-label={`Go to step ${idx + 1}`}
        >
          {idx + 1}
        </button>
        {idx < steps.length - 1 && <div className={`h-1 w-8 ${step > idx + 1 ? 'bg-blue-400' : 'bg-gray-200'}`}></div>}
      </div>
    ))}
  </div>
);

export default ProgressBar;
