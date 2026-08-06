import { HiveMimeBulletItem } from "@/components/custom/utility/hm-bullet-item";
import { HiveMimeInlineSelectTrigger } from "@/components/custom/utility/hm-inline-select";
import { Select, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { observer } from "mobx-react-lite";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { HiveMimeCategoryTag } from "../../../vote/category/hm-category-poll-vote-category";
import { CandidateDto, PollDto, ValueOperator, FilterQuery } from "@/lib/Api";
import { valueOperatorToInlineString } from "@/lib/utils";
import { HiveMimeConditionViewer } from "../hm-condition-viewer";

interface HiveMimeFilterConditionCategoryValuePickerProps {
    currentItem: FilterQuery;
    candidate: CandidateDto;
    poll: PollDto;
}

export const HiveMimeFilterConditionCategoryValuePicker = observer(({ currentItem, candidate, poll }: HiveMimeFilterConditionCategoryValuePickerProps) => {
    const { t } = useTranslation();

    useEffect(() => {
        if (currentItem.value != null)
            return;

        currentItem.valueOperator = ValueOperator.Equals;
        currentItem.value = poll.categories![0].id!;
    }, [currentItem]);

    function setNegation(value: boolean) {
        currentItem.isNegated = value;
    }

    function setValue(value: string | null) {
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
                            onValueChange={(value) => setValue(value === "none" ? null : value)}
                        >
                            <HiveMimeInlineSelectTrigger>
                                <SelectValue />
                            </HiveMimeInlineSelectTrigger>
                            <SelectContent>
                                {poll.categories!.map((category) => (
                                    <SelectItem key={category.id} value={category.id!}>
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

export const HiveMimeFilterConditionCategoryValueViewer = observer(({ currentItem, candidate, poll }: HiveMimeFilterConditionCategoryValuePickerProps) => {
    const { t } = useTranslation();

    const values = currentItem.value == null
        ? [t("posts:filter.uncategorized")]
        : [<HiveMimeCategoryTag key="category" category={poll.categories!.find(c => c.id === currentItem.value)!} />];

    return (
        <HiveMimeConditionViewer
            pollName={poll.title}
            name={candidate.name}
            operator={valueOperatorToInlineString(ValueOperator.Equals)}
            negated={currentItem.isNegated}
            values={values}
        />
    );
});
