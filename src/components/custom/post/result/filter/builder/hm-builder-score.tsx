import { observer } from "mobx-react-lite";
import { useTranslation } from "react-i18next";
import { ValueOperator } from "@/lib/Api";
import { SelectItem } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { valueOperatorToInlineString } from "@/lib/utils";
import { Chip, DialogValueChip, SelectChip } from "./hm-builder-chip";
import { HiveMimeFilterConditionEditorProps, useReportValidity } from "./hm-builder-editor";

const OPERATORS = [ValueOperator.Equals, ValueOperator.Greater, ValueOperator.Less, ValueOperator.GreaterEquals, ValueOperator.LessEquals];

export const ScoreEditor = observer(({ currentItem, poll, onValidChange, isActive }: HiveMimeFilterConditionEditorProps) => {
    const { t } = useTranslation();

    useReportValidity(currentItem, onValidChange);

    const showRest = currentItem.valueOperator != null;

    return (
        <>
            <SelectChip
                autoOpen={isActive}
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
                <DialogValueChip
                    autoOpen={isActive}
                    hasValue={currentItem.value != null && currentItem.value !== ""}
                    trigger={currentItem.value
                        ? <Chip className="text-muted-blue">{currentItem.value}</Chip>
                        : <Chip filled={false} className="text-muted-foreground">{t("posts:filter.setValue")}</Chip>}
                >
                    <div className="flex flex-col items-center gap-4 p-2">
                        <span className="text-2xl font-semibold tabular-nums text-foreground">
                            {currentItem.value ?? poll.minValue!}
                        </span>
                        <Slider
                            value={[Number(currentItem.value ?? poll.minValue!)]}
                            onValueChange={(value) => currentItem.value = String(value[0])}
                            min={poll.minValue!}
                            max={poll.maxValue!}
                            step={poll.stepValue!}
                        />
                    </div>
                </DialogValueChip>
            )}
        </>
    );
});
