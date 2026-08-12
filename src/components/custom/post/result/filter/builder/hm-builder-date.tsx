import { CalendarScope, DateSelection, Variant } from "@/components/custom/utility/date-selection";
import { DatePicker } from "@/components/custom/utility/date-picker";
import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import { reaction } from "mobx";
import { useTranslation } from "react-i18next";
import { SubProperty, ValueOperator } from "@/lib/Api";
import { InsideOperator } from "@/lib/vote-query";
import { SelectItem } from "@/components/ui/select";
import { valueOperatorToInlineString } from "@/lib/utils";
import { Chip, DialogValueChip, SelectChip } from "./hm-builder-chip";
import { HiveMimeFilterConditionEditorProps, useReportValidity, useAutoSingle } from "./hm-builder-editor";


function getNumericOptions(subValue: SubProperty): { value: string; label: string }[] {
    switch (subValue) {
        case SubProperty.Month:
            return [...Array(12).keys()].map(i => ({ value: String(i + 1), label: new Date(2000, i, 1).toLocaleString("default", { month: "long" }) }));
        case SubProperty.DayOfMonth:
            return [...Array(31).keys()].map(i => ({ value: String(i + 1), label: String(i + 1) }));
        case SubProperty.DayOfWeek:
            return [...Array(7).keys()].map(i => ({ value: String(i + 1), label: new Date(2024, 0, i + 1).toLocaleString("default", { weekday: "long" }) }));
        case SubProperty.Hour:
            return [...Array(24).keys()].map(i => ({ value: String(i), label: String(i) }));
        case SubProperty.Minute:
            return [...Array(60).keys()].map(i => ({ value: String(i), label: String(i) }));
        default:
            return [];
    }
}

function formatValue(subValue: SubProperty, value?: string | null): string {
    if (value == null)
        return "";
    switch (subValue) {
        case SubProperty.Date:
            return new Date(Number(value)).toLocaleString();
        case SubProperty.Month:
            return new Date(2000, Number(value) - 1, 1).toLocaleString("default", { month: "long" });
        case SubProperty.DayOfWeek:
            return new Date(2024, 0, Number(value)).toLocaleString("default", { weekday: "long" });
        default:
            return value;
    }
}

export const DateEditor = observer(({ currentItem, poll, onValidChange, isActive }: HiveMimeFilterConditionEditorProps) => {
    const { t } = useTranslation();
    const [subValue, setSubValue] = useState<SubProperty | null>(null);
    const [dateSelection] = useState(() => new DateSelection((poll.stepValue as CalendarScope) ?? CalendarScope.Day, 1, poll.dateFilterQuery, [], Variant.Edit));

    const subValueOptions = getSubValueOptions();
    const hideSubValue = subValueOptions.length <= 1;
    useAutoSingle((value) => setProperty(value as SubProperty), subValueOptions);

    useEffect(() => {
        if (subValue === SubProperty.Date && currentItem.value != null) {
            const dates = currentItem.value.split(",").map(v => ({ date: new Date(Number(v)), value: Number(v) }));
            dateSelection.dates = dates;
        }

        const dispose = reaction(
            () => dateSelection.dates.map(d => d),
            () => {
                if (subValue !== SubProperty.Date)
                    return;
                const times = dateSelection.dates.map(d => d.date.getTime());
                currentItem.value = times.length > 0 ? times.join(",") : null;
            }
        );

        return () => dispose();
    }, [currentItem, subValue]);

    useEffect(() => {
        dateSelection.minScope = poll.stepValue as CalendarScope;
        dateSelection.dates = [];
    }, [poll.stepValue]);

    function setProperty(nextSubValue: SubProperty) {
        const dotIndex = currentItem.property!.lastIndexOf(".");
        const propertyWithoutSubValue = dotIndex === -1 ? currentItem.property : currentItem.property!.substring(0, dotIndex);
        currentItem.property = `${propertyWithoutSubValue}.${nextSubValue}`;
        setSubValue(nextSubValue);

        currentItem.valueOperator = undefined;
        currentItem.value = null;
    }

    function setOperator(operator: ValueOperator) {
        currentItem.valueOperator = operator;
        currentItem.value = null;

        if (operator === InsideOperator)
            dateSelection.maxDates = 20;
        else {
            dateSelection.maxDates = 1;
            dateSelection.dates = dateSelection.dates.slice(0, 1);
        }
    }

    function getOperators() {
        const operators: ValueOperator[] = [ValueOperator.Equals, ValueOperator.Greater, ValueOperator.GreaterEquals, ValueOperator.Less, ValueOperator.LessEquals];
        if (subValue === SubProperty.Date)
            operators.push(InsideOperator);
        
        return operators;
    }

    function getSubValueOptions() {
        const options: SubProperty[] = [SubProperty.Date];
        if (poll.stepValue! <= CalendarScope.Month)
            options.push(SubProperty.Month);
        if (poll.stepValue! <= CalendarScope.Day)
            options.push(SubProperty.DayOfMonth, SubProperty.DayOfWeek);
        if (poll.stepValue! <= CalendarScope.Hour)
            options.push(SubProperty.Hour);
        if (poll.stepValue! <= CalendarScope.FifteenMinutes)
            options.push(SubProperty.Minute);
        return options;
    }

    const numericOptions = getNumericOptions(subValue ?? SubProperty.Date);

    useReportValidity(currentItem, onValidChange);

    const showRest = currentItem.valueOperator != null;
    const dateValues = currentItem.value ? currentItem.value.split(",").map(v => formatValue(subValue ?? SubProperty.Date, v)).filter(Boolean) : [];

    return (
        <>
            {!hideSubValue && (
                <SelectChip
                    autoOpen={isActive}
                    value={subValue ?? ""}
                    onValueChange={(value) => setProperty(value as SubProperty)}
                    lockedClassName="text-muted-green"
                    placeholder={t("posts:filter.selectSubValue")}
                >
                    {subValueOptions.map(sv => (
                        <SelectItem key={sv} value={sv}>{t(`posts:filter.dateSub${sv}`)}</SelectItem>
                    ))}
                </SelectChip>
            )}
            {subValue != null && (
                <>
                    <SelectChip
                        autoOpen={isActive}
                        value={currentItem.valueOperator}
                        onValueChange={(value) => setOperator(value as ValueOperator)}
                        lockedClassName="text-foreground"
                        placeholder={t("posts:filter.selectOperator")}
                    >
                        {getOperators().map(op => <SelectItem key={op} value={op}>{valueOperatorToInlineString(op)}</SelectItem>)}
                    </SelectChip>
                    {showRest && (subValue === SubProperty.Date ? (
                        <DialogValueChip
                            autoOpen={isActive}
                            hasValue={currentItem.value != null && currentItem.value !== ""}
                            trigger={dateValues.length > 0
                                ? dateValues.map(value => <Chip key={value} className="text-muted-blue">{value}</Chip>)
                                : <Chip filled={false} className="text-muted-foreground">{t("posts:filter.setValue")}</Chip>}
                        >
                            <DatePicker dateSelection={dateSelection} />
                        </DialogValueChip>
                    ) : (
                        <SelectChip
                            autoOpen={isActive}
                            value={currentItem.value ?? ""}
                            onValueChange={(value) => currentItem.value = value}
                            lockedClassName="text-muted-blue"
                            placeholder={t("posts:filter.setValue")}
                        >
                            {numericOptions.map(option => (
                                <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                            ))}
                        </SelectChip>
                    ))}
                </>
            )}
        </>
    );
});
