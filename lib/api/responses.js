'use strict';

const httpStatus = require("http-status");

module.exports = {
    success: (context, data) => {
        context.body = {
            email: data,
            message: 'Successfully Verified'
        };
        context.status = data ? httpStatus.OK : httpStatus.NO_CONTENT;
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
    notFound: (context) => {
        context.body = { message: 'Resource was not found' };
        context.status = httpStatus.NOT_FOUND;
    }
};
