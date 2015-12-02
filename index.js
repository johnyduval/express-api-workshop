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
    req.accountId = 2;
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

// Read AddressBooks
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

// Create new AddressBooks
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


// Delete AddressBooks
app.delete ('/AddressBooks/:id', function(req, res){
        connection.query("delete from AddressBook where id = " + req.params.id);
        res.send("The ID was deleted!");
});


// Update AddressBooks
app.put ('/AddressBooks/:id', function(req,res){
    connection.query("update AddressBook set name = '" + req.body.name + "' where id = " + req.params.id, function(err, result){
        res.send("The ID was edited");
        if(err) throw (err);
    });
});

app.post('/Entries', function(req, res){

    if (req.body.accountId === req.accountId){
        if(req.body.firstName){
          connection.query("Insert into Entry set firstName= '" + req.body.firstName + "', lastName= '" + req.body.lastName + "', birthday= '" + req.body.birthday + "', addressBookId= " + req.body.addressBookId, function (err, result){
            res.send("Yay!");
            //console.log(result);
            if (err){
                res.status(400).send('You have an error 1!');
            }
          });
        }  else {
        res.status(404).send('You have an error 2!');    
        }
    } else {
        res.status(404).send('You have an error 3!');
    }
});

// Read Addresses
app.get('/Address/:id', function(req, res) {
    connection.query('select Address.id as addressId, Address.entryId as EntryId, Address.type as addressType, Address.line1 as addressLine1, Address.line2 as addressLine2, Address.city as addressCity, Address.state as addressState, Address.zip as addressZip, Address.country as addressCountry from Address join Entry on Address.entryId = Entry.id join AddressBook on addressbookId = AddressBook.id join Account on AddressBook.accountId = Account.id where Address.id = ' + req.params.id + ' AND accountId =' + req.accountId + '', function(err, result) {
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

// Create Addresses
app.post('/Address', function(req, res){

    if (req.body.accountId === req.accountId){
        if(req.body.type === "home" || req.body.type === "work" || req.body.type === "other"){
          connection.query("Insert into Address set entryId = " + req.body.entryId + ", type= '" + req.body.type + "', line1= '" + req.body.line1 + "', line2= '" + req.body.line2 + "', city= '" + req.body.city + "', state= '" + req.body.state + "', zip= '" + req.body.zip + "', country = '" + req.body.country + "'", function (err, result){
            res.send(result);
            if (err){
                res.status(400).send('You have an error 1!');
            }
          });
        }  else {
        res.status(404).send('You have an error 2!');    
        }
    } else {
        res.status(404).send('You have an error 3!');
    }
});


// Delete Addresses
app.delete ('/Address/:id', function(req, res){
        connection.query("delete from Address where id = " + req.params.id);
        res.send("The ID was deleted!");
});


// Update Addresses
app.put ('/Address/:id', function(req,res){
    connection.query("update Address set entryId = '" + req.body.entryId + "', type = '" + req.body.type + "', line1 = '" + req.body.line1 + "', line2 = '" + req.body.line2 + "', city = '" + req.body.city + "', state = '" + req.body.state + "', zip = '" + req.body.zip + "', country = '" + req.body.country + "' where id = " + req.params.id, function(err, result){
        res.send("The ID was edited");
        if(err) throw (err);
    });
});

// Read Phone
app.get('/Phone/:id', function(req, res) {
    connection.query('select Phone.id as phoneId, Phone.entryId as phoneEntryId, Phone.type as phoneType, Phone.subtype as phoneSubtype, Phone.phoneNumber as phonePhoneNumber from Phone join Entry on Phone.entryId = Entry.id join AddressBook on addressbookId = AddressBook.id join Account on AddressBook.accountId = Account.id where Phone.id = ' + req.params.id + ' AND accountId =' + req.accountId + '', function(err, result) {
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

// Create Phone
app.post('/Phone', function(req, res){

    if (req.body.accountId === req.accountId){
        if(req.body.type === "home" || req.body.type === "work" || req.body.type === "other"){
          connection.query("Insert into Phone set entryId = " + req.body.entryId + ", type= '" + req.body.type + "', subtype= '" + req.body.subtype + "', phoneNumber= '" + req.body.phoneNumber + "'", function (err, result){
            res.send(result);
            if (err){
                res.status(400).send('You have an error 1!');
            }
          });
        }  else {
        res.status(404).send('You have an error 2!');    
        }
    } else {
        res.status(404).send('You have an error 3!');
    }
});


// Delete Phone
app.delete ('/Phone/:id', function(req, res){
        connection.query("delete from Phone where id = " + req.params.id);
        res.send("The ID was deleted!");
});


// Update Phone
app.put ('/Phone/:id', function(req,res){
    connection.query("update Phone set entryId = '" + req.body.entryId + "', type = '" + req.body.type + "', subtype = '" + req.body.subtype + "', phoneNumber = '" + req.body.phoneNumber + "' where id = " + req.params.id, function(err, result){
        res.send("The ID was edited");
        if(err) throw (err);
    });
});

// Read Email
app.get('/Email/:id', function(req, res) {
    connection.query('select Email.id as emailId, Email.entryId as emailEntryId, Email.type as emailType, Email.address as emailAddress from Email join Entry on Email.entryId = Entry.id join AddressBook on addressbookId = AddressBook.id join Account on AddressBook.accountId = Account.id where Email.id = ' + req.params.id + ' AND accountId =' + req.accountId + '', function(err, result) {
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

// Create Email
app.post('/Email', function(req, res){

    if (req.body.accountId === req.accountId){
        if(req.body.type === "home" || req.body.type === "work" || req.body.type === "other"){
          connection.query("Insert into Email set entryId = " + req.body.entryId + ", type= '" + req.body.type + "', address= '" + req.body.address + "'", function (err, result){
            res.send(result);
            if (err){
                res.status(400).send('You have an error 1!');
            }
          });
        }  else {
        res.status(404).send('You have an error 2!');    
        }
    } else {
        res.status(404).send('You have an error 3!');
    }
});


// Delete Email
app.delete ('/Email/:id', function(req, res){
        connection.query("delete from Email where id = " + req.params.id);
        res.send("The ID was deleted!");
});


// Update Email
app.put ('/Email/:id', function(req,res){
    connection.query("update Email set entryId = '" + req.body.entryId + "', type = '" + req.body.type + "', address = '" + req.body.address + "' where id = " + req.params.id, function(err, result){
        res.send("The ID was edited");
        if(err) throw (err);
    });
});

var server = app.listen(process.env.PORT, process.env.IP, function() {
    var host = server.address().address;
    var port = server.address().port;

    console.log('Example app listening at http://%s:%s', host, port);
});
