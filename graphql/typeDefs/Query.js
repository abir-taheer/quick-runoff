import { gql } from "apollo-server-micro";

export default gql`
	type Query {
		options: [Option]
		userRankings: [Ranking]
		results: Result
		authenticatedUser: User
		users: [User]
		peopleWhoVoted: [User]
	}
`;
