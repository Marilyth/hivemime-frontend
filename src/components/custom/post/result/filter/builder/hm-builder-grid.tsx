import { CellSelection } from "@/components/custom/utility/cell-selection";
import { GridPicker, Variant } from "@/components/custom/utility/grid-picker";
import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import { reaction } from "mobx";
import { useTranslation } from "react-i18next";
import { SubProperty, ValueOperator } from "@/lib/Api";
import { valueOperatorToInlineString } from "@/lib/utils";
import { CellSubProperty, InsideOperator } from "@/lib/vote-query";
import { SelectItem } from "@/components/ui/select";
import { Chip, DialogValueChip, SelectChip } from "./hm-builder-chip";
import { splitValues } from "../hm-condition-viewer";
import { HiveMimeFilterConditionEditorProps, useReportValidity } from "./hm-builder-editor";

const ROW_COLUMN_OPERATORS = [ValueOperator.Equals, ValueOperator.Greater, ValueOperator.GreaterEquals, ValueOperator.Less, ValueOperator.LessEquals];

export const GridEditor = observer(({ currentItem, poll, candidate, onValidChange, isActive }: HiveMimeFilterConditionEditorProps) => {
    const { t } = useTranslation();
    const src = candidate?.mediaKeys?.find(key => !key.endsWith("thumbnail.webp"));
    const [subValue, setSubValue] = useState<SubProperty | null>(currentItem.subProperty ?? (currentItem.value?.includes(":") ? CellSubProperty : null));
    const [cellSelection] = useState(() => new CellSelection(poll.rows!, poll.columns!, poll.maxVotesPerCandidate!));

    const subValueOptions: SubProperty[] = [CellSubProperty, SubProperty.Row, SubProperty.Column];

    useEffect(() => {
        if (subValue !== CellSubProperty)
            return;

        currentItem.valueOperator = InsideOperator;

        if (currentItem.value == null)
            return;

        for (let row = 0; row < cellSelection.rows; row++)
            for (let col = 0; col < cellSelection.cols; col++)
                cellSelection.viewCells[row][col].value = 0;
        cellSelection.onCellsCount = 0;

        for (const part of currentItem.value.split(",")) {
            const [row, col] = part.split(":").map(Number);

            if (Number.isInteger(row) && Number.isInteger(col)
                && row >= 0 && row < cellSelection.rows
                && col >= 0 && col < cellSelection.cols) {
                cellSelection.viewCells[row][col].value = 1;
                cellSelection.onCellsCount++;
            }
        }
    }, [currentItem, cellSelection, subValue]);

    useEffect(() => {
        if (subValue !== CellSubProperty)
            return;

        const dispose = reaction(
            () => cellSelection.viewCells.map(row => row.map(cell => cell.value).join(",")).join(";"),
            () => {
                const selected: string[] = [];

                for (let row = 0; row < cellSelection.rows; row++)
                    for (let col = 0; col < cellSelection.cols; col++)
                        if (cellSelection.viewCells[row][col].value > 0)
                            selected.push(`${row}:${col}`);

                currentItem.value = selected.length > 0 ? selected.join(",") : null;
            }
        );
        return dispose;
    }, [cellSelection, currentItem, subValue]);

    function setProperty(nextSubValue: SubProperty) {
        currentItem.subProperty = nextSubValue;
        setSubValue(nextSubValue);
        currentItem.valueOperator = undefined;
        currentItem.value = null;
    }

    function setOperator(operator: ValueOperator) {
        currentItem.valueOperator = operator;
        currentItem.value = null;
    }

    const rowOptions = [...Array(poll.rows ?? 0).keys()].map(String);
    const colOptions = [...Array(poll.columns ?? 0).keys()].map(String);

    useReportValidity(currentItem, onValidChange);

    const showRest = currentItem.valueOperator != null;
    const cellValues = currentItem.value ? splitValues(currentItem.value) : [];

    return (
        <>
            <SelectChip
                autoOpen={isActive}
                value={subValue ?? ""}
                onValueChange={(value) => setProperty(value as SubProperty)}
                lockedClassName="text-muted-green"
                placeholder={t("posts:filter.selectSubValue")}
            >
                {subValueOptions.map(sv => (
                    <SelectItem key={sv} value={sv}>{t(`posts:filter.gridSub${sv}`)}</SelectItem>
                ))}
            </SelectChip>
            {subValue != null && (
                subValue === CellSubProperty ? (
                    <DialogValueChip
                        autoOpen={isActive}
                        hasValue={currentItem.value != null && currentItem.value !== ""}
                        trigger={cellValues.length > 0
                            ? cellValues.map(value => <Chip key={value} className="text-muted-blue">{value}</Chip>)
                            : <Chip filled={false} className="text-muted-foreground">{t("posts:filter.setValue")}</Chip>}
                    >
                        <GridPicker variant={Variant.Grid} cellSelection={cellSelection} src={src!} />
                    </DialogValueChip>
                ) : (
                    <>
                        <SelectChip
                            autoOpen={isActive}
                            value={currentItem.valueOperator}
                            onValueChange={(value) => setOperator(value as ValueOperator)}
                            lockedClassName="text-foreground"
                            placeholder={t("posts:filter.selectOperator")}
                        >
                            {ROW_COLUMN_OPERATORS.map(op => (
                                <SelectItem key={op} value={op}>{valueOperatorToInlineString(op)}</SelectItem>
                            ))}
                        </SelectChip>
                        {showRest && (
                            <SelectChip
                                autoOpen={isActive}
                                value={currentItem.value ?? ""}
                                onValueChange={(value) => currentItem.value = value}
                                lockedClassName="text-muted-blue"
                                placeholder={t("posts:filter.setValue")}
                            >
                                {(subValue === SubProperty.Row ? rowOptions : colOptions).map(option => (
                                    <SelectItem key={option} value={option}>{option}</SelectItem>
                                ))}
                            </SelectChip>
                        )}
                    </>
                )
            )}
        </>
    );
});
