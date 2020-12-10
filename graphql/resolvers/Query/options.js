export default (root, args, {models, signedIn}) => {
	if(signedIn){
		return models.options.findAll();
	}

	return null;
};