const swaggerJSDoc = require('swagger-jsdoc');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Brain Scan API',
            version: '1.0.0',
            description: 'API for analyzing CT/MRI scans and managing users',
        },
        servers: [
            {
                url: 'http://localhost:5000',
            },
        ],
    },
    apis: ['./routes/*.js'], // path to the API docs
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;
