'use strict';

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'httpStatus... Remove this comment to see the full error message
const httpStatus = require("http-status");

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
    success: (context: any, data: any) => {
        context.body = data;
        context.status = data ? 200 : 204;
    },
    notAuthorized: (context: any, errors: any) => {
        context.body = {
            message: 'Check your access parameters',
            errors: errors
        };
        context.status = httpStatus.UNAUTHORIZED;
    },
    badRequest: (context: any, errors: any) => {
        context.body = {
            message: 'Check your request parameters',
            errors: errors
        };
        context.status = httpStatus.BAD_REQUEST;
    },
    notFound: (context: any, errors: any) => {
        context.body = {
            message: 'Resource was not found',
            errors: errors
        };
        context.status = httpStatus.NOT_FOUND;
    }
};
