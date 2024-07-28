import respond from "./responses";
import { Context } from "koa";


const exportFunction = (context: Context): void => {
  respond.success(context, {
    message: 'OK'
  });
};

export default exportFunction;
