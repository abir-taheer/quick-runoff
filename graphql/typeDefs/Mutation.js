import {gql} from "apollo-server-micro";

export default gql`
	type Mutation {
		addOption(name: String!): Option
		disableOption(id: Int!): Option
		rank(options: [Int!]!): [Ranking]
		login(idToken: String!): String
	}

`;