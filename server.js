var express = require('express');
var bodyParser = require('body-parser');
var request = require('request');
var app = express();

var baseURL = "https://apiv2.bitcoinaverage.com/indices/global/ticker/"
app.use(bodyParser.urlencoded({extended: true}));

app.get('/', function(req, res) {
    // res.send("Hello World");
    res.sendFile(__dirname + '/public/index.html');
});

app.post('/', function(req, res) {
    // console.log(req.body);
    var crypto = req.body.crypto;
    var fiat = req.body.fiat;
    var URLFin = baseURL + crypto + fiat;
    request(URLFin, function(error, response, body) {
        console.log("response is: ", response);
        console.log("body is: ", body);
    });
})

var port = 3000;
app.listen(port, function() {
    console.log("application is running on port " + port);
});