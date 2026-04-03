import { observer } from "mobx-react-lite";
import { BooleanOperator, VoteQuery } from "@/lib/query-builder";
import { PollType } from "@/lib/Api";
import { HiveMimeFilterConditionChoiceValueViewer } from "./choice/hm-choice-value-picker";
import { HiveMimeFilterConditionScoreValueViewer } from "./score/hm-score-value-picker";
import { HiveMimeFilterConditionRankValueViewer } from "./rank/hm-rank-value-picker";
import { HiveMimeFilterConditionCategoryValueViewer } from "./category/hm-category-value-picker";
import { Button } from "@/components/ui/button";
import { Edit, Trash } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { HiveMimeInlineSelectTrigger } from "@/components/custom/utility/hm-inline-select";


type HiveMimeVoteQueryProps = {
    currentItem: VoteQuery;
    isFirstItem?: boolean;
    onEdit?: () => void;
    onRemove?: () => void;
} & React.HTMLAttributes<HTMLDivElement>;

export const HiveMimeVoteQuery = observer(({ currentItem, isFirstItem = false, onEdit, onRemove, className, ...props }: HiveMimeVoteQueryProps) => {
    const pollMapping: {
        [key in PollType]: React.ReactElement;
    } = {
        [PollType.Choice]: <HiveMimeFilterConditionChoiceValueViewer currentItem={currentItem} />,
        [PollType.Score]: <HiveMimeFilterConditionScoreValueViewer currentItem={currentItem} />,
        [PollType.Rank]: <HiveMimeFilterConditionRankValueViewer currentItem={currentItem} />,
        [PollType.Category]: <HiveMimeFilterConditionCategoryValueViewer currentItem={currentItem} />,
    };

    function setLeftOperator(value: BooleanOperator) {
        currentItem.leftOperator = value;
    }
        
    return (
        <div className={`flex flex-row gap-2 border-b py-1 pl-2 last:border-0 items-center ${className}`} {...props}>
            <div className="flex flex-row items-center gap-2 flex-1 min-w-0">
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
            <Button variant="ghost" className="p-0 h-auto" onClick={onRemove}>
                <Trash />
            </Button>
        </div>
    );
});
