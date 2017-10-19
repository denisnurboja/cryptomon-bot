'use strict';
const sjdb = require('sjdb');
const log = require('ololog').configure({ locate: false });
require('ansicolor').nice;

const db = new sjdb.JDatabase('./db', 'data');
db.core.secureMod = true;
db.create();

var users = db.table('users');
users.create();

//users.put('1', { userId: 1, name: 'Alfonso' });

log.green(`Database initialized at ${db.dir.path}/${db.file.path}`);

module.exports = {
    users: users
}