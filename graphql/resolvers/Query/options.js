export default (root, args, {models, user}) => {
	if(user.signedIn){
		return models.options.findAll();
	}

	return null;
};