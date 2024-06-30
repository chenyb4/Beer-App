const swaggerJsdoc = require('swagger-jsdoc');

const options = {
    swaggerDefinition: {
        info: {
            title: 'Beer Swipe API',
            version: '1.0.0',
            description: 'The API behind the Beer Swipe Application',
        },
        servers: [
            { url: 'http://localhost:8080' },
        ],
    },

    apis: ['./Routing.js'],
};

const specs = swaggerJsdoc(options);

module.exports = specs;