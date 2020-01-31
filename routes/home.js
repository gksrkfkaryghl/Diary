var express = require('express');
var router = express.Router();
var template = require('../lib/template.js');
var auth = require('../lib/auth');


router.get('/', function(request, response) {
    var fmsg = request.flash();
    var feedback = '';
    if(fmsg.success) {
        feedback = fmsg.success[0];
    } else if(fmsg.error) {
        feedback = fmsg.error[0];
    }
    var title = 'My Own Diary';
    var text = 'Write about your today.';
    var html = template.HTML(title, text, `
    <div>${feedback}</div>
    <a href='/page/list'>list</a>
    <a href='/page/write'>write</a><br>
    `, auth.statusUI(request, response));
    response.send(html);
});

module.exports = router;