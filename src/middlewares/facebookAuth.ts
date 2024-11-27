import passport from "passport";
import { Strategy as FacebookStrategy } from "passport-facebook";
import { envConfig } from "../configs/env.config";

passport.use(
  new FacebookStrategy(
    {
      clientID: envConfig.FACEBOOK_CLIENT_ID,
      clientSecret: envConfig.FACEBOOK_CLIENT_SECRET,
      callbackURL: envConfig.FACEBOOK_DIRECT_URL,
      profileFields: ["id", "emails", "name"],
    },
    async (accessToken, refreshToken, profile, done) => {
      const user = {
        facebookId: profile.id,
        email: profile.emails?.[0].value,
        name: `${profile.name?.givenName} ${profile.name?.familyName}`,
      };
      done(null, user);
    },
  ),
);

export default passport;
