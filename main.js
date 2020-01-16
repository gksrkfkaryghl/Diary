var express = require('express')
var app = express()
var fs = require('fs');
var template = require('./lib/template.js');
var path = require('path');
var bodyParser = require('body-parser');
var compression = require('compression')

app.use(bodyParser.urlencoded({ extended: false }));
app.use(compression());

app.get('/', function(request, response) {
    var title = 'My Own Diary';
    var text = 'Write about your today.';
    var html = template.HTML(title, text, `
    <a href='/list'>list</a>
    <a href='/write'>write</a>
    <a href='/update'>upadte</a><br>
    `);
    response.send(html);
});

app.get('/list', function(request, response) {
    fs.readdir('./data', function(error, filelist) {
        var title = "Diary List";
        console.log(filelist);
        var list = template.List(filelist);
        var html = template.HTML(title, list, `
        <a href='/list'>list</a>
        <a href='/write'>write</a>
        <a href='/update'>upadte</a><br>
        `);
        response.send(html);
    });
});

app.get('/page/:pageId', function(request, response) {
    console.log(request.params);
    var filteredId = path.parse(request.params.pageId).base;
    fs.readFile(`./data/${filteredId}`, 'utf8', function(err, description) {
        var title = request.params.pageId;
        var html = template.HTML(title, description, `
        <a href='/list'>list</a>
        <a href='/write'>write</a>
        <a href='/update'>upadte</a><br>
        `);
        response.send(html); 
    });
});

app.get('/write', function(request, response) {
    var title = 'Write';
    var html = template.HTML(title, `
    <form action='/write_process' method="post">
    <p>title: <input type="title" name="title"></p>
    <p><textarea name='text' cols="80" rows="40" placeholder="How was your day?"></textarea></p>
    <input type="submit" value="save">
    </form>
    `, '');
    response.send(html);
});

app.post('/write_process', function(request, response) {
    var post = request.body;
    var title = post.title;
    var text = post.text;
    console.log(title, text);
    fs.writeFile(`data/${title}`, text, 'utf8', function(err){
        console.log(title, text);
        response.redirect('/');
    });
});

app.listen(3000, function() {
    console.log('Example app listening on port 3000!');
  });