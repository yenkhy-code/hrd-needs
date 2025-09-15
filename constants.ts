import { SurveyStepData } from './types';

export const SURVEY_STEPS: SurveyStepData[] = [
  {
    id: 1,
    title: '조직 현황 진단',
    description: '조직의 현재 상황과 비즈니스 목표를 파악하여 교육의 큰 방향을 설정합니다.',
    questions: [
      { id: 'q1_company_goals', text: '회사의 주요 비즈니스 목표는 무엇인가요?', type: 'textarea' },
      { id: 'q1_challenges', text: '현재 조직이 직면한 가장 큰 어려움이나 문제는 무엇인가요?', type: 'textarea' },
      { id: 'q1_culture', text: '조직의 문화나 분위기를 설명해주세요. (예: 성과 중심, 안정 지향, 혁신적 등)', type: 'text' },
    ],
  },
  {
    id: 2,
    title: '교육 목표 설정',
    description: '이번 교육을 통해 달성하고자 하는 구체적인 목표를 명확히 합니다.',
    questions: [
      { id: 'q2_edu_goals', text: '교육을 통해 직원들이 어떤 지식이나 기술을 습득하길 원하시나요?', type: 'textarea' },
      { id: 'q2_behavior_change', text: '교육 후 직원들의 행동이 어떻게 변화하길 기대하시나요?', type: 'textarea' },
      { id: 'q2_performance_impact', text: '교육의 성공이 조직의 어떤 성과 지표(KPI)에 긍정적인 영향을 미칠 것이라 생각하시나요?', type: 'text' },
    ],
  },
  {
    id: 3,
    title: '참가자 특성 파악',
    description: '교육에 참여할 대상 그룹의 특성을 이해하여 맞춤형 과정을 설계합니다.',
    questions: [
      { id: 'q3_target_audience', text: '주요 교육 대상은 누구인가요? (예: 신입사원, 팀장, 전사원 등)', type: 'text' },
      { id: 'q3_current_level', text: '교육 대상의 현재 직무 지식 및 기술 수준은 어느 정도인가요?', type: 'radio', options: ['초급', '중급', '고급'] },
      { id: 'q3_motivation', text: '교육에 대한 참가자들의 예상 참여도나 동기부여 수준은 어떠할 것이라 생각하시나요?', type: 'radio', options: ['낮음', '보통', '높음'] },
    ],
  },
  {
    id: 4,
    title: '교육 환경 분석',
    description: '교육을 진행하는 데 필요한 환경적 요소를 점검합니다.',
    questions: [
      { id: 'q4_budget', text: '교육에 할당된 예산은 어느 정도인가요?', type: 'text' },
      { id: 'q4_timeline', text: '언제까지 교육이 진행되기를 희망하시나요?', type: 'text' },
      { id: 'q4_preferred_method', text: '선호하는 교육 방식이 있으신가요?', type: 'checkbox', options: ['오프라인 강의', '온라인 라이브', '동영상 VOD', '워크숍', '코칭/멘토링'] },
    ],
  },
];
