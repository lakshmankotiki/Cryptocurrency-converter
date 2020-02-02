//requiring modules
var express = require('express');
var bodyParser = require('body-parser');
var request = require('request');
var app = express();

//getting base URLs of bitcoing average
var convertBaseURL = "https://apiv2.bitcoinaverage.com/indices/global/ticker/";
var priceBaseURL = "https://apiv2.bitcoinaverage.com/convert/global";

//body parser for getting form input data
app.use(bodyParser.urlencoded({extended: true}));

//home page route
app.get('/', function(req,res) {
    res.sendFile(__dirname + '/public/home.html');
});

//route to get crypto currency convrsion page
app.get('/convert.html', function(req, res) {
    res.sendFile(__dirname + '/public/convert.html');
});

//route to get the live price of cryptos
app.get('/price.html', function(req,res) {
    res.sendFile(__dirname + '/public/price.html');
})

//logic to get the converted currency from cryptos
app.post('/convert.html', function(req, res) {

    //getting the requested data using body parser
    var crypto = req.body.crypto;
    var fiat = req.body.fiat;

    //binding dynaic values to the URL
    var URLFin = convertBaseURL + crypto + fiat;

    //calling external api using request module
    request(URLFin, function(error, response, body) {
        if(response.statusCode === 200) {
            var data = JSON.parse(body);
            var price = data.last;

            //displaying response on body
            res.write("The current time is: " + "<b>" +data.display_timestamp + "</b>");
            res.write("<h1>The current price of " + crypto + "is " + price + fiat + "</h1>");
            res.send();
        } else if(response.statusCode === 403) {
            res.send("<b>Authentication Problem from Bitcoin average site due to the security.</b>");
        } else if(response.error) {
            res.send(error);
        }
    });
});

//logic to get the live price of specific amount of currency
app.post('/price.html', function(req,res) {
    var crypto = req.body.crypto;
    var fiat = req.body.fiat;
    var amount = req.body.amount;
    
    //request module accepting options as the parameter which includes url,methods and query parameters
    var options = {
        url: priceBaseURL,
        method: "GET",
        qs: {
            from: crypto,
            to: fiat,
            amount: amount
        }
    };
    request(options, function(error, response, body) {
        if(response.statusCode === 200) {
            var data = JSON.parse(body);
            var price = data.price;
            var time = data.time;
            res.write("<p>The Current date is:" + time);
            res.write("<h1>" + amount + crypto + " is currently worth " + price + fiat);
            res.send();
        } else if(response.statusCode === 403) {
            res.send("<b>Authentication Problem from Bitcoin average site due to the security.</b>");
        } else if(response.error) {
            res.send(error);
        }
    })
});

//port to listen out application
var port = 3000;
app.listen(port, function() {
    console.log("application is running on port " + port);
});