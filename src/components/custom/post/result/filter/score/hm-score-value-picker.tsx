import { HiveMimeBulletItem } from "@/components/custom/utility/hm-bullet-item";
import { HiveMimeInlineSelectTrigger } from "@/components/custom/utility/hm-inline-select";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { ValueOperator, VoteQuery } from "@/lib/query-builder";
import { valueOperatorToInlineString } from "@/lib/utils";
import { observer } from "mobx-react-lite";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";

interface HiveMimeFilterConditionScoreValuePickerProps {
    currentItem: VoteQuery;
}

export const HiveMimeFilterConditionScoreValuePicker = observer(({ currentItem }: HiveMimeFilterConditionScoreValuePickerProps) => {
    const { t } = useTranslation();

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
    const { t } = useTranslation();

    return (
        <Label>
            {t("posts:filter.scoreViewer", {
                name: currentItem.candidate?.name,
                negation: currentItem.isNegated ? " not" : "",
                operator: currentItem.valueOperator!,
                value: currentItem.value,
            })}
        </Label>
    );
});
