const AWS = require('aws-sdk');

class LoggingService {
  constructor() {
    this.dynamodb = new AWS.DynamoDB.DocumentClient({
      region: process.env.AWS_REGION || 'us-east-1'
    });
    this.tableName = process.env.DYNAMODB_TABLE_NAME || 'ChatbotLogs';
  }

  async logChatInteraction(interaction) {
    try {
      const item = {
        id: this.generateId(),
        userMessage: interaction.userMessage,
        botResponse: interaction.botResponse,
        timestamp: interaction.timestamp,
        createdAt: new Date().toISOString()
      };

      const params = {
        TableName: this.tableName,
        Item: item
      };

      await this.dynamodb.put(params).promise();
      console.log('Chat interaction logged successfully:', item.id);
    } catch (error) {
      console.error('Failed to log chat interaction:', error);
      // Don't throw error to avoid breaking the main chat flow
    }
  }

  generateId() {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  async getChatHistory(limit = 50) {
    try {
      const params = {
        TableName: this.tableName,
        Limit: limit,
        ScanIndexForward: false // Get most recent first
      };

      const result = await this.dynamodb.scan(params).promise();
      return result.Items || [];
    } catch (error) {
      console.error('Failed to retrieve chat history:', error);
      throw new Error('Failed to retrieve chat history');
    }
  }
}

module.exports = { LoggingService };