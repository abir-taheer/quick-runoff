import Head from "next/head";
import UserContext from "../comps/context/UserContext";
import { useContext } from "react";

export default function Home() {
	const user = useContext(UserContext);

	return (
		<div>
			<Head>
				<title>Sci Fi Vote</title>
			</Head>

			<main>
				{user.signedIn ? "You're signed in" : "You're not signed in"}
			</main>
		</div>
	);
}
