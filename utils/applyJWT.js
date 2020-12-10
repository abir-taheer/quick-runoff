import { verify } from "jsonwebtoken";
import { COOKIE_SECRET } from "../constants";

const { users } = require("./../database/models");

const jwtValidator = async req => {
	let token =
		req.cookies["auth-jwt"] ||
		req.headers["x-access-token"] ||
		req.headers["authorization"]; // Express headers are auto converted to lowercase

	if (token) {
		if (token.startsWith("Bearer ")) {
			token = token.replace("Bearer ", "");
		}

		try {
			req.jwt = await verify(token, COOKIE_SECRET);
			if (req.jwt) {
				const user = await users.findOne({
					where: {
						userId: req.jwt.userId,
					},
				});

				if (user) {
					req.user = {
						...user,
						signedIn: true,
					};
				}
			}
		} catch (er) {
			req.jwt = null;
			req.user = { signedIn: false };
		}
	}
};

export default jwtValidator;
