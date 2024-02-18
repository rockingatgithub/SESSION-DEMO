const mongoose = require('mongoose')

const mongoDB = mongoose.connect('mongodb://localhost:27017/testDB')


module.exports = mongoDB