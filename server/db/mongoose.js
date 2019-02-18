const mongoose = require("mongoose");

mongoose.Promise = global.Promise;
console.log("Mongo URI : ", process.env.MONGODB_URI);
mongoose.connect(process.env.MONGODB_URI, {useNewUrlParser: true, useCreateIndex: true, useFindAndModify: false});

module.exports = {mongoose};