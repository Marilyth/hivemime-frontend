import { PollDto, PollType, PollVoteDto, PostVoteDto } from "./Api";
import i18n from "./i18n";

export function validatePickPost(postPolls: PollDto[], postVotes: PostVoteDto): string[] {
    const errors: string[] = [];

    postPolls.forEach((poll, index) => {
        const vote = postVotes.polls![index];
        errors.push(...validatePickPoll(poll, vote).map(e => i18n.t("validation:pollPrefix", { index: index + 1, message: e })));
    });

    return errors;
}

export function validatePickPoll(poll: PollDto, vote: PollVoteDto): string[] {
    const errors: string[] = [];

    const voteValues = vote.candidates!.map(c => c.value);
    const voteCount = voteValues!.filter(c => c != null && (poll.pollType != PollType.Choice || c != 0)).length;

    if (voteCount < poll.minVotes!)
        errors.push(i18n.t("validation:vote.minCandidates", { minVotes: poll.minVotes }));

    if (voteCount > poll.maxVotes!)
        errors.push(i18n.t("validation:vote.maxCandidates", { maxVotes: poll.maxVotes }));

    return errors;
}
