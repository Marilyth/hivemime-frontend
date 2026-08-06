import { HiveMimeBulletItem } from "@/components/custom/utility/hm-bullet-item";
import { HiveMimeInlineSelectTrigger } from "@/components/custom/utility/hm-inline-select";
import { Select, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { CalendarScope, DateSelection, Variant } from "@/components/custom/utility/date-selection";
import { DatePicker } from "@/components/custom/utility/date-picker";
import { CandidateDto, PollDto, ValueOperator, FilterQuery } from "@/lib/Api";
import { valueOperatorToInlineString } from "@/lib/utils";
import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { reaction } from "mobx";
import { HiveMimeConditionViewer, splitValues } from "../hm-condition-viewer";

enum DateSubValue {
    Date = "Date",
    Month = "Month",
    DayOfMonth = "DayOfMonth",
    DayOfWeek = "DayOfWeek",
    Hour = "Hour",
    Minute = "Minute"
}

interface HiveMimeFilterConditionDateValuePickerProps {
    currentItem: FilterQuery;
    candidate: CandidateDto;
    poll: PollDto;
}

/**
 * Reads the sub-value suffix ("pollOrder:candidateOrder.SubValue") from a property, defaulting to "Date".
 */
function getSubValue(property?: string | null): DateSubValue {
    const dot = (property ?? "").lastIndexOf(".");
    return dot === -1 ? DateSubValue.Date : (property!.substring(dot + 1) as DateSubValue);
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
            return [...Array(24).keys()].map(i => ({ value: String(i), label: new Date(2000, 0, 1, i).toLocaleString("default", { hour: "numeric" })}));
        case DateSubValue.Minute:
            return [...Array(60).keys()].map(i => ({ value: String(i), label: new Date(2000, 0, 1, 0, i).toLocaleString("default", { minute: "numeric" }) }));
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
        case DateSubValue.Hour:
            return new Date(2000, 0, 1, Number(value)).toLocaleString("default", { hour: "numeric" });
        case DateSubValue.Minute:
            return new Date(2000, 0, 1, 0, Number(value)).toLocaleString("default", { minute: "numeric" });
        default:
            return value;
    }
}

export const HiveMimeFilterConditionDateValuePicker = observer(({ currentItem, poll }: HiveMimeFilterConditionDateValuePickerProps) => {
    const { t } = useTranslation();
    const [subValue, setSubValue] = useState<DateSubValue>(() => getSubValue(currentItem.property));
    const [dateSelection] = useState(() => new DateSelection((poll.stepValue as CalendarScope) ?? CalendarScope.Day, 1, [], Variant.Edit));

    useEffect(() => {
        if (currentItem.value != null)
        {
            const dates = currentItem.value.split(",").map(v => ({ date: new Date(Number(v)), value: Number(v) }));
            dateSelection.dates = dates;
        }
        else
        {
            setProperty(DateSubValue.Date);
            setOperator(ValueOperator.Equals);
        }

        const dispose = reaction(() => dateSelection.dates.map(d => d), (newDates, oldDates) => {
            currentItem.value = newDates.map(d => d.date.getTime()).join(",");
        })

        return () => {
            dispose();
        }
    }, [currentItem]);

    function setProperty(subValue: DateSubValue) {
        const dotIndex = currentItem.property!.lastIndexOf(".");
        const propertyWithoutSubValue = dotIndex === -1 ? currentItem.property : currentItem.property!.substring(0, dotIndex);
        currentItem.property = `${propertyWithoutSubValue}.${subValue}`;
        setSubValue(subValue);

        const options = getNumericOptions(subValue);
        if (options.length > 0)
            currentItem.value = options[0].value;
        else
            currentItem.value = null;
    }

    function setNegation(value: boolean) {
        currentItem.isNegated = value;
    }

    function setOperator(operator: ValueOperator) {
        currentItem.valueOperator = operator;

        if (operator === ValueOperator.Inside || operator === ValueOperator.Outside)
            dateSelection.maxDates = 20;
        else
        {
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
        console.log(poll.stepValue);
        const options: DateSubValue[] = [DateSubValue.Date];

        if (poll.stepValue! <= CalendarScope.Month)
            options.push(DateSubValue.Month)
        if (poll.stepValue! <= CalendarScope.Day)
            options.push(DateSubValue.DayOfMonth, DateSubValue.DayOfWeek)
        if (poll.stepValue! <= CalendarScope.Hour)
            options.push(DateSubValue.Hour)
        if (poll.stepValue! <= CalendarScope.FifteenMinutes)
            options.push(DateSubValue.Minute)

        return options;
    }

    const numericOptions = getNumericOptions(subValue);

    return (
        <div className="flex flex-col gap-2">
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
                <span className="text-sm text-muted-foreground">
                    <Select value={subValue.toString()} onValueChange={(value) => setProperty(value as DateSubValue)}>
                        <HiveMimeInlineSelectTrigger>
                            <SelectValue />
                        </HiveMimeInlineSelectTrigger>
                        <SelectContent>
                            {getSubValueOptions().map(sv => (
                                <SelectItem key={sv} value={sv.toString()}>
                                    {t(`posts:filter.dateSub${DateSubValue[sv].toString()}`)}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Select value={currentItem.valueOperator!} onValueChange={(value) => setOperator(value as ValueOperator)}>
                        <HiveMimeInlineSelectTrigger>
                            <SelectValue />
                        </HiveMimeInlineSelectTrigger>
                        <SelectContent>
                            {getOperators().map((operator) => (
                                <SelectItem key={operator} value={operator}>
                                    {valueOperatorToInlineString(operator)}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    {subValue !== DateSubValue.Date && (
                        <Select value={currentItem.value ?? numericOptions[0].value} onValueChange={(value) => currentItem.value = value}>
                            <HiveMimeInlineSelectTrigger>
                                <SelectValue />
                            </HiveMimeInlineSelectTrigger>
                            <SelectContent>
                                {numericOptions.map(option => (
                                    <SelectItem key={option.value} value={option.value}>
                                        {option.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                   )}
                </span>
            </HiveMimeBulletItem>

            {subValue === DateSubValue.Date && <DatePicker dateSelection={dateSelection} />}
        </div>
    );
});

export const HiveMimeFilterConditionDateValueViewer = observer(({ currentItem, candidate, poll }: HiveMimeFilterConditionDateValuePickerProps) => {
    const { t } = useTranslation();

    const subValue = getSubValue(currentItem.property);
    const operator = currentItem.valueOperator ?? ValueOperator.Equals;
    const values = splitValues(currentItem.value).map(value => formatValue(subValue, value));

    return (
        <HiveMimeConditionViewer
            pollName={poll.title}
            name={candidate.name}
            subValue={t(`posts:filter.dateSub${subValue}`)}
            operator={valueOperatorToInlineString(operator)}
            negated={currentItem.isNegated}
            values={values}
        />
    );
});
