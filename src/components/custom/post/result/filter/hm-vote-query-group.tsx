import { VoteQueryGroup, VoteQuery, BooleanOperator } from "@/lib/query-builder";
import { observer } from "mobx-react-lite";
import { useEffect } from "react";
import { reaction, toJS } from "mobx";
import { HiveMimeVoteQuery } from "./hm-vote-query";
import { Select, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { HiveMimeInlineSelectTrigger } from "@/components/custom/utility/hm-inline-select";


type HiveMimeVoteQueryGroupProps = {
    group: VoteQueryGroup;
    isFirstItem: boolean;
    isRoot: boolean;
    onMoved?: () => void;
};

export const HiveMimeVoteQueryGroup = observer(({ group, isFirstItem, isRoot, onMoved }: HiveMimeVoteQueryGroupProps) => {
    function setLeftOperator(value: BooleanOperator) {
        group.leftOperator = value;
    }

    /**
     * Simplifies and cleans up the query group recursively by removing empty groups and collapsing groups with only 1 element.
     */
    function cleanUpGroup() {
        for (let i = group.children.length - 1; i >= 0; i--) {
            const child = group.children[i];
            
            if (child instanceof VoteQueryGroup) {
                // Adopt the child if there is only 1 left or it is my only child.
                if (child.children.length == 1 || group.children.length == 1)
                    group.children.splice(i, 1, ...child.children);

                // Remove the group if it is empty.
                else if (child.children.length == 0)
                    group.children.splice(i, 1);
            }
        }

        // Notify the parent as well.
        onMoved?.();
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
                    <HiveMimeVoteQueryGroup key={index} group={item as VoteQueryGroup} isFirstItem={index == 0} isRoot={false} onMoved={cleanUpGroup} /> :
                    <HiveMimeVoteQuery key={index} currentItem={item as VoteQuery} currentGroup={group} isFirstItem={index == 0} onMoved={cleanUpGroup} />
                )}
            </div>
        </div>
    );
});
