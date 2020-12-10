import GraphQLProvider from "../comps/context/GraphQLProvider";
import UserProvider from "../comps/context/UserProvider";
import { StylesProvider } from "@material-ui/core/styles";

import "./../styles/Global.css";
import ThemeProvider from "../comps/context/ThemeProvider";

function MyApp({ Component, pageProps }) {
	return (
		<StylesProvider injectFirst>
			<ThemeProvider>
				<GraphQLProvider>
					<UserProvider>
						<Component {...pageProps} />
					</UserProvider>
				</GraphQLProvider>
			</ThemeProvider>
		</StylesProvider>
	);
}

export default MyApp;
