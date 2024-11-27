import { envConfig } from "./env.config";
import passport from "passport";
import { Strategy as FacebookStrategy } from "passport-facebook";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";

passport.use(
  new GoogleStrategy(
    {
      clientID: envConfig.GOOGLE_CLIENT_ID,
      clientSecret: envConfig.GOOGLE_CLIENT_SECRET,
      callbackURL: envConfig.GOOGLE_DIRECT_URL,
      passReqToCallback: true,
      scope: ["profile", "email"],
    },
    async function (request, accessToken, refreshToken, profile, done) {
      return done(null, profile._json);
    },
  ),
);

passport.use(
  new FacebookStrategy(
    {
      clientID: envConfig.FACEBOOK_CLIENT_ID,
      clientSecret: envConfig.FACEBOOK_CLIENT_SECRET,
      callbackURL: envConfig.FACEBOOK_DIRECT_URL,
      profileFields: [
        "emails",
        "name",
        "id",
        "displayName",
        "gender",
        "picture",
      ],
    },
    function (accessToken, refreshToken, profile, done) {
      return done(null, profile._json);
    },
  ),
);

passport.serializeUser((user, done) => {
  done(null, user);
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
passport.deserializeUser(async (user: any, done) => {
  done(null, user);
});
