import { Context } from 'koa';
import httpStatus from 'http-status';

interface ResponseData {
    message: string;
    errors: any;
}

export default {
    success: (context: Context, data: any) => {
        context.body = data;
        context.status = data ? 200 : 204;
    },
    notAuthorized: (context: Context, errors: any) => {
        const responseData: ResponseData = {
            message: 'Check your access parameters',
            errors: errors
        };
        context.body = responseData;
        context.status = httpStatus.UNAUTHORIZED;
    },
    badRequest: (context: Context, errors: any) => {
        const responseData: ResponseData = {
            message: 'Check your request parameters',
            errors: errors
        };
        context.body = responseData;
        context.status = httpStatus.BAD_REQUEST;
    },
    notFound: (context: Context, errors: any) => {
        const responseData: ResponseData = {
            message: 'Resource was not found',
            errors: errors
        };
        context.body = responseData;
        context.status = httpStatus.NOT_FOUND;
    }
};