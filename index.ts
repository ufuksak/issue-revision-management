'use strict';

const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const { koaSwagger } = require('koa2-swagger-ui');
const yaml = require('js-yaml');
const fs = require('fs');
const path = require('path');
const router = require('./lib/routes');

const app = new Koa();

// Load the OpenAPI specification
const spec = yaml.load(fs.readFileSync(path.join(__dirname, 'openapi.yaml'), 'utf8'));

app.use(bodyParser());
app.use(router.routes());

// Swagger UI
app.use(
    koaSwagger({
        routePrefix: '/docs',
        swaggerOptions: { spec }
    })
);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`API documentation available at http://localhost:${PORT}/docs`);
});

module.exports = {app, router};
