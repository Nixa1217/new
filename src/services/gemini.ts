import axios from 'axios';

const GEMINI_API_KEY = process.env.VITE_GEMINI_API_KEY || '';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

interface GeminiMessage {
  role: 'user' | 'model';
  parts: Array<{ text: string }>;
}

export const geminiService = {
  generateText: async (prompt: string): Promise<string> => {
    try {
      const response = await axios.post(
        `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`,
        {
          contents: [
            {
              parts: [
                {
                  text: prompt,
                },
              ],
            },
          ],
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      const text =
        response.data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
      return text;
    } catch (error) {
      console.error('Gemini API error:', error);
      throw new Error('Failed to generate content');
    }
  },

  generateActions: async (goal: string, identity: string, emotion: string): Promise<string[]> => {
    const prompt = `You are a personal development coach. Based on this goal, core identity, and emotional state, generate 10 specific, actionable steps to achieve the goal.

Goal: ${goal}
Core Identity: ${identity}
Current Emotional State: ${emotion}

Provide exactly 10 action items as a numbered list. Each item should be specific and actionable.`;

    const text = await geminiService.generateText(prompt);
    const actions = text.split('\n').filter(line => line.match(/^\d+\./));
    return actions.map(action => action.replace(/^\d+\.\s*/, ''));
  },

  generateReflection: async (prompt: string, context: string): Promise<string> => {
    const fullPrompt = `You are a mindful reflection guide. Help the user explore this reflection prompt deeply and meaningfully.

Reflection Prompt: ${prompt}
Context: ${context}

Provide a thoughtful, insightful response that helps them go deeper into their reflection. Keep it concise but impactful.`;

    return geminiService.generateText(fullPrompt);
  },

  generateInsights: async (content: string, type: string): Promise<string> => {
    const prompt = `You are a personal development insights generator. Analyze this ${type} content and provide 2-3 key insights or patterns.

Content: ${content}

Provide brief, actionable insights in a numbered list format.`;

    return geminiService.generateText(prompt);
  },

  generateAffirmations: async (identity: string, goal: string): Promise<string[]> => {
    const prompt = `Generate 5 powerful, specific affirmations based on this identity and goal.

Core Identity: ${identity}
Goal: ${goal}

Create affirmations in the present tense that are personally empowering. Return as a numbered list.`;

    const text = await geminiService.generateText(prompt);
    const affirmations = text.split('\n').filter(line => line.match(/^\d+\./));
    return affirmations.map(aff => aff.replace(/^\d+\.\s*/, ''));
  },

  chatWithAI: async (message: string, conversationHistory?: GeminiMessage[]): Promise<string> => {
    const history = conversationHistory || [];
    const contents = [
      ...history,
      {
        role: 'user',
        parts: [{ text: message }],
      },
    ];

    try {
      const response = await axios.post(
        `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`,
        { contents },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      return response.data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
    } catch (error) {
      console.error('Gemini chat error:', error);
      throw new Error('Failed to generate response');
    }
  },
};
