import { CandidateDto, PollDto, ValueOperator, FilterQuery } from "@/lib/Api";
import { valueOperatorToInlineString } from "@/lib/utils";
import { observer } from "mobx-react-lite";
import { useTranslation } from "react-i18next";
import { HiveMimeConditionViewer, splitValues } from "../hm-condition-viewer";

enum DateSubValue {
    Date = "Date",
    Month = "Month",
    DayOfMonth = "DayOfMonth",
    DayOfWeek = "DayOfWeek",
    Hour = "Hour",
    Minute = "Minute"
}

interface HiveMimeFilterConditionDateValueViewerProps {
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

export const HiveMimeFilterConditionDateValueViewer = observer(({ currentItem, candidate, poll }: HiveMimeFilterConditionDateValueViewerProps) => {
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
