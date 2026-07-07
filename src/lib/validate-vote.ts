import { PollDto, PollType } from "./Api";
import i18n from "./i18n";
import { UiPollVoteDto, UiPostVoteDto } from "./vote-models";

export function validatePickPost(postPolls: PollDto[], postVotes: UiPostVoteDto): string[] {
    const errors: string[] = [];

    postPolls.forEach((poll, index) => {
        const vote = postVotes.polls![index];
        errors.push(...validatePickPoll(poll, vote).map(e => i18n.t("validation:pollPrefix", { index: index + 1, message: e })));
    });

    return errors;
}

function countVotes(poll: PollDto, vote: UiPollVoteDto): number {
    const candidates = vote.candidates ?? [];

    switch (poll.pollType) {
        case PollType.Choice:
            return candidates.filter(c => c.selected).length;
        case PollType.Score:
            return candidates.filter(c => c.score != null).length;
        case PollType.Rank:
            return candidates.filter(c => c.rank != null).length;
        case PollType.Category:
            return candidates.filter(c => c.categoryId != null).length;
        case PollType.Locate:
            return candidates.reduce((count, c) => count + (c.rectangles?.rectangles.length ?? 0), 0);
        default:
            return 0;
    }
}

export function validatePickPoll(poll: PollDto, vote: UiPollVoteDto): string[] {
    const errors: string[] = [];
    const voteCount = countVotes(poll, vote);

    if (voteCount < poll.minVotes!)
        errors.push(i18n.t("validation:vote.minCandidates", { minVotes: poll.minVotes }));

    if (voteCount > poll.maxVotes!)
        errors.push(i18n.t("validation:vote.maxCandidates", { maxVotes: poll.maxVotes }));

    return errors;
}
