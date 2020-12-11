import { gql, useQuery } from "@apollo/client";
import {
	Button,
	List,
	ListItem,
	ListItemSecondaryAction,
	ListItemText,
} from "@material-ui/core";
import { Block } from "@material-ui/icons";
import Link from "next/link";

const QUERY = gql`
	query {
		peopleWhoVoted {
			id
			firstName
			lastName
			email
		}

		results {
			rounds {
				number
				numVotes
				results {
					option {
						id
						name
					}
					numVotes
					percentage
					eliminated
				}
				eliminatedOptions {
					id
					name
				}
			}
			winner {
				id
				name
			}
			numPeopleVoted
			isTie
		}
	}
`;

export default function Results() {
	const { data, loading } = useQuery(QUERY);

	if (!data || loading) {
		return <p>Loading...</p>;
	}

	const results = data.results;

	return (
		<div>
			<Link href={"/"}>
				<Button variant={"outlined"} color={"primary"}>
					&lt;- Back
				</Button>
			</Link>

			<h2
				style={{
					textAlign: "center",
				}}
			>
				Results:
			</h2>
			<div style={{ color: "grey" }}>
				<p>Election Type: Runoff</p>
				<p>Number of Votes: {results?.numPeopleVoted}</p>
				{/*<p>Number of Eligible Voters: {results?.numEligibleVoters}</p>*/}
			</div>
			{results?.rounds?.map(round => {
				return (
					<div>
						<h3>Round {round?.number}:</h3>
						<List>
							{round?.results.map(roundRes => {
								return (
									<ListItem
										style={{ marginBottom: "0.5rem" }}
									>
										<div>
											<span>{roundRes.option?.name}</span>
											<br />

											<span
												style={{
													color: "grey",
													fontSize: 14,
												}}
											>
												{roundRes.numVotes} Votes (
												{roundRes.percentage}%)
											</span>
											<br />
										</div>
										<ListItemSecondaryAction>
											{roundRes.eliminated && (
												<div
													style={{
														textAlign: "center",
													}}
												>
													<Block
														style={{
															color: "grey",
														}}
													/>
													<br />
													<span
														style={{
															color: "grey",
															fontSize: 12,
														}}
													>
														Eliminated
													</span>
												</div>
											)}
										</ListItemSecondaryAction>
									</ListItem>
								);
							})}
						</List>
					</div>
				);
			})}

			<h4>
				Winner:{" "}
				{results?.winner
					? results.winner?.name
					: results?.isTie
					? "Tie"
					: "No Winner"}
			</h4>

			<br />
			<br />
			<p>People who've voted</p>
			<List>
				{data.peopleWhoVoted.map(i => (
					<ListItem key={i.id}>
						<ListItemText
							primary={i.firstName + " " + i.lastName}
							secondary={i.email}
						/>
					</ListItem>
				))}
			</List>
		</div>
	);
}
