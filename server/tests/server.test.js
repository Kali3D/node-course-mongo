const expect = require("expect");
const request = require("supertest");
const {ObjectID} = require("mongodb");

const {app} = require("../server.js");
const {Todo, User} = require("../models");


const dummies = [
	{_id: new ObjectID(), text: "dummy 01"}, 
	{_id: new ObjectID(), text: "dummy 02", completed: true, completedAt: 12345}, 
	{_id: new ObjectID(), text: "dummy 03"}
];

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
});

describe("GET /todos/:id", () => {
	it("should return the right todo", done => {
		request(app).get("/todos/"+dummies[0]._id.toHexString())
		.expect(200)
		.expect(response => {
			expect(response.body.todo.text).toBe(dummies[0].text)
		})
		.end(done);
	});
	it("should return a 404 if todo not found", done => {
		request(app).get("/todos/"+new ObjectID().toHexString())
		.expect(404)
		.end(done);
	});
	it("should return a 404 for bad ObjectID", done => {
		request(app).get("/todos/12345")
		.expect(404)
		.end(done);
	});
});

describe("DELETE /todos/:id", () => {
	it("should return the deleted todo", done => {
		const hexId = dummies[0]._id.toHexString();
		request(app).delete("/todos/"+hexId)
		.expect(200)
		.expect(response => {
			expect(response.body.todo.text).toBe(dummies[0].text)
		})
		.end((error, response) => {
			if (error)
				return done(error);
			Todo.findById(hexId).then(todo => {
				expect(todo).toBeNull();
				done();
			})
			.catch(error => done(error));

		});
	});
	it("should return a 404 if todo not found", done => {
		request(app).delete("/todos/"+new ObjectID().toHexString())
		.expect(404)
		.end(done);
	});
	it("should return a 404 for bad ObjectID", done => {
		request(app).delete("/todos/12345")
		.expect(404)
		.end(done);
	});
});

describe("PATCH /todos/:id", () => {
	it("should update the todo", done => {
		const hexId = dummies[0]._id.toHexString();
		const update = {text: "updated dummy 01", completed: true};
		request(app).patch("/todos/"+hexId).send(update)
		.expect(200)
		.expect(response => {
			expect(response.body.todo.text).toBe(update.text);
			expect(response.body.todo.completed).toBe(true);
			expect(response.body.todo.completedAt).not.toBeNull();
			expect(typeof response.body.todo.completedAt).toBe("number");
		})
		.end(done);
	});

	it("should clear completedAt on the updated todo", done => {
		const hexId = dummies[1]._id.toHexString();
		const update = {text: "updated dummy 02", completed: false};
		request(app).patch("/todos/"+hexId).send(update)
		.expect(200)
		.expect(response => {
			expect(response.body.todo.text).toBe(update.text);
			expect(response.body.todo.completed).toBe(false);
			expect(response.body.todo.completedAt).toBeNull();
		})
		.end(done);
	});


});