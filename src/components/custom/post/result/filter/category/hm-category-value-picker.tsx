import { HiveMimeBulletItem } from "@/components/custom/utility/hm-bullet-item";
import { HiveMimeInlineSelectTrigger } from "@/components/custom/utility/hm-inline-select";
import { Select, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { ValueOperator, VoteQuery } from "@/lib/query-builder";
import { observer } from "mobx-react-lite";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { HiveMimeCategoryTag } from "../../../vote/category/hm-category-poll-vote-category";
import { Label } from "@/components/ui/label";

interface HiveMimeFilterConditionCategoryValuePickerProps {
    currentItem: VoteQuery;
}

export const HiveMimeFilterConditionCategoryValuePicker = observer(({ currentItem }: HiveMimeFilterConditionCategoryValuePickerProps) => {
    const { t } = useTranslation();

    useEffect(() => {
        if (currentItem.value != null)
            return;

        currentItem.valueOperator = ValueOperator.Equals;
        currentItem.value = currentItem.poll!.minValue!;
    }, [currentItem]);

    function setNegation(value: boolean) {
        currentItem.isNegated = value;
    }

    function setValue(value: number | null) {
        currentItem.value = value;
    }

    return (
        <div className="flex-col gap-2">
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
                <div className="flex flex-col gap-4">
                    <div className="text-sm text-muted-foreground">
                        {t("posts:filter.categorizedAs")}
                        
                        <Select
                            value={currentItem.value?.toString() ?? "none"}
                            onValueChange={(value) => setValue(value === "none" ? null : Number(value))}
                        >
                            <HiveMimeInlineSelectTrigger>
                                <SelectValue />
                            </HiveMimeInlineSelectTrigger>
                            <SelectContent>
                                {currentItem.poll!.categories!.map((category) => (
                                    <SelectItem key={category.id} value={category.value!.toString()}>
                                        <HiveMimeCategoryTag category={category} />
                                    </SelectItem>
                                ))}
                                <SelectItem value="none">{t("enums:rankFilter.nothing")}</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </HiveMimeBulletItem>
        </div>
    );
});

export const HiveMimeFilterConditionCategoryValueViewer = observer(({ currentItem }: HiveMimeFilterConditionCategoryValuePickerProps) => {
    const { t } = useTranslation();

    return (
        <Label>
            {t(currentItem.isNegated ? "posts:filter.notCategorized" : "posts:filter.categorizedAsViewer", { name: currentItem.candidate?.name })}{" "}
            {currentItem.value == null
                ? t("posts:filter.uncategorized")
                : (
                <span className="inline-block align-middle">
                    <HiveMimeCategoryTag category={currentItem.poll!.categories!.find(c => c.value === currentItem.value)!} />
                </span>
            )}
        </Label>
    );
});
