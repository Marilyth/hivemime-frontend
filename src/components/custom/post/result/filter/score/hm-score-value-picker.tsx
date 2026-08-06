import { HiveMimeBulletItem } from "@/components/custom/utility/hm-bullet-item";
import { HiveMimeInlineSelectTrigger } from "@/components/custom/utility/hm-inline-select";
import { Select, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { CandidateDto, PollDto, ValueOperator, FilterQuery } from "@/lib/Api";
import { valueOperatorToInlineString } from "@/lib/utils";
import { observer } from "mobx-react-lite";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { HiveMimeConditionViewer, splitValues } from "../hm-condition-viewer";

interface HiveMimeFilterConditionScoreValuePickerProps {
    currentItem: FilterQuery;
    candidate: CandidateDto;
    poll: PollDto;
}

export const HiveMimeFilterConditionScoreValuePicker = observer(({ currentItem, candidate, poll }: HiveMimeFilterConditionScoreValuePickerProps) => {
    const { t } = useTranslation();

    useEffect(() => {
        if (currentItem.value != null)
            return;
        
        currentItem.valueOperator = ValueOperator.Equals;
        currentItem.value = String(poll.minValue!);
    }, [currentItem]);

    function setNegation(value: boolean) {
        currentItem.isNegated = value;
    }

    function setValue(value: number) {
        currentItem.value = String(value);
    }

    function setOperator(operator: ValueOperator) {
        currentItem.valueOperator = operator;
    }

    return (
        <div className="flex-col gap-2">
            <HiveMimeBulletItem>
                <span className="text-sm text-muted-foreground">
                    {t("posts:filter.thisCondition")}
                    <Select
                        value={currentItem.isNegated ? "true" : "false"}
                        onValueChange={(value) => setNegation(value === "true")}
                    >
                        <HiveMimeInlineSelectTrigger>
                            <SelectValue />
                        </HiveMimeInlineSelectTrigger>
                        <SelectContent>
                            <SelectItem value="false">{t("enums:match.must")}</SelectItem>
                            <SelectItem value="true">{t("enums:match.mustNot")}</SelectItem>
                        </SelectContent>
                    </Select>
                    {t("posts:filter.match")}
                </span>
            </HiveMimeBulletItem>

            <HiveMimeBulletItem className="gap-2">
                <div className="flex flex-col gap-4">
                    <div className="text-sm text-muted-foreground">
                        {t("posts:filter.scoreWas")}
                        <Select
                            value={currentItem.valueOperator!}
                            onValueChange={(value) => setOperator(value as ValueOperator)}
                        >
                            <HiveMimeInlineSelectTrigger>
                                {currentItem.valueOperator!}
                            </HiveMimeInlineSelectTrigger>
                            <SelectContent>
                                {[ValueOperator.Equals, ValueOperator.Greater, ValueOperator.Less, ValueOperator.GreaterEquals, ValueOperator.LessEquals].map((operator) => (
                                    <SelectItem key={operator} value={operator}>
                                        {valueOperatorToInlineString(operator)}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        {currentItem.value}
                    </div>

                    <Slider
                        value={[Number(currentItem.value ?? poll.minValue!)]}
                        onValueChange={(value) => setValue(value[0])}
                        min={poll.minValue!}
                        max={poll.maxValue!}
                        step={poll.stepValue!}
                    />
                </div>
            </HiveMimeBulletItem>
        </div>
    );
});

export const HiveMimeFilterConditionScoreValueViewer = observer(({ currentItem, candidate }: HiveMimeFilterConditionScoreValuePickerProps) => {
    return (
        <HiveMimeConditionViewer
            name={candidate.name}
            operator={valueOperatorToInlineString(currentItem.valueOperator!)}
            negated={currentItem.isNegated}
            values={splitValues(currentItem.value)}
        />
    );
});
