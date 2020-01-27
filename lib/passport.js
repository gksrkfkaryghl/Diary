module.exports = function(app) {
    var authData = {
        id: 'Jang',
        password: '1234',
        nickname: 'Jang'
      }
      
      var passport = require('passport')
      , LocalStrategy = require('passport-local').Strategy;
      
      app.use(passport.initialize());
      app.use(passport.session());
      
      passport.serializeUser(function(user, done) {
         done(null, user.id);;
      });
      
      passport.deserializeUser(function(id, done) {
        done(null, authData);
      });
      
      passport.use(new LocalStrategy(
        {
          usernameField: 'id'
        },
        function(username, password, done) {
          if(username === authData.id) {
            if(password === authData.password) {
              return done(null, authData);
            } else {
              return done(null, false);
            }
          } else {
            return done(null, false);
          }
        }
      ));
      return passport;
}
