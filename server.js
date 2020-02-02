var express = require('express');
var bodyParser = require('body-parser');
var request = require('request');
var app = express();

var baseURL = "https://apiv2.bitcoinaverage.com/indices/global/ticker/"
app.use(bodyParser.urlencoded({extended: true}));

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/public/convert.html');
});

app.post('/', function(req, res) {
    var crypto = req.body.crypto;
    var fiat = req.body.fiat;
    var URLFin = baseURL + crypto + fiat;
    request(URLFin, function(error, response, body) {
        if(response.statusCode === 200) {
            var data = JSON.parse(body);
            var price = data.last;
            res.write("The current time is: " + data.display_timestamp);
            res.write("<h1>The current price of " + crypto + "is " + price + fiat + "</h1>");
            res.send();
        } else if(response.statusCode === 403) {
            res.send("<b>Authentication Problem from Bitcoin average site.</b>");
        } else if(response.error) {
            res.send(error);
        }
    });
})

var port = 3000;
app.listen(port, function() {
    console.log("application is running on port " + port);
});