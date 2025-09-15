import { GoogleGenAI, Type } from "@google/genai";
import { SurveyAnswers, Proposal } from "../types";
import { SURVEY_STEPS } from "../constants";

// This is a placeholder for the API key.
// In a real application, this should be handled securely.
const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  // In a real app, you might have a more sophisticated error handling or UI feedback.
  console.error("API_KEY is not set. Please set it in your environment variables.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

function formatAnswersForPrompt(answers: SurveyAnswers): string {
  let formattedString = "다음은 기업 교육 니즈 진단 설문조사 결과입니다:\n\n";

  SURVEY_STEPS.forEach(step => {
    formattedString += `--- ${step.title} ---\n`;
    step.questions.forEach(question => {
      const answer = answers[question.id];
      if (answer) {
        const formattedAnswer = Array.isArray(answer) ? answer.join(', ') : answer;
        formattedString += `Q: ${question.text}\nA: ${formattedAnswer}\n`;
      }
    });
    formattedString += "\n";
  });

  return formattedString;
}

const responseSchema = {
  type: Type.OBJECT,
  properties: {
    addieAnalysis: {
      type: Type.OBJECT,
      properties: {
        analysis: { type: Type.STRING, description: "분석(Analysis) 단계 요약" },
        design: { type: Type.STRING, description: "설계(Design) 단계 요약" },
        development: { type: Type.STRING, description: "개발(Development) 단계 요약" },
        implementation: { type: Type.STRING, description: "실행(Implementation) 단계 요약" },
        evaluation: { type: Type.STRING, description: "평가(Evaluation) 단계 요약" },
      },
      required: ["analysis", "design", "development", "implementation", "evaluation"],
    },
    trainingProposal: {
      type: Type.OBJECT,
      properties: {
        title: { type: Type.STRING, description: "교육 프로그램 제목" },
        objectives: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description: "교육 목표 목록",
        },
        targetAudience: { type: Type.STRING, description: "핵심 교육 대상" },
        curriculum: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              module: { type: Type.STRING, description: "모듈 또는 세션 이름" },
              topics: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "해당 모듈의 세부 주제 목록",
              },
              duration: { type: Type.STRING, description: "예상 소요 시간 (예: 4시간)" },
            },
            required: ["module", "topics", "duration"],
          },
        },
        methods: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description: "추천 교육 방법 목록",
        },
      },
      required: ["title", "objectives", "targetAudience", "curriculum", "methods"],
    },
  },
  required: ["addieAnalysis", "trainingProposal"],
};

export async function generateProposal(answers: SurveyAnswers): Promise<Proposal> {
  const formattedAnswers = formatAnswersForPrompt(answers);

  const prompt = `
    당신은 최고의 HRD 컨설턴트입니다. 제공된 설문조사 결과를 바탕으로, 다음 두 가지 작업을 수행해주세요:
    1. ADDIE 모델(분석, 설계, 개발, 실행, 평가)의 각 단계에 맞춰 설문 결과를 분석하고 핵심 내용을 요약해주세요.
    2. 분석 내용을 기반으로 맞춤형 교육 프로그램 제안서 초안을 작성해주세요. 제안서에는 교육명, 목표, 대상, 커리큘럼(모듈, 주요 내용, 시간), 추천 교육 방법이 포함되어야 합니다.

    모든 결과는 반드시 지정된 JSON 형식으로만 응답해야 합니다.

    [설문조사 결과]
    ${formattedAnswers}
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        temperature: 0.7,
      },
    });

    const jsonText = response.text.trim();
    // Gemini can sometimes wrap the JSON in ```json ... ```, so we need to clean it.
    const cleanedJsonText = jsonText.replace(/^```json\s*|```$/g, '');
    const parsedResponse = JSON.parse(cleanedJsonText);
    
    return parsedResponse as Proposal;
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("Failed to generate proposal from AI. Please try again.");
  }
}
