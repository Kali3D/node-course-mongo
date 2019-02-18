const {User} = require("../models");

module.exports.authenticate = (request, response, next) => {
	const token = request.header("x-auth");
	User.findByToken(token).then(user => {
		if (!user)
			return Promise.reject();
		request.user = user;
		request.token = token;
		next();
	})
	.catch(error => response.status(401).send());
};

