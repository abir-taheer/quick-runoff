export default (root, args, { signedIn, user, models }) => {
	if (signedIn) {
		return models.rankings.findAll({
			where: {
				userId: user.id,
			},
			order: [['rank', 'asc']]
		});
	}

	return null;
};
