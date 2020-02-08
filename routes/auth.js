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
        <div class="fmsg">${feedback}</div><br>
        <form action='/auth/login_process' class="login" method="post">
        ID : <input type="text" name="id" placeholder="ID">
        <p>Password : <input type="password" name="password" placeholder="Password"></p>
        <input type="submit" value="login">
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
        successFlash: true,
        failureFlash: true
    }));


    router.get('/register', function(request, response) {
        var fmsg = request.flash();
        var feedback = '';
        if(fmsg.error) {
            feedback = fmsg.error;
        }
        var title = 'register';
        var html = template.HTML(title, `
        <div class="fmsg">${feedback}</div><br>
        <form action='/auth/register_process' class="register" method="post">
        ID : <input type="text" name="id" placeholder="ID">
        <p>Password : <input type="password" name="password" placeholder="Password"></p>
        <p>Confirm Password : <input type="password" name="password2" placeholder="Confirm Password"></p>
        <p>Nickname : <input type="text" name="nickname" placeholder="Nickname"></p>
        <input type="submit" value="register">
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
        //*** the function that Checking user's information is not completed yet.***/
        // var existingId = db.get('users').find({id:id}).value();
        // var existingNickname = db.get('users').find({nickname:nickname}).value();
        // users = db.get('users').value();
        // var existingPwd = '';
        // var i = 0;
        // console.log(users[1]);
        // while(i < users.length) {
        //     bcrypt.compare(pwd, users[i].password, function(err, result) {
        //         console.log('result: ', result);
        //         if(result) {
        //             existingPwd = true;
        //         }
        //     });
        //     i++;
        //     console.log('existingPwd: ', existingPwd);
        // }
        // console.log('22existingPwd: ', existingPwd);
        // console.log('existingId: ', existingId);
        // console.log('existingNickname: ', existingNickname);
        // if(!(id&&pwd&&pwd2&&nickname)) {
        //     console.log('error!!!!');
        //     request.flash('error', 'Please fill out the form.')
        //     response.redirect('/auth/register');
        // } else if(existingId) {
        //     console.log('error2!!!!');
        //     request.flash('error', 'Your ID is already exist!')
        //     response.redirect('/auth/register');
        // } else if(existingNickname) {
        //     console.log('error3!!!!');
        //     request.flash('error', 'Your Nickname is already exist!')
        //     response.redirect('/auth/register');
        // } else if(pwd !== pwd2) {
        //     console.log('error5!!!!');
        //     request.flash('error', 'Password should be the same!');
        //     response.redirect('/auth/register');
        // } else if(existingPwd) {
        //     request.flash('error', 'Your Password is already exist!')
        //     return response.redirect('/auth/register');
        // } else {
            bcrypt.hash(pwd, 8, function(err, hash) {
                var puser = db.get('users').find({id:id}).value();
                if(puser) {
                    puser.password = hash;
                    puser.nickname = nickname;
                    db.get('users').find({id:id}).assign(puser).write();
                } else {
                    puser = {
                        shortid: ids.generate(),
                        id: id,
                        password: hash,
                        nickname: nickname
                    }
                    db.get('users').push(puser).write();
                }
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
        // }
    });
    
    
    router.get('/logout', function(request, response) {
        request.logout();
        request.session.save(function(err) {
            response.redirect('/');
        });
    });
    return router;
}
