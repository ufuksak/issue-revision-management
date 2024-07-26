"use strict";

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Koa'.
const Koa = require("koa");
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'bodyParser... Remove this comment to see the full error message
const bodyParser = require("koa-bodyparser");

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'router'.
const router = require("../lib/routes");

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'app'.
const app = new Koa();

app.use(bodyParser());
app.use(router.middleware());

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = app;
