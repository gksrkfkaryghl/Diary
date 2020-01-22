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
  resave: false,
  saveUninitialized: true,
  store:new FileStore()
}))

app.use('/', homeRouters);
app.use('/page', pageRouters);
app.use('/auth', authRouters);


app.listen(3000, function() {
    console.log('Example app listening on port 3000!');
  }); 