import express from "express";
import session from "express-session";
import { createClient } from "redis";
import connectRedis from "connect-redis";

const main = async () => {
  const app = express();

  const RedisStore = connectRedis(session);
  const redisClient = createClient();

  app.use(
    session({
      name: "express-session-cookie",
      secret: "keyboard cat", // you would want this to be an environment variable, not public, and also a random string
      store: new RedisStore({ client: redisClient, disableTouch: true }),
      cookie: {
        path: "/",
        maxAge: 1000 * 60 * 60 * 24 * 365 * 10, // 10 years
        httpOnly: true,
        sameSite: "lax", // for protecting against CSRF
        secure: false, // cookie only works in https - something desirable for production but not necessary for this dev use case
      },
      resave: false,
      saveUninitialized: true, // for current use, where no login occurs, requires true to function
    })
  );

  app.get("/", (_, res) => {
    res.send("Hello, session!");
  });

  app.listen(4000, () => {
    console.log("server started on localhost:4000");
  });
};

main().catch((err) => {
  console.error(err);
});
