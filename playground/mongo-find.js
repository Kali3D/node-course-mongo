const {MongoClient, ObjectID} = require("mongodb");

MongoClient.connect("mongodb://localhost:27017", {useNewUrlParser: true}, (error, client) => {
	if (error)
		return console.log("Enable to connect to MongoDB server");
	console.log("Connected to MongoDB server");
	const db = client.db("TodoApp");

	// db.collection("todos").find({_id: new ObjectID("5c4da439dc8bee6d5d5a3ea2")}).toArray()
	// 	.then(docs => {
	// 		console.log(JSON.stringify(docs, undefined, 2));
	// 	})
	// 	.catch(error => console.log("Enable to fetch todos", error))
	// 	.finally(() => client.close());


	// db.collection("todos").find().count()
	// 	.then(count => {
	// 		console.log("Todos count : ", count);
	// 	})
	// 	.catch(error => console.log("Enable to count todos", error))
	// 	.finally(() => client.close());


	db.collection("users").find({name: "Nico"}).toArray()
		.then(docs => {
			console.log(JSON.stringify(docs, undefined, 2));
		})
		.catch(error => console.log("Enable to count todos", error))
		.finally(() => client.close());


//	client.close();

});