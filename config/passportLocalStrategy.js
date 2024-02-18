const passport = require('passport')
const passportLocalStrategy = require('passport-local').Strategy
const User = require('../model/User')


passport.use(new passportLocalStrategy(
    async function(username, password, done) {
      const user = await User.findOne({ username: username })

      if(user) {
        return done(null, user);
      }

      return done(null, false)

    }
  ));

  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });
  
  passport.deserializeUser(async function(id, done) {
    const user = await User.findById(id)
    if(user)
        return  done(null, user);
    return done(null, false)
  });

  module.exports = passport