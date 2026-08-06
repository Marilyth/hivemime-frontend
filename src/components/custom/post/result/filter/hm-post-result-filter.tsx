import { observer } from "mobx-react-lite";
import { PostDto, FilterQueryGroup } from "@/lib/Api";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { Plus } from "lucide-react";
import { HiveMimeFilterQueryGroup } from "./hm-vote-query-group";
import { HiveMimeBulletItem } from "@/components/custom/utility/hm-bullet-item";
import { LayoutGroup } from "framer-motion";


interface HiveMimePostResultFilterProps {
    post: PostDto;
    builder: FilterQueryGroup;
    onAddCondition: () => void;
}

export const HiveMimePostResultFilter = observer(({ post, builder, onAddCondition }: HiveMimePostResultFilterProps) => {
    const { t } = useTranslation();

    return (
        <div className="flex flex-col">
            <LayoutGroup>
                {builder.children!.length > 0 &&
                    <div className="border rounded mb-2 text-sm text-muted-foreground ">
                        <HiveMimeFilterQueryGroup post={post} group={builder} isFirstItem={true} ancestors={[]} />
                    </div>
                }
            </LayoutGroup>

            {builder.children!.length > 1 &&
                <HiveMimeBulletItem className="mb-2">
                    <span className="text-muted-foreground text-sm">{t("posts:filter.reorderHint")}</span>
                </HiveMimeBulletItem>
            }

            <Button variant="outline" onClick={onAddCondition}>
                <Plus />
                {t("posts:filter.addCondition")}
            </Button>
        </div>
    );
});
