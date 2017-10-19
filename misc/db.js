/*
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const adapter = new FileSync('db.json');
//const FileAsync = require('lowdb/adapters/FileAsync')
//const adapter = new FileAsync('db.json');
const db = low(adapter);

db.defaults({ users: [] }).write();
//const result = db.get('posts').push({ name: process.argv[2] }).write();
const result = db.get('users');
console.log(result);
*/

//var store = require('json-fs-store')('db.json');

/*
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB_URI, function(err) {
    if (err) {
        console.log(err);
    } else {
        console.log("Connected to DB");
    }
});
*/