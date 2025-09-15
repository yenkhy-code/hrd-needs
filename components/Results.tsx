import React, { useRef, useState } from 'react';
import { Proposal } from '../types';
import LoadingSpinner from './LoadingSpinner';

interface ResultsProps {
  isLoading: boolean;
  error: string | null;
  proposal: Proposal | null;
  onReset: () => void;
  theme: 'light' | 'dark';
}

const Results: React.FC<ResultsProps> = ({ isLoading, error, proposal, onReset, theme }) => {
  const reportRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownloadPdf = async () => {
    const reportElement = reportRef.current;
    if (!reportElement || isDownloading) return;

    setIsDownloading(true);
    try {
      const { jsPDF } = window.jspdf;
      const canvas = await window.html2canvas(reportElement, {
        scale: 2, // Increase resolution for better quality
        useCORS: true,
        backgroundColor: theme === 'dark' ? '#1f2937' : '#ffffff',
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'p',
        unit: 'mm',
        format: 'a4',
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const canvasWidth = canvas.width;
      const canvasHeight = canvas.height;
      const ratio = canvasWidth / canvasHeight;

      const imgWidth = pdfWidth;
      const imgHeight = imgWidth / ratio;
      
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pdfHeight;

      while (heightLeft > 0) {
        position -= pdfHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pdfHeight;
      }
      
      pdf.save('HRD_진단_결과_보고서.pdf');
    } catch (err) {
      console.error("PDF 생성 중 오류가 발생했습니다:", err);
      alert("PDF를 생성하는 데 실패했습니다. 다시 시도해주세요.");
    } finally {
      setIsDownloading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="text-center py-20">
        <LoadingSpinner />
        <h2 className="mt-4 text-2xl font-bold text-primary">AI가 맞춤 제안서를 생성하고 있습니다...</h2>
        <p className="text-gray-600 dark:text-gray-400 mt-2 transition-colors duration-300">잠시만 기다려주세요. 최적의 교육 솔루션을 설계하고 있습니다.</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20 bg-red-50 dark:bg-red-900/20 p-8 rounded-lg">
        <h2 className="text-2xl font-bold text-red-600 dark:text-red-400">오류 발생</h2>
        <p className="text-red-500 dark:text-red-400 mt-2">{error}</p>
        <button
          onClick={onReset}
          className="mt-6 py-2 px-6 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-light transition duration-150"
        >
          처음으로 돌아가기
        </button>
      </div>
    );
  }

  if (!proposal) {
    return null; // Should not happen if logic is correct
  }
  
  const { addieAnalysis, trainingProposal } = proposal;

  return (
    <div className="animate-fade-in">
      <div ref={reportRef} className="p-1"> {/* Padding to prevent content cutoff */}
        <div className="space-y-12">
          <div>
            <h2 className="text-3xl font-bold text-primary border-b-2 border-secondary pb-2 mb-4">
              교육 니즈 진단 결과
            </h2>
            <p className="text-gray-700 dark:text-gray-300 transition-colors duration-300">작성해주신 내용을 바탕으로 AI가 분석한 교육 방향성 및 맞춤 제안서입니다.</p>
          </div>
          
          {/* ADDIE Model Analysis */}
          <section>
            <h3 className="text-2xl font-semibold text-neutral-dark dark:text-neutral-light mb-4 transition-colors duration-300">ADDIE 모델 기반 교육 방향성</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-primary/10 dark:bg-primary/20 p-6 rounded-lg transition-colors duration-300">
                <h4 className="font-bold text-lg text-primary dark:text-primary-light">분석 (Analysis)</h4>
                <p className="mt-2 text-gray-800 dark:text-gray-200">{addieAnalysis.analysis}</p>
              </div>
              <div className="bg-primary/10 dark:bg-primary/20 p-6 rounded-lg transition-colors duration-300">
                <h4 className="font-bold text-lg text-primary dark:text-primary-light">설계 (Design)</h4>
                <p className="mt-2 text-gray-800 dark:text-gray-200">{addieAnalysis.design}</p>
              </div>
              <div className="bg-primary/10 dark:bg-primary/20 p-6 rounded-lg transition-colors duration-300">
                <h4 className="font-bold text-lg text-primary dark:text-primary-light">개발 (Development)</h4>
                <p className="mt-2 text-gray-800 dark:text-gray-200">{addieAnalysis.development}</p>
              </div>
              <div className="bg-primary/10 dark:bg-primary/20 p-6 rounded-lg transition-colors duration-300">
                <h4 className="font-bold text-lg text-primary dark:text-primary-light">실행 (Implementation)</h4>
                <p className="mt-2 text-gray-800 dark:text-gray-200">{addieAnalysis.implementation}</p>
              </div>
              <div className="bg-primary/10 dark:bg-primary/20 p-6 rounded-lg md:col-span-2 transition-colors duration-300">
                <h4 className="font-bold text-lg text-primary dark:text-primary-light">평가 (Evaluation)</h4>
                <p className="mt-2 text-gray-800 dark:text-gray-200">{addieAnalysis.evaluation}</p>
              </div>
            </div>
          </section>

          {/* Training Proposal */}
          <section>
            <h3 className="text-2xl font-semibold text-neutral-dark dark:text-neutral-light mb-4 transition-colors duration-300">맞춤 교육 프로그램 제안서 (초안)</h3>
            <div className="border border-neutral dark:border-gray-700 rounded-lg p-6 shadow-sm transition-colors duration-300">
              <h4 className="text-2xl font-bold text-secondary text-center mb-6">{trainingProposal.title}</h4>
              
              <div className="space-y-6">
                <div>
                  <h5 className="font-bold text-primary dark:text-primary-light">교육 목표</h5>
                  <ul className="list-disc list-inside mt-2 text-gray-700 dark:text-gray-300 space-y-1">
                    {trainingProposal.objectives.map((obj, i) => <li key={i}>{obj}</li>)}
                  </ul>
                </div>
                <div>
                  <h5 className="font-bold text-primary dark:text-primary-light">교육 대상</h5>
                  <p className="mt-2 text-gray-700 dark:text-gray-300">{trainingProposal.targetAudience}</p>
                </div>
                <div>
                  <h5 className="font-bold text-primary dark:text-primary-light">추천 교육 방법</h5>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {trainingProposal.methods.map((method, i) => (
                      <span key={i} className="bg-secondary/20 text-secondary-dark dark:text-secondary-light dark:bg-secondary/30 text-sm font-medium px-3 py-1 rounded-full">{method}</span>
                    ))}
                  </div>
                </div>
                <div>
                  <h5 className="font-bold text-primary dark:text-primary-light">상세 커리큘럼</h5>
                  <div className="mt-2 border-t border-neutral dark:border-gray-700 pt-2">
                    {trainingProposal.curriculum.map((item, i) => (
                      <div key={i} className="py-3 border-b border-neutral-light dark:border-gray-700 last:border-b-0">
                        <div className="flex justify-between items-start">
                          <p className="font-semibold text-neutral-dark dark:text-gray-100">{item.module}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400 font-mono bg-neutral dark:bg-gray-700 px-2 py-0.5 rounded">{item.duration}</p>
                        </div>
                        <ul className="list-disc list-inside mt-1 ml-4 text-sm text-gray-600 dark:text-gray-400">
                          {item.topics.map((topic, j) => <li key={j}>{topic}</li>)}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
      <div className="text-center pt-8 flex flex-col sm:flex-row justify-center items-center gap-4">
        <button
          onClick={handleDownloadPdf}
          disabled={isDownloading}
          className="w-full sm:w-auto py-3 px-8 border border-secondary rounded-md shadow-lg text-base font-medium text-secondary-dark dark:text-secondary-light hover:bg-secondary/10 dark:hover:bg-secondary/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary-light transition duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-wait"
        >
          {isDownloading ? 'PDF 저장 중...' : 'PDF로 저장'}
        </button>
        <button
          onClick={onReset}
          className="w-full sm:w-auto py-3 px-8 border border-transparent rounded-md shadow-lg text-base font-medium text-white bg-secondary hover:bg-secondary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary-light transition duration-300 transform hover:scale-105"
        >
          새로운 진단 시작하기
        </button>
      </div>
    </div>
  );
};

export default Results;