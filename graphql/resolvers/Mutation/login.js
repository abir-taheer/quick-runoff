import { ForbiddenError } from "apollo-server-micro";
import { COOKIE_SECRET, GOOGLE_CLIENT_ID } from "../../../constants";
import { sign } from "jsonwebtoken";

import { OAuth2Client } from "google-auth-library";


const client = new OAuth2Client(GOOGLE_CLIENT_ID);


export default async (root, { idToken }, { user, models }) => {
	if (user) {
		throw new ForbiddenError("You are already signed in.");
	}

	let payload;

	try {
		const ticket = await client.verifyIdToken({
			idToken,
			audience: GOOGLE_CLIENT_ID,
		});

		payload = ticket.getPayload();
	} catch (e) {
		throw new ForbiddenError("The provided login token was invalid.");
	}

	if (!payload.email_verified) {
		throw new ForbiddenError(
			"That email is not verified and cannot be used for sign in."
		);
	}

	if (payload.azp !== GOOGLE_CLIENT_ID || payload.aud !== GOOGLE_CLIENT_ID) {
		throw new ForbiddenError(
			"That login token was not generated for this app and cannot be used."
		);
	}

	const email = payload.email;
	const existingUser = await models.users.findOne({ email });

	if (!existingUser) {
		throw new ForbiddenError(
			"Your email address is not in the database. Contact stuyboe@gmail.com if you think this is a mistake."
		);
	}

	existingUser.firstName = payload.given_name;
	existingUser.lastName = payload.family_name;
	existingUser.profilePic = payload.profilePic;
	existingUser.googleId = payload.sub;

	await existingUser.save();

	return sign(
		{
			user: {
				id: user.id,
				sub: payload.sub,
			},
			audience: "sci-fi-staley.vercel.app",
			issuer: "sci-fi-staley.vercel.app",
		},
		COOKIE_SECRET,
		{ expiresIn: "14d" }
	);
};
