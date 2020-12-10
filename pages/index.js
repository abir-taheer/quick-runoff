import Head from "next/head";
import UserContext from "../comps/context/UserContext";
import { createRef, useContext, useEffect, useState } from "react";
import useAuth from "../comps/hooks/useAuth";
import styles from "../styles/Home.module.css";
import {
	Button,
	IconButton,
	List,
	ListItem,
	ListItemSecondaryAction,
	ListItemText,
} from "@material-ui/core";
import { gql, useMutation, useQuery } from "@apollo/client";
import { ArrowDownward, ArrowUpward, Close, Refresh } from "@material-ui/icons";
import Link from "next/link";

const SignInPage = () => {
	const { signIn, loading } = useAuth();

	return (
		<div className={styles.flexContent}>
			<div className={styles.contentContainer}>
				<h1>Sign In To Vote</h1>
				<Button
					onClick={signIn}
					disabled={loading}
					variant={"contained"}
					color={"primary"}
				>
					Sign In
				</Button>
			</div>
		</div>
	);
};

const RANK_MUTATION = gql`
	mutation($ids: [Int!]!) {
		rank(options: $ids) {
			id
			option {
				id
				name
			}
		}
	}
`;

const Vote = ({ options, setIsEditing }) => {
	const user = useContext(UserContext);
	const optionMap = {};
	options.forEach(option => {
		optionMap[option.id] = option;
	});

	const listRef = createRef();
	const [selectedOptions, setSelectedOptions] = useState(
		options.filter(a => a.active).map(a => a.id)
	);
	const [eliminatedOptions, setEliminatedOptions] = useState([]);

	const [vote, { loading }] = useMutation(RANK_MUTATION, {
		variables: { ids: selectedOptions },
		update: cache => cache.reset().then(a => user.refetch() & setIsEditing(false)),
	});

	const removeItem = index => {
		const newOpts = [...selectedOptions];
		setEliminatedOptions(
			eliminatedOptions.concat(newOpts.splice(index, 1))
		);

		setSelectedOptions(newOpts);
	};

	const restoreItem = index => {
		const newEliminated = [...eliminatedOptions];

		setSelectedOptions(
			selectedOptions.concat(newEliminated.splice(index, 1))
		);

		setEliminatedOptions(newEliminated);
	};

	const moveDown = index => {
		const opts = [...selectedOptions];
		const temp = opts[index + 1];

		opts[index + 1] = opts[index];
		opts[index] = temp;
		setSelectedOptions(opts);
	};

	const moveUp = index => {
		const opts = [...selectedOptions];
		const temp = opts[index - 1];

		opts[index - 1] = opts[index];
		opts[index] = temp;
		setSelectedOptions(opts);
	};

	return (
		<div>
			<h2>Vote</h2>
			<List ref={listRef}>
				{selectedOptions.map((optionId, i) => {
					const option = optionMap[optionId];

					if (!option.active) {
						return null;
					}

					return (
						<ListItem
							key={optionId}
							data-option={optionId}
							selected={false}
							style={{ border: "1px solid rgba(0, 0, 0, 0.8)" }}
						>
							<ListItemText>{option.name}</ListItemText>
							<ListItemSecondaryAction>
								{i < selectedOptions.length - 1 && (
									<IconButton
										color={"primary"}
										onClick={() => moveDown(i)}
									>
										<ArrowDownward />
									</IconButton>
								)}
								{i > 0 && (
									<IconButton
										color={"primary"}
										onClick={() => moveUp(i)}
									>
										<ArrowUpward />
									</IconButton>
								)}

								{selectedOptions.length > 1 && (
									<IconButton
										color={"primary"}
										onClick={() => removeItem(i)}
									>
										<Close />
									</IconButton>
								)}
							</ListItemSecondaryAction>
						</ListItem>
					);
				})}
			</List>

			<p>Removed Options:</p>
			<List>
				{eliminatedOptions.map((optionId, i) => {
					const option = optionMap[optionId];

					return (
						<ListItem
							key={optionId}
							data-option={optionId}
							disabled
							selected={false}
							style={{ border: "1px solid rgba(0, 0, 0, 0.3)" }}
						>
							<ListItemText>{option.name}</ListItemText>
							<ListItemSecondaryAction>
								<IconButton
									color={"primary"}
									onClick={() => restoreItem(i)}
								>
									<Refresh />
								</IconButton>
							</ListItemSecondaryAction>
						</ListItem>
					);
				})}
			</List>

			<br />
			<br />
			<Button
				variant={"contained"}
				onClick={vote}
				color={"primary"}
				disabled={loading}
			>
				Submit
			</Button>
		</div>
	);
};

const QUERY = gql`
	query {
		userRankings {
			id
			option {
				id
				name
				active
			}
		}
		options {
			id
			name
			active
		}
	}
`;

const Rank = () => {
	const { data, loading } = useQuery(QUERY);
	const [isEditing, setIsEditing] = useState(false);

	if (loading) {
		return <p>loading...</p>;
	}

	const hasVoted = Boolean(data.userRankings.length);

	if (hasVoted && !isEditing) {
		return (
			<div>
				<h1>You have voted! Your rankings are below:</h1>
				<List>
					{data.userRankings.map(ranking => (
						<ListItem key={ranking.id}>
							<ListItemText primary={ranking.option.name} />
						</ListItem>
					))}
				</List>
				<Button variant={"outlined"} onClick={() => setIsEditing(true)}>Edit</Button>

				<br/>
				<Link href={"/results"}>
					<Button variant={"outlined"} color={"primary"}>
						Results
					</Button>
				</Link>
			</div>
		);
	}

	return <Vote options={data.options} setIsEditing={setIsEditing} />;
};

export default function Home() {
	const user = useContext(UserContext);

	return (
		<div>
			<Head>
				<title>Sci Fi Vote</title>
				<script
					src="https://cdnjs.cloudflare.com/ajax/libs/slipjs/2.1.1/slip.min.js"
					integrity="sha512-lVZ4wG9nTdat0RaQRYtzHFZ6Akwrw1LskH05mpkT2EV402m0YAd70bqmo6pqfyK2P/TAKBun7cjp8zUdSgxSuA=="
					crossOrigin="anonymous"
				/>
			</Head>

			<main>{user.signedIn ? <Rank /> : <SignInPage />}</main>
		</div>
	);
}
