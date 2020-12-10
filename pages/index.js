import Head from "next/head";
import UserContext from "../comps/context/UserContext";
import { useContext } from "react";
import useAuth from "../comps/hooks/useAuth";

export default function Home() {
	const user = useContext(UserContext);

	const {signIn, loading} = useAuth();

	return (
		<div>
			<Head>
				<title>Sci Fi Vote</title>
			</Head>

			<main>
				{user.signedIn ? "You're signed in" : "You're not signed in"}
				<button onClick={signIn} disabled={loading}>Sign In</button>
			</main>
		</div>
	);
}
