import { VoteQueryGroup, VoteQuery, BooleanOperator } from "@/lib/query-builder";
import { observer } from "mobx-react-lite";
import { HiveMimeVoteQuery } from "./hm-vote-query";
import { Select, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { HiveMimeInlineSelectTrigger } from "@/components/custom/utility/hm-inline-select";
import { HiveMimeDraggable } from "@/components/custom/utility/hm-draggable";


type HiveMimeVoteQueryGroupProps = {
    group: VoteQueryGroup;
    isFirstItem: boolean;
    isRoot: boolean;
};

export const HiveMimeVoteQueryGroup = observer(({ group, isFirstItem, isRoot }: HiveMimeVoteQueryGroupProps) => {

    function setLeftOperator(value: BooleanOperator) {
        group.leftOperator = value;
    }

    function removeItem(item: VoteQuery) {
        group.children = group.children.filter(i => i !== item);
    }
    
    return (
        <div className="flex flex-col text-sm text-muted-foreground gap-2">
            {!isFirstItem && (
                <Select
                    value={group.leftOperator}
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
                {group.children.map((item, index) => item instanceof VoteQueryGroup ?
                    <HiveMimeVoteQueryGroup key={index} group={item as VoteQueryGroup} isFirstItem={index == 0} isRoot={false} /> :
                    <HiveMimeVoteQuery key={index} currentItem={item as VoteQuery} currentGroup={group} isFirstItem={index == 0} onRemove={() => removeItem(item as VoteQuery)} />
                )}
            </div>
        </div>
    );
});
