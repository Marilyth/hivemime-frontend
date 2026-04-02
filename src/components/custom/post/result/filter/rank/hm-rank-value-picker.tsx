import { HiveMimeBulletItem } from "@/components/custom/utility/hm-bullet-item";
import { HiveMimeInlineSelectTrigger } from "@/components/custom/utility/hm-inline-select";
import { hiveMimeRankIcon } from "@/components/custom/utility/hm-rank-icon";
import { Select, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { PollDto } from "@/lib/Api";
import { ValueOperator, VoteQuery } from "@/lib/query-builder";
import { valueOperatorToInlineString } from "@/lib/utils";
import { observer } from "mobx-react-lite";
import { useEffect } from "react";

interface HiveMimeFilterConditionRankValuePickerProps {
    currentItem: VoteQuery;
    poll: PollDto;
}

export const HiveMimeFilterConditionRankValuePicker = observer(({ currentItem, poll }: HiveMimeFilterConditionRankValuePickerProps) => {
    useEffect(() => {
        if (currentItem.value != null)
            return;

        currentItem.valueOperator = ValueOperator.Equals;
        currentItem.value = 0;
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
                        Candidate&apos;s rank was
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

                        {/* This score must be adjusted before sending it out. Ranks are inverse. */}
                        <Select
                            value={(currentItem.value ?? 0).toString()}
                            onValueChange={(value) => setValue(Number(value))}
                        >
                            <HiveMimeInlineSelectTrigger>
                                <SelectValue />
                            </HiveMimeInlineSelectTrigger>
                            <SelectContent>
                                {[...Array(poll.candidates!.length).keys()].map((rank) => (
                                    <SelectItem key={rank} value={rank.toString()}>
                                        {hiveMimeRankIcon(rank + 1)}
                                    </SelectItem>)
                                )}
                                <SelectItem key="unranked" value={poll.maxValue!.toString()}>
                                    Unranked
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </HiveMimeBulletItem>
        </div>
    );
});