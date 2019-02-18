const {ObjectID} = require("mongodb");
const jwt = require("jsonwebtoken");

const {Todo, User} = require("../models");



const dummies = [
	{_id: new ObjectID(), text: "dummy 01"}, 
	{_id: new ObjectID(), text: "dummy 02", completed: true, completedAt: 12345}, 
	{_id: new ObjectID(), text: "dummy 03"}
];

const userId = new ObjectID();

const users = [{
	_id: userId,
	email: "xleto@hotmail.com",
	password: "Atreides_23",
	tokens: [{
		access: "auth",
		token: jwt.sign({_id: userId, access: "auth"}, "afhiufkn354").toString()
	}]
}, {
	_id: new ObjectID(),
	email: "ncharpin@axxescaraibes.net",
	password: "123456789"
}];


const populateTodos = done => {
	Todo.deleteMany({}).then(() => Todo.insertMany(dummies)).then(() => done());
};

const populateUsers = done => {
	User.deleteMany({}).then(() => {
		const user1 = new User(users[0]).save();
		const user2 = new User(users[1]).save();
		return Promise.all([user1, user2]);
	}).then(() => done());
};

module.exports = {populateTodos, populateUsers, dummies, users};