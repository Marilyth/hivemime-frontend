import { mutedColors } from "@/lib/colors";

export function hiveMimeRankIcon(rank: number) {
    switch (rank) {
        case 1: return "🥇";
        case 2: return "🥈";
        case 3: return "🥉";
        default: return rank.toString();
    }
};

export function hiveMimeRankIconColor(rank: number) {
    switch (rank) {
        case 1: return "#FFD700";
        case 2: return "#C0C0C0";
        case 3: return "#CD7F32";
        default: return mutedColors.honeyBrown;
    }
};