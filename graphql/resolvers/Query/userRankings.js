export default (root, args, { user, models }) => {
	if (user.signedIn) {
		return models.rankings.findAll({
			where: {
				userId: user.id,
			},
			order: [['rank', 'asc']]
		});
	}

	return null;
};
