import { HiveMimeBulletItem } from "@/components/custom/utility/hm-bullet-item";
import { HiveMimeInlineSelectTrigger } from "@/components/custom/utility/hm-inline-select";
import { Select, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { CandidateDto, PollDto, ValueOperator, FilterQuery } from "@/lib/Api";
import { valueOperatorToInlineString } from "@/lib/utils";
import { observer } from "mobx-react-lite";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { HiveMimeConditionViewer } from "../hm-condition-viewer";

interface HiveMimeFilterConditionChoiceValuePickerProps {
    currentItem: FilterQuery;
    candidate: CandidateDto;
    poll: PollDto;
}

export const HiveMimeFilterConditionChoiceValuePicker = observer(({ currentItem, candidate, poll }: HiveMimeFilterConditionChoiceValuePickerProps) => {
    const { t } = useTranslation();

    useEffect(() => {
        if (currentItem.value != null)
            return;
        
        currentItem.valueOperator = ValueOperator.Equals;
        currentItem.value = "1";
    }, [currentItem]);

    function setValue(value: string) {
        currentItem.value = value;
    }

    return (
        <div className="flex-col gap-2">
            <HiveMimeBulletItem>
                <span className="text-sm text-muted-foreground">
                    {t("posts:filter.candidateWas")}
                    <Select
                        value={currentItem.value === "1" ? "1" : "0"}
                        onValueChange={(value) => setValue(value)}
                    >
                        <HiveMimeInlineSelectTrigger>
                            <SelectValue />
                        </HiveMimeInlineSelectTrigger>
                        <SelectContent>
                            <SelectItem value="1">{t("enums:selection.selected")}</SelectItem>
                            <SelectItem value="0">{t("enums:selection.notSelected")}</SelectItem>
                        </SelectContent>
                    </Select>
                </span>
            </HiveMimeBulletItem>
        </div>
    );
});

export const HiveMimeFilterConditionChoiceValueViewer = observer(({ currentItem, candidate, poll }: HiveMimeFilterConditionChoiceValuePickerProps) => {
    const { t } = useTranslation();

    return (
        <HiveMimeConditionViewer
            name={candidate.name}
            operator={valueOperatorToInlineString(ValueOperator.Equals)}
            values={[currentItem.value === "1"
                ? t("enums:selection.selected")
                : t("enums:selection.notSelected")]}
        />
    );
});
