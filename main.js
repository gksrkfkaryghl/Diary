var express = require('express')
var app = express()
var bodyParser = require('body-parser');
var compression = require('compression')
var pageRouters = require('./routes/page');
var homeRouters = require('./routes/home');
var authRouters = require('./routes/auth');
var session = require('express-session')
var FileStore = require('session-file-store')(session)

app.use(bodyParser.urlencoded({ extended: false }));
app.use(compression());

//아래는 session을 실제로 미들웨어로써 실제 이 앱에 설치하는 코드.
app.use(session({
  secret: 'asadlfkj!@#!@#dfgasdg',
  // cookie: {
  //   secure: false
  // },
  resave: true,
  saveUninitialized: true,
  store:new FileStore()
}));

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
   console.log('serializeUser', user);
   done(null, user.id);;
});

passport.deserializeUser(function(id, done) {
  console.log('deserializeUser', id);
  done(null, authData);
});

passport.use(new LocalStrategy(
  {
    usernameField: 'id'
  },
  function(username, password, done) {
    if(username === authData.id) {
      if(password === authData.password) {
        return done(null, authData, {
          message: 'Welcome.'
        });
      } else {
        return done(null, false, {
          message: 'Incorrect password.'
        });
      }
    } else {
      return done(null, false, {
        message: 'Incorrect ID.'
      });
    }
  }
));

app.post('/auth/login_process', passport.authenticate('local', { 
  successRedirect: '/',
  failureRedirect: '/auth/login' 
}));

app.use('/', homeRouters);
app.use('/page', pageRouters);
app.use('/auth', authRouters);


app.listen(3000, function() {
    console.log('Example app listening on port 3000!');
  }); 