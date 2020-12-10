export default (round, args, { models }) =>
	models.options.findAll({ where: { id: round.eliminatedCandidates } });
c