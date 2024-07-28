import Koa from "koa";
import bodyParser from "koa-bodyparser";

import router from "../routes";

const app: Koa = new Koa();

app.use(bodyParser());
app.use(router.middleware());

export default app;
