import { HiveMimeBulletItem } from "@/components/custom/utility/hm-bullet-item";
import { HiveMimeInlineSelectTrigger } from "@/components/custom/utility/hm-inline-select";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { ValueOperator, VoteQuery } from "@/lib/query-builder";
import { observer } from "mobx-react-lite";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";

interface HiveMimeFilterConditionChoiceValuePickerProps {
    currentItem: VoteQuery;
}

export const HiveMimeFilterConditionChoiceValuePicker = observer(({ currentItem }: HiveMimeFilterConditionChoiceValuePickerProps) => {
    const { t } = useTranslation();

    useEffect(() => {
        if (currentItem.value != null)
            return;
        
        currentItem.valueOperator = ValueOperator.Equals;
        currentItem.value = 1;
    }, [currentItem]);

    function setValue(value: number) {
        currentItem.value = value;
    }

    return (
        <div className="flex-col gap-2">
            <HiveMimeBulletItem>
                <span className="text-sm text-muted-foreground">
                    {t("posts:filter.candidateWas")}
                    <Select
                        value={currentItem.value === 1 ? "1" : "0"}
                        onValueChange={(value) => setValue(Number(value))}
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

export const HiveMimeFilterConditionChoiceValueViewer = observer(({ currentItem }: HiveMimeFilterConditionChoiceValuePickerProps) => {
    const { t } = useTranslation();

    return (
        <Label>
            {currentItem.value === 1
                ? t("posts:filter.candidateSelected", { name: currentItem.candidate?.name })
                : t("posts:filter.candidateNotSelected", { name: currentItem.candidate?.name })}
        </Label>
    );
});