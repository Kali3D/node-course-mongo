const {SHA256} = require("crypto-js");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const password = "Atreides_23";

/*bcrypt.genSalt(10, (error, salt) => {
	bcrypt.hash(password, salt, (error, hash) => console.log(hash));
});
*/
const hashed = "$2a$10$cR7PVVFmJRyddXgVZcIAHeqVo.oFFeqtVVJFhXta3Ue.ki/Vrp29m";

bcrypt.compare(password, hashed, (error, result) => console.log(result));

// let message = "I'm user Nico";
// const hash = SHA256(message).toString();

// console.log(message);
// console.log(hash);

// const serverToken = "secretServerToken";

// const data = {
// 	id: 10
// };

// const token = {
// 	data,
// 	hash: SHA256(JSON.stringify(data)+serverToken).toString()
// };

// console.log(token.hash);

// token.data.id = 5

// const resultHash = SHA256(JSON.stringify(token.data)+serverToken).toString();

// if (resultHash === token.hash)
// 	console.log("Valid data");
// else
// 	console.log("Data changed, ACHTUNG");


// const token = jwt.sign(data, serverToken);
// console.log(token);
// const decoded = jwt.verify(token, serverToken);
// console.log(decoded);