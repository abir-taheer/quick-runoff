import { useContext, useEffect, useState } from "react";
import UserContext from "../comps/context/UserContext";
import { useRouter } from "next/router";
import { gql, useMutation, useQuery } from "@apollo/client";
import {
	Button,
	IconButton,
	List,
	ListItem,
	ListItemSecondaryAction,
	ListItemText,
	TextField,
} from "@material-ui/core";
import { Close, Refresh } from "@material-ui/icons";
import Link from "next/link";

const QUERY = gql`
	query {
		options {
			id
			name
			active
		}
	}
`;

const REMOVE_OPTION = gql`
	mutation($id: Int!) {
		disableOption(id: $id) {
			id
			active
		}
	}
`;

const CREATE_OPTION = gql`
	mutation($name: String!) {
		addOption(name: $name) {
			id
			name
			active
		}
	}
`;

export default function Admin() {
	const user = useContext(UserContext);
	const router = useRouter();
	const { data, refetch, loading } = useQuery(QUERY);

	const [name, setName] = useState("");

	const [submit, { loading: loadingSubmit }] = useMutation(CREATE_OPTION, {
		variables: {
			name,
		},
		update: cache => cache.reset().then(() => refetch() & setName("")),
	});

	const [del, { loading: loadingDelete }] = useMutation(REMOVE_OPTION, {
		update: cache => cache.reset().then(() => refetch()),
	});

	useEffect(() => {
		if (!user.signedIn) {
			router.push("/");
		}
	});

	if (!user.signedIn) {
		return null;
	}

	if (loading) {
		return <p>Loading...</p>;
	}

	return (
		<div style={{ textAlign: "center" }}>
			<h1>Admin Panel</h1>
			<p>Add options:</p>
			<TextField
				value={name}
				onChange={ev => setName(ev.target.value)}
				variant={"outlined"}
			/>
			<br />
			<Button variant={"contained"} color={"primary"} onClick={submit} disabled={loadingSubmit}>
				Submit
			</Button>

			<br />
			<h2>Existing Options:</h2>
			<List>
				{data.options.filter(a => Boolean(a.active)).map(option => (
					<ListItem
						key={option.id}
						selected={false}
						style={{ border: "1px solid rgba(0, 0, 0, 0.3)" }}
					>
						<ListItemText>{option.name}</ListItemText>
						<ListItemSecondaryAction>
							<IconButton
								color={"primary"}
								disabled={loadingDelete}
								onClick={() =>
									window.confirm(
										"Are you sure you want to delete this option? "
									) && del({ variables: { id: option.id } })
								}
							>
								<Close />
							</IconButton>
						</ListItemSecondaryAction>
					</ListItem>
				))}
			</List>
			<br/>
			<Link href={"/results"}>
				<Button variant={"outlined"} color={"primary"}>
					Results
				</Button>
			</Link>
			<br/>
			<Link href={"/"}>
				<Button variant={"outlined"} color={"primary"}>
					Home
				</Button>
			</Link>
		</div>
	);
}
