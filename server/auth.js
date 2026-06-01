const jwt = require("jsonwebtoken");

require('dotenv').config();

module.exports.createAccessToken = (user) => {


	const data = {

		id: user._id,
		email: user.email,
		isAdmin: user.isAdmin

	};
							//sample expiry time {expiresIn: '1h', '10m', '7d'}
	return jwt.sign(data, process.env.JWT_SECRET_KEY, {});

}

module.exports.verify = (req, res, next) => {

	console.log(req.headers.authorization);

	let token = req.headers.authorization;

	if(typeof token === "undefined") {
		return res.send({ auth: "Failed. No Token"});
	} else {
		//Bearer asdgasd123.ajsdgasd12.asdasdasd
		token = token.slice(7, token.length);
		//asdgasd123.ajsdgasd12.asdasdasd


		jwt.verify(token, process.env.JWT_SECRET_KEY, function(err, decodedToken) {

			if (err) {
				return res.status(403).send({
					auth: "Failed",
					message: err.message
				});

			} else {
				req.user = decodedToken;

				next();
			}
		})
	}
}

module.exports.verifyAdmin = (req, res, next) => {

	console.log("result from verifyAdmin: " + req.user);

	if(req.user.isAdmin) {

		next();
	} else {
		return res.status(403).send({
			auth: "Failed",
			message: "Action Forbidden"
		})
	}
}