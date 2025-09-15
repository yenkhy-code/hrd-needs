import React from 'react';
import { SurveyStepData, SurveyAnswers, Question } from '../types';

interface SurveyStepProps {
  stepData: SurveyStepData;
  answers: SurveyAnswers;
  onAnswerChange: (questionId: string, answer: string | string[]) => void;
  onNext: () => void;
  onBack: () => void;
  isFirstStep: boolean;
  isLastStep: boolean;
}

const QuestionRenderer: React.FC<{ question: Question; value: any; onChange: (value: any) => void; }> = ({ question, value, onChange }) => {
  switch (question.type) {
    case 'text':
      return (
        <input
          type="text"
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          className="mt-2 block w-full px-3 py-2 bg-white dark:bg-gray-700 dark:text-white border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm transition-colors duration-300"
          placeholder={`${question.text}에 대한 답변을 입력해주세요.`}
        />
      );
    case 'textarea':
      return (
        <textarea
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          rows={4}
          className="mt-2 block w-full px-3 py-2 bg-white dark:bg-gray-700 dark:text-white border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm transition-colors duration-300"
          placeholder={`${question.text}에 대한 답변을 입력해주세요.`}
        />
      );
    case 'radio':
      return (
        <div className="mt-2 space-y-2">
          {question.options?.map((option) => (
            <label key={option} className="flex items-center cursor-pointer">
              <input
                type="radio"
                name={question.id}
                value={option}
                checked={value === option}
                onChange={(e) => onChange(e.target.value)}
                className="h-4 w-4 text-primary focus:ring-primary border-gray-300 dark:border-gray-600"
              />
              <span className="ml-3 text-sm text-gray-700 dark:text-gray-300">{option}</span>
            </label>
          ))}
        </div>
      );
    case 'checkbox':
      const handleCheckboxChange = (option: string, checked: boolean) => {
        const currentValues = Array.isArray(value) ? [...value] : [];
        if (checked) {
          onChange([...currentValues, option]);
        } else {
          onChange(currentValues.filter((v) => v !== option));
        }
      };
      return (
        <div className="mt-2 space-y-2">
          {question.options?.map((option) => (
            <label key={option} className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                value={option}
                checked={Array.isArray(value) && value.includes(option)}
                onChange={(e) => handleCheckboxChange(option, e.target.checked)}
                className="h-4 w-4 text-primary focus:ring-primary border-gray-300 dark:border-gray-600 rounded"
              />
              <span className="ml-3 text-sm text-gray-700 dark:text-gray-300">{option}</span>
            </label>
          ))}
        </div>
      );
    default:
      return null;
  }
};

const SurveyStep: React.FC<SurveyStepProps> = ({ stepData, answers, onAnswerChange, onNext, onBack, isFirstStep, isLastStep }) => {
  return (
    <div className="animate-fade-in">
      <h2 className="text-3xl font-bold text-primary">{stepData.title}</h2>
      <p className="mt-2 text-gray-600 dark:text-gray-300 transition-colors duration-300">{stepData.description}</p>
      
      <div className="mt-8 space-y-6">
        {stepData.questions.map((q) => (
          <div key={q.id}>
            <label className="text-lg font-semibold text-neutral-dark dark:text-neutral-light transition-colors duration-300">{q.text}</label>
            <QuestionRenderer
              question={q}
              value={answers[q.id]}
              onChange={(answer) => onAnswerChange(q.id, answer)}
            />
          </div>
        ))}
      </div>

      <div className="mt-10 flex justify-between">
        <button
          onClick={onBack}
          disabled={isFirstStep}
          className="py-2 px-6 border border-gray-300 dark:border-gray-500 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-600 hover:bg-gray-50 dark:hover:bg-gray-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-150"
        >
          이전
        </button>
        <button
          onClick={onNext}
          className="py-2 px-6 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-secondary hover:bg-secondary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary-light transition-all duration-150"
        >
          {isLastStep ? '진단 결과 보기' : '다음'}
        </button>
      </div>
    </div>
  );
};

export default SurveyStep;