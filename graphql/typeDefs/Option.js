import {gql} from "apollo-server-micro";

export default gql`
	type Option {
		id: Int!
		name: String
		active: Boolean
		addedBy: User
	}
`;