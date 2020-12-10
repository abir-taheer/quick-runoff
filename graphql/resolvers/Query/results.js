const results = async (root, args, { models }) => {
	const rankings = await models.rankings.findAll();
	const options = await models.options.findAll();

	const optionMap = {};

	options.forEach(option => {
		optionMap[option.id] = option;
	});

	const organized = {};

	rankings.forEach(ranking => {
		if (!organized[ranking.userId]) {
			organized[ranking.userId] = [];
		}

		organized[ranking.userId][ranking.rank] = ranking.optionId;
	});

	const votes = Object.keys(organized).map(userId => ({
		choices: organized[userId],
	}));

	const rounds = [];
	let winner = null;
	let isTie = false;
	let numPeopleVoted = votes.length;

	const eliminated = [];

	if (votes.length > 0) {
		let complete = false;
		let number = 0;
		while (!complete) {
			number++;
			let numVotesThisRound = 0;

			let voteCountsThisRound = {};

			if (number === 1) {
				options.forEach(candidate => {
					voteCountsThisRound[candidate.id] = 0;
				});
			}

			const eliminatedThisRound = [];

			votes.forEach(vote => {
				const activeVote = vote.choices.find(
					choice => !eliminated.includes(choice)
				);

				if (activeVote) {
					numVotesThisRound++;
					// init counter if not already done this round
					if (!voteCountsThisRound[activeVote]) {
						voteCountsThisRound[activeVote] = 0;
					}

					voteCountsThisRound[activeVote]++;
				}
			});

			const candidateIdsThisRound = Object.keys(voteCountsThisRound);

			let minVotes = voteCountsThisRound[candidateIdsThisRound[0]];

			candidateIdsThisRound.forEach(candidateId => {
				const currentCandidateNumVotes =
					voteCountsThisRound[candidateId];

				if (currentCandidateNumVotes < minVotes) {
					minVotes = currentCandidateNumVotes;
				}
			});

			const results = candidateIdsThisRound.map(id => {
				const candidateNumVotesThisRound = voteCountsThisRound[id];
				const isEliminated = candidateNumVotesThisRound === minVotes;
				const percentage =
					Math.round(
						(candidateNumVotesThisRound * 10000) / numVotesThisRound
					) / 100;

				if (isEliminated) {
					eliminated.push(id);
					eliminatedThisRound.push(id);
				}

				if (percentage >= 50) {
					if (winner) {
						// This means a tie
						winner = null;
						complete = false;
						isTie = true;
					} else {
						winner = Number(id);
						complete = true;
						isTie = false;
					}
				}

				return {
					candidate: Number(id),
					eliminated: isEliminated,
					percentage,
					numVotes: candidateNumVotesThisRound,
				};
			});

			if (numVotesThisRound) {
				results.sort((a, b) => b.numVotes - a.numVotes);

				rounds.push({
					number,
					numVotes: numVotesThisRound,
					results,
					eliminatedCandidates: eliminatedThisRound,
				});
			} else {
				complete = true;
			}
		}
	}

	return {
		rounds,
		winner,
		numPeopleVoted,
		isTie,
	};
};

export default results;
