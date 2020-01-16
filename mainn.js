var http = require('http');
var fs = require('fs');
var url = require('url');

var app = http.createServer(function(request, response) {
    var _url = request.url;
    var queryData = url.parse(_url, true).query;
    var title = queryData.id;
    if(_url == '/'){
        title = 'Home'
    }
    if(_url == '/favicon.ico'){
        return response.writeHead(404);
    }
    response.writeHead(200);
    fs.readFile(`data/${queryData.id}`, 'utf8', function(err, description) {
        var template = `
        <!doctype html>
        <html>
        <head>
            <title>Diary - ${title}</title>
            <meta charset="utf-8">
        </head>
        <body>
            <h1>${title}</h1>
            ${description}
        </body>
        </html>
        `
    })
})