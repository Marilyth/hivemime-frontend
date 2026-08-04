import { observer } from "mobx-react-lite";
import { BooleanOperator, PollType, PostDto, FilterQuery, FilterQueryGroup } from "@/lib/Api";
import { createFilterQueryGroup, isFilterQuery, isFilterQueryGroup, resolveCandidate } from "@/lib/vote-query";
import { HiveMimeFilterConditionChoiceValueViewer } from "./choice/hm-choice-value-picker";
import { HiveMimeFilterConditionScoreValueViewer } from "./score/hm-score-value-picker";
import { HiveMimeFilterConditionRankValueViewer } from "./rank/hm-rank-value-picker";
import { HiveMimeFilterConditionCategoryValueViewer } from "./category/hm-category-value-picker";
import { HiveMimeFilterConditionDrawValueViewer } from "./draw/hm-draw-value-picker";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { HiveMimeInlineSelectTrigger } from "@/components/custom/utility/hm-inline-select";
import { HiveMimeDraggable, OnDroppedArgs } from "@/components/custom/utility/hm-draggable";
import { getReferenceId } from "@/lib/utils";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";


type HiveMimeFilterQueryProps = {
    ancestors: FilterQueryGroup[];
    currentItem: FilterQuery;
    isFirstItem: boolean;
    onEdit?: () => void;
    onMoved?: () => void;
    post: PostDto;
};

export const HiveMimeFilterQuery = observer(({ currentItem, ancestors, isFirstItem, onEdit, onMoved, post }: HiveMimeFilterQueryProps) => {
    const { t } = useTranslation();
    const { poll, candidate } = resolveCandidate(post, currentItem.property);
    const pollMapping: {
        [key in PollType]: React.ReactElement;
    } = {
        [PollType.Choice]: <HiveMimeFilterConditionChoiceValueViewer currentItem={currentItem} candidate={candidate!} poll={poll!} />,
        [PollType.Score]: <HiveMimeFilterConditionScoreValueViewer currentItem={currentItem} candidate={candidate!} poll={poll!} />,
        [PollType.Rank]: <HiveMimeFilterConditionRankValueViewer currentItem={currentItem} candidate={candidate!} poll={poll!} />,
        [PollType.Category]: <HiveMimeFilterConditionCategoryValueViewer currentItem={currentItem} candidate={candidate!} poll={poll!} />,
        [PollType.Draw]: <HiveMimeFilterConditionDrawValueViewer currentItem={currentItem} candidate={candidate!} poll={poll!} />,
        [PollType.Date]: <div>ToDo</div>,
    };

    function isNotAncestor(draggable: unknown): boolean {
        return !(isFilterQueryGroup(draggable) &&
                 ancestors.includes(draggable as FilterQueryGroup));
    }
    
    function getParent() {
        return ancestors[ancestors.length - 1];
    }

    function removeItem(item: FilterQuery) {
        const parent = getParent();
        parent.children = parent.children!.filter(i => i !== item);

        onMoved?.();
    }

    function onDropped(args: OnDroppedArgs) {
        const { draggableData, dropAreaData, zone } = args;

        if (zone === "center" && (isFilterQuery(draggableData) || isFilterQueryGroup(draggableData))) {
            // We are the only children of the group no need for another.
            if (getParent().children!.length == 2)
                return;

            const draggableItem = draggableData as FilterQuery | FilterQueryGroup;

            // Create a new group with the dragged item and the target item.
            const newGroup = createFilterQueryGroup();
            newGroup.children!.push(currentItem);
            newGroup.children!.push(draggableItem);

            // Replace the items in the current group with the new group.
            const currentIndex = getParent().children!.findIndex(i => i === currentItem);
            getParent().children![currentIndex] = newGroup;
            getParent().children = getParent().children!.filter(i => i !== draggableItem && i !== currentItem);
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
              transition={{ duration: 0.2 }}>
            <HiveMimeDraggable className="flex flex-row gap-2 border-b hover:bg-honey-yellow/10" isDraggable isDropArea allowedZones={["top", "bottom", "center"]}
                data={currentItem} dataList={getParent().children!} onDropped={onDropped} canDrop={isNotAncestor}>
                <div className="flex flex-row items-center gap-2 flex-1 min-w-0 my-3 pl-2">
                    {!isFirstItem && (
                        <Select
                            value={currentItem.leftOperator}
                            onValueChange={(value) => setLeftOperator(value as BooleanOperator)}
                        >
                            <HiveMimeInlineSelectTrigger className="w-10 m-0 p-0">
                                <SelectValue />
                            </HiveMimeInlineSelectTrigger>
                            <SelectContent>
                                <SelectItem value={BooleanOperator.And}>{t("enums:queryOperator.and")}</SelectItem>
                                <SelectItem value={BooleanOperator.Or}>{t("enums:queryOperator.or")}</SelectItem>
                            </SelectContent>
                        </Select>
                    )}
                    {poll?.pollType && pollMapping[poll.pollType]}
                </div>
                <Button variant="ghost" className="p-0 h-auto" onClick={() => removeItem(currentItem)}>
                    <Trash />
                </Button>
            </HiveMimeDraggable>
        </motion.div>
    );
});
