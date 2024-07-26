const respond = require('../api/responses');
const Auth = require('../api/auth');
const httpStatus = require('http-status');

const AuthMiddleware = {};

AuthMiddleware.auth = async (ctx, next) => {
  await Auth.validateToken(ctx);

  if (ctx.status === httpStatus.UNAUTHORIZED) {
    return respond.notAuthorized(ctx, ctx.body.errors);
  }

  await next();
};

module.exports = AuthMiddleware;
