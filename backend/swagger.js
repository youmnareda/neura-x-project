const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'BrainScan API Documentation',
      version: '1.0.0',
      description: 'API documentation for BrainScan application',
      contact: {
        name: 'BrainScan Support',
        email: 'support@brainscan.com'
      }
    },
    servers: [
      {
        url: 'http://localhost:5000', // Change this to your actual server URL
        description: 'Development server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            firstName: { type: 'string' },
            lastName: { type: 'string' },
            userName: { type: 'string' },
            email: { type: 'string', format: 'email' },
            phoneNumber: { type: 'string' },
            password: { type: 'string', format: 'password' },
            isVerified: { type: 'boolean' },
            isAdmin: { type: 'boolean' }
          }
        },
        Scan: {
          type: 'object',
          properties: {
            imageUrl: { type: 'string' },
            diagnosisResult: { type: 'string' },
            createdAt: { type: 'string', format: 'date-time' }
          }
        },
        TestResponse: {
          type: 'object',
          properties: {
            message: { type: 'string' },
            status: { type: 'string', enum: ['success', 'error'] },
            error: { type: 'string' }
          }
        }
      }
    },
    tags: [
      {
        name: 'Authentication',
        description: 'User authentication endpoints'
      },
      {
        name: 'Profile',
      }
    ]
  },
  apis: ['./routes/*.js', './controllers/*.js'], // Path to the API docs
};

const specs = swaggerJsdoc(options);

module.exports = specs; 