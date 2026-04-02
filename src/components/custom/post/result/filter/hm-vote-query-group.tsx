import { VoteQueryGroup, VoteQuery } from "@/lib/query-builder";
import { observer } from "mobx-react-lite";
import { HiveMimeVoteQuery } from "./hm-vote-query";


interface HiveMimeVoteQueryGroupProps {
    builder: VoteQueryGroup;
}

export const HiveMimeVoteQueryGroup = observer(({ builder }: HiveMimeVoteQueryGroupProps) => {
    return (
        <div className="flex flex-col gap-2 border-l pl-2">
            {builder.children.map((item, index) => item instanceof VoteQueryGroup ?
                <HiveMimeVoteQueryGroup key={index} builder={item as VoteQueryGroup} /> :
                <HiveMimeVoteQuery key={index} currentItem={item as VoteQuery} />
            )}
        </div>
    );
});
