var http = require('http');
var fs = require('fs');

const express = require('express');
const app = express();

const path = __dirname + '/public/';
const PORT=80; 

fs.readFile(path + 'index.html', function (err, html) {

    if (err) throw err;    

    http.createServer(function(request, response) {  
        response.writeHeader(200, {"Content-Type": "text/html"});  
        response.write(html);  
        response.end();  
    }).listen(PORT);
});