export default (result, args, { models }) =>
	models.options.idLoader.load(result.winner);
