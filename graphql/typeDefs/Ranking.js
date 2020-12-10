import { gql } from "apollo-server-micro";

export default gql`
	type Ranking {
		id: Int!
		user: User
		option: Option
	}
`;
