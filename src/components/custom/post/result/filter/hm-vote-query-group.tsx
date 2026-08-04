import { BooleanOperator, PostDto, FilterQuery, FilterQueryGroup } from "@/lib/Api";
import { isFilterQueryGroup } from "@/lib/vote-query";
import { observer } from "mobx-react-lite";
import { HiveMimeFilterQuery } from "./hm-vote-query";
import { Select, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { HiveMimeInlineSelectTrigger } from "@/components/custom/utility/hm-inline-select";
import { HiveMimeDraggable } from "@/components/custom/utility/hm-draggable";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { getReferenceId } from "@/lib/utils";


type HiveMimeFilterQueryGroupProps = {
    ancestors: FilterQueryGroup[];
    group: FilterQueryGroup;
    isFirstItem: boolean;
    onMoved?: () => void;
    post: PostDto;
};

export const HiveMimeFilterQueryGroup = observer(({ ancestors, group, isFirstItem, onMoved, post }: HiveMimeFilterQueryGroupProps) => {
    const { t } = useTranslation();
    const newAncestors: FilterQueryGroup[] = useMemo(() => [...ancestors, group], [ancestors, group]);

    function setLeftOperator(value: BooleanOperator) {
        group.leftOperator = value;
    }

    /**
     * Simplifies and cleans up the query group recursively by removing empty groups and collapsing groups with only 1 element.
     */
    function cleanUpGroup(group: FilterQueryGroup) {
        // Root will handle this. Trickle up.
        if (!isRoot()){
            onMoved?.();
            return;
        }

        for (let i = group.children!.length - 1; i >= 0; i--) {
            const child = group.children![i];
            
            if (isFilterQueryGroup(child)) {
                cleanUpGroup(child);

                // Adopt the child if there is only 1 left or it is my only child.
                if (child.children!.length == 1 || group.children!.length == 1)
                    group.children!.splice(i, 1, ...child.children!);

                // Remove the group if it is empty.
                else if (child.children!.length == 0)
                    group.children!.splice(i, 1);
            }
        }
    }

    function isRoot() {
        return ancestors.length == 0;
    }

    function isNotAncestor(draggable: unknown): boolean {
        return !(isFilterQueryGroup(draggable) &&
                 ancestors.includes(draggable as FilterQueryGroup));
    }
    
    function getParent() {
        return ancestors[ancestors.length - 1];
    }

    return (
        <motion.div layout
                      layoutId={getReferenceId(group)}
                      key={getReferenceId(group)}
                      transition={{ duration: 0.2 }}>
            <HiveMimeDraggable className={`flex flex-col gap-2 ${!isRoot() ? "my-2" : ""}`} canDrop={isNotAncestor} isDraggable={!isRoot()}
                isDropArea={!isRoot()} allowedZones={["top", "bottom"]} dataList={getParent()?.children ?? []} data={group} onDropped={onMoved}>
                {!isFirstItem && (
                    <Select
                        value={group.leftOperator}
                        onValueChange={(value) => setLeftOperator(value as BooleanOperator)}
                    >
                        <HiveMimeInlineSelectTrigger className="p-0">
                            <SelectValue />
                        </HiveMimeInlineSelectTrigger>
                        <SelectContent>
                            <SelectItem value={BooleanOperator.And}>{t("enums:queryOperator.and")}</SelectItem>
                            <SelectItem value={BooleanOperator.Or}>{t("enums:queryOperator.or")}</SelectItem>
                        </SelectContent>
                    </Select>
                )}

                <div className={`${!isRoot() ? "mx-2 border border-l-3 border-b-3 rounded bg-muted/30" : ""}`}>
                    {group.children!.map((item, index) => {
                        if (isFilterQueryGroup(item)) {
                            return <HiveMimeFilterQueryGroup key={index} group={item} isFirstItem={index == 0} onMoved={() => cleanUpGroup(group)} ancestors={newAncestors} post={post} />;
                        }

                        const query = item as FilterQuery;
                        return <HiveMimeFilterQuery key={index} currentItem={query} isFirstItem={index == 0} onMoved={() => cleanUpGroup(group)} ancestors={newAncestors} post={post} />;
                    })}
                </div>
            </HiveMimeDraggable>
        </motion.div>
    );
});
