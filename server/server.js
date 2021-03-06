const express = require("express");
const bodyParser = require("body-parser");
const {ObjectID} = require("mongodb");
const _ = require("lodash");

require("./config/config");

const {mongoose} = require("./db/mongoose");
const {Todo, User} = require("./models");
const {authenticate} = require("./middlewares");


const app = express();
//PORT set by heroku
const port = process.env.PORT;

app.use(bodyParser.json());


app.post("/todos", authenticate, (request, response) => {
	const todo = new Todo({text: request.body.text, _creator: request.user._id});
	todo.save()
	.then(doc => response.send(doc))
	.catch(error => response.status(400).send(error));
});

app.get("/todos", authenticate, (request, response) => {
	Todo.find({_creator: request.user._id}).then(todos => response.send({todos}))
	.catch(error => response.status(400).send(error))
});

app.get("/todos/:id", authenticate, (request, response) => {
	if (!ObjectID.isValid(request.params.id))
		return response.status(404).send();
	Todo.findOne({_id: request.params.id, _creator: request.user._id}).then(todo => {
		if (todo)
			return response.send({todo});
		response.status(404).send();
	})
	.catch(error => response.status(400).send());
});

app.delete("/todos/:id", authenticate, (request, response) => {
	if (!ObjectID.isValid(request.params.id))
		return response.status(404).send();
	Todo.findOneAndDelete({_id: request.params.id, _creator: request.user._id}).then(todo => {
		if (todo)
			return response.send({todo});
		response.status(404).send();
	})
	.catch(error => response.status(400).send());
});

app.patch("/todos/:id", authenticate, (request, response) => {
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
	Todo.findOneAndUpdate({_id: id, _creator: request.user._id}, {$set: body}, {new: true}).then(todo => {
		if (todo)
			return response.send({todo});
		response.status(404).send();
	})
	.catch(error => response.status(400).send());
});

app.get("/users/me", authenticate, (request, response) => {
	response.send(request.user);
});

app.post("/users", (request, response) => {
	const body = _.pick(request.body, ["email", "password"]);
	const user = new User(body);
	user.save()
	.then(() => user.generateAuthToken())
	.then(token => response.header("x-auth", token).send(user))
	.catch(error => response.status(400).send(error));
});

app.post("/users/login", (request, response) => {
	const email = request.body.email;
	const password = request.body.password;
	User.findByCredentials(email, password).then(user => {
		user.generateAuthToken().then(token => response.header("x-auth", token).send(user))
	})
	.catch(error => response.status(400).send());
});

app.delete("/users/me/token", authenticate, (request, response) => {
	request.user.removeToken(request.token)
	.then(() => response.status(200).send())
	.catch(error => response.status(400).send());
});


app.listen(port, () => {
	console.log(`Started on port ${port}`);
});

module.exports = {app};