var express = require('express');
var router = express.Router();
var path = require('path');
var fs = require('fs');
var template = require('../lib/template.js');
var auth = require('../lib/auth');


router.get('/list', function(request, response) {
    fs.readdir('data', function(error, filelist) {
        var title = "Diary List";
        var list = template.List(filelist);
        var html = template.HTML(title, list, `
        <a href='/page/list'>list</a>
        <a href='/page/write'>write</a>
        `, auth.statusUI(request, response));
        response.send(html);
    });
});

router.get('/write', function(request, response) {
    if(!auth.isOwner(request, response)) {
        response.redirect('/auth/login');
    } else {
        var title = 'Write';
        var html = template.HTML(title, `
        <form action='/page/write_process' method="post">
        <p>title: <input type="title" name="title"></p>
        <p><textarea name='text' cols="80" rows="40" placeholder="How was your day?"></textarea></p>
        <input type="submit" value="save">
        </form>
        `, '', auth.statusUI(request, response));
        response.send(html);
    }
});

router.post('/write_process', function(request, response) {
    var post = request.body;
    var title = post.title;
    var text = post.text;
    fs.writeFile(`data/${title}`, text, 'utf8', function(err){
        response.redirect('/');
    });
});


router.get('/update/:pageId', function(request, response){
    if(!auth.isOwner(request, response)){
        response.redirect('/auth/login');
    } else {
        var title = request.params.pageId;
        fs.readFile(`data/${title}`, 'utf8', function(err, text){
        var html = template.HTML(title,
            `
            <form action="/page/update_process" method="post">
            <input type="hidden" name="id" value="${title}">
            <p><input type="text" name="title" placeholder="title" value="${title}"></p>
            <p>
            <textarea name="text" placeholder="How was your day?">${text}</textarea>
            </p>
            <p>
            <input type="submit">
            </p>
            </form>
            `,
            `<a href="/page/write">write</a> <a href="/page/${title}">update</a>`,
            '', auth.statusUI(request, response)
            );
        response.send(html);
        });
    }
});
   
router.post('/update_process', function(request, response){
    var post = request.body;
    var id = post.id;
    var title = post.title;
    var text = post.text;
    fs.rename(`data/${id}`, `data/${title}`, function(error){
        fs.writeFile(`data/${title}`, text, 'utf8', function(err){
        response.redirect(`/page/${title}`);
        });
    });
});

router.post('/delete', function(request, response) {
    if(!auth.isOwner(request, response)) {
        response.redirect('/auth/login');
    } else {
        var post = request.body;
        var id = post.id;
        fs.unlink(`data/${id}`, function(err) {
            response.redirect('/');
        });
    }
});

router.get('/:pageId', function(request, response) {
    if(!auth.isOwner(request, response)) {
        response.redirect('/auth/login');
    } else {
        var filteredId = path.parse(request.params.pageId).base;
        fs.readFile(`./data/${filteredId}`, 'utf8', function(err, text) {
            var title = request.params.pageId;
            var html = template.HTML(title, text, `
            <a href='/page/list'>list</a>
            <a href='/page/write'>write</a>
            <a href='/page/update/${title}'>update</a>
            <form action="/page/delete" method="post">
                <input type="hidden" name="id" value="${title}">
                <input type="submit" value="delete">
            </form>
            `, auth.statusUI(request, response));
            response.send(html); 
        });
    }
});

module.exports = router;