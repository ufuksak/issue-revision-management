import { Context } from "koa";
import respond from "./responses";

const baseUrl: string = 'http://localhost:8080';

export default (context: Context): void => {
    respond.success(context, {
        discovery: baseUrl
    });
};
