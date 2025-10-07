import { CreatePollDto, CreatePostDto, PollType } from "./Api";

export function validatePostTitle(post: CreatePostDto): string[] {
    const errors: string[] = [];

    if (!post.polls)
        return errors;

    for (let i = 0; i < post.polls!.length; i++) {
        const pollErrors = validatePoll(post.polls![i]);
        errors.push(...pollErrors.map(e => `Poll ${i + 1}: ${e}`));
    }

    return errors;
}

export function validatePoll(poll: CreatePollDto): string[] {
    const errors: string[] = [];

    switch (poll.pollType) {
        case PollType.SingleChoice:
            errors.push(...validateSingleChoicePoll(poll));
            break;
        case PollType.MultipleChoice:
            errors.push(...validateMultipleChoicePoll(poll));
            break;
        case PollType.Scoring:
            errors.push(...validateScoringPoll(poll));
            break;
        case PollType.Ranking:
            errors.push(...validateRankingPoll(poll));
            break;
        case PollType.Categorization:
            errors.push(...validateCategorizationPoll(poll));
            break;
        default:
            errors.push("No poll type was selected.");
    }

    if (poll.title == undefined || poll.title == null || poll.title!.trim() === "")
        errors.push("A poll must have a title.");

    return errors;
}

export function validateSingleChoicePoll(poll: CreatePollDto): string[] {
    const errors: string[] = [];

    if (!poll.candidates || poll.candidates.length < 2) {
        errors.push("A choice poll must have at least two candidates.");
    }

    return errors;
}

export function validateMultipleChoicePoll(poll: CreatePollDto): string[] {
    return validateSingleChoicePoll(poll);
}

export function validateScoringPoll(poll: CreatePollDto): string[] {
    const errors: string[] = [];

    if (!poll.candidates || poll.candidates.length < 1) {
        errors.push("A scoring poll must have at least one candidate.");
    }

    return errors;
}

export function validateRankingPoll(poll: CreatePollDto): string[] {
    const errors: string[] = [];

    if (!poll.candidates || poll.candidates.length < 2) {
        errors.push("A ranking poll must have at least two candidates.");
    }

    return errors;
}

export function validateCategorizationPoll(poll: CreatePollDto): string[] {
    const errors: string[] = [];

    if (!poll.candidates || poll.candidates.length < 1) {
      errors.push("A categorization poll must have at least one candidate.");
    }

    if (!poll.categories || poll.categories.length < 2) {
       errors.push("A categorization poll must have at least two categories.");
    }

    return errors;
}
