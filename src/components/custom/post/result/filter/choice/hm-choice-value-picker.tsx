import { HiveMimeBulletItem } from "@/components/custom/utility/hm-bullet-item";
import { HiveMimeInlineSelectTrigger } from "@/components/custom/utility/hm-inline-select";
import { Select, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { ValueOperator, VoteQuery } from "@/lib/query-builder";
import { observer } from "mobx-react-lite";
import { useEffect } from "react";

interface HiveMimeFilterConditionChoiceValuePickerProps {
    currentItem: VoteQuery;
}

export const HiveMimeFilterConditionChoiceValuePicker = observer(({ currentItem }: HiveMimeFilterConditionChoiceValuePickerProps) => {
    useEffect(() => {
        if (currentItem.value != null)
            return;
        
        currentItem.valueOperator = ValueOperator.Equals;
        currentItem.value = 1;
    }, [currentItem]);

    function setValue(value: number) {
        currentItem.value = value;
    }

    return (
        <div className="flex-col gap-2">
            <HiveMimeBulletItem>
                <span className="text-sm text-muted-foreground">
                    Candidate was
                    <Select
                        value={currentItem.value === 1 ? "1" : "0"}
                        onValueChange={(value) => setValue(Number(value))}
                    >
                        <HiveMimeInlineSelectTrigger>
                            <SelectValue />
                        </HiveMimeInlineSelectTrigger>
                        <SelectContent>
                            <SelectItem value="1">selected</SelectItem>
                            <SelectItem value="0">not selected</SelectItem>
                        </SelectContent>
                    </Select>
                </span>
            </HiveMimeBulletItem>
        </div>
    );
});