const express = require("express");
const bodyParser = require("body-parser");
const {ObjectID} = require("mongodb");

const {mongoose} = require("./db/mongoose");
const {Todo, User} = require("./models");

const app = express();

app.use(bodyParser.json());


app.post("/todos", (request, response) => {
	const todo = new Todo({text: request.body.text});
	todo.save()
	.then(doc => response.send(doc))
	.catch(error => response.status(400).send(error));
	console.log(request.body);
});

app.get("/todos", (request, response) => {
	Todo.find().then(todos => response.send({todos}))
	.catch(error => response.status(400).send(error))
});



app.get("/todos/:id", (request, response) => {
	if (!ObjectID.isValid(request.params.id))
		return response.status(404).send();
	Todo.findById(request.params.id).then(todo => {
		if (todo)
			return response.send({todo});
		response.status(404).send();
	})
	.catch(error => response.status(400).send());
});


app.listen(3000, () => {
	console.log("Started on port 3000");
});

module.exports = {app};