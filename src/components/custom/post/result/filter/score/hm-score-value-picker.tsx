import { HiveMimeBulletItem } from "@/components/custom/utility/hm-bullet-item";
import { HiveMimeInlineSelectTrigger } from "@/components/custom/utility/hm-inline-select";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { ValueOperator, VoteQuery } from "@/lib/query-builder";
import { valueOperatorToInlineString } from "@/lib/utils";
import { observer } from "mobx-react-lite";
import { useEffect } from "react";

interface HiveMimeFilterConditionScoreValuePickerProps {
    currentItem: VoteQuery;
}

export const HiveMimeFilterConditionScoreValuePicker = observer(({ currentItem }: HiveMimeFilterConditionScoreValuePickerProps) => {
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

    function setOperator(operator: ValueOperator) {
        currentItem.valueOperator = operator;
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
                        Candidate&apos;s score was
                        <Select
                            value={currentItem.valueOperator!}
                            onValueChange={(value) => setOperator(value as ValueOperator)}
                        >
                            <HiveMimeInlineSelectTrigger>
                                {currentItem.valueOperator!}
                            </HiveMimeInlineSelectTrigger>
                            <SelectContent>
                                {Object.values(ValueOperator).map((operator) => (
                                    <SelectItem key={operator} value={operator}>
                                        {valueOperatorToInlineString(operator)}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        {currentItem.value}
                    </div>

                    <Slider
                        value={[currentItem.value ?? currentItem.poll!.minValue!]}
                        onValueChange={(value) => setValue(value[0])}
                        min={currentItem.poll!.minValue!}
                        max={currentItem.poll!.maxValue!}
                        step={currentItem.poll!.stepValue!}
                    />
                </div>
            </HiveMimeBulletItem>
        </div>
    );
});

export const HiveMimeFilterConditionScoreValueViewer = observer(({ currentItem }: HiveMimeFilterConditionScoreValuePickerProps) => {
    return (
        <Label>
            {currentItem.candidate?.name} score {currentItem.isNegated ? " not" : ""} {currentItem.valueOperator!} {currentItem.value}
        </Label>
    );
});