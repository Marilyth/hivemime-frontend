import type { CandidateDto, FilterQuery, PollDto } from "@/lib/Api";
import { useEffect, useRef } from "react";

export interface HiveMimeFilterConditionEditorProps {
    currentItem: FilterQuery;
    poll: PollDto;
    candidate: CandidateDto;
    onValidChange?: (valid: boolean) => void;
}

export function useReportValidity(currentItem: FilterQuery, onValidChange?: (valid: boolean) => void, extra: () => boolean = () => true) {
    useEffect(() => {
        const valid = currentItem.valueOperator != null
            && currentItem.value != null
            && currentItem.value !== ""
            && extra();
        onValidChange?.(valid);
    }, [currentItem, currentItem.valueOperator, currentItem.value, onValidChange, extra]);
}

/**
 * Generic "auto-select if there is exactly one option, else hide" rule for a selector chip.
 * Returns whether the chip should be hidden (zero or one options). When exactly one option exists,
 * `apply` is called with it. When none exist, nothing is applied.
 */
export function useAutoSingle(apply: (value: string) => void, options: (string | null | undefined)[]): boolean {
    const values = options.filter((o): o is string => o != null && o !== "");
    const count = values.length;
    const single = count === 1 ? values[0] : null;

    const applyRef = useRef(apply);
    applyRef.current = apply;

    useEffect(() => {
        if (count === 1 && single != null)
            applyRef.current(single);
    }, [count, single]);

    return count <= 1;
}
