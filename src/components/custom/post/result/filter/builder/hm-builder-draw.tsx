import { CellSelection, DrawPicker, Variant } from "@/components/custom/utility/draw-picker";
import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import { reaction } from "mobx";
import { useTranslation } from "react-i18next";
import { valueOperatorToInlineString } from "@/lib/utils";
import { InsideOperator } from "@/lib/vote-query";
import { Chip, DialogValueChip } from "./hm-builder-chip";
import { splitValues } from "../hm-condition-viewer";
import { HiveMimeFilterConditionEditorProps, useReportValidity } from "./hm-builder-editor";

export const DrawEditor = observer(({ currentItem, poll, candidate, onValidChange, isActive }: HiveMimeFilterConditionEditorProps) => {
    const { t } = useTranslation();
    const src = candidate?.mediaKeys?.find(key => !key.endsWith("thumbnail.webp"));
    const [cellSelection] = useState(() => new CellSelection(poll.rows!, poll.columns!, poll.maxVotesPerCandidate!));

    useEffect(() => {
        currentItem.valueOperator = InsideOperator;

        if (currentItem.value == null)
            return;

        const cellIndices = currentItem.value
            .split(",")
            .map(Number)
            .filter(index => Number.isInteger(index) && index >= 0);

        cellSelection.cells.forEach(cell => cell.value = 0);
        cellSelection.onCellsCount = 0;

        for (const cellIndex of cellIndices) {
            if (cellIndex < cellSelection.cells.length) {
                cellSelection.cells[cellIndex].value = 1;
                cellSelection.onCellsCount++;
            }
        }
    }, [currentItem, cellSelection]);

    useEffect(() => {
        const dispose = reaction(
            () => cellSelection.cells.map(cell => cell.value).join(","),
            (values) => {
                const cellIndices = values
                    .split(",")
                    .map(Number)
                    .map((value, index) => value > 0 ? index : null)
                    .filter((index): index is number => index != null);
                currentItem.value = cellIndices.join(",");
            }
        );
        return dispose;
    }, [cellSelection, currentItem]);

    useReportValidity(currentItem, onValidChange);
    const values = splitValues(currentItem.value);

    return (
        <>
            <Chip className="text-foreground">{valueOperatorToInlineString(InsideOperator)}</Chip>
            <DialogValueChip
                hasValue={currentItem.value != null && currentItem.value !== ""}
                trigger={values.length > 0
                    ? values.map(value => <Chip key={value} className="text-muted-blue">{value}</Chip>)
                    : <Chip filled={false} className="text-muted-foreground">{t("posts:filter.setValue")}</Chip>}
            >
                <DrawPicker variant={Variant.Draw} cellSelection={cellSelection} src={src!} />
            </DialogValueChip>
        </>
    );
});
