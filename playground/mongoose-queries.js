const {ObjectID} = require("mongodb");
const {mongoose} = require("../server/db/mongoose");
const {User, Todo} = require("../server/models");

//const id = "5c655528745ecc76769a27cb";

//const id = "5c655528745ecc76769a27cb11";


// Todo.find({_id: id}).then(todos => console.log("Todos", todos));

// Todo.findOne({_id: id}).then(todo => console.log("Todo", todo));

// if (!ObjectID.isValid(id))
// 	return console.log("Invalid ID");

// Todo.findById(id).then(todo => {
// 	if (!todo) return console.log("Object not found");
// 	console.log("By ID", todo);
// })
// .catch(error => console.log(error));


const id = "5c64420e803bfb4e20afb729";

User.findById(id).then(user => {
	if (!user) return console.log("User not found");
	console.log("User found : ", JSON.stringify(user, undefined, 2))
})
.catch(error => console.log(error));