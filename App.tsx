import React, { useReducer, useCallback, useState, useEffect } from 'react';
// FIX: `SurveyStepData` is exported from `types.ts`, not `constants.ts`.
import { SURVEY_STEPS } from './constants';
import { SurveyStepData, SurveyState, SurveyAction, SurveyAnswers, Proposal } from './types';
import Header from './components/Header';
import ProgressBar from './components/ProgressBar';
import SurveyStep from './components/SurveyStep';
import Results from './components/Results';
import { generateProposal } from './services/geminiService';

const initialState: SurveyState = {
  currentStep: 0,
  answers: {},
  isLoading: false,
  error: null,
  proposal: null,
};

function surveyReducer(state: SurveyState, action: SurveyAction): SurveyState {
  switch (action.type) {
    case 'NEXT_STEP':
      return { ...state, currentStep: Math.min(state.currentStep + 1, SURVEY_STEPS.length) };
    case 'PREV_STEP':
      return { ...state, currentStep: Math.max(state.currentStep - 1, 0) };
    case 'SET_ANSWER':
      return {
        ...state,
        answers: {
          ...state.answers,
          [action.payload.questionId]: action.payload.answer,
        },
      };
    case 'SUBMIT_START':
      return { ...state, isLoading: true, error: null };
    case 'SUBMIT_SUCCESS':
      return { ...state, isLoading: false, proposal: action.payload };
    case 'SUBMIT_ERROR':
      return { ...state, isLoading: false, error: action.payload };
    case 'RESET':
      return initialState;
    default:
      return state;
  }
}

const App: React.FC = () => {
  const [state, dispatch] = useReducer(surveyReducer, initialState);
  const { currentStep, answers, isLoading, error, proposal } = state;

  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined' && window.localStorage) {
      const storedTheme = window.localStorage.getItem('theme');
      if (storedTheme === 'dark' || storedTheme === 'light') {
        return storedTheme;
      }
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'light';
  });

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const totalSteps = SURVEY_STEPS.length;
  const isSurveyFinished = currentStep === totalSteps;

  const handleAnswerChange = (questionId: string, answer: string | string[]) => {
    dispatch({ type: 'SET_ANSWER', payload: { questionId, answer } });
  };

  const handleNext = () => {
    dispatch({ type: 'NEXT_STEP' });
  };

  const handleBack = () => {
    dispatch({ type: 'PREV_STEP' });
  };
  
  const handleReset = () => {
    dispatch({ type: 'RESET' });
  }

  const handleSubmit = useCallback(async (finalAnswers: SurveyAnswers) => {
    dispatch({ type: 'SUBMIT_START' });
    try {
      const result = await generateProposal(finalAnswers);
      dispatch({ type: 'SUBMIT_SUCCESS', payload: result });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
      dispatch({ type: 'SUBMIT_ERROR', payload: errorMessage });
    }
  }, []);

  React.useEffect(() => {
    if (isSurveyFinished && !proposal && !isLoading) {
      handleSubmit(answers);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSurveyFinished, proposal, isLoading, answers, handleSubmit]);

  const currentStepData: SurveyStepData | undefined = SURVEY_STEPS[currentStep];

  return (
    <div className="min-h-screen bg-neutral-light dark:bg-neutral-dark flex flex-col transition-colors duration-300">
      <Header onReset={handleReset} theme={theme} toggleTheme={toggleTheme} />
      <main className="flex-grow container mx-auto p-4 md:p-8 flex flex-col items-center">
        <div className="w-full max-w-4xl bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden transition-colors duration-300">
          <div className="p-6 md:p-10">
            <ProgressBar currentStep={currentStep} totalSteps={totalSteps} />
            
            {!isSurveyFinished && currentStepData ? (
              <SurveyStep
                stepData={currentStepData}
                answers={answers}
                onAnswerChange={handleAnswerChange}
                onNext={handleNext}
                onBack={handleBack}
                isFirstStep={currentStep === 0}
                isLastStep={currentStep === totalSteps - 1}
              />
            ) : (
              <Results isLoading={isLoading} error={error} proposal={proposal} onReset={handleReset} theme={theme} />
            )}
          </div>
        </div>
      </main>
      <footer className="text-center p-4 text-gray-500 dark:text-gray-400 text-sm transition-colors duration-300">
        &copy; {new Date().getFullYear()} HRD Needs Assessment System. All Rights Reserved.
      </footer>
    </div>
  );
};

export default App;