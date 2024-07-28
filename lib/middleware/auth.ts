import { Context, Next } from 'koa';
import respond from '../api/responses';
import Auth from '../api/auth';
import * as httpStatus from 'http-status';

const AuthMiddleware: { auth: (ctx: Context, next: Next) => Promise<void> } = {
    auth: function (ctx: Context, next: Next): Promise<void> {
        return AuthMiddleware.auth(ctx, next);
    }
};

AuthMiddleware.auth = async (ctx: Context, next: Next): Promise<void> => {
    await Auth.validateToken(ctx);

    if (ctx.status === httpStatus.UNAUTHORIZED) {
        const payload: any = ctx.body;
        return respond.notAuthorized(ctx, payload.errors);
    }

    await next();
};

export default AuthMiddleware;
