const allowedOrigins = [
  'https://www.your-website.com',
  'https://your-website.com',
  'http://localhost:3000',
  'http://localhost:8080'
];

exports.handler = async (event) => {
  const origin = event.headers?.origin || event.headers?.Origin || '';
  const isAllowed = allowedOrigins.includes(origin);
  
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': isAllowed ? origin : '',
    'Access-Control-Allow-Credentials': true,
    'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
    'Access-Control-Allow-Methods': 'OPTIONS,POST',
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Vary': 'Origin'
  };

  // Handle preflight request
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  try {
    // Parse request body
    let body = {};
    if (event.body) {
      body = JSON.parse(event.body);
    }

    // Input validation
    if (!body.message) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Message is required' })
      };
    }

    // Process chat message (placeholder logic)
    const response = {
      message: `Received: ${body.message}`
    };

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(response)
    };
  } catch (error) {
    console.error('Error processing request:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Internal server error' })
    };
  }
};