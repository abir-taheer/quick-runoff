import { ApolloServer } from "apollo-server-micro";
import typeDefs from "../../graphql/typeDefs";
import resolvers from "../../graphql/resolvers";
import applyJWT from "../../utils/applyJWT";
import models from "../../database";

const apolloServer = new ApolloServer({
	typeDefs,
	resolvers,
	context: async ({ req }) => {
		await applyJWT(req);

		return { user: req.user, req, models };
	},
});

export const config = {
	api: {
		bodyParser: false,
	},
};

export default apolloServer.createHandler({
	path: "/api/graphql",
});
