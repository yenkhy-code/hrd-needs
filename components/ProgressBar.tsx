import React from 'react';
import { SURVEY_STEPS } from '../constants';

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ currentStep, totalSteps }) => {
  const progressPercentage = currentStep > totalSteps ? 100 : (currentStep / totalSteps) * 100;

  return (
    <div className="mb-8">
      <div className="flex justify-between mb-2">
        {SURVEY_STEPS.map((step, index) => (
          <div key={step.id} className="text-center w-1/4">
            <div
              className={`text-sm font-semibold transition-colors duration-300 ${index <= currentStep ? 'text-primary' : 'text-gray-400 dark:text-gray-500'}`}
            >
              {step.title}
            </div>
          </div>
        ))}
        <div className="text-center w-1/4">
             <div className={`text-sm font-semibold transition-colors duration-300 ${currentStep >= totalSteps ? 'text-primary' : 'text-gray-400 dark:text-gray-500'}`}>
                진단 결과
             </div>
        </div>
      </div>
      <div className="w-full bg-neutral dark:bg-gray-700 rounded-full h-2.5 transition-colors duration-300">
        <div
          className="bg-secondary h-2.5 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${progressPercentage}%` }}
        ></div>
      </div>
    </div>
  );
};

export default ProgressBar;