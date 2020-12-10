export default async (optionsResult, args, { models }) =>
	models.options.idLoader.load(optionsResult.candidate);
