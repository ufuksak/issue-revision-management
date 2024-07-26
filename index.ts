'use strict';

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Koa'.
const Koa = require('koa');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'bodyParser... Remove this comment to see the full error message
const bodyParser = require('koa-bodyparser');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const { koaSwagger } = require('koa2-swagger-ui');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const yaml = require('js-yaml');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const fs = require('fs');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const path = require('path');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'router'.
const router = require('./lib/routes');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'app'.
const app = new Koa();

// Load the OpenAPI specification
// @ts-expect-error TS(2304): Cannot find name '__dirname'.
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

// @ts-expect-error TS(2580): Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`API documentation available at http://localhost:${PORT}/docs`);
});

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {app, router};
