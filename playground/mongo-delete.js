const {MongoClient, ObjectID} = require("mongodb");

MongoClient.connect("mongodb://localhost:27017", {useNewUrlParser: true}, (error, client) => {
	if (error)
		return console.log("Enable to connect to MongoDB server");
	console.log("Connected to MongoDB server");
	const db = client.db("TodoApp");

	//delete many
	// db.collection("todos").deleteMany({text: "Promener Athena"})
	// 	.then(result => {
	// 		console.log(result);
	// 	})
	// 	.catch(error => console.log("Enable to delete todos", error))
	// 	.finally(() => client.close());

	//delete one
	// db.collection("todos").deleteOne({text: "test"})
	// 	.then(result => {
	// 		console.log(result);
	// 	})
	// 	.catch(error => console.log("Enable to delete todo", error))
	// 	.finally(() => client.close());

	//findOneAndDelete

	// db.collection("todos").findOneAndDelete({text: "test"})
	// 	.then(result => {
	// 		console.log(result);
	// 	})
	// 	.catch(error => console.log("Enable to delete todo", error))
	// 	.finally(() => client.close());


	db.collection("users").deleteMany({name: "Nico"})
		.then(result => {
			console.log("Users Nico deleted");
			return db.collection("users").deleteOne({_id: ObjectID("5c4da8044a1c436ddb1df4b1")});
		}).then(result => console.log("User with id 5c4da8044a1c436ddb1df4b1 deleted"))
		.catch(error => console.log("Enable to delete todo", error))
		.finally(() => client.close());





});