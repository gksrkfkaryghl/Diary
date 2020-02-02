var express = require('express');
var router = express.Router();
var template = require('../lib/template.js');
var ids = require('short-id');
var db = require('../lib/db');
var bcrypt = require('bcryptjs');

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


    router.get('/register', function(request, response) {
        var fmsg = request.flash();
        var feedback = '';
        if(fmsg.error) {
            feedback = fmsg.error;
        }
        var title = 'register';
        var html = template.HTML(title, `
        <div>${feedback}</div>
        <form action='/auth/register_process' method="post">
        <p>id: <input type="text" name="id"></p>
        <p>password: <input type="password" name="password"></p>
        <p>password-conform: <input type="password" name="password2"></p>
        <p>nickname: <input type="text" name="nickname"></p>
        <input type="submit">
        </form>
        `, '', '');
        response.send(html);
    });

    router.post('/register_process', function(request, response) {
        var post = request.body;
        var id = post.id;
        var pwd = post.password;
        var pwd2 = post.password2;
        var nickname = post.nickname;
        if(pwd !== pwd2) {
            request.flash('error', 'Password should be the same.');
            response.redirect('/auth/register');
        } else {
            bcrypt.hash(pwd, 8, function(err, hash) {
                var user = {
                    shortid: ids.generate(),
                    id: id,
                    password: hash,
                    nickname: nickname
                };
                db.get('users').push(user).write();
                request.login(user, function(err) {
                    if (err) { return next(err); }
                    return response.redirect('/');
                });
            });
        }
    });
    
    
    router.get('/logout', function(request, response) {
        request.logout();
        request.session.save(function(err) {
            response.redirect('/');
        });
    });
    return router;
}
