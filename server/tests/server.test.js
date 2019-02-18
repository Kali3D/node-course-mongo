const expect = require("expect");
const request = require("supertest");
const {ObjectID} = require("mongodb");

const {app} = require("../server");
const {Todo, User} = require("../models");
const {dummies, populateTodos, populateUsers, users} = require("./seed");

beforeEach(populateUsers);
beforeEach(populateTodos);

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

describe("Get /users/me", () => {
	it("should return a user if autenticated", done => {
		request(app).get("/users/me")
		.set("x-auth", users[0].tokens[0].token)
		.expect(200)
		.expect(response => {
			expect(response.body._id).toBe(users[0]._id.toHexString());
			expect(response.body.email).toBe(users[0].email);
		})
		.end(done);
	});

	it("should return a 401 if not autenticated", done => {
		request(app).get("/users/me")
		.expect(401)
		.expect(response => {
			expect(response.body).toEqual({});
		})
		.end(done);
	});
});

describe("POST /users", () => {
	it("should create a user", done => {
		const email = "q@s.fr";
		const password = "123654789";
		request(app).post("/users").send({email, password})
		.expect(200)
		.expect(response => {
			expect(response.headers["x-auth"]).toBeTruthy();
			expect(response.body._id).toBeTruthy();
			expect(response.body.email).toBe(email);
		})
		.end(error => {
			if (error)
				return done(error);
			User.findOne({email}).then(user => {
				expect(user).toBeTruthy();
				expect(user.password).not.toBe(password);
				done();
			})
			.catch(error => done(error));
		});
	});

	it("should return validation error if request invalid", done => {
		const email = "qs.fr";
		const password = "4789";
		request(app).post("/users").send({email, password})
		.expect(400)
		.end(done);
	});

	it("should note create user if email in use", done => {
		const email = "xleto@hotmail.com";
		const password = "Atreides_23";
		request(app).post("/users").send({email, password})
		.expect(400)
		.end(done);
	});
});

describe("POST /users/login", () => {
	it("should login user and return auth token", done => {
		request(app).post("/users/login")
		.send({email: users[1].email, password: users[1].password})
		.expect(200)
		.expect(response => {
			expect(response.headers["x-auth"]).toBeTruthy();
		})
		.end((error, response) => {
			if (error)
				return done(error);
			User.findById(users[1]._id).then(user => {
				expect(user.tokens[0]).toMatchObject({access: "auth", token: response.headers["x-auth"]});
				done();
			})
			.catch(error => done(error));
		});
	});

	it("should reject invalid login", done => {
		request(app).post("/users/login")
		.send({email: users[1].email, password: users[1].password+1})
		.expect(400)
		.expect(response => {
			expect(response.headers["x-auth"]).toBeFalsy();
		})
		.end((error, response) => {
			if (error)
				return done(error);
			User.findById(users[1]._id).then(user => {
				expect(user.tokens.length).toBe(0);
				done();
			})
			.catch(error => done(error));
		});
	});
});

