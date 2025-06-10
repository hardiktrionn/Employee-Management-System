"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const passport_1 = __importDefault(require("passport"));
const passport_google_oauth20_1 = require("passport-google-oauth20");
const passport_facebook_1 = require("passport-facebook");
const dotenv_1 = __importDefault(require("dotenv"));
const employeeSchema_1 = __importDefault(require("../schema/employeeSchema"));
const generateCustomId_1 = __importDefault(require("../utils/generateCustomId"));
dotenv_1.default.config();
passport_1.default.use(new passport_google_oauth20_1.Strategy({
    clientID: process.env.GOOGLE_CLIENT_ID || "",
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    callbackURL: "/api/auth/google/callback",
    passReqToCallback: true, // Important for first param `req`
}, (req, accessToken, refreshToken, profile, done) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f;
    try {
        let emp = yield employeeSchema_1.default.findOne({
            $or: [{ googleId: profile.id }, { email: (_b = (_a = profile.emails) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.value }],
        });
        if (!emp) {
            const employeeId = yield (0, generateCustomId_1.default)("Emp", "employeeId");
            emp = yield employeeSchema_1.default.create({
                googleId: profile.id,
                name: profile.displayName,
                email: (_d = (_c = profile.emails) === null || _c === void 0 ? void 0 : _c[0]) === null || _d === void 0 ? void 0 : _d.value,
                profilePhoto: (_f = (_e = profile.photos) === null || _e === void 0 ? void 0 : _e[0]) === null || _f === void 0 ? void 0 : _f.value,
                employeeId,
            });
        }
        done(null, emp);
    }
    catch (err) {
        done(err, null);
    }
})));
passport_1.default.use(new passport_facebook_1.Strategy({
    clientID: process.env.FACEBOOK_APP_ID || "",
    clientSecret: process.env.FACEBOOK_APP_SECRET || "",
    callbackURL: "/api/auth/facebook/callback",
    profileFields: ["id", "displayName", "emails", "photos"],
    passReqToCallback: false, // No req param here
}, (accessToken, refreshToken, profile, done) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f;
    try {
        let emp = yield employeeSchema_1.default.findOne({
            $or: [{ facebookId: profile.id }, { email: (_b = (_a = profile.emails) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.value }],
        });
        if (!emp) {
            const employeeId = yield (0, generateCustomId_1.default)("Emp", "employeeId");
            emp = yield employeeSchema_1.default.create({
                facebookId: profile.id,
                name: profile.displayName,
                email: (_d = (_c = profile.emails) === null || _c === void 0 ? void 0 : _c[0]) === null || _d === void 0 ? void 0 : _d.value,
                employeeId,
                profilePhoto: (_f = (_e = profile.photos) === null || _e === void 0 ? void 0 : _e[0]) === null || _f === void 0 ? void 0 : _f.value,
            });
        }
        done(null, emp);
    }
    catch (err) {
        done(err, null);
    }
})));
passport_1.default.serializeUser((user, done) => {
    done(null, user.id);
});
passport_1.default.deserializeUser((id, done) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield employeeSchema_1.default.findById(id);
        done(null, user);
    }
    catch (err) {
        done(err, null);
    }
}));
