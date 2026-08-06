import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";

interface HiveMimeConditionViewerProps {
    pollName?: ReactNode;
    name: ReactNode;
    operator: ReactNode;
    values: ReactNode[];
    negated?: boolean;
    subValue?: ReactNode;
}

const box = "rounded-md border px-2 py-0.5 text-sm whitespace-nowrap";

export const HiveMimeConditionViewer = ({ pollName, name, operator, values, negated, subValue }: HiveMimeConditionViewerProps) => {
    const { t } = useTranslation();

    return (
        <div className="flex flex-wrap items-center gap-1 overflow-x-auto">
            {pollName != null && <span className={`${box} text-muted-purple`}>{pollName}</span>}
            <span className={`${box} text-honey-brown`}>{name}</span>
            {subValue != null && <span className={`${box} text-muted-green`}>{subValue}</span>}
            {negated && <span className={`${box} text-failure`}>{t("common:not")}</span>}
            <span className={`${box} text-foreground`}>{operator}</span>
            {values.map((value, index) => (
                <span key={index} className={`${box} text-muted-blue`}>{value}</span>
            ))}
        </div>
    );
};

export function splitValues(value?: string | null): string[] {
    return (value ?? "").split(",").map(s => s.trim()).filter(s => s.length > 0);
}
