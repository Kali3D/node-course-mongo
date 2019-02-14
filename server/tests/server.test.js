const expect = require("expect");
const request = require("supertest");

const {app} = require("../server.js");
const {Todo, User} = require("../models");

const dummies = [{text: "dummy 01"}, {text: "dummy 02"}, {text: "dummy 03"}];

beforeEach(done => {
	Todo.deleteMany({}).then(() => Todo.insertMany(dummies)).then(() => done());
});

describe("POST /todos", () => {
	it("should create a new todo", (done) => {
		let text = "Test Todo text";
		request(app).post("/todos").send({text})
			.expect(200)
			.expect((response) => {
				expect(response.body.text).toBe(text)
			})
			.end((error, response) => {
				if (error) return done(error);
				Todo.find({text})
				.then((todos) => {
					expect(todos.length).toBe(1);
					expect(todos[0].text).toBe(text);
					done();
				})
				.catch(error => done(error));
			});
	});
	it("should not create todo with invalid body data", done => {
		request(app).post("/todos").send({})
			.expect(400)
			.end((error, response) => {
				if (error) return done(error);
				Todo.find()
				.then((todos) => {
					expect(todos.length).toBe(3);
					done();
				})
				.catch(error => done(error));
			});
	});
});

describe("GET /todos", () => {
	it("should get all todos", done => {
		request(app).get("/todos")
		.expect(200)
		.expect(response => {
			expect(response.body.todos.length).toBe(3);
		})
		.end(done);
	});
})