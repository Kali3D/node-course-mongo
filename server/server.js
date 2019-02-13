const express = require("express");
const bodyParser = require("body-parser");

const {mongoose} = require("./db/mongoose");
const {Todo} = require("./models/Todo");
const {User} = require("./models/User");

const app = express();

app.use(bodyParser.json());


app.post("/todos", (request, response) => {
	const todo = new Todo({text: request.body.text});
	todo.save()
	.then(doc => response.send(doc))
	.catch(error => response.status(400).send(error));
	console.log(request.body);
});

// app.get("/todos", (request, response) => {

// });

app.listen(3000, () => {
	console.log("Started on port 3000");
});