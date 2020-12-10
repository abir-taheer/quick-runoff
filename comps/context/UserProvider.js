import { gql, useQuery } from '@apollo/client';

import UserContext from './UserContext';

const USER_QUERY = gql`
    query {
        authenticatedUser {
            id
            email
			firstName
			lastName
			profilePic
        }
    }
`;

const UserProvider = ({ children }) => {
	const { data, error, loading, refetch } = useQuery(USER_QUERY);

	if (loading) {
		return null;
	}

	const value = { refetch };

	if (data?.authenticatedUser) {
		value.signedIn = true;
		Object.assign(value, data.authenticatedUser);
	} else {
		value.signedIn = false;
	}

	return <UserContext.Provider value={value} children={children} />;
};

export default UserProvider;