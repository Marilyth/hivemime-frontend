import { ListPollDto, UpsertVoteToPollDto, UpsertVoteToPostDto } from "./Api";

export function validatePickPost(postPolls: ListPollDto[], postVotes: UpsertVoteToPostDto): string[] {
    const errors: string[] = [];

    postPolls.forEach((poll, index) => {
        const vote = postVotes.polls![index];
        errors.push(...validatePickPoll(poll, vote).map(e => `Poll ${index + 1}: ${e}`));
    });

    return errors;
}

export function validatePickPoll(poll: ListPollDto, vote: UpsertVoteToPollDto): string[] {
    const errors: string[] = [];

    const voteValues = vote.candidates!.map(c => c.value);
    const voteCount = voteValues!.filter(c => c != null).length;

    if (poll.minVotes != undefined)
    {
        if (voteCount < poll.minVotes!) {
            errors.push(`You must vote for at least ${poll.minVotes} candidates.`);
        }
    }

    if (poll.maxVotes != undefined && poll.maxVotes > 0)
    {
        if (voteCount > poll.maxVotes!) {
            errors.push(`You must vote for no more than ${poll.maxVotes} candidates.`);
        }
    }

    for (const value of voteValues) {
        if (value != null) {
            if (poll.minValue != undefined && value < poll.minValue!)
                errors.push(`Your candidate's value can not be smaller than ${poll.minValue}.`);
            if (poll.maxValue != undefined && value > poll.maxValue!)
                errors.push(`Your candidate's value can not be larger than ${poll.maxValue}.`);
        }
    }

    return errors;
}