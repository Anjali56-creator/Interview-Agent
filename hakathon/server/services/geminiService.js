const roleProfiles = {
  'Software Engineer': {
    category: 'technical',
    topics: ['algorithms', 'debugging', 'system design', 'testing', 'APIs', 'architecture', 'scalability'],
  },
  'Frontend Developer': {
    category: 'technical',
    topics: ['React state management', 'component architecture', 'accessibility', 'performance', 'UX', 'rendering'],
  },
  'Backend Developer': {
    category: 'technical',
    topics: ['REST APIs', 'authentication', 'databases', 'caching', 'concurrency', 'security', 'performance'],
  },
  'Full Stack Developer': {
    category: 'technical',
    topics: ['API integration', 'state management', 'deployment', 'authentication', 'databases', 'scalability'],
  },
  'Data Analyst': {
    category: 'technical',
    topics: ['SQL', 'dashboards', 'trend analysis', 'data quality', 'visualization', 'stakeholders'],
  },
  'Data Scientist': {
    category: 'technical',
    topics: ['statistics', 'feature engineering', 'model evaluation', 'experimentation', 'Python', 'metrics'],
  },
  'Machine Learning Engineer': {
    category: 'technical',
    topics: ['model deployment', 'monitoring', 'feature pipelines', 'ML ops', 'latency', 'optimization'],
  },
  'DevOps Engineer': {
    category: 'technical',
    topics: ['CI/CD', 'containers', 'observability', 'automation', 'cloud', 'reliability'],
  },
  'QA Engineer': {
    category: 'technical',
    topics: ['test strategy', 'automation', 'regression testing', 'edge cases', 'quality', 'coverage'],
  },
  'Cybersecurity Analyst': {
    category: 'technical',
    topics: ['threat modeling', 'incident response', 'security controls', 'risk mitigation', 'authentication', 'logging'],
  },
  'UI/UX Designer': {
    category: 'non-technical',
    topics: ['user research', 'interaction design', 'design systems', 'prototyping', 'feedback', 'accessibility'],
  },
  'Graphic Designer': {
    category: 'non-technical',
    topics: ['visual hierarchy', 'brand consistency', 'creative direction', 'typography', 'layout', 'identity'],
  },
  'Product Manager': {
    category: 'non-technical',
    topics: ['strategy', 'prioritization', 'stakeholders', 'metrics', 'tradeoffs', 'roadmaps'],
  },
  'Business Analyst': {
    category: 'non-technical',
    topics: ['requirements gathering', 'process mapping', 'gap analysis', 'documentation', 'stakeholders', 'workflows'],
  },
  HR: {
    category: 'non-technical',
    topics: ['behavioral interviewing', 'employee experience', 'policy', 'conflict resolution', 'people ops', 'communication'],
  },
};

const difficultyGuidance = {
  Beginner: 'Focus on fundamentals, clear definitions, and simple examples.',
  Intermediate: 'Focus on practical scenarios, implementation tradeoffs, and applied judgment.',
  Advanced: 'Focus on architecture, scale, tradeoffs, risk, and production-level thinking.',
};

const interviewTypeGuidance = {
  Technical: 'Ask mostly technical questions, with practical depth where appropriate.',
  Behavioral: 'Ask questions that explore collaboration, communication, ownership, and decision making.',
  Mixed: 'Mix conceptual, practical, scenario-based, and behavioral questions so the interview feels realistic.',
};

const buildPrompt = ({ role, difficulty, interviewType, questionCount }) => {
  const profile = roleProfiles[role] || { category: 'technical', topics: ['core concepts', 'practical scenarios', 'tradeoffs'] };
  const topics = profile.topics.join(', ');

  return `
Generate ${questionCount} unique interview questions for a ${role} interview at ${difficulty} difficulty.

Interview type: ${interviewType}

Role category: ${profile.category}
Relevant topic areas: ${topics}

Requirements:
- Questions must be relevant to ${role}.
- Match ${difficulty} difficulty.
- ${difficultyGuidance[difficulty] || difficultyGuidance.Intermediate}
- ${interviewTypeGuidance[interviewType] || interviewTypeGuidance.Mixed}
- Cover multiple different topic areas.
- Do not repeat questions.
- Do not generate generic questions unrelated to the role.
- Each question should test a different concept.
- Questions should resemble real software and career interviews.
- Return ONLY valid JSON in this exact shape:
{
  "questions": [
    {
      "id": "q1",
      "question": "...",
      "topic": "...",
      "type": "technical|behavioral|mixed",
      "difficulty": "${difficulty}"
    }
  ]
}
`;
};

const stripCodeFences = (value) => value.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim();

const normalizeQuestion = (question, index, role, difficulty) => {
  if (!question || typeof question.question !== 'string' || !question.question.trim()) {
    throw new Error('Gemini returned an invalid question payload.');
  }

  const normalizedType = ['technical', 'behavioral', 'mixed'].includes(String(question.type).toLowerCase())
    ? String(question.type).toLowerCase()
    : 'mixed';

  return {
    id: question.id || `q${index + 1}`,
    question: question.question.trim(),
    topic: String(question.topic || 'General').trim(),
    type: normalizedType,
    difficulty,
    role,
  };
};

const validateQuestions = ({ questions, role, difficulty, questionCount }) => {
  if (!Array.isArray(questions)) {
    throw new Error('Gemini response did not contain a valid questions array.');
  }

  if (questions.length !== questionCount) {
    throw new Error('Gemini returned the wrong number of questions.');
  }

  const seen = new Set();
  const roleHints = (roleProfiles[role]?.topics || []).map((item) => item.toLowerCase());

  return questions.map((item, index) => {
    const normalized = normalizeQuestion(item, index, role, difficulty);

    const duplicateKey = normalized.question.toLowerCase();
    if (seen.has(duplicateKey)) {
      throw new Error('Gemini returned duplicate questions.');
    }
    seen.add(duplicateKey);

    const belongsToRole = roleHints.some((hint) => duplicateKey.includes(hint) || normalized.topic.toLowerCase().includes(hint));
    if (!belongsToRole) {
      throw new Error('Gemini returned questions that do not match the requested role.');
    }

    return normalized;
  });
};

export async function generateInterviewQuestions({ role, difficulty, interviewType, questionCount }) {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error('Gemini API key is missing.');
  }

  const prompt = buildPrompt({ role, difficulty, interviewType, questionCount });

  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      contents: [
        {
          role: 'user',
          parts: [{ text: prompt }],
        },
      ],
      generationConfig: {
        temperature: 1,
        topP: 0.95,
        topK: 40,
        maxOutputTokens: 2048,
        responseMimeType: 'application/json',
      },
    }),
  });

  const raw = await response.text();

  if (!response.ok) {
    throw new Error('Gemini failed to generate a new interview.');
  }

  let text = raw;
  try {
    const payload = JSON.parse(raw);
    text = payload?.candidates?.[0]?.content?.parts?.map((part) => part.text || '').join('') || raw;
  } catch {
    // keep raw text for parsing below
  }

  const parsed = JSON.parse(stripCodeFences(text));
  const questions = validateQuestions({ questions: parsed.questions, role, difficulty, questionCount });

  return questions;
}