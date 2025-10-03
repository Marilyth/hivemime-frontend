import { CreatePollDto, CreatePostDto, PollType } from "./Api";

export function validatePostTitle(post: CreatePostDto): string[] {
    const errors: string[] = [];

    // A post must have a title.
    if (post.title == undefined || post.title.trim() === "")
      errors.push("A post must have a title.");

    if (!post.polls)
        return errors;

    for (let i = 0; i < post.polls!.length; i++) {
        const pollErrors = validatePoll(post.polls![i]);
        errors.push(...pollErrors.map(e => `Poll ${i + 1}: ${e}`));
    }

    return errors;
}

export function validatePoll(poll: CreatePollDto): string[] {
    switch (poll.pollType) {
        case PollType.SingleChoice:
            return validateSingleChoicePoll(poll);
        case PollType.MultipleChoice:
            return validateMultipleChoicePoll(poll);
        case PollType.Scoring:
            return validateScoringPoll(poll);
        case PollType.Ranking:
            return validateRankingPoll(poll);
        case PollType.Categorization:
            return validateCategorizationPoll(poll);
        default:
            return ["No poll type was selected."];
    }
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
