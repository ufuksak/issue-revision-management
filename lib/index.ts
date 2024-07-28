import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import { koaSwagger } from 'koa2-swagger-ui';
import yaml from 'js-yaml';
import fs from 'fs';
import path from 'path';
import router from './routes';

const app: Koa = new Koa();

// Load the OpenAPI specification
const spec: any = yaml.load(fs.readFileSync(path.join(__dirname, 'openapi.yaml'), 'utf8'));

app.use(bodyParser());
app.use(router.routes());

// Swagger UI
app.use(
    koaSwagger({
        routePrefix: '/docs',
        swaggerOptions: { spec }
    })
);

const PORT: number = process.env.PORT ? parseInt(process.env.PORT) : 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`API documentation available at http://localhost:${PORT}/docs`);
});

export { app, router };
