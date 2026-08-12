import { observer } from "mobx-react-lite";
import { CandidateDto, FilterQueryBase, PollDto, PostDto, FilterQueryGroup } from "@/lib/Api";
import { useTranslation } from "react-i18next";
import { HiveMimeFilterQueryGroup } from "./hm-vote-query-group";
import { HiveMimeBulletItem } from "@/components/custom/utility/hm-bullet-item";
import { LayoutGroup } from "framer-motion";
import { HiveMimeFilterConditionOverflowBuilder } from "./hm-condition-builder";
import { Button } from "@/components/ui/button";
import { canConvertToAST, deepChildCount, queryToBalancedAST } from "@/lib/vote-query";
import { Network } from "lucide-react";


interface HiveMimePostResultFilterProps {
    post: PostDto;
    builder: FilterQueryGroup;
    onAddCondition: (result: FilterQueryBase) => void;
    lockedPoll?: PollDto;
    lockedCandidate?: CandidateDto;
}

export const HiveMimePostResultFilter = observer(({ post, builder, onAddCondition, lockedPoll, lockedCandidate }: HiveMimePostResultFilterProps) => {
    const { t } = useTranslation();

    return (
        <div className="flex flex-col gap-2">
            {canConvertToAST(builder) && 
                <Button variant="link" size="sm" onClick={() => queryToBalancedAST(builder)} className="h-auto w-fit ml-auto"><Network/> Convert to AST</Button>
            }

            <LayoutGroup>
                {builder.children!.length > 0 &&
                    <div className="border rounded text-sm text-muted-foreground ">
                        <HiveMimeFilterQueryGroup post={post} group={builder} isFirstItem={true} ancestors={[]} />
                    </div>
                }
            </LayoutGroup>

            {deepChildCount(builder) > 2 &&
                <HiveMimeBulletItem>
                    <span className="text-muted-foreground text-sm">{t("posts:filter.reorderHint")}</span>
                </HiveMimeBulletItem>
            }

            <HiveMimeFilterConditionOverflowBuilder
                post={post}
                onAddCondition={onAddCondition}
                lockedPoll={lockedPoll}
                lockedCandidate={lockedCandidate}
            />
        </div>
    );
});
