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
            errors.push("No poll type was selected.");
    }

    if (!poll.candidates || poll.candidates.length < 1)
        errors.push("A poll must have at least one candidate.");

    if (poll.title == undefined || poll.title == null || poll.title!.trim() === "")
        errors.push("A poll must have a title.");

    if (poll.minVotes! < 1)
        errors.push("A poll must allow at least 1 vote.");

    if (poll.maxVotes! < poll.minVotes! && poll.maxVotes! != -1)
        errors.push("Max votes must be greater than min votes.");

    return errors;
}

function validateChoicePoll(poll: CreatePollDto): string[] {
    const errors: string[] = [];

    if (!poll.candidates || poll.candidates.length < 2) {
        errors.push("A choice poll must have at least two candidates.");
    }

    return errors;
}

function validateScoringPoll(poll: CreatePollDto): string[] {
    const errors: string[] = [];

    if (poll.stepValue == undefined || poll.stepValue <= 0) {
        errors.push("A scoring poll must have a step value higher than 0.");
    }

    return errors;
}

function validateRankingPoll(poll: CreatePollDto): string[] {
    const errors: string[] = [];

    return errors;
}

function validateCategorizationPoll(poll: CreatePollDto): string[] {
    const errors: string[] = [];

    if (!poll.categories || poll.categories.length < 2) {
       errors.push("A categorization poll must have at least two categories.");
    }

    return errors;
}
