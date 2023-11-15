const bcrypt = require("bcryptjs");
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as JWTStrategy, ExtractJwt } from "passport-jwt";

import User from "../models/user";

export const localAuth = new LocalStrategy(
  async (username: string, password: string, done: any) => {
    try {
      const user = await User.findOne({ username: username.toLowerCase() });

      if (!user) {
        return done(null, false, { message: "Incorrect username" });
      }
      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        return done(null, false, { message: "Incorrect password" });
      }
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  }
);

export const jwtAuth = new JWTStrategy(
  {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: "your_secret_key",
  },
  async (jwtPayload, done) => {
    const user = await User.findOne({
      username: jwtPayload.username.toLowerCase(),
    });
    if (user) {
      return done(null, user);
    } else {
      return done(null, false);
    }
  }
);
