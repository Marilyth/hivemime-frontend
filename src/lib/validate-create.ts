import { CreatePollDto, CreatePostDto, PollType } from "./Api";
import i18n from "./i18n";

export function validatePostTitle(post: CreatePostDto): string[] {
    const errors: string[] = [];

    if (!post.polls)
        return errors;

    for (let i = 0; i < post.polls!.length; i++) {
        const pollErrors = validateCreatePoll(post.polls![i]);
        errors.push(...pollErrors.map(e => i18n.t("validation:pollPrefix", { index: i + 1, message: e })));
    }

    return errors;
}

export function validateCreatePoll(poll: CreatePollDto): string[] {
    const errors: string[] = [];

    switch (poll.pollType) {
        case PollType.Choice:
            errors.push(...validateChoicePoll(poll));
            break;
        case PollType.Score:
            errors.push(...validateScoringPoll(poll));
            break;
        case PollType.Rank:
            errors.push(...validateRankingPoll(poll));
            break;
        case PollType.Category:
            errors.push(...validateCategorizationPoll(poll));
            break;
        default:
            errors.push(i18n.t("validation:poll.noType"));
    }

    if (!poll.candidates || poll.candidates.length < 1)
        errors.push(i18n.t("validation:poll.noCandidates"));

    if (poll.title == undefined || poll.title == null || poll.title!.trim() === "")
        errors.push(i18n.t("validation:poll.noTitle"));

    if (poll.minVotes! < 1)
        errors.push(i18n.t("validation:poll.minVotes"));

    if (poll.maxVotes! < poll.minVotes! && poll.maxVotes! != -1)
        errors.push(i18n.t("validation:poll.maxVotesLessThanMin"));

    return errors;
}

function validateChoicePoll(poll: CreatePollDto): string[] {
    const errors: string[] = [];

    if (!poll.candidates || poll.candidates.length < 2) {
        errors.push(i18n.t("validation:poll.choiceMinCandidates"));
    }

    return errors;
}

function validateScoringPoll(poll: CreatePollDto): string[] {
    const errors: string[] = [];

    if (poll.stepValue == undefined || poll.stepValue <= 0) {
        errors.push(i18n.t("validation:poll.scoreStepValue"));
    }

    return errors;
}

function validateRankingPoll(_poll: CreatePollDto): string[] {
    const errors: string[] = [];

    return errors;
}

function validateCategorizationPoll(poll: CreatePollDto): string[] {
    const errors: string[] = [];

    if (!poll.categories || poll.categories.length < 2) {
       errors.push(i18n.t("validation:poll.categoryMinCategories"));
    }

    return errors;
}
