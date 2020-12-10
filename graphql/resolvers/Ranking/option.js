export default (ranking, args, { models }) =>
	models.options.idLoader.load(ranking.optionId);
