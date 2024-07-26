"use strict";

const Koa = require("koa");
const bodyParser = require("koa-bodyparser");

const router = require("../lib/routes");

const app = new Koa();

app.use(bodyParser());
app.use(router.middleware());

module.exports = app;
