var express = require('express');
var router = express.Router();
var template = require('../lib/template.js');

var authData = {
    id: 'Jang',
    password: '1234',
    nickname: 'Jang'
}

router.get('/login', function(request, response) {
    var title = 'login';
    var html = template.HTML(title, `
    <form action='/auth/login_process' method="post">
    <p>id: <input type="text" name="id"></p>
    <p>password: <input type="password" name="password"></p>
    <input type="submit">
    </form>
    `, '', '');
    response.send(html);
});

router.post('/login_process', function(request, response) {
    var post = request.body;
    var id = post.id;
    var pwd = post.password;
    if(id === authData.id && pwd === authData.password) {
        request.session.is_logined = true;
        request.session.nickname = authData.nickname;
        request.session.save(function() {
            response.redirect('/');
        });
    } else {
        response.send('Who?');
    }
});

router.post('/logout', function(request, response) {
    request.session.destroy(function(err) {
        response.redirect('/');
    })
})

module.exports = router;