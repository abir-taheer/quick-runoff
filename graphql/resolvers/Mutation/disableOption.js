import { ForbiddenError, UserInputError } from "apollo-server-micro";

export default async (root, { id }, { user, models, signedIn }) => {
	if (!signedIn) {
		throw new ForbiddenError("You must be signed in to remove an option");
	}

	const option = await models.options.findOne({ where: { id } });

	if (!option) {
		throw new UserInputError("That option does not exist");
	}

	const isAdmin =
		process.env.ADMINS && process.env.ADMINS.includes(user.email);
	const isCreator = option.addedBy === user.id;

	if (!isAdmin && !isCreator) {
		throw new ForbiddenError("You are not allowed to disable this option");
	}

	option.active = false;
	await option.save();

	return option;
};
