import { HiveMimeBulletItem } from "@/components/custom/utility/hm-bullet-item";
import { CellSelection, DrawPicker, Variant } from "@/components/custom/utility/draw-picker";
import { HiveMimeInlineSelectTrigger } from "@/components/custom/utility/hm-inline-select";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { DrawValueOperator, VoteQuery } from "@/lib/query-builder";
import { reaction } from "mobx";
import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import { Trans, useTranslation } from "react-i18next";

interface HiveMimeFilterConditionDrawValuePickerProps {
    currentItem: VoteQuery;
}

function drawValueOperatorToInlineString(operator: DrawValueOperator, t: (key: string) => string) {
    switch (operator) {
        case DrawValueOperator.Inside:
            return t("enums:drawValueOperator.inside");
        case DrawValueOperator.Outside:
            return t("enums:drawValueOperator.outside");
        case DrawValueOperator.ExclusiveInside:
            return t("enums:drawValueOperator.exclusiveInside");
        case DrawValueOperator.ExclusiveOutside:
            return t("enums:drawValueOperator.exclusiveOutside");
    }
}

export const HiveMimeFilterConditionDrawValuePicker = observer(({ currentItem }: HiveMimeFilterConditionDrawValuePickerProps) => {
    const { t } = useTranslation();
    const poll = currentItem.poll!;
    const src = currentItem.candidate?.mediaKeys?.find(key => !key.endsWith("thumbnail.webp"));
    const [cellSelection] = useState(() => new CellSelection(poll.rows!, poll.columns!, poll.maxVotesPerCandidate!));

    useEffect(() => {
        if (currentItem.valueOperator != null)
            return;

        currentItem.valueOperator = DrawValueOperator.Inside;
    }, [currentItem]);

    useEffect(() => {
        if (currentItem.value == null)
            return;

        const cellIndices = currentItem.value
            .split(",")
            .map(index => index.trim())
            .filter(index => index.length > 0)
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

    function setOperator(operator: DrawValueOperator) {
        currentItem.valueOperator = operator;
    }

    return (
        <div className="flex flex-col gap-2">
            <HiveMimeBulletItem>
                <span className="text-sm text-muted-foreground">
                    <Trans
                        i18nKey="posts:filter.drawCellsWere"
                        components={{
                            select: (
                                <Select
                                    value={currentItem.valueOperator?.toString() ?? DrawValueOperator.Inside}
                                    onValueChange={(value) => setOperator(value as DrawValueOperator)}
                                >
                                    <HiveMimeInlineSelectTrigger>
                                        <SelectValue />
                                    </HiveMimeInlineSelectTrigger>
                                    <SelectContent>
                                        {Object.values(DrawValueOperator).map((operator) => (
                                            <SelectItem key={operator} value={operator}>
                                                {drawValueOperatorToInlineString(operator, t)}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            ),
                        }}
                    />
                </span>
            </HiveMimeBulletItem>

            <DrawPicker variant={Variant.Draw} cellSelection={cellSelection} src={src!} />
        </div>
    );
});

export const HiveMimeFilterConditionDrawValueViewer = observer(({ currentItem }: HiveMimeFilterConditionDrawValuePickerProps) => {
    const { t } = useTranslation();
    const operator = (currentItem.valueOperator ?? DrawValueOperator.Inside) as DrawValueOperator;
    const cellCount = (currentItem.value ?? "")
        .split(",")
        .filter(index => index.trim().length > 0)
        .length;

    return (
        <Label>
            {t("posts:filter.drawViewer", {
                name: currentItem.candidate?.name,
                operator: drawValueOperatorToInlineString(operator, t),
                count: cellCount,
            })}
        </Label>
    );
});
