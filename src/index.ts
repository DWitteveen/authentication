import setupDb from './db'
import "reflect-metadata";
import { createKoaServer } from "routing-controllers";
import { Action, BadRequestError } from "routing-controllers";
import LoginController from "./login/controller";
import { verify } from "./jwt";
import "reflect-metadata";
import UserController from "./users/controller";
import WebhookController from "./routes/webhooks";
import ResponsesController from "./routes/responses";
import QuizzesController from "./routes/quizzes";
import UsersController from "./routes/users";

const port = process.env.PORT || 4007;


export const app = createKoaServer({
  cors: true,
  controllers: [
    LoginController,
    UserController,
    ResponsesController,
    WebhookController,
    QuizzesController,
    UsersController
  ],

  authorizationChecker: (action: Action) => {
    const header: string = action.request.headers.authorization;
    if (header && header.startsWith("Bearer ")) {
      const [, token] = header.split(" ");

      try {
        return !!(token && verify(token));
      } catch (e) {
        throw new BadRequestError(e);
      }
    }
    return false;
  },

  currentUserChecker: async (action: Action) => {
    const header: string = action.request.headers.authorization;
    if (header && header.startsWith("Bearer ")) {
      const [, token] = header.split(" ");

      if (token) {
        const { id, role } = verify(token);

        return { id, role };
      }
    }
    return {}
  }
});

setupDb()
  .then(_ => {
    app.listen(port, () => console.log(`Listening on port ${port}`));
  })
  .catch(err => console.error(err));
