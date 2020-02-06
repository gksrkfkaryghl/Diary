var express = require('express');
var app = express();
app.use(express.static('static'));
var db = require('../lib/db');
var bcrypt = require('bcryptjs');

module.exports = {
    HTML: function(title, text, control, authStatusUI = '<a href="/auth/login">login</a> | <a href="/auth/register">register</a>') {
        return `
        <!doctype>
        <html>
        <head>
            <title>My Own Diary - ${title}</title>
            <meta charset="utf8">
            <link rel="stylesheet" href="/diary.css">
        </head>
        <body>
            <div class="background"><div class="box">
            <div class="access">${authStatusUI}</div>
            <h1>${title}</h1>
            <div>${control}</div>
            <div>${text}</div>
            </div></div>
        </body>
        </html>
        `
    },

    HTMLControl: function(title, text, control, authStatusUI = '<a href="/auth/login">login</a> | <a href="/auth/register">register</a>') {
        return `
        <!doctype>
        <html>
        <head>
            <title>My Own Diary - ${title}</title>
            <meta charset="utf8">
            <link rel="stylesheet" href="/diary.css">
        </head>
        <body>
            <div class="background"><div class="paper"><div class="box">
            <div class="access">${authStatusUI}</div>
            <div id="category">${control}</div>
            <h1>${title}</h1>
            <div class="text">${text}</div>
            </div></div></div>
        </body>
        </html>
        `
    },

    HTMLPage: function(date, text, control, authStatusUI = '<a href="/auth/login">login</a> | <a href="/auth/register">register</a>') {
        return `
        <!doctype>
        <html>
        <head>
            <title>My Own Diary - ${date}</title>
            <meta charset="utf8">
            <link rel="stylesheet" href="/diary.css">
        </head>
        <body>
            <div class="background"><div class="paper"><div class="box">
            <div class="access">${authStatusUI}</div>
            <div id="category">${control}</div>
            <h3>${date}</h3>
            <div class="text">${text}</div>
            </div></div></div>
        </body>
        </html>
        `
    },

    List: function(filelist, user) {
        var list = '<div id="list"><ol>';
        var i = 0;
        while(i < filelist.length) {
            if(filelist[i].user_id === user.id) {
                list = list + `<li><a href="/page/${filelist[i].id}">${filelist[i].date}</a></li>`;
            }
            i++;
        }
        console.log('completed list', list);
        list += '</ol></div>';
        return list;
    }
} 