var express = require('express')
var app = express()
var fs = require('fs');
var template = require('./lib/template.js');
var bodyParser = require('body-parser');
var compression = require('compression')
var pageRouters = require('./routes/page.js');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(compression());

app.use('/page', pageRouters);

app.get('/', function(request, response) {
    var title = 'My Own Diary';
    var text = 'Write about your today.';
    var html = template.HTML(title, text, `
    <a href='/list'>list</a>
    <a href='/page/write'>write</a><br>
    `);
    response.send(html);
});

app.get('/list', function(request, response) {
    fs.readdir('./data', function(error, filelist) {
        var title = "Diary List";
        var list = template.List(filelist);
        var html = template.HTML(title, list, `
        <a href='/list'>list</a>
        <a href='/page/write'>write</a>
        `);
        response.send(html);
    });
});


app.listen(3000, function() {
    console.log('Example app listening on port 3000!');
  }); 