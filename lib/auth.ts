const bcrypt = require("bcryptjs");
const LocalStrategy = require("passport-local").Strategy;

import User from "../models/user";

export const localLogin = new LocalStrategy(
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
