var express = require('express');
var app = express();
var exphbs = require('express-handlebars');

// require http module
var http = require('http');
// initialize the giphy api library
var giphy = require('giphy-api')();

app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

// static files will live in the public folder
app.use(express.static('public'));

// Not sure about this line
app.get('/hello-gif', function (req, res) {
    var gifUrl = 'http://media2.giphy.com/media/gYBVM1igrlzH2/giphy.gif'
    res.render('hello-gif', {gifUrl: gifUrl})
})

app.get('/greetings/:name', function (req, res) {
  var name = req.params.name;
  res.render('greetings', {name: name});
})


app.get('/', function (req, res) {
    
    // giphy.search(req.query.term, function (err, response) {
    //     res.render('home', {gifs: response.data})
    // })

    // BIG BLOB
    console.log(req.query.term)
    var queryString = req.query.term;
    // encode the query string to remove white spaces and rest5ricted characters
    var term = encodeURIComponent(queryString);
    // put the searched term into the giphy api search url
    var url = 'http://api.giphy.com/v1/gifs/search?q=' + term + '&api_key=dc6zaTOxFJmzC'

    http.get(url, function(response) {
        // set encoding of response to UTF8
        response.setEncoding('utf8');

        var body = '';

        response.on('data', function(d) {
            // continuously update stream with data from giphy
            body += d;
        });

        response.on('end', function() {
            // when data is fully received, parse into json
            var parsed = JSON.parse(body);
            res.render('home', {gifs: parsed.data})
        });
    });
})


app.listen(3000, function ()  {
    console.log('gif search listening on port localhost:3000')
})
