import { observer } from "mobx-react-lite";
import { CandidateDto, FilterQuery, PollDto, PostDto, FilterQueryGroup } from "@/lib/Api";
import { useTranslation } from "react-i18next";
import { HiveMimeFilterQueryGroup } from "./hm-vote-query-group";
import { HiveMimeBulletItem } from "@/components/custom/utility/hm-bullet-item";
import { LayoutGroup } from "framer-motion";
import { HiveMimeFilterConditionOverflowBuilder } from "./hm-condition-builder";


interface HiveMimePostResultFilterProps {
    post: PostDto;
    builder: FilterQueryGroup;
    onAddCondition: (result: FilterQuery) => void;
    lockedPoll?: PollDto;
    lockedCandidate?: CandidateDto;
}

export const HiveMimePostResultFilter = observer(({ post, builder, onAddCondition, lockedPoll, lockedCandidate }: HiveMimePostResultFilterProps) => {
    const { t } = useTranslation();

    return (
        <div className="flex flex-col gap-2">
            <LayoutGroup>
                {builder.children!.length > 0 &&
                    <div className="border rounded text-sm text-muted-foreground ">
                        <HiveMimeFilterQueryGroup post={post} group={builder} isFirstItem={true} ancestors={[]} />
                    </div>
                }
            </LayoutGroup>

            {builder.children!.length > 2 &&
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
