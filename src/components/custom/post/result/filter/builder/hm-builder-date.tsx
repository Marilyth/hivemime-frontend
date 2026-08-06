import { CalendarScope, DateSelection, Variant } from "@/components/custom/utility/date-selection";
import { DatePicker } from "@/components/custom/utility/date-picker";
import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import { reaction } from "mobx";
import { useTranslation } from "react-i18next";
import { ValueOperator } from "@/lib/Api";
import { SelectItem } from "@/components/ui/select";
import { valueOperatorToInlineString } from "@/lib/utils";
import { Chip, ValuePopover, SelectChip } from "./hm-builder-chip";
import { HiveMimeFilterConditionEditorProps, useReportValidity, useAutoSingle } from "./hm-builder-editor";

enum DateSubValue {
    Date = "Date",
    Month = "Month",
    DayOfMonth = "DayOfMonth",
    DayOfWeek = "DayOfWeek",
    Hour = "Hour",
    Minute = "Minute"
}

function getNumericOptions(subValue: DateSubValue): { value: string; label: string }[] {
    switch (subValue) {
        case DateSubValue.Month:
            return [...Array(12).keys()].map(i => ({ value: String(i + 1), label: new Date(2000, i, 1).toLocaleString("default", { month: "long" }) }));
        case DateSubValue.DayOfMonth:
            return [...Array(31).keys()].map(i => ({ value: String(i + 1), label: String(i + 1) }));
        case DateSubValue.DayOfWeek:
            return [...Array(7).keys()].map(i => ({ value: String(i + 1), label: new Date(2024, 0, i + 1).toLocaleString("default", { weekday: "long" }) }));
        case DateSubValue.Hour:
            return [...Array(24).keys()].map(i => ({ value: String(i), label: String(i) }));
        case DateSubValue.Minute:
            return [...Array(60).keys()].map(i => ({ value: String(i), label: String(i) }));
        default:
            return [];
    }
}

function formatValue(subValue: DateSubValue, value?: string | null): string {
    if (value == null)
        return "";
    switch (subValue) {
        case DateSubValue.Date:
            return new Date(Number(value)).toLocaleString();
        case DateSubValue.Month:
            return new Date(2000, Number(value) - 1, 1).toLocaleString("default", { month: "long" });
        case DateSubValue.DayOfWeek:
            return new Date(2024, 0, Number(value)).toLocaleString("default", { weekday: "long" });
        default:
            return value;
    }
}

export const DateEditor = observer(({ currentItem, poll, onValidChange }: HiveMimeFilterConditionEditorProps) => {
    const { t } = useTranslation();
    const [subValue, setSubValue] = useState<DateSubValue | null>(null);
    const [dateSelection] = useState(() => new DateSelection((poll.stepValue as CalendarScope) ?? CalendarScope.Day, 1, [], Variant.Edit));

    useEffect(() => {
        if (subValue === DateSubValue.Date && currentItem.value != null) {
            const dates = currentItem.value.split(",").map(v => ({ date: new Date(Number(v)), value: Number(v) }));
            dateSelection.dates = dates;
        }

        const dispose = reaction(
            () => dateSelection.dates.map(d => d),
            () => {
                if (subValue !== DateSubValue.Date)
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

    function setProperty(nextSubValue: DateSubValue) {
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

        if (operator === ValueOperator.Inside || operator === ValueOperator.Outside)
            dateSelection.maxDates = 20;
        else {
            dateSelection.maxDates = 1;
            dateSelection.dates = dateSelection.dates.slice(0, 1);
        }
    }

    function getOperators() {
        const operators: ValueOperator[] = [ValueOperator.Equals, ValueOperator.Greater, ValueOperator.GreaterEquals, ValueOperator.Less, ValueOperator.LessEquals];
        if (subValue === DateSubValue.Date)
            operators.push(ValueOperator.Inside, ValueOperator.Outside);
        return operators;
    }

    function getSubValueOptions() {
        const options: DateSubValue[] = [DateSubValue.Date];
        if (poll.stepValue! <= CalendarScope.Month)
            options.push(DateSubValue.Month);
        if (poll.stepValue! <= CalendarScope.Day)
            options.push(DateSubValue.DayOfMonth, DateSubValue.DayOfWeek);
        if (poll.stepValue! <= CalendarScope.Hour)
            options.push(DateSubValue.Hour);
        if (poll.stepValue! <= CalendarScope.FifteenMinutes)
            options.push(DateSubValue.Minute);
        return options;
    }

    const numericOptions = getNumericOptions(subValue ?? DateSubValue.Date);
    const subValueOptions = getSubValueOptions();
    const hideSubValue = useAutoSingle((value) => setProperty(value as DateSubValue), subValueOptions);

    useReportValidity(currentItem, onValidChange);

    const showRest = currentItem.valueOperator != null;
    const dateValues = currentItem.value ? currentItem.value.split(",").map(v => formatValue(subValue ?? DateSubValue.Date, v)).filter(Boolean) : [];

    return (
        <>
            {!hideSubValue && (
                <SelectChip
                    value={subValue ?? ""}
                    onValueChange={(value) => setProperty(value as DateSubValue)}
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
                        value={currentItem.valueOperator}
                        onValueChange={(value) => setOperator(value as ValueOperator)}
                        lockedClassName="text-foreground"
                        placeholder={t("posts:filter.selectOperator")}
                    >
                        {getOperators().map(op => <SelectItem key={op} value={op}>{valueOperatorToInlineString(op)}</SelectItem>)}
                    </SelectChip>
                    {showRest && (subValue === DateSubValue.Date ? (
                        <ValuePopover
                            trigger={dateValues.length > 0
                                ? dateValues.map(value => <Chip key={value} className="text-muted-blue">{value}</Chip>)
                                : <Chip filled={false} className="text-muted-foreground">{t("posts:filter.setValue")}</Chip>}
                        >
                            <DatePicker dateSelection={dateSelection} />
                        </ValuePopover>
                    ) : (
                        <SelectChip
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
