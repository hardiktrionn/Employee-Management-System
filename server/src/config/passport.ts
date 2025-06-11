import passport from "passport";
import { Strategy as GoogleStrategy, Profile as GoogleProfile } from "passport-google-oauth20";
import { Strategy as FacebookStrategy, Profile as FacebookProfile } from "passport-facebook";
import dotenv from "dotenv";
import Employee from "../schema/employeeSchema";
import generateCustomId from "../utils/generateCustomId";
import { Request } from "express";

dotenv.config();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      callbackURL: "/api/auth/google/callback",
      passReqToCallback: true, // Important for first param `req`
    },
    async (
      req: Request,
      accessToken: string,
      refreshToken: string,
      profile: GoogleProfile,
      done: (error: any, user?: any) => void
    ) => {
      try {
        let emp = await Employee.findOne({
          $or: [{ googleId: profile.id }, { email: profile.emails?.[0]?.value }],
        });

        if (!emp) {
          const employeeId = await generateCustomId("Emp", "employeeId");
          emp = await Employee.create({
            googleId: profile.id,
            name: profile.displayName,
            email: profile.emails?.[0]?.value,
            profilePhoto: profile.photos?.[0]?.value,
            employeeId,
          });
        }

        done(null, emp);
      } catch (err) { // Unexpected error handling
        done(err, null);
      }
    }
  )
);

passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_APP_ID || "",
      clientSecret: process.env.FACEBOOK_APP_SECRET || "",
      callbackURL: "/api/auth/facebook/callback",
      profileFields: ["id", "displayName", "emails", "photos"],
      passReqToCallback: false, // No req param here
    },
    async (
      accessToken: string,
      refreshToken: string,
      profile: FacebookProfile,
      done: (error: any, user?: Express.User | false | null) => void
    ) => {
      try {
        let emp = await Employee.findOne({
          $or: [{ facebookId: profile.id }, { email: profile.emails?.[0]?.value }],
        });

        if (!emp) {
          const employeeId = await generateCustomId("Emp", "employeeId");
          emp = await Employee.create({
            facebookId: profile.id,
            name: profile.displayName,
            email: profile.emails?.[0]?.value,
            employeeId,
            profilePhoto: profile.photos?.[0]?.value,
          });
        }

        done(null, emp);
      } catch (err) { // Unexpected error handling
        done(err, null);
      }
    }
  )
);

passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await Employee.findById(id);
    done(null, user);
  } catch (err) { // Unexpected error handling
    done(err, null);
  }
});
