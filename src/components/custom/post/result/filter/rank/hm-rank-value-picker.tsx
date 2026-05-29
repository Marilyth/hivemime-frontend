import { HiveMimeBulletItem } from "@/components/custom/utility/hm-bullet-item";
import { HiveMimeInlineSelectTrigger } from "@/components/custom/utility/hm-inline-select";
import { hiveMimeRankIcon } from "@/components/custom/utility/hm-rank-icon";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { ValueOperator, VoteQuery } from "@/lib/query-builder";
import { valueOperatorToInlineString } from "@/lib/utils";
import { observer } from "mobx-react-lite";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";

interface HiveMimeFilterConditionRankValuePickerProps {
    currentItem: VoteQuery;
}

export const HiveMimeFilterConditionRankValuePicker = observer(({ currentItem }: HiveMimeFilterConditionRankValuePickerProps) => {
    const { t } = useTranslation();

    useEffect(() => {
        if (currentItem.value != null)
            return;

        currentItem.valueOperator = ValueOperator.Equals;
        currentItem.value = currentItem.poll!.maxValue!;
    }, [currentItem]);

    function setNegation(value: boolean) {
        currentItem.isNegated = value;
    }

    function setValue(value: number | null) {
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
                        {t("posts:filter.rankWas")}
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
                            value={currentItem.value?.toString() ?? "none"}
                            onValueChange={(value) => setValue(value === "none" ? null : Number(value))}
                        >
                            <HiveMimeInlineSelectTrigger>
                                <SelectValue />
                            </HiveMimeInlineSelectTrigger>
                            <SelectContent>
                                {[...Array(currentItem.poll!.candidates!.length).keys()].map((rank) => (
                                    <SelectItem key={rank} value={(currentItem.poll!.maxValue! - rank).toString()}>
                                        {hiveMimeRankIcon(rank + 1)}
                                    </SelectItem>)
                                )}
                                <SelectItem key="none" value="none">
                                    {t("enums:rankFilter.nothing")}
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </HiveMimeBulletItem>
        </div>
    );
});

export const HiveMimeFilterConditionRankValueViewer = observer(({ currentItem }: HiveMimeFilterConditionRankValuePickerProps) => {
    const { t } = useTranslation();

    return (
        <Label>
            {t("posts:filter.rankViewer", {
                name: currentItem.candidate?.name,
                negation: currentItem.isNegated ? " not" : "",
                operator: currentItem.valueOperator!,
            })}{" "}
            {currentItem.value == null
                ? t("posts:filter.unranked")
                : hiveMimeRankIcon(Number(currentItem.poll!.maxValue! - currentItem.value) + 1)}
        </Label>
    );
});
