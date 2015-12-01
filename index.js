var express = require('express');
var bodyParser = require('body-parser');
var app = express();

var db = require('mysql');
var connection = db.createConnection({
    user: 'johnyduval',
    host: '127.0.0.1',
    database: 'addressbook'
});

app.use(function(req, res, next) {
    req.accountId = 1;
    next();
});

app.use(bodyParser.json());

app.get('/AddressBooks/', function(req, res) {
    connection.query('select AddressBook.name, AddressBook.id as id from Account join AddressBook on Account.id = AddressBook.accountId where accountId =' + req.accountId, function(err, result) {
        if (err) {
            console.log(err);
        }
        else {
            console.log(result);
            res.send(result);
        }
    });
});

app.get('/AddressBooks/:id', function(req, res) {
    connection.query('select AddressBook.id as id, AddressBook.name as name from AddressBook where AddressBook.id = ' + req.params.id + ' AND accountId =' + req.accountId, function(err, result) {
        if (err) {
            console.log(err);
        }
        else if (result.length === 0) {
            res.status(404).send('Not Found');
        }
        else if (result) {
            res.send(result);
        }
    });
});

app.post('/AddressBooks', function(req, res){

    if (req.body.accountId === req.accountId){
        if(req.body.name){
          connection.query("Insert into AddressBook set accountId = " + req.body.accountId + ", name= '" + req.body.name + "'", function (err, result){
            //console.log(result);
            if (err){
                res.status(400).send('You have an error!');
            }
          });
        }  else {
        res.status(404).send('You have an error!');    
        }
    } else {
        res.status(404).send('You have an error!');
    }
});

app.delete ('/AddressBooks/:id', function(req, res){
        connection.query("delete from AddressBook where id = " + req.params.id);
        res.send("The ID was deleted!");
});

var server = app.listen(process.env.PORT, process.env.IP, function() {
    var host = server.address().address;
    var port = server.address().port;

    console.log('Example app listening at http://%s:%s', host, port);
});
