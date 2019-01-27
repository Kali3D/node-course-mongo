//const MongoClient = require("mongodb").MongoClient;

const {MongoClient, ObjectID} = require("mongodb");

const obj = new ObjectID();
console.log(obj, obj.getTimestamp());

MongoClient.connect("mongodb://localhost:27017", {useNewUrlParser: true}, (error, client) => {
	if (error)
		return console.log("Enable to connect to MongoDB server");
	console.log("Connected to MongoDB server");

	const db = client.db("TodoApp");
	// db.collection("todos").insertOne({
	// 	text: "Finish NodeJS course",
	// 	completed: false
	// }, (error, result) => {
	// 	if (error)
	// 		return console.log("Enable to insert todo", error);
	// 	console.log(JSON.stringify(result.ops, undefined, 2));		
	// });

	
	// db.collection("users").insertOne({
	// 	name: "Nico",
	// 	age: 41,
	// 	location: "Oléron"
	// }, (error, result) => {
	// 	if (error)
	// 		return console.log("Enable to insert todo", error);
	//  	console.log(JSON.stringify(result.ops, undefined, 2));		
	//  	console.log(result.ops[0]._id.getTimestamp());		


	// });

	 client.close();

});