import passport from 'passport';
import GoogleStrategy from 'passport-google-oauth20';
import User from '../models/users.js';
import dotenv from 'dotenv';

dotenv.config();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_REDIRECT_URI,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const normalizedEmail = profile.emails[0].value.toLowerCase();
        let user = await User.findOne({ email: normalizedEmail });

        if (!user) {
          // Create new user if not exists
          user = new User({
            name: profile.displayName,
            email: normalizedEmail,
            googleId: profile.id,
            userType: 'student', // Default, can prompt user later
            password: null, // No password for Google users
          });
          await user.save();
        } else if (!user.googleId) {
          // Link Google account to existing user
          user.googleId = profile.id;
          await user.save();
        }

        return done(null, user);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

export default passport;