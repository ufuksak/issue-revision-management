// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'respond'.
const respond = require('../api/responses');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Auth'.
const Auth = require('../api/auth');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'httpStatus... Remove this comment to see the full error message
const httpStatus = require('http-status');

const AuthMiddleware = {};

(AuthMiddleware as any).auth = async (ctx: any, next: any) => {
    await (Auth as any).validateToken(ctx);
    if (ctx.status === httpStatus.UNAUTHORIZED) {
        return respond.notAuthorized(ctx, ctx.body.errors);
    }
    await next();
};

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = AuthMiddleware;
