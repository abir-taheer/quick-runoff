import { ForbiddenError, UserInputError } from "apollo-server-micro";

export default (root, { name }, { signedIn, models }) => {
	if (!signedIn) {
		throw new ForbiddenError("You need to be signed in to add an option");
	}

	if (!name) {
		throw new UserInputError("You need to provide a valid name");
	}

	return models.options.create({
		name,
		active: true,
	});
};
