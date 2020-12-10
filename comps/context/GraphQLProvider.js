import React from "react";
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";
import { createUploadLink } from "apollo-upload-client";
import { setContext } from "@apollo/client/link/context";

export const cache = new InMemoryCache();

const authLink = setContext((_, { headers }) => {
	const token = localStorage.getItem("auth-jwt");
	return {
		headers: {
			...headers,
			authorization: token ? `Bearer ${token}` : "",
		},
	};
});

const uploadLink = createUploadLink({
	uri: "/api/graphql",
});

export const client = new ApolloClient({
	link: authLink.concat(uploadLink),
	cache,
});

export default function GraphQLProvider(props) {
	return <ApolloProvider client={client}>{props.children}</ApolloProvider>;
}
