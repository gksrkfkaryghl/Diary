var db = require('../lib/db');
var bcrypt = require('bcryptjs');
var ids = require('short-id');

module.exports = function(app) {

      var passport = require('passport')
      , LocalStrategy = require('passport-local').Strategy,
      FacebookStrategy = require('passport-facebook').Strategy;
      
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
            id:username
          }).value();
          if(user) {
            bcrypt.compare(password, user.password, function(err, result) {
              if(result) {
                return done(null, user, {
                  message: `Welcome ${user.nickname}!`
                });
              } else {
                return done(null, false);
              }
            });
          } else {
            return done(null, false);
          }
        }
      ));

      var facebookCredentials = require('../config/facebook.json');
      facebookCredentials.profileFields = ['id', 'emails', 'name', 'displayName'];

      passport.use(new FacebookStrategy(facebookCredentials,
      function(accessToken, refreshToken, profile, done) {
        console.log('FacebookStrategy', accessToken, refreshToken, profile);
        var email = profile.emails[0].value;
        var user = db.get('users').find({id:email}).value();
        if(user) {
          user.facebookId = profile.id;
          db.get('users').find({id:email}).assign(user).write();
        } else {
          user = {
            shortid: ids.generate(),
            id: email,
            facebookId: profile.id,
            nickname: profile.displayName
          }
          db.get('users').push(user).write();
        }
        done(null, user);
      }
    ));
    app.get('/auth/facebook', passport.authenticate('facebook', { 
      scope: 'email' 
    }));
    app.get('/auth/facebook/callback',
      passport.authenticate('facebook', { 
        successRedirect: '/',                                   
        failureRedirect: '/login' 
      }));
    return passport;
}
