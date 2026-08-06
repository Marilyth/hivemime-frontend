import { Select, SelectContent, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { observer } from "mobx-react-lite";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { useTranslation } from "react-i18next";
import type { FilterQuery } from "@/lib/Api";

export const chipBase = "rounded-md border px-2 py-1 text-sm whitespace-nowrap inline-flex items-center justify-center h-9";

interface ChipProps {
    className?: string;
    children?: ReactNode;
    filled?: boolean;
}

export const Chip = ({ className, filled, children }: ChipProps) => (
    <span className={cn(chipBase, filled === false && "border-dashed text-muted-foreground", className)}>{children}</span>
);

interface SelectChipProps {
    value?: string;
    onValueChange?: (value: string) => void;
    placeholder?: string;
    className?: string;
    lockedClassName?: string;
    disabled?: boolean;
    /** When true, auto-opens this dropdown on mount while it has no value (used while the builder is "active"). */
    autoOpen?: boolean;
    /** Overrides the value-based "has a value" check (e.g. when a sentinel like "none" is used). */
    hasValue?: boolean;
    children: ReactNode;
}

export const SelectChip = ({ value, onValueChange, placeholder, className, lockedClassName, disabled, autoOpen, hasValue, children }: SelectChipProps) => {
    const [open, setOpen] = useState(false);
    const dismissedRef = useRef(false);
    const effectiveHasValue = hasValue ?? (value != null && value !== "");

    useEffect(() => {
        if (!effectiveHasValue)
            dismissedRef.current = false;
    }, [effectiveHasValue]);

    useEffect(() => {
        if (autoOpen && !effectiveHasValue && !dismissedRef.current)
            setOpen(true);
    }, [autoOpen, effectiveHasValue]);

    function handleOpenChange(next: boolean) {
        dismissedRef.current = !next;
        setOpen(next);
    }

    return (
        <Select value={value ?? ""} onValueChange={onValueChange} disabled={disabled} open={open} onOpenChange={handleOpenChange}>
            <SelectTrigger className={cn(chipBase, "gap-1", value ? lockedClassName : "border-dashed text-muted-foreground", disabled && "opacity-60", className)}>
                <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>{children}</SelectContent>
        </Select>
    );
};

interface ToggleChipProps {
    active: boolean;
    onActive: (active: boolean) => void;
    activeClassName?: string;
    inactiveClassName?: string;
    className?: string;
    children: ReactNode;
}

export const ToggleChip = ({ active, onActive, activeClassName, inactiveClassName, className, children }: ToggleChipProps) => (
    <button
        type="button"
        onClick={() => onActive(!active)}
        className={cn(chipBase, "cursor-pointer", active ? activeClassName : inactiveClassName, className)}
    >
        {children}
    </button>
);

export const NegationChip = observer(({ currentItem }: { currentItem: FilterQuery }) => {
    const { t } = useTranslation();
    const negated = currentItem.isNegated === true;
    return (
        <ToggleChip
            active={negated}
            onActive={(active) => currentItem.isNegated = active}
            activeClassName="text-failure"
            inactiveClassName="text-muted-foreground opacity-50 border-dashed"
        >
            {t("common:not")}
        </ToggleChip>
    );
});

interface DialogValueChipProps {
    trigger: ReactNode;
    autoOpen?: boolean;
    hasValue?: boolean;
    children: ReactNode;
}

export const DialogValueChip = ({ trigger, autoOpen, hasValue, children }: DialogValueChipProps) => {
    const { t } = useTranslation();
    const [open, setOpen] = useState(false);

    useEffect(() => {
        if (autoOpen && !hasValue)
            setOpen(true);
    }, [autoOpen, hasValue]);

    return (
        <>
            <button type="button" onClick={() => setOpen(true)} className="inline-flex flex-wrap items-center gap-1 cursor-pointer">
                {trigger}
            </button>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="w-auto">
                    <span className="text-sm text-muted-foreground">{t("posts:filter.pickValuePrompt")}</span>
                    <div className="mt-1">{children}</div>
                    <div className="mt-3 flex justify-end">
                        <Button type="button" size="sm" onClick={() => setOpen(false)}>{t("common:submit")}</Button>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
};
