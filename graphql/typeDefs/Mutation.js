import {gql} from "apollo-server-micro";

export default gql`
	type Mutation {
		addOption(name: String!): Option
		disableOption(name: String!): Option
		rank(options: [Int!]!): [Ranking]
		login(token: String!): String
	}

`;