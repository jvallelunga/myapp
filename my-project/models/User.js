'use strict';
const mongoose = require('mongoose');
const mySchema = mongoose.Schema({ name: String });

/* global db */
module.exports = db.model('users', mySchema);