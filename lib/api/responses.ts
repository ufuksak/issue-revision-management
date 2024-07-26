'use strict';

const httpStatus = require("http-status");

module.exports = {
    success: (context, data) => {
        context.body = data;
        context.status = data ? 200 : 204;
    },
    notAuthorized: (context, errors) => {
        context.body = {
            message: 'Check your access parameters',
            errors: errors
        };
        context.status = httpStatus.UNAUTHORIZED;
    },
    badRequest: (context, errors) => {
        context.body = {
            message: 'Check your request parameters',
            errors: errors
        };
        context.status = httpStatus.BAD_REQUEST;
    },
    notFound: (context, errors) => {
        context.body = {
            message: 'Resource was not found',
            errors: errors
        };
        context.status = httpStatus.NOT_FOUND;
    }
};
