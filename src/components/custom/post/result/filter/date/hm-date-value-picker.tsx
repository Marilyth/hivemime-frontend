import { HiveMimeBulletItem } from "@/components/custom/utility/hm-bullet-item";
import { HiveMimeInlineSelectTrigger } from "@/components/custom/utility/hm-inline-select";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { CalendarScope, DateSelection, Variant } from "@/components/custom/utility/date-selection";
import { DatePicker } from "@/components/custom/utility/date-picker";
import { CandidateDto, PollDto, ValueOperator, FilterQuery } from "@/lib/Api";
import { valueOperatorToInlineString } from "@/lib/utils";
import { autorun } from "mobx";
import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

type DateSubValue = "Date" | "Month" | "DayOfMonth" | "DayOfWeek" | "Hour" | "Minute";

const DATE_SUB_VALUES: DateSubValue[] = ["Date", "Month", "DayOfMonth", "DayOfWeek", "Hour", "Minute"];

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
    return dot === -1 ? "Date" : (property!.substring(dot + 1) as DateSubValue);
}

/**
 * Strips the sub-value suffix, returning the "pollOrder:candidateOrder" (or candidate id) part.
 */
function getBaseProperty(property?: string | null): string {
    const dot = (property ?? "").lastIndexOf(".");
    return dot === -1 ? (property ?? "") : property!.substring(0, dot);
}

function getNumericOptions(subValue: DateSubValue): { value: string; label: string }[] {
    switch (subValue) {
        case "Month":
            return [...Array(12).keys()].map(i => ({ value: String(i + 1), label: new Date(2000, i, 1).toLocaleString("default", { month: "long" }) }));
        case "DayOfMonth":
            return [...Array(31).keys()].map(i => ({ value: String(i + 1), label: String(i + 1) }));
        case "DayOfWeek":
            return [...Array(7).keys()].map(i => ({ value: String(i + 1), label: new Date(2024, 0, i + 1).toLocaleString("default", { weekday: "long" }) }));
        case "Hour":
            return [...Array(24).keys()].map(i => ({ value: String(i), label: String(i) }));
        case "Minute":
            return [...Array(60).keys()].map(i => ({ value: String(i), label: String(i) }));
        default:
            return [];
    }
}

function formatValue(subValue: DateSubValue, value?: string | null): string {
    if (value == null)
        return "";

    switch (subValue) {
        case "Date":
            return new Date(Number(value)).toLocaleString();
        case "Month":
            return new Date(2000, Number(value) - 1, 1).toLocaleString("default", { month: "long" });
        case "DayOfWeek":
            return new Date(2024, 0, Number(value)).toLocaleString("default", { weekday: "long" });
        default:
            return value;
    }
}

export const HiveMimeFilterConditionDateValuePicker = observer(({ currentItem, poll }: HiveMimeFilterConditionDateValuePickerProps) => {
    const { t } = useTranslation();
    const [subValue, setSubValue] = useState<DateSubValue>(() => getSubValue(currentItem.property));
    const [dateSelection] = useState(() => new DateSelection(
        (poll.stepValue as CalendarScope) ?? CalendarScope.Day,
        1,
        [],
        Variant.Edit
    ));

    useEffect(() => {
        if (currentItem.valueOperator != null)
            return;

        currentItem.valueOperator = ValueOperator.Equals;
    }, [currentItem]);

    // Ensure the property carries the sub-value suffix.
    useEffect(() => {
        currentItem.property = `${getBaseProperty(currentItem.property)}.${subValue}`;
    }, []);

    // (Re)initialize the date selection whenever the "Date" sub-value becomes active.
    useEffect(() => {
        if (subValue !== "Date")
            return;

        dateSelection.currentDate = currentItem.value != null
            ? new Date(Number(currentItem.value))
            : new Date();

        if (dateSelection.activeCount === 0)
            dateSelection.confirm();
    }, [subValue]);

    // Sync the selected date into the value.
    useEffect(() => {
        if (subValue !== "Date")
            return;

        const dispose = autorun(() => {
            const timestamps = dateSelection.selectedTimestamps;
            currentItem.value = timestamps.length > 0 ? String(timestamps[0]) : null;
        });

        return dispose;
    }, [dateSelection, currentItem, subValue]);

    function changeSubValue(next: DateSubValue) {
        currentItem.property = `${getBaseProperty(currentItem.property)}.${next}`;
        currentItem.value = next === "Date" ? null : getNumericOptions(next)[0].value;
        setSubValue(next);
    }

    function setNegation(value: boolean) {
        currentItem.isNegated = value;
    }

    function setOperator(operator: ValueOperator) {
        currentItem.valueOperator = operator;
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
                    <Select value={subValue} onValueChange={(value) => changeSubValue(value as DateSubValue)}>
                        <HiveMimeInlineSelectTrigger>
                            <SelectValue />
                        </HiveMimeInlineSelectTrigger>
                        <SelectContent>
                            {DATE_SUB_VALUES.map(sv => (
                                <SelectItem key={sv} value={sv}>
                                    {t(`posts:filter.dateSub${sv}`)}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Select
                        value={currentItem.valueOperator!}
                        onValueChange={(value) => setOperator(value as ValueOperator)}
                    >
                        <HiveMimeInlineSelectTrigger>
                            <SelectValue />
                        </HiveMimeInlineSelectTrigger>
                        <SelectContent>
                            {[ValueOperator.Equals, ValueOperator.Greater, ValueOperator.Less, ValueOperator.GreaterEquals, ValueOperator.LessEquals].map((operator) => (
                                <SelectItem key={operator} value={operator}>
                                    {valueOperatorToInlineString(operator)}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    {subValue !== "Date" && (
                        <Select
                            value={currentItem.value ?? numericOptions[0].value}
                            onValueChange={(value) => currentItem.value = value}
                        >
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

            {subValue === "Date" && <DatePicker dateSelection={dateSelection} />}
        </div>
    );
});

export const HiveMimeFilterConditionDateValueViewer = observer(({ currentItem, candidate }: HiveMimeFilterConditionDateValuePickerProps) => {
    const { t } = useTranslation();

    const subValue = getSubValue(currentItem.property);
    const operator = currentItem.valueOperator ?? ValueOperator.Equals;

    return (
        <Label>
            {t("posts:filter.dateViewer", {
                name: candidate.name,
                subValue: t(`posts:filter.dateSub${subValue}`),
                negation: currentItem.isNegated ? " not" : "",
                operator: valueOperatorToInlineString(operator),
                value: formatValue(subValue, currentItem.value),
            })}
        </Label>
    );
});
