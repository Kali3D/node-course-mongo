const express = require("express");
const bodyParser = require("body-parser");
const {ObjectID} = require("mongodb");
const _ = require("lodash");

const {mongoose} = require("./db/mongoose");
const {Todo, User} = require("./models");

const app = express();
//PORT set by heroku
const port = process.env.PORT || 3000;

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

app.delete("/todos/:id", (request, response) => {
	if (!ObjectID.isValid(request.params.id))
		return response.status(404).send();
	Todo.findByIdAndDelete(request.params.id).then(todo => {
		if (todo)
			return response.send({todo});
		response.status(404).send();
	})
	.catch(error => response.status(400).send());
});

app.patch("/todos/:id", (request, response) => {
	const id = request.params.id;
	const body = _.pick(request.body, ["text", "completed"]);
	if (!ObjectID.isValid(request.params.id))
		return response.status(404).send();
	if (_.isBoolean(body.completed) && body.completed)
		body.completedAt = Date.now();
	else {
		body.completed = false;
		body.completedAt = null;
	}
	Todo.findByIdAndUpdate(id, {$set: body}, {new: true}).then(todo => {
		if (todo)
			return response.send(todo);
		response.status(404).send();
	})
	.catch(error => response.status(400).send());
});

app.listen(port, () => {
	console.log(`Started on port ${port}`);
});

module.exports = {app};