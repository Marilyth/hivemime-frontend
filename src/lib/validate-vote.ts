import { PollDto, PollType } from "./Api";
import i18n from "./i18n";
import { UiPollVoteDto, UiPostVoteDto } from "./vote-models";

export function validatePickPost(postPolls: PollDto[], postVotes: UiPostVoteDto): string[] {
    const errors: string[] = [];

    postPolls.forEach((poll, index) => {
        const vote = postVotes.polls![index];
        errors.push(...validatePickPoll(poll, vote).map(e => i18n.t("validation:pollPrefix", { index: index + 1, message: e })));
        errors.push(...validateCandidateVoteCount(poll, vote).map(e => i18n.t("validation:pollPrefix", { index: index + 1, message: e })));
    });

    return errors;
}

function countCandidateVotes(poll: PollDto, vote: UiPollVoteDto): { [key: string]: number } {
    const candidatesVoteCounts: { [key: string]: number } = {};

    for (const candidate of vote.candidates ?? []) {
        const candidateKey = candidate.id ?? candidate.name!;

        if (candidatesVoteCounts[candidateKey] == null)
            candidatesVoteCounts[candidateKey] = 0;

        switch (poll.pollType) {
            case PollType.Choice:
                if (candidate.selected)
                    candidatesVoteCounts[candidateKey]++;
                break;
            case PollType.Score:
                if (candidate.score != null)
                    candidatesVoteCounts[candidateKey]++;
                break;
            case PollType.Rank:
                if (candidate.rank != null)
                    candidatesVoteCounts[candidateKey]++;
                break;
            case PollType.Category:
                if (candidate.categoryId != null)
                    candidatesVoteCounts[candidateKey]++;
                break;
            case PollType.Draw:
                if (candidate.cellSelection != null && candidate.cellSelection.cells.length > 0)
                    candidatesVoteCounts[candidateKey] += candidate.cellSelection.cells.filter(c => c.value > 0).length;
                break;
        }
    }

    return candidatesVoteCounts;
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
        case PollType.Draw:
            return candidates.filter(c => c.cellSelection != null && c.cellSelection.cells.length > 0).length;
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

export function validateCandidateVoteCount(poll: PollDto, vote: UiPollVoteDto): string[] {
    const errors: string[] = [];
    const candidateVoteCounts = countCandidateVotes(poll, vote);

    for (const candidate of vote.candidates ?? []) {
        const candidateKey = candidate.id ?? candidate.name!;
        const candidateVoteCount = candidateVoteCounts[candidateKey] ?? 0;

        if (candidateVoteCount > poll.maxVotesPerCandidate!)
            errors.push(i18n.t("validation:vote.maxCandidateVotes", { candidateName: candidate.name, maxVotesPerCandidate: poll.maxVotesPerCandidate }));

        if (candidateVoteCount < poll.minVotesPerCandidate! && candidateVoteCount > 0)
            errors.push(i18n.t("validation:vote.minCandidateVotes", { candidateName: candidate.name, minVotesPerCandidate: poll.minVotesPerCandidate }));
    }

    return errors;
}