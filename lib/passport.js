var db = require('../lib/db');

module.exports = function(app) {

      var passport = require('passport')
      , LocalStrategy = require('passport-local').Strategy;
      
      app.use(passport.initialize());
      app.use(passport.session());
      
      passport.serializeUser(function(user, done) {
        console.log('serializeUser', user.shortid, user);
         done(null, user.shortid);;
      });
      
      passport.deserializeUser(function(id, done) {
        var user = db.get('users').find({shortid:id}).value();
        console.log('deserializeUser', id, db.get('users').find({shortid:id}).value());
        done(null, user);
      });
      
      passport.use(new LocalStrategy(
        {
          usernameField: 'id'
        },
        function(username, password, done) {
          var user = db.get('users').find({
            id:username, 
            password:password
          }).value();
          if(user) {
            return done(null, user);
          } else {
            return done(null, false);
          }
        }
      ));
      return passport;
}
