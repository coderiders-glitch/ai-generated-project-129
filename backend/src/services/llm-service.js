const { Configuration, OpenAIApi } = require('openai');

class LLMService {
  constructor() {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY environment variable is required');
    }

    const configuration = new Configuration({
      apiKey: process.env.OPENAI_API_KEY,
    });
    this.openai = new OpenAIApi(configuration);
  }

  async generateResponse(message) {
    try {
      const completion = await this.openai.createChatCompletion({
        model: process.env.OPENAI_MODEL || 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are a helpful assistant. Provide clear and concise responses.'
          },
          {
            role: 'user',
            content: message
          }
        ],
        max_tokens: parseInt(process.env.MAX_TOKENS) || 150,
        temperature: parseFloat(process.env.TEMPERATURE) || 0.7
      });

      if (!completion.data.choices || completion.data.choices.length === 0) {
        throw new Error('No response generated from OpenAI');
      }

      return completion.data.choices[0].message.content.trim();
    } catch (error) {
      console.error('OpenAI API error:', error);
      
      if (error.response?.status === 401) {
        throw new Error('Invalid OpenAI API key');
      } else if (error.response?.status === 429) {
        throw new Error('OpenAI API rate limit exceeded');
      } else if (error.response?.status >= 500) {
        throw new Error('OpenAI API service unavailable');
      }
      
      throw new Error('Failed to generate response from OpenAI');
    }
  }
}

module.exports = { LLMService };