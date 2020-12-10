import {gql} from "apollo-server-micro";

export default gql`
    type OptionRoundResult {
        option: Option
        numVotes: Int
        percentage: Float
        eliminated: Boolean
    }
    type Round {
        number: Int
        numVotes: Int
        results: [OptionRoundResult]
        eliminatedOptions: [Option]
    }
    type Result {
        rounds: [Round]
        winner: Option
        numPeopleVoted: Int
        isTie: Boolean
    }
`;