const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: '3irdSpace App API',
            version: '1.0.0',
            description: 'API documentation for 3irdSpace App',
        },
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
        },
        security: [{ bearerAuth: [] }],
        tags: [
            {
                name: 'Auth',
                description: 'Authentication endpoints',
            },
            {
                name: 'User',
                description: 'User Authenticated endpoints',
            },
        ],
        servers: [
            {
                url: `${process.env.API_URL}/v1/api`,
                description: 'Development server',
            },
        ],
    },
    apis: ['./src/routes/*.js', './src/docs/*.js'],
};

const swaggerSpec = swaggerJSDoc(options);

const setupSwaggerDocs = (app) => {
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
    console.log('Swagger docs available at /api-docs');
};

module.exports = setupSwaggerDocs;
