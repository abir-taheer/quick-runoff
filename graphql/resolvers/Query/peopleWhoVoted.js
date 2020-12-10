export default async (root, args, {signedIn, models}) => {

	const rankings = await models.rankings.findAll();

	const userIds = Array.from(new Set(rankings.map(rank => rank.userId)));

	return await models.users.findAll({
		where: {
			id: userIds
		}
	});
};