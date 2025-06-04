const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const Employee = require("../schema/employeeSchema");
const FacebookStrategy = require("passport-facebook").Strategy;

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/api/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let emp = await Employee.findOne({
          $or: [{ googleId: profile.id }, { email: profile.emails[0].value }],
        });
        if (!emp) {
          emp = await Employee.create({
            googleId: profile.id,
            name: profile.displayName,
            email: profile.emails[0].value,
          });
        }
        done(null, emp);
      } catch (err) {
        done(err, null);
      }
    }
  )
);

passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_APP_ID,
      clientSecret: process.env.FACEBOOK_APP_SECRET,
      callbackURL: "/api/auth/facebook/callback",
      profileFields: ["id", "displayName", "emails", "photos"],
    },
    async function (accessToken, refreshToken, profile, done) {
      try {
        let emp = await Employee.findOne({
          $or: [{ facebookId: profile.id }, { email: profile.emails[0].value }],
        });
        if (!emp) {
          emp = await Employee.create({
            facebookId: profile.id,
            name: profile.displayName,
            email: profile.emails[0].value,
          });
        }
        done(null, emp);
      } catch (err) {
        done(err, null);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id); 
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await Employee.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});
