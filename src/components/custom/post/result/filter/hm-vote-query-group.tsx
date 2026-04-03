import { VoteQueryGroup, VoteQuery, BooleanOperator } from "@/lib/query-builder";
import { observer } from "mobx-react-lite";
import { HiveMimeVoteQuery } from "./hm-vote-query";
import { Select, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { HiveMimeInlineSelectTrigger } from "@/components/custom/utility/hm-inline-select";


type HiveMimeVoteQueryGroupProps = {
    group: VoteQueryGroup;
    isFirstItem: boolean;
    isRoot: boolean;
};

export const HiveMimeVoteQueryGroup = observer(({ group: builder, isFirstItem, isRoot }: HiveMimeVoteQueryGroupProps) => {

    function setLeftOperator(value: BooleanOperator) {
        builder.leftOperator = value;
    }

    function removeItem(item: VoteQuery) {
        builder.children = builder.children.filter(i => i !== item);
    }
    
    return (
        <div className="flex flex-col text-sm text-muted-foreground gap-2">
            {!isFirstItem && (
                <Select
                    value={builder.leftOperator}
                    onValueChange={(value) => setLeftOperator(value as BooleanOperator)}
                >
                    <HiveMimeInlineSelectTrigger className="p-0">
                        <SelectValue />
                    </HiveMimeInlineSelectTrigger>
                    <SelectContent>
                        <SelectItem value={BooleanOperator.And}>And</SelectItem>
                        <SelectItem value={BooleanOperator.Or}>Or</SelectItem>
                    </SelectContent>
                </Select>
            )}

            <div className={`${!isRoot ? "ml-2 border-l" : ""}`}>
                {builder.children.map((item, index) => item instanceof VoteQueryGroup ?
                    <HiveMimeVoteQueryGroup key={index} group={item as VoteQueryGroup} isFirstItem={index == 0} isRoot={false} /> :
                    <HiveMimeVoteQuery key={index} currentItem={item as VoteQuery} isFirstItem={index == 0} onRemove={() => removeItem(item as VoteQuery)} />
                )}
            </div>
        </div>
    );
});
