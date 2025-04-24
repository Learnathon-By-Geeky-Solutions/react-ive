import passport from 'passport';
import GoogleStrategy from 'passport-google-oauth20';
import User from './models/users.js';
import validator from 'validator';

passport.use(
  new GoogleStrategy(
    {
      clientID: "544875149208-e78n9ophsru88eaasm1ljh173224p9n7.apps.googleusercontent.com",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const normalizedEmail = validator.normalizeEmail(profile.emails[0].value);
        let user = await User.findOne({ email: normalizedEmail });

        if (user) {
          // Existing user, return user
          return done(null, user);
        }

        // New user, create with Google data
        user = new User({
          name: profile.displayName,
          email: normalizedEmail,
          password: '', // No password for Google users
          userType: 'student', // Default, can prompt user later
          googleId: profile.id, // Store Google ID
        });

        await user.save();
        return done(null, user);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

// Serialize user to session
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Deserialize user from session
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

export default passport;