const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');


const adapter = new FileSync('./models/db.json');
const db = low(adapter);

db.defaults({
    user:{},
    message:[],
    product:[],
    skils:{}
}).write();


module.exports = db;

