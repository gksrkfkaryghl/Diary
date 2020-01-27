var express = require('express');
var router = express.Router();
var template = require('../lib/template.js');

module.exports = function(passport) {
    router.get('/login', function(request, response) {
        var fmsg = request.flash();
        var feedback = '';
        if(fmsg.error) {
            feedback = fmsg.error;
        }
        var title = 'login';
        var html = template.HTML(title, `
        <div>${feedback}</div>
        <form action='/auth/login_process' method="post">
        <p>id: <input type="text" name="id"></p>
        <p>password: <input type="password" name="password"></p>
        <input type="submit">
        </form>
        `, '', '');
        response.send(html);
    });
    
    // router.post('/login_process', function(request, response) {
    //     var post = request.body;
    //     var id = post.id;
    //     var pwd = post.password;
    //     if(id === authData.id && pwd === authData.password) {
    //         request.session.is_logined = true;
    //         request.session.nickname = authData.nickname;
    //         request.session.save(function() {
    //             response.redirect('/');
    //         });
    //     } else {
    //         response.send('Who?');
    //     }
    // });
    router.post('/login_process', passport.authenticate('local', { 
        successRedirect: '/',
        failureRedirect: '/auth/login',
        successFlash: 'Welcome.',
        failureFlash: 'Invalid username or password.'
    }));
    
    router.get('/logout', function(request, response) {
        request.logout();
        request.session.save(function(err) {
            response.redirect('/');
        });
    });
    return router;
}
