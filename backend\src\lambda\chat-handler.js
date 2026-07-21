const { LLMService } = require('../services/llm-service');
const { LoggingService } = require('../services/logging-service');

const llmService = new LLMService();
const loggingService = new LoggingService();

exports.handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Content-Type': 'application/json'
  };

  try {
    const { httpMethod, path } = event;

    // Health check endpoint
    if (httpMethod === 'GET' && path === '/') {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ status: 'healthy', timestamp: new Date().toISOString() })
      };
    }

    // CORS preflight
    if (httpMethod === 'OPTIONS') {
      return {
        statusCode: 200,
        headers,
        body: ''
      };
    }

    // Chat endpoint
    if (httpMethod === 'POST' && path === '/chat') {
      if (!event.body) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: 'Request body is required' })
        };
      }

      let requestBody;
      try {
        requestBody = JSON.parse(event.body);
      } catch (parseError) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: 'Invalid JSON in request body' })
        };
      }

      const { message } = requestBody;
      if (!message || typeof message !== 'string') {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: 'Message is required and must be a string' })
        };
      }

      // Get response from LLM service
      const response = await llmService.generateResponse(message);
      
      // Log the interaction
      await loggingService.logChatInteraction({
        userMessage: message,
        botResponse: response,
        timestamp: new Date().toISOString()
      });

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ response })
      };
    }

    // Route not found
    return {
      statusCode: 404,
      headers,
      body: JSON.stringify({ error: 'Route not found' })
    };

  } catch (error) {
    console.error('Lambda handler error:', error);
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Internal server error' })
    };
  }
};