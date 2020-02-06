var express = require('express');
var router = express.Router();
var path = require('path');
var fs = require('fs');
var template = require('../lib/template.js');
var auth = require('../lib/auth');
var ids = require('short-id');
var db = require('../lib/db');


router.get('/list', function(request, response) {
    if(!auth.isOwner(request, response)) {
        response.redirect('/auth/login');
    } else {
        request.list = db.get('pages').value();
        console.log('list', request.list);
        var list = template.List(request.list, request.user);
        var title = "My Diary";
        var html = template.HTML(title, list, `
        <a href='/page/list'>my diary</a>
        <a href='/page/write'>write</a>
        `, auth.statusUI(request, response));
        response.send(html);
    }
});

router.get('/write', function(request, response) {
    if(!auth.isOwner(request, response)) {
        response.redirect('/auth/login');
    } else {
        var title = 'Write';
        var html = template.HTMLControl(title, `
        <form action='/page/write_process' method="post">
        <p><div class="date">* date <br><input type="date" class="form_date" name="date"></div></p>
        <p><textarea name='text' placeholder="How was your day?"></textarea></p>
        <input type="submit" value="save">
        </form>
        `, '', auth.statusUI(request, response));
        response.send(html);
    }
});

router.post('/write_process', function(request, response) {
    var post = request.body;
    var date = post.date;
    var text = post.text;
    var id = ids.generate();
    db.get('pages').push({
        id:id,
        date:date,
        text:text,
        user_nickname: request.user.nickname,
        user_id: request.user.id
    }).write();
    response.redirect(`/page/${id}`)
});


router.get('/update/:pageId', function(request, response){
    if(!auth.isOwner(request, response)){
        response.redirect('/auth/login');
    } else {
        var page = db.get('pages').find({id:request.params.pageId}).value();
        if(page.user_nickname !== request.user.nickname) {
            request.flash('error', 'Only the writer can access.');
            return response.redirect('/');
        }
        var date = page.date;
        var text = page.text;
        var id = page.id;
        var html = template.HTMLControl('',
            `
            <form action="/page/update_process" method="post">
            <input type="hidden" name="id" value="${id}">
            <p><div class="date">* date: <input type="date" class="form_date" name="date" value="${date}"></div></p>
            <p>
            <textarea name="text" placeholder="How was your day?">${text}</textarea>
            </p>
            <p>
            <input type="submit" value="update">
            </p>
            </form>
            `,
            `<a href="/page/write">write</a> <a href="/page/${id}">update</a>`,
            auth.statusUI(request, response)
            );
        response.send(html);
    }
});
   
router.post('/update_process', function(request, response){
    var post = request.body;
    var id = post.id;
    var date = post.date;
    var text = post.text;
    db.get('pages').find({id:id}).assign({
        date:date, text:text
    }).write();
    response.redirect(`/page/${id}`)
});

router.post('/delete', function(request, response) {
    if(!auth.isOwner(request, response)) {
        response.redirect('/auth/login');
    } else {
        var post = request.body;
        var id = post.id;
        var page = db.get('pages').find({id:id}).value();
        if(page.user_nickname !== request.user.nickname) {
            request.flash('error', 'Only the writer can delete this page.');
        } else {
            db.get('pages').remove({id:id}).write();
            return response.redirect('/');
        }
        response.redirect(`/page/${id}`);
    }
});

router.get('/:pageId', function(request, response) {
    if(!auth.isOwner(request, response)) {
        return response.redirect('/auth/login');
    }
    var fmsg = request.flash();
    var feedback = '';
    if(fmsg.error) {
        feedback = fmsg.error;
    }
    var page = db.get('pages').find({
        id:request.params.pageId
    }).value();
    var date = page.date;
    var text = page.text;
    var id = page.id;
    var user = db.get('users').find({
        nickname:page.user_nickname
    }).value();
    var html = template.HTMLPage(date, text, `
    <a href='/page/list'>my diary</a>
    <a href='/page/write'>write</a>
    <a href='/page/update/${id}'>update</a>
    <form action="/page/delete" method="post">
        <input type="hidden" name="id" value="${id}">
        <input type="submit" value="delete">
    </form>
    <div class="fmsg">${feedback}</div><br>
    <div>writer: ${user.nickname}</div>
    `, auth.statusUI(request, response));
    response.send(html); 
});

module.exports = router;