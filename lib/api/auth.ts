import jwt from "jsonwebtoken";
import { decode } from "jsonwebtoken";
import dotenv from "dotenv";
import respond from "./responses";
import { Context } from "koa";

dotenv.config();

class AuthController {
    generateToken = async (context: Context) => {
        // Validate User Here
        // Then generate JWT Token
        // @ts-ignore
        let {email}: { email: string } = context.request.body;

        const jwtSecretKey = process.env.JWT_SECRET_KEY as string;
        const data = {
            time: new Date().toString(),
            email: email,
        };

        const token = jwt.sign(data, jwtSecretKey, {
            expiresIn: process.env.EXPIRY_TIME ? Number(process.env.EXPIRY_TIME) : 300,
        });
        respond.success(context, {token});
    };

    validateToken = async (context: Context) => {
        const jwtSecretKey = process.env.JWT_SECRET_KEY as string;

        try {
            if (context.request.headers.authorization) {
                const token = context.request.headers.authorization.split(" ")[1];
                const decodedToken = decode(token) as jwt.JwtPayload;
                const verified = jwt.verify(token, jwtSecretKey);
                if (verified) {
                    context.body = {
                        email: decodedToken.email,
                    };
                } else {
                    // Access Denied
                    respond.notAuthorized(context, "The Access Denied");
                }
            } else {
                respond.notAuthorized(context, "No Token Found");
            }
        } catch (error) {
            // Access Denied
            respond.notAuthorized(context, error);
        }
    };
}

export default new AuthController();


