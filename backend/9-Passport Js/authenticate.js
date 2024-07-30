const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const User = require("./models/user");

// Use the LocalStrategy with Passport
passport.use(new LocalStrategy(User.authenticate()));

// Serialize the user into the session
passport.serializeUser(User.serializeUser());

// Deserialize the user from the session
passport.deserializeUser(User.deserializeUser());
