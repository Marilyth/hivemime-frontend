import { CreatePollDto, CreatePostDto, ListPollDto, PollType, UpsertVoteToPollDto } from "./Api";

export function validatePostTitle(post: CreatePostDto): string[] {
    const errors: string[] = [];

    if (!post.polls)
        return errors;

    for (let i = 0; i < post.polls!.length; i++) {
        const pollErrors = validateCreatePoll(post.polls![i]);
        errors.push(...pollErrors.map(e => `Poll ${i + 1}: ${e}`));
    }

    return errors;
}

export function validateCreatePoll(poll: CreatePollDto): string[] {
    const errors: string[] = [];

    switch (poll.pollType) {
        case PollType.SingleChoice:
            errors.push(...validateCreateSingleChoicePoll(poll));
            break;
        case PollType.MultipleChoice:
            errors.push(...validateCreateMultipleChoicePoll(poll));
            break;
        case PollType.Scoring:
            errors.push(...validateScoringPoll(poll));
            break;
        case PollType.Ranking:
            errors.push(...validateCreateRankingPoll(poll));
            break;
        case PollType.Categorization:
            errors.push(...validateCreateCategorizationPoll(poll));
            break;
        default:
            errors.push("No poll type was selected.");
    }

    if (poll.title == undefined || poll.title == null || poll.title!.trim() === "")
        errors.push("A poll must have a title.");

    return errors;
}

export function validateCreateSingleChoicePoll(poll: CreatePollDto): string[] {
    const errors: string[] = [];

    if (!poll.candidates || poll.candidates.length < 2) {
        errors.push("A choice poll must have at least two candidates.");
    }

    return errors;
}

export function validateCreateMultipleChoicePoll(poll: CreatePollDto): string[] {
    return validateCreateSingleChoicePoll(poll);
}

export function validateScoringPoll(poll: CreatePollDto): string[] {
    const errors: string[] = [];

    if (!poll.candidates || poll.candidates.length < 1) {
        errors.push("A scoring poll must have at least one candidate.");
    }

    return errors;
}

export function validateCreateRankingPoll(poll: CreatePollDto): string[] {
    const errors: string[] = [];

    if (!poll.candidates || poll.candidates.length < 2) {
        errors.push("A ranking poll must have at least two candidates.");
    }

    return errors;
}

export function validateCreateCategorizationPoll(poll: CreatePollDto): string[] {
    const errors: string[] = [];

    if (!poll.candidates || poll.candidates.length < 1) {
      errors.push("A categorization poll must have at least one candidate.");
    }

    if (!poll.categories || poll.categories.length < 2) {
       errors.push("A categorization poll must have at least two categories.");
    }

    return errors;
}
