import { observer } from "mobx-react-lite";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { ValueOperator } from "@/lib/Api";
import { valueOperatorToInlineString } from "@/lib/utils";
import { Chip } from "./hm-builder-chip";
import { HiveMimeFilterConditionEditorProps, useReportValidity } from "./hm-builder-editor";

export const ChoiceEditor = observer(({ currentItem, onValidChange }: HiveMimeFilterConditionEditorProps) => {
    const { t } = useTranslation();

    useEffect(() => {
        currentItem.valueOperator = ValueOperator.Equals;
        currentItem.value = "1";
    }, [currentItem]);

    useReportValidity(currentItem, onValidChange);

    return (
        <>
            <Chip className="text-foreground">{valueOperatorToInlineString(ValueOperator.Equals)}</Chip>
            <Chip className="text-muted-blue">{t("enums:selection.selected")}</Chip>
        </>
    );
});
