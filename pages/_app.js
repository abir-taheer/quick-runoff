import GraphQLProvider from "../comps/context/GraphQLProvider";
import UserProvider from "../comps/context/UserProvider";

function MyApp({ Component, pageProps }) {
	return (
		<GraphQLProvider>
			<UserProvider>
				<Component {...pageProps} />
			</UserProvider>
		</GraphQLProvider>
	);
}

export default MyApp;
