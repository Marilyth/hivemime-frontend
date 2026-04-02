export function hiveMimeRankIcon(rank: number) {
    switch (rank) {
        case 1: return "🥇";
        case 2: return "🥈";
        case 3: return "🥉";
        default: return rank.toString();
    }
};