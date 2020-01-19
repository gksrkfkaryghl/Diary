module.exports = {
    HTML: function(title, text, control) {
        return `
        <!doctype>
        <html>
        <head>
            <title>My Own Diary - ${title}</title>
            <meta charset="utf8">
        <head>
        <body>
            <h1>${title}</h1>
            ${control}
            ${text}
        </body>
        </html>
        `
    },
    List: function(filelist) {
        var list = '<ol>';
        var i = 0;
        while(i < filelist.length) {
            list = list + `<li><a href="/page/${filelist[i]}">${filelist[i]}</a></li>`;
            i++;
        }
        list += '</ol>';
        return list;
    }
} 