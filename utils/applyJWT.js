import { verify } from "jsonwebtoken";
import { COOKIE_SECRET } from "../constants";

const { users } = require("./../database/models");

const jwtValidator = async req => {
	let token =
		req.cookies["auth-jwt"] ||
		req.headers["x-access-token"] ||
		req.headers["authorization"]; // Express headers are auto converted to lowercase

	req.signedIn = false;

	if (token) {
		if (token.startsWith("Bearer ")) {
			token = token.replace("Bearer ", "");
		}

		try {
			req.jwt = await verify(token, COOKIE_SECRET);
			if (req.jwt) {
				const user = await users.findOne({
					where: {
						id: req.jwt.user.id,
					},
				});

				if (user) {
					req.user = user;
					req.signedIn = true;req
				}
			}
		} catch (er) {
			req.jwt = null;
		}
	}
};

export default jwtValidator;
