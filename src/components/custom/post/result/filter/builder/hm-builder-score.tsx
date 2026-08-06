import { observer } from "mobx-react-lite";
import { useTranslation } from "react-i18next";
import { ValueOperator } from "@/lib/Api";
import { SelectItem } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { valueOperatorToInlineString } from "@/lib/utils";
import { PopoverChip, SelectChip } from "./hm-builder-chip";
import { HiveMimeFilterConditionEditorProps, useReportValidity } from "./hm-builder-editor";

const OPERATORS = [ValueOperator.Equals, ValueOperator.Greater, ValueOperator.Less, ValueOperator.GreaterEquals, ValueOperator.LessEquals];

export const ScoreEditor = observer(({ currentItem, poll, onValidChange }: HiveMimeFilterConditionEditorProps) => {
    const { t } = useTranslation();

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
            {showRest && (
                <PopoverChip
                    value={currentItem.value}
                    placeholder={t("posts:filter.setValue")}
                    lockedClassName="text-muted-blue"
                >
                    <Slider
                        value={[Number(currentItem.value ?? poll.minValue!)]}
                        onValueChange={(value) => currentItem.value = String(value[0])}
                        min={poll.minValue!}
                        max={poll.maxValue!}
                        step={poll.stepValue!}
                        className="w-40"
                    />
                </PopoverChip>
            )}
        </>
    );
});
