const mongoose = require('mongoose');

const uri = process.env.DATABASE_URL;
global.db = mongoose.createConnection(uri);
