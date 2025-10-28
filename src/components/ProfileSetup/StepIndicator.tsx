import React from 'react';
import { Check } from 'lucide-react';

interface Step {
  id: number;
  title: string;
  completed: boolean;
}

interface StepIndicatorProps {
  steps: Step[];
  currentStep: number;
}

export default function StepIndicator({ steps, currentStep }: StepIndicatorProps) {
  return (
    <div className="w-full py-6">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <React.Fragment key={step.id}>
            <div className="flex flex-col items-center flex-1">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all ${
                  step.completed
                    ? 'bg-green-500 text-white'
                    : currentStep === step.id
                    ? 'bg-blue-600 text-white ring-4 ring-blue-100'
                    : 'bg-gray-200 text-gray-600'
                }`}
              >
                {step.completed ? (
                  <Check className="w-5 h-5" />
                ) : (
                  step.id
                )}
              </div>
              <p
                className={`mt-2 text-xs sm:text-sm font-medium ${
                  currentStep === step.id
                    ? 'text-blue-600'
                    : step.completed
                    ? 'text-green-600'
                    : 'text-gray-500'
                }`}
              >
                {step.title}
              </p>
            </div>
            {index < steps.length - 1 && (
              <div className="flex-1 h-1 mx-2 -mt-10">
                <div
                  className={`h-full rounded transition-all ${
                    step.completed ? 'bg-green-500' : 'bg-gray-200'
                  }`}
                />
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
