import evaluateAnswer from '../utils/evaluateAnswer.js';

export async function generateQuestions({ role, difficulty, interviewType, questionCount }) {
  const response = await fetch('/api/interview/generate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      role,
      difficulty,
      interviewType,
      questionCount,
    }),
  });

  let payload = null;
  try {
    payload = await response.json();
  } catch {
    payload = null;
  }

  if (!response.ok) {
    const message = payload?.error || payload?.message || 'Unable to generate a new interview right now.';
    throw new Error(message);
  }

  if (!payload || !Array.isArray(payload.questions)) {
    throw new Error('Unable to generate a new interview right now.');
  }

  return payload.questions;
}

export { evaluateAnswer };

export function calculateFinalSummary({ role, difficulty, questions, evaluations }) {
  const totalQuestions = questions.length;
  const safeEvaluations = Array.from({ length: totalQuestions }, (_, index) => evaluations[index] || null);
  const completed = safeEvaluations.filter(Boolean);
  const divisor = Math.max(1, totalQuestions);

  const average = (key) => Math.round(safeEvaluations.reduce((sum, item) => sum + (item?.[key] || 0), 0) / divisor);

  const breakdown = {
    technicalKnowledge: average('accuracy'),
    communication: average('communication'),
    problemSolving: average('score'),
    answerRelevance: average('relevance'),
    completeness: average('completeness'),
  };

  const score = Math.max(0, Math.min(100, Math.round((breakdown.technicalKnowledge + breakdown.communication + breakdown.problemSolving + breakdown.answerRelevance + breakdown.completeness) / 5)));

  const strengths = Array.from(new Set(completed.flatMap((item) => item.strengths).slice(0, 3)));
  const improvements = Array.from(new Set(completed.flatMap((item) => item.improvements).slice(0, 3)));

  return {
    role: role.title,
    difficulty,
    totalQuestions,
    overallScore: score,
    breakdown,
    strengths: strengths.length > 0 ? strengths : ['Good technical fundamentals', 'Clear explanations', 'Strong problem-solving approach'],
    areasToImprove: improvements.length > 0 ? improvements : ['Add more detail', 'Tighten structure', 'Use stronger examples'],
    recommendation: score >= 80
      ? 'Keep pushing on advanced scenarios and practice concise, high-signal answers.'
      : improvements[0] || 'Focus on clearer structure and more role-specific detail in your answers.',
  };
}
