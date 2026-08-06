import { Popover, PopoverAnchor, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { observer } from "mobx-react-lite";
import { useRef, useState, type ReactNode, type RefObject } from "react";
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
    children: ReactNode;
}

export const SelectChip = ({ value, onValueChange, placeholder, className, lockedClassName, disabled, children }: SelectChipProps) => (
    <Select value={value ?? ""} onValueChange={onValueChange} disabled={disabled}>
        <SelectTrigger className={cn(chipBase, "gap-1", value ? lockedClassName : "border-dashed text-muted-foreground", disabled && "opacity-60", className)}>
            <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>{children}</SelectContent>
    </Select>
);

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

interface PopoverChipProps {
    value?: ReactNode;
    placeholder?: string;
    className?: string;
    lockedClassName?: string;
    children: ReactNode;
}

export const PopoverChip = ({ value, placeholder, className, lockedClassName, children }: PopoverChipProps) => (
    <Popover>
        <PopoverTrigger asChild>
            <button
                type="button"
                className={cn(chipBase, "cursor-pointer", value ? lockedClassName : "border-dashed text-muted-foreground", className)}
            >
                {value ?? placeholder}
            </button>
        </PopoverTrigger>
        <PopoverContent align="start" className="w-auto">{children}</PopoverContent>
    </Popover>
);

interface ValuePopoverProps {
    trigger: ReactNode;
    children: ReactNode;
}

type VirtualRect = { left: number; top: number; right: number; bottom: number; width: number; height: number };

/**
 * A dialog-safe Radix Popover anchored to a virtual element whose rect is captured once when the
 * popover opens and frozen. Radix re-reads that rect on every update, so the popup never moves —
 * even though the value-chip trigger wraps and grows. The trigger remains the clickable element.
 */
export const ValuePopover = ({ trigger, children }: ValuePopoverProps) => {
    const [open, setOpen] = useState(false);
    const triggerRef = useRef<HTMLSpanElement>(null);
    const rectRef = useRef<VirtualRect>({ left: 0, top: 0, right: 0, bottom: 0, width: 0, height: 0 });
    const virtualRef = useRef({ getBoundingClientRect: () => rectRef.current });

    function handleOpenChange(next: boolean) {
        if (next && triggerRef.current) {
            const r = triggerRef.current.getBoundingClientRect();
            rectRef.current = { left: r.left, top: r.top, right: r.right, bottom: r.bottom, width: r.width, height: r.height };
        }
        setOpen(next);
    }

    return (
        <Popover open={open} onOpenChange={handleOpenChange}>
            <PopoverAnchor virtualRef={virtualRef as unknown as RefObject<{ getBoundingClientRect(): DOMRect }>} />
            <PopoverTrigger asChild>
                <span ref={triggerRef} className="inline-flex flex-wrap items-center gap-1 cursor-pointer">{trigger}</span>
            </PopoverTrigger>
            <PopoverContent align="start" className="w-auto">{children}</PopoverContent>
        </Popover>
    );
};
