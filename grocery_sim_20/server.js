
const path = require('path');
const express = require('express');
const app = express();

app.use(express.static(__dirname + '/public/'));

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/index.html'));
});

app.listen(80);

console.log(__dirname,'Now the server is running inside docker in url: http://127.0.0.1:80');
console.log(__dirname,'You can access the docker server on your PC on: http://127.0.0.1:8080');
