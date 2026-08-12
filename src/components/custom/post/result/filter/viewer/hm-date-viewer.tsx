import { CandidateDto, PollDto, ValueOperator, FilterQuery, SubProperty } from "@/lib/Api";
import { valueOperatorToInlineString } from "@/lib/utils";
import { fromGMT } from "@/lib/gmt";
import { observer } from "mobx-react-lite";
import { useTranslation } from "react-i18next";
import { HiveMimeConditionViewer, splitValues } from "../hm-condition-viewer";


interface HiveMimeFilterConditionDateValueViewerProps {
    currentItem: FilterQuery;
    candidate: CandidateDto;
    poll: PollDto;
}


function formatValue(subValue: SubProperty, value?: string | null): string {
    if (value == null)
        return "";

    switch (subValue) {
        case SubProperty.Date:
            return fromGMT(Number(value)).toLocaleString();
        case SubProperty.Month:
            return new Date(2000, Number(value) - 1, 1).toLocaleString("default", { month: "long" });
        case SubProperty.DayOfWeek:
            return new Date(2024, 0, Number(value)).toLocaleString("default", { weekday: "long" });
        case SubProperty.Hour:
            return new Date(2000, 0, 1, Number(value)).toLocaleString("default", { hour: "numeric" });
        case SubProperty.Minute:
            return new Date(2000, 0, 1, 0, Number(value)).toLocaleString("default", { minute: "numeric" });
        default:
            return value;
    }
}

export const HiveMimeFilterConditionDateValueViewer = observer(({ currentItem, candidate, poll }: HiveMimeFilterConditionDateValueViewerProps) => {
    const { t } = useTranslation();

    const subValue = currentItem.subProperty ?? SubProperty.Date;
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
