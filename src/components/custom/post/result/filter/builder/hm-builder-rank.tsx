import { observer } from "mobx-react-lite";
import { useTranslation } from "react-i18next";
import { ValueOperator } from "@/lib/Api";
import { SelectItem } from "@/components/ui/select";
import { hiveMimeRankIcon } from "@/components/custom/utility/hm-rank-icon";
import { valueOperatorToInlineString } from "@/lib/utils";
import { SelectChip } from "./hm-builder-chip";
import { HiveMimeFilterConditionEditorProps, useReportValidity, useAutoSingle } from "./hm-builder-editor";

const OPERATORS = [ValueOperator.Equals, ValueOperator.Greater, ValueOperator.GreaterEquals, ValueOperator.Less, ValueOperator.LessEquals];

export const RankEditor = observer(({ currentItem, poll, onValidChange }: HiveMimeFilterConditionEditorProps) => {
    const { t } = useTranslation();

    const rankValues = [...Array(poll.candidates!.length).keys()].map(rank => (poll.maxValue! - rank).toString());
    const hideValue = useAutoSingle((value) => currentItem.value = value, rankValues);

    useReportValidity(currentItem, onValidChange);

    const showRest = currentItem.valueOperator != null;

    return (
        <>
            <SelectChip
                value={currentItem.valueOperator}
                onValueChange={(value) => {
                    currentItem.valueOperator = value as ValueOperator;
                    currentItem.value = null;
                }}
                lockedClassName="text-foreground"
                placeholder={t("posts:filter.selectOperator")}
            >
                {OPERATORS.map(op => <SelectItem key={op} value={op}>{valueOperatorToInlineString(op)}</SelectItem>)}
            </SelectChip>
            {showRest && !hideValue && (
                <SelectChip
                    value={currentItem.value ?? "none"}
                    onValueChange={(value) => currentItem.value = value === "none" ? null : value}
                    lockedClassName="text-muted-blue"
                    placeholder={t("posts:filter.setValue")}
                >
                    {rankValues.map((value, rank) => (
                        <SelectItem key={value} value={value}>
                            {hiveMimeRankIcon(rank + 1)}
                        </SelectItem>
                    ))}
                    <SelectItem value="none">{t("enums:rankFilter.nothing")}</SelectItem>
                </SelectChip>
            )}
        </>
    );
});
