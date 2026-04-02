import { HiveMimeBulletItem } from "@/components/custom/utility/hm-bullet-item";
import { HiveMimeInlineSelectTrigger } from "@/components/custom/utility/hm-inline-select";
import { Select, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { PollDto } from "@/lib/Api";
import { ValueOperator, VoteQuery } from "@/lib/query-builder";
import { observer } from "mobx-react-lite";
import { useEffect } from "react";
import { HiveMimeCategoryTag } from "../../../vote/category/hm-category-poll-vote-category";

interface HiveMimeFilterConditionCategoryValuePickerProps {
    currentItem: VoteQuery;
    poll: PollDto;
}

export const HiveMimeFilterConditionCategoryValuePicker = observer(({ currentItem, poll }: HiveMimeFilterConditionCategoryValuePickerProps) => {
    useEffect(() => {
        if (currentItem.value != null)
            return;

        currentItem.valueOperator = ValueOperator.Equals;
        currentItem.value = poll.minValue!;
    }, [currentItem]);

    function setNegation(value: boolean) {
        currentItem.isNegated = value;
    }

    function setValue(value: number) {
        currentItem.value = value;
    }

    return (
        <div className="flex-col gap-2">
            <HiveMimeBulletItem>
                <span className="text-sm text-muted-foreground">
                    This condition
                    <Select
                        value={currentItem.isNegated ? "true" : "false"}
                        onValueChange={(value) => setNegation(value === "true")}
                    >
                        <HiveMimeInlineSelectTrigger>
                            <SelectValue />
                        </HiveMimeInlineSelectTrigger>
                        <SelectContent>
                            <SelectItem value="false">must</SelectItem>
                            <SelectItem value="true">must not</SelectItem>
                        </SelectContent>
                    </Select>
                    match
                </span>
            </HiveMimeBulletItem>

            <HiveMimeBulletItem className="gap-2">
                <div className="flex flex-col gap-4">
                    <div className="text-sm text-muted-foreground">
                        Candidate was categorized as 
                        
                        <Select
                            value={(currentItem.value ?? 0).toString()!}
                            onValueChange={(value) => setValue(Number(value))}
                        >
                            <HiveMimeInlineSelectTrigger>
                                <SelectValue />
                            </HiveMimeInlineSelectTrigger>
                            <SelectContent>
                                {poll.categories!.map((category) => (
                                    <SelectItem key={category.id} value={category.value!.toString()}>
                                        <HiveMimeCategoryTag category={category} />
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </HiveMimeBulletItem>
        </div>
    );
});