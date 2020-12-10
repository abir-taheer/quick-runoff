import { ForbiddenError, UserInputError } from "apollo-server-micro";

export default async (root, { options }, { user, models }) => {
	if (!user.signedIn) {
		throw new ForbiddenError("You need to be signed in to rank choices");
	}

	const realOptions = await models.options.findAll({
		where: {
			id: options
		}
	});

	if (! realOptions.length) {
		throw new UserInputError("You must rank at least one option");
	}

	const optionMap = {};

	realOptions.forEach(option => {
		optionMap[option.id] = option;
	});

	await models.rankings.destory({
		where: { userId: user.id },
	});

	options = options.filter(id => Boolean(realOptions[id]));

	const rankings = options.map((id, index) => ({
		userId: user.id,
		optionId: id,
		rank: index
	}));

	await models.rankings.bulkCreate(rankings);

	return await models.rankings.findAll({where: {userId: user.id}});
};
