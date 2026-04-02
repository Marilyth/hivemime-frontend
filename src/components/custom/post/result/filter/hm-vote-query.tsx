import { observer } from "mobx-react-lite";
import { VoteQuery } from "@/lib/query-builder";


interface HiveMimeVoteQueryProps {
    currentItem: VoteQuery;
}

export const HiveMimeVoteQuery = observer(({ currentItem }: HiveMimeVoteQueryProps) => {
    return (
        <div className="flex flex-row gap-2">
            {currentItem.toString()}
        </div>
    );
});
