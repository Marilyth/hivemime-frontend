import { observer } from "mobx-react-lite";
import { BooleanOperator, VoteQuery, VoteQueryGroup } from "@/lib/query-builder";
import { PollType } from "@/lib/Api";
import { HiveMimeFilterConditionChoiceValueViewer } from "./choice/hm-choice-value-picker";
import { HiveMimeFilterConditionScoreValueViewer } from "./score/hm-score-value-picker";
import { HiveMimeFilterConditionRankValueViewer } from "./rank/hm-rank-value-picker";
import { HiveMimeFilterConditionCategoryValueViewer } from "./category/hm-category-value-picker";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { HiveMimeInlineSelectTrigger } from "@/components/custom/utility/hm-inline-select";
import { HiveMimeDraggable, OnDroppedArgs } from "@/components/custom/utility/hm-draggable";
import { getReferenceId } from "@/lib/utils";
import { motion } from "framer-motion";


type HiveMimeVoteQueryProps = {
    ancestors: VoteQueryGroup[];
    currentItem: VoteQuery;
    isFirstItem: boolean;
    onEdit?: () => void;
    onMoved?: () => void;
};

export const HiveMimeVoteQuery = observer(({ currentItem, ancestors, isFirstItem, onEdit, onMoved }: HiveMimeVoteQueryProps) => {
    const pollMapping: {
        [key in PollType]: React.ReactElement;
    } = {
        [PollType.Choice]: <HiveMimeFilterConditionChoiceValueViewer currentItem={currentItem} />,
        [PollType.Score]: <HiveMimeFilterConditionScoreValueViewer currentItem={currentItem} />,
        [PollType.Rank]: <HiveMimeFilterConditionRankValueViewer currentItem={currentItem} />,
        [PollType.Category]: <HiveMimeFilterConditionCategoryValueViewer currentItem={currentItem} />,
    };

    function isNotAncestor(draggable: unknown): boolean {
        return !(draggable instanceof VoteQueryGroup &&
                 ancestors.includes(draggable as VoteQueryGroup));
    }
    
    function getParent() {
        return ancestors[ancestors.length - 1];
    }

    function removeItem(item: VoteQuery) {
        const parent = getParent();
        parent.children = parent.children.filter(i => i !== item);

        onMoved?.();
    }

    function onDropped(args: OnDroppedArgs) {
        const { draggableData, dropAreaData, zone } = args;

        if (zone === "center" && draggableData instanceof VoteQuery) {
            // We are the only children of the group no need for another.
            if (getParent().children.length == 2)
                return;

            const targetItem = draggableData as VoteQuery;

            // Create a new group with the dragged item and the target item.
            const newGroup = new VoteQueryGroup();
            newGroup.children.push(currentItem);
            newGroup.children.push(targetItem);

            // Replace the items in the current group with the new group.
            const currentIndex = getParent().children.findIndex(i => i === currentItem);
            getParent().children[currentIndex] = newGroup;
            getParent().children = getParent().children.filter(i => i !== targetItem && i !== currentItem);
        }

        onMoved?.();
    }

    function setLeftOperator(value: BooleanOperator) {
        currentItem.leftOperator = value;
    }
        
    return (
        <motion.div
              layout
              layoutId={getReferenceId(currentItem)}
              key={getReferenceId(currentItem)}
              className="border-b"
              transition={{ duration: 0.2 }}>
            <HiveMimeDraggable className="flex flex-row gap-2 hover:bg-honey-yellow/10" isDraggable isDropArea allowedZones={["top", "bottom", "center"]}
                data={currentItem} dataList={getParent().children} onDropped={onDropped} canDrop={isNotAncestor}>
                <div className="flex flex-row items-center gap-2 flex-1 min-w-0 py-3 pl-2">
                    {!isFirstItem && (
                        <Select
                            value={currentItem.leftOperator}
                            onValueChange={(value) => setLeftOperator(value as BooleanOperator)}
                        >
                            <HiveMimeInlineSelectTrigger className="w-10 m-0 p-0">
                                <SelectValue />
                            </HiveMimeInlineSelectTrigger>
                            <SelectContent>
                                <SelectItem value={BooleanOperator.And}>And</SelectItem>
                                <SelectItem value={BooleanOperator.Or}>Or</SelectItem>
                            </SelectContent>
                        </Select>
                    )}
                    {currentItem.poll?.pollType && pollMapping[currentItem.poll.pollType]}
                </div>
                <Button variant="ghost" className="p-0 h-auto" onClick={() => removeItem(currentItem)}>
                    <Trash />
                </Button>
            </HiveMimeDraggable>
        </motion.div>
    );
});
