const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const User = require("./models/user");
const jwt = require("jsonwebtoken");
const { Strategy, ExtractJwt } = require("passport-jwt");
const config = require("./config");
// Use the LocalStrategy with Passport
passport.use(new LocalStrategy(User.authenticate()));

// Serialize the user into the session
passport.serializeUser(User.serializeUser());

// Deserialize the user from the session
passport.deserializeUser(User.deserializeUser());

exports.getToken = (user) => {
  return jwt.sign(user, config.secretKey, {
    expiresIn: "1h",
  });
};

// JWT Strategy configuration
const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: config.secretKey,
};

exports.jwtPassport = passport.use(
  new Strategy(options, async (jwt_payload, done) => {
    try {
      const user = await User.findById(jwt_payload._id);
      if (user) {
        return done(null, user);
      } else {
        return done(null, false);
      }
    } catch (err) {
      return done(err, false);
    }
  })
);

exports.verifyUser = passport.authenticate("jwt");
