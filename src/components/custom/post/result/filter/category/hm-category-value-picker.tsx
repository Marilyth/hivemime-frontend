import { HiveMimeBulletItem } from "@/components/custom/utility/hm-bullet-item";
import { HiveMimeInlineSelectTrigger } from "@/components/custom/utility/hm-inline-select";
import { Select, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { ValueOperator, VoteQuery } from "@/lib/query-builder";
import { observer } from "mobx-react-lite";
import { useEffect } from "react";
import { HiveMimeCategoryTag } from "../../../vote/category/hm-category-poll-vote-category";
import { Label } from "@/components/ui/label";

interface HiveMimeFilterConditionCategoryValuePickerProps {
    currentItem: VoteQuery;
}

export const HiveMimeFilterConditionCategoryValuePicker = observer(({ currentItem }: HiveMimeFilterConditionCategoryValuePickerProps) => {
    useEffect(() => {
        if (currentItem.value != null)
            return;

        currentItem.valueOperator = ValueOperator.Equals;
        currentItem.value = currentItem.poll!.minValue!;
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
                                {currentItem.poll!.categories!.map((category) => (
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

export const HiveMimeFilterConditionCategoryValueViewer = observer(({ currentItem }: HiveMimeFilterConditionCategoryValuePickerProps) => {
    return (
        <Label>
            {currentItem.candidate?.name} is{currentItem.isNegated ? " not" : ""} 
            <span className="inline-block align-middle ml-2">
                <HiveMimeCategoryTag category={currentItem.poll!.categories!.find(c => c.value === currentItem.value)!} />
            </span>
        </Label>
    );
});