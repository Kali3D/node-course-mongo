const {MongoClient, ObjectID} = require("mongodb");

MongoClient.connect("mongodb://localhost:27017", {useNewUrlParser: true}, (error, client) => {
	if (error)
		return console.log("Enable to connect to MongoDB server");
	console.log("Connected to MongoDB server");
	const db = client.db("TodoApp");



	// db.collection("todos").findOneAndUpdate(
	// 	{_id: ObjectID("5c4da9dbde28d20868205c49")}, 
	// 	{$set: {completed: true}}, {returnOriginal: false}
	// )
	// .then(result => {
	// 	console.log(JSON.stringify(result));
	// })
	// .catch(error => console.log("Enable to update todo", error))
	// .finally(() => client.close());


	db.collection("users").findOneAndUpdate(
		{_id: ObjectID("5c4da5884ee1ae6d8ba67d93")}, 
		{$set: {name: "Nico"}, $inc: {age: -1}}, {returnOriginal: false}
	)
	.then(result => {
		console.log(JSON.stringify(result, undefined, 2));
	})
	.catch(error => console.log("Enable to update user", error))
	.finally(() => client.close());




});