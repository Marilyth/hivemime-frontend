import { VoteQueryGroup, VoteQuery, BooleanOperator, VoteQueryBase } from "@/lib/query-builder";
import { observer } from "mobx-react-lite";
import { HiveMimeVoteQuery } from "./hm-vote-query";
import { Select, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { HiveMimeInlineSelectTrigger } from "@/components/custom/utility/hm-inline-select";
import { HiveMimeDraggable } from "@/components/custom/utility/hm-draggable";
import { useMemo } from "react";
import { motion } from "framer-motion";
import { getReferenceId } from "@/lib/utils";


type HiveMimeVoteQueryGroupProps = {
    ancestors: VoteQueryGroup[];
    group: VoteQueryGroup;
    isFirstItem: boolean;
    onMoved?: () => void;
};

export const HiveMimeVoteQueryGroup = observer(({ ancestors, group, isFirstItem, onMoved }: HiveMimeVoteQueryGroupProps) => {
    const newAncestors: VoteQueryGroup[] = useMemo(() => [...ancestors, group], [ancestors, group]);

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

    function isRoot() {
        return ancestors.length == 0;
    }

    function isNotAncestor(draggable: unknown): boolean {
        return !(draggable instanceof VoteQueryGroup &&
                 ancestors.includes(draggable as VoteQueryGroup));
    }
    
    function getParent() {
        return ancestors[ancestors.length - 1];
    }

    return (
        <motion.div layout
                      layoutId={getReferenceId(group)}
                      key={getReferenceId(group)}
                      transition={{ duration: 0.2 }}>
            <HiveMimeDraggable className={`flex flex-col gap-2 ${!isRoot() ? "my-2" : ""}`} canDrop={isNotAncestor} isDraggable={!isRoot()}
                isDropArea={!isRoot()} allowedZones={["top", "bottom"]} dataList={getParent()?.children} data={group} onDropped={onMoved}>
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

                <div className={`${!isRoot() ? "mx-2 border border-l-3 border-b-3 rounded bg-muted/30" : ""}`}>
                    {group.children.map((item, index) => item instanceof VoteQueryGroup ?
                        <HiveMimeVoteQueryGroup key={index} group={item as VoteQueryGroup} isFirstItem={index == 0} onMoved={cleanUpGroup} ancestors={newAncestors} /> :
                        <HiveMimeVoteQuery key={index} currentItem={item as VoteQuery} isFirstItem={index == 0} onMoved={cleanUpGroup} ancestors={newAncestors}  />
                    )}
                </div>
            </HiveMimeDraggable>
        </motion.div>
    );
});
