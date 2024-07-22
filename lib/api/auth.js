'use strict';

const jwt = require('jsonwebtoken');
const {decode} = require('jsonwebtoken');
const dotenv = require('dotenv');
const respond = require("./responses");
const Auth = {};

dotenv.config();

Auth.generateToken = async (context) => {
    // Validate User Here
    // Then generate JWT Token

    let jwtSecretKey = process.env.JWT_SECRET_KEY;
    console.log(jwtSecretKey);
    let data = {
        time: Date(),
        userId: 12,
        email: context.request.body.email
    }

    const token = jwt.sign(data, jwtSecretKey, { expiresIn: process.env.EXPIRY_TIME ? Number(process.env.EXPIRY_TIME) : 300 });
    respond.success(context, { token });
};

Auth.validateToken = async (context) => {
    let jwtSecretKey = process.env.JWT_SECRET_KEY;

    try {
        console.log(context.request.headers);
        if (context.request.headers.authorization) {
            const token = context.request.headers.authorization.split(' ')[1];
            const decodedToken = decode(token);
            const verified = jwt.verify(token, jwtSecretKey);
            if (verified) {
                respond.success(context, decodedToken.email);
            } else {
                // Access Denied
                respond.notAuthorized(context, 'The Access Denied');
            }
        } else {
            respond.notAuthorized(context, 'No Token Found');
        }
    } catch (error) {
        // Access Denied
        respond.notAuthorized(context, error);
    }
}

module.exports = Auth;
