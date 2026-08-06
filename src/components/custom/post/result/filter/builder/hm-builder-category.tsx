import { observer } from "mobx-react-lite";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { ValueOperator } from "@/lib/Api";
import { SelectItem } from "@/components/ui/select";
import { HiveMimeCategoryTag } from "@/components/custom/post/vote/category/hm-category-poll-vote-category";
import { valueOperatorToInlineString } from "@/lib/utils";
import { Chip, SelectChip } from "./hm-builder-chip";
import { HiveMimeFilterConditionEditorProps, useReportValidity, useAutoSingle } from "./hm-builder-editor";

export const CategoryEditor = observer(({ currentItem, poll, onValidChange }: HiveMimeFilterConditionEditorProps) => {
    const { t } = useTranslation();

    useEffect(() => {
        if (currentItem.valueOperator == null)
            currentItem.valueOperator = ValueOperator.Equals;
    }, [currentItem]);

    const categories = poll.categories ?? [];
    const hideValue = useAutoSingle((value) => currentItem.value = value, categories.map(c => c.id ?? null));

    useReportValidity(currentItem, onValidChange);

    return (
        <>
            <Chip className="text-foreground">{valueOperatorToInlineString(ValueOperator.Equals)}</Chip>
            {!hideValue && (
                <SelectChip
                    value={currentItem.value ?? "none"}
                    onValueChange={(value) => currentItem.value = value === "none" ? null : value}
                    lockedClassName="text-muted-blue"
                    placeholder={t("posts:filter.setValue")}
                >
                    {categories.map(category => (
                        <SelectItem key={category.id} value={category.id!}>
                            <HiveMimeCategoryTag category={category} />
                        </SelectItem>
                    ))}
                    <SelectItem value="none">{t("enums:rankFilter.nothing")}</SelectItem>
                </SelectChip>
            )}
        </>
    );
});
