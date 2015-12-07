var express = require('express');
var bodyParser = require('body-parser');
var sequelize = require('sequelize');
var bcrypt = require('bcrypt-nodejs');
var app = express();

app.use(bodyParser.json());

var conn = new sequelize(
    // host: '127.0.0.1',
    'addressbook', 'johnyduval'
);


//Middleware to assign the account ID to 1 at all times
app.use(function(request, response, next) {
    request.accountId = 2;
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

//Tell it about the Address table
var Address = conn.define('Address', {
    type: sequelize.ENUM('home', 'work', 'other'),
    line1: sequelize.STRING,
    line2: sequelize.STRING,
    city: sequelize.STRING,
    state: sequelize.STRING,
    zip: sequelize.STRING,
    country: sequelize.STRING
}, {
    tableName: 'Address'
});

// Link Entry and Address
Entry.hasMany(Address, {
    foreignKey: 'entryId'
});

//Tell it about the Phone table
var Phone = conn.define('Phone', {
    type: sequelize.ENUM('home', 'work', 'other'),
    subtype: sequelize.ENUM('landline', 'mobile', 'fax'),
    phoneNumber: sequelize.STRING
}, {
    tableName: 'Phone'
});

// Link Entry and Phone
Entry.hasMany(Phone, {
    foreignKey: 'entryId'
});

//Tell it about the Email table
var Email = conn.define('Email', {
    type: sequelize.ENUM('home', 'work', 'other'),
    address: sequelize.STRING
}, {
    tableName: 'Email'
});

// Link Entry and Address
Entry.hasMany(Email, {
    foreignKey: 'entryId'
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

    AddressBook.create({ //create an addressbook 
        name: req.body.name,
        accountId: req.body.accountId
            // }).then(function(book) {//link the addressbook to the user's account
            //     account.addAddressBook(book);
    }).then(function(book) {
        res.json(book);
    }).catch(function(err) {
        console.log(err);
        res.status(404).send('Not Found');
    });
});

// Delete an Addressbook

app.delete('/Addressbooks/:id', function(req, res) {

    AddressBook.destroy({
        where: {
            id: req.params.id
        }
    }).then(function(book) {
        res.json(book);
    });
});


// Update an AddressBook
app.put('/AddressBooks/:id', function(req, res) {

    AddressBook.update({
        name: req.body.name
    }, {
        where: {
            id: req.params.id
        }
    }).then(function(book) {
        res.send(book);
    });
});

//Add an Entry
app.post('/Entry/:addressbookId', function(req, res) {

    AddressBook.findOne({
        where: {
            id: req.params.addressbookId,
            accountId: req.accountId
        }
    }).then(function(AB) {
        console.log("Hello" + AB);

        if (AB) {
            return Entry.create({
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                birthday: req.body.birthday,
                addressbookId: req.params.addressbookId
            }).then(function(result) {
                res.send(result);
            });
        }
        else {
            res.send("NOoooo!");
        }
    });
});

//Read Entry by ID
app.get('/Entry/:id', function(req, res) {

    Entry.find({
        where: {
            id: req.params.id
        },
        attributes: {
            exclude: ['createdAt', 'updatedAt', 'addressbookId']
        }
    }).then(function(result) {
        res.json(result);
    }).catch(function(error) {
        console.log(error);
    });
});

// Delete an Entry
app.delete('/Entry/:id', function(req, res) {

    Entry.destroy({
        where: {
            id: req.params.id
        }
    }).then(function(book) {
        res.json(book);
    });
});

// Update an Entry
app.put('/Entry/:id', function(req, res) {

    Entry.update({
        firstName: req.body.firstName,
        addressbookId: req.body.addressbookId,
        lastName: req.body.lastName,
        birthday: req.body.birthday
    }, {
        where: {
            id: req.params.id
        },
        attributes: {
            exclude: ['createdAt', 'updatedAt']
        }
    }).then(function(book) {
        res.send(book);
    });
});

// ADDRESS --------------------------------------------------------------

//Add an Address
app.post('/Address/:entryId', function(req, res) {

    Account.findById(req.accountId)
        .then(function(account) {

            Entry.findById(req.params.entryId)
                .then(function(entry) {
                    return AddressBook.findById(entry.addressbookId);
                })
                .then(function(addressbook) {
                    return account.hasAddressBook(addressbook);
                })
                .then(function(result) {
                    if (result) return Address.create({
                        type: req.body.type,
                        line1: req.body.line1,
                        line2: req.body.line2,
                        city: req.body.city,
                        state: req.body.state,
                        zip: req.body.zip,
                        country: req.body.country,
                        entryId: req.params.entryId
                    });
                    else {
                        throw new Error("Sorry you are trying to add an address to an Entry that does not belong to you");
                    }
                }).then(function(newAddress) {
                    res.send(newAddress);
                }).catch(function(error) {
                    res.send(error.message);
                });
        });

});

//Read an Address by ID
app.get('/Address/:id', function(req, res) {

    Address.find({
        where: {
            id: req.params.id
        },
        attributes: {
            exclude: ['createdAt', 'updatedAt', 'entryId']
        }
    }).then(function(result) {
        res.json(result);
    }).catch(function(error) {
        console.log(error);
    });
});

// Delete an Address
app.delete('/Address/:id', function(req, res) {

    Address.destroy({
        where: {
            id: req.params.id
        }
    }).then(function(book) {
        res.json(book);
    });
});

// Update an Address
app.put('/Address/:id', function(req, res) {

    Address.update({
        type: req.body.type,
        line1: req.body.line1,
        line2: req.body.line2,
        city: req.body.city,
        state: req.body.state,
        zip: req.body.zip,
        country: req.body.country
    }, {
        where: {
            id: req.params.id
        },
        attributes: {
            exclude: ['createdAt', 'updatedAt']
        }
    }).then(function(modAddress) {
        res.send(modAddress);
    });
});

//PHONE-----------------------------------------------------

//Add a Phone
app.post('/Phone/:entryId', function(req, res) {

    Account.findById(req.accountId)
        .then(function(account) {

            Entry.findById(req.params.entryId)
                .then(function(entry) {
                    return AddressBook.findById(entry.addressbookId);
                })
                .then(function(addressbook) {
                    return account.hasAddressBook(addressbook);
                })
                .then(function(result) {
                    if (result) return Phone.create({
                        type: req.body.type,
                        subtype: req.body.subtype,
                        phoneNumber: req.body.phoneNumber,
                        entryId: req.params.entryId
                    });
                    else {
                        throw new Error("Sorry you are trying to add a phone number to an Entry that does not belong to you");
                    }
                }).then(function(newPhone) {
                    res.send(newPhone);
                }).catch(function(error) {
                    res.send(error.message);
                });
        });

});

//Read a Phone by ID
app.get('/Phone/:id', function(req, res) {

    Phone.find({
        where: {
            id: req.params.id
        },
        attributes: {
            exclude: ['createdAt', 'updatedAt', 'entryId']
        }
    }).then(function(result) {
        res.json(result);
    }).catch(function(error) {
        console.log(error);
    });
});

// Delete a Phone
app.delete('/Phone/:id', function(req, res) {

    Phone.destroy({
        where: {
            id: req.params.id
        }
    }).then(function(book) {
        res.json(book);
    });
});

// Update a Phone
app.put('/Phone/:id', function(req, res) {

    Phone.update({
        type: req.body.type,
        subtype: req.body.subtype,
        phoneNumber: req.body.phoneNumber
    }, {
        where: {
            id: req.params.id
        },
        attributes: {
            exclude: ['createdAt', 'updatedAt']
        }
    }).then(function(modPhone) {
        res.send(modPhone);
    });
});

// EMAIL -----------------------------------------------------

//Add an Email
app.post('/Email/:entryId', function(req, res) {

    Account.findById(req.accountId)
        .then(function(account) {

            Entry.findById(req.params.entryId)
                .then(function(entry) {
                    return AddressBook.findById(entry.addressbookId);
                })
                .then(function(addressbook) {
                    return account.hasAddressBook(addressbook);
                })
                .then(function(result) {
                    if (result) return Email.create({
                        type: req.body.type,
                        address: req.body.address,
                        entryId: req.params.entryId
                    });
                    else {
                        throw new Error("Sorry you are trying to add a phone number to an Entry that does not belong to you");
                    }
                }).then(function(newEmail) {
                    res.send(newEmail);
                }).catch(function(error) {
                    res.send(error.message);
                });
        });

});

//Read a Email by ID
app.get('/Email/:id', function(req, res) {

    Email.find({
        where: {
            id: req.params.id
        },
        attributes: {
            exclude: ['createdAt', 'updatedAt', 'entryId']
        }
    }).then(function(result) {
        res.json(result);
    }).catch(function(error) {
        console.log(error);
    });
});

// Delete an Email
app.delete('/Email/:id', function(req, res) {

    Email.destroy({
        where: {
            id: req.params.id
        }
    }).then(function(book) {
        res.json(book);
    });
});

// Update an Email
app.put('/Email/:id', function(req, res) {

    Email.update({
        type: req.body.type,
        address: req.body.address
    }, {
        where: {
            id: req.params.id
        },
        attributes: {
            exclude: ['createdAt', 'updatedAt']
        }
    }).then(function(modEmail) {
        res.send(modEmail);
    });
});

//SIGN UP ---------------------------------------------------------------

app.post('/Accounts/signup', function(req, res) {

    Account.create({
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password)
    }).then(function(result) {
        res.send(result);
    }).catch(function(error){
        res.status(400).send("You can't do that");
    });
});

var server = app.listen(process.env.PORT, process.env.IP, function() {
    var host = server.address().address;
    var port = server.address().port;

    console.log('Example app listening at http://%s:%s', host, port);
});