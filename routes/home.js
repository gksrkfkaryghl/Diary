var express = require('express');
var router = express.Router();
var template = require('../lib/template.js');
var auth = require('../lib/auth');


router.get('/', function(request, response) {
    var title = 'My Own Diary';
    var text = 'Write about your today.';
    var html = template.HTML(title, text, `
    <a href='/page/list'>list</a>
    <a href='/page/write'>write</a><br>
    `, auth.statusUI(request, response));
    response.send(html);
});

module.exports = router;