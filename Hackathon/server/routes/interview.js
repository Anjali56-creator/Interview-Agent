import { Router } from 'express';
import { generateInterviewQuestions } from '../services/geminiService.js';

const router = Router();

router.post('/generate', async (request, response, next) => {
  try {
    const { role, difficulty, interviewType, questionCount } = request.body || {};

    if (!role || typeof role !== 'string') {
      return response.status(400).json({ error: 'Role is required.' });
    }

    if (!difficulty || typeof difficulty !== 'string') {
      return response.status(400).json({ error: 'Difficulty is required.' });
    }

    if (!interviewType || typeof interviewType !== 'string') {
      return response.status(400).json({ error: 'Interview type is required.' });
    }

    const count = Number(questionCount);
    if (!Number.isInteger(count) || count < 1 || count > 15) {
      return response.status(400).json({ error: 'Question count must be between 1 and 15.' });
    }

    const questions = await generateInterviewQuestions({
      role,
      difficulty,
      interviewType,
      questionCount: count,
    });

    return response.json({
      questions,
    });
  } catch (error) {
    return next(error);
  }
});

export default router;