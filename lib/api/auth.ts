"use strict";

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'jwt'.
const jwt = require("jsonwebtoken");
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const { decode } = require("jsonwebtoken");
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const dotenv = require("dotenv");
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'respond'.
const respond = require("./responses");
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Auth'.
const Auth = {};

dotenv.config();

(Auth as any).generateToken = async (context: any) => {
    // Validate User Here
    // Then generate JWT Token
    // @ts-expect-error TS(2580): Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
    let jwtSecretKey = process.env.JWT_SECRET_KEY;
    let data = {
        time: Date(),
        userId: 12,
        email: context.request.body.email,
    };
    const token = jwt.sign(data, jwtSecretKey, {
        // @ts-expect-error TS(2580): Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
        expiresIn: process.env.EXPIRY_TIME ? Number(process.env.EXPIRY_TIME) : 300,
    });
    respond.success(context, { token });
};

(Auth as any).validateToken = async (context: any) => {
    // @ts-expect-error TS(2580): Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
    let jwtSecretKey = process.env.JWT_SECRET_KEY;
    try {
        if (context.request.headers.authorization) {
            const token = context.request.headers.authorization.split(" ")[1];
            const decodedToken = decode(token);
            const verified = jwt.verify(token, jwtSecretKey);
            if (verified) {
                context.body = {
                    email: decodedToken.email,
                };
            }
            else {
                // Access Denied
                respond.notAuthorized(context, "The Access Denied");
            }
        }
        else {
            respond.notAuthorized(context, "No Token Found");
        }
    }
    catch (error) {
        // Access Denied
        respond.notAuthorized(context, error);
    }
};

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = Auth;
