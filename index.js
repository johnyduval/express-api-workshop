var express = require('express');
var bodyParser = require('body-parser');
var app = express();

var db = require('mysql');
var connection = db.createConnection({
    user: 'johnyduval',
    host: '127.0.0.1',
    database: 'addressbook'
});

app.use(function(req, res, next){
    req.accountId = 1;
    next();
});

app.use(bodyParser.json());

 app.get('/AddressBook/:accountId', function (req,res){
     connection.query('select * from Account where id =' + req.accountId, function(err,result){
        if (err){
            console.log(err);
        } else {
            console.log(result);
        }
     });
 });


var server = app.listen(process.env.PORT, process.env.IP, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});
