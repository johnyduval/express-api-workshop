var express = require('express');
var bodyParser = require('body-parser');
var sequelize = require('sequelize');
var app = express();

app.use(bodyParser.json());

var conn = new sequelize(
    // host: '127.0.0.1',
    'addressbook', 'johnyduval'
);


//Middleware to assign the account ID to 1 at all times
app.use(function(request, response, next) {
    request.accountId = 3;
    next();
});

//Tell it about the Account table

var Account = conn.define('Account', {
    email: sequelize.STRING,
    password: sequelize.STRING
}, {
    tableName: 'Account'
});

//Tell it about the AddressBook table
var AddressBook = conn.define('AddressBook', {
    name: sequelize.STRING
}, {
    tableName: 'AddressBook'
});

// Link Account and Addressbook
Account.hasMany(AddressBook, {
    foreignKey: 'accountId'
});

//Tell it about the Entry table
var Entry = conn.define('Entry', {
    firstName: sequelize.STRING,
    lastName: sequelize.STRING,
    birthday: sequelize.DATE
}, {
    tableName: 'Entry'
});

// Link Addressbook and Entry
AddressBook.hasMany(Entry, {
    foreignKey: 'addressbookId'
});


//Get all of the address books
app.get('/AddressBooks', function(req, res) {
    AddressBook.find({
        where: {
            accountId: req.accountId,
        },
        attributes: {
            exclude: ['createdAt', 'updatedAt', 'AccountId']
        }
    }).then(function(result) {
        res.json(result);
    }).catch(function(error) {
        console.log(error);
    });
});

//Get all of the address books by ID
app.get('/AddressBooks/:id', function(req, res) {

    AddressBook.find({
        where: {
            accountId: req.accountId,
            id: req.params.id
        },
        attributes: {
            exclude: ['createdAt', 'updatedAt', 'AccountId']
        }
    }).then(function(result) {
        res.json(result);
    }).catch(function(error) {
        console.log(error);
    });
});


// Add an Addressbook
app.post('/AddressBooks', function(req, res) {

    AddressBook.create({//create an addressbook 
        name: req.body.name,
        accountId: req.accountId
    // }).then(function(book) {//link the addressbook to the user's account
    //     account.addAddressBook(book);
    }).then(function(book){
        res.json(book);    
    }).catch(function(err) {
        console.log(err);
        res.send('error');
    });
});

// Delete an Addressbook

app.delete('/Addressbooks/:id', function(req, res){
    
    AddressBook.destroy({
        where: {
        id: req.params.id}
    }).then(function(book){
        res.json(book);
    });
});

var server = app.listen(process.env.PORT, process.env.IP, function() {
    var host = server.address().address;
    var port = server.address().port;

    console.log('Example app listening at http://%s:%s', host, port);
});