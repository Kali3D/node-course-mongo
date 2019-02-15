const {ObjectID} = require("mongodb");
const {mongoose} = require("../server/db/mongoose");
const {User, Todo} = require("../server/models");

//Todo.deleteMany({}).then(result => console.log(result));

//Todo.findOneAndDelete({_id: ???}).then(result => console.log(result));

Todo.findByIdAndDelete("5c669e0d28687fa76d30c7a0").then(todo => console.log(todo));