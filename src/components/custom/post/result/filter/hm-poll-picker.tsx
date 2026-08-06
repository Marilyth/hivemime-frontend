import { HiveMimeHoverCard } from "@/components/custom/utility/hm-hover-card";
import { useHiveMimeStep } from "@/components/custom/utility/hm-multistep-ui";
import { HiveMimePollTypeIcon } from "@/components/custom/utility/hm-poll-type-icon";
import { Label } from "@/components/ui/label";
import { PollDto, PostDto } from "@/lib/Api";
import { getReferenceId } from "@/lib/utils";
import { observer } from "mobx-react-lite";
import { useTranslation } from "react-i18next";


interface HiveMimeFilterConditionPollPickerProps {
    post: PostDto;
    onPollPicked: (poll: PollDto) => void;
}

export const HiveMimeFilterConditionPollPicker = observer(({ post, onPollPicked }: HiveMimeFilterConditionPollPickerProps) => {
    const { t } = useTranslation();
    const stepContext = useHiveMimeStep();

    function handlePollPicked(poll: PollDto) {
        onPollPicked(poll);
        stepContext.next();
    }

    return (
        <div className="flex flex-col gap-2">
            <div className="text-sm text-muted-foreground mb-4">
                {t("posts:filter.pickPoll")}
            </div>

            <div className="flex flex-col gap-2">
                {post.polls!.map((poll) => (
                    <HiveMimeHoverCard key={getReferenceId(poll)} onClick={() => handlePollPicked(poll)} className="hover:text-honey-brown ">
                        <div className="flex flex-row gap-4 items-center p-1">
                            <HiveMimePollTypeIcon answerType={poll.pollType!} className="text-honey-brown w-6 h-6 self-start" />
                            <Label className="text-muted-foreground font-bold">
                                {poll.title}
                            </Label>
                        </div>
                    </HiveMimeHoverCard>
                ))}
            </div>
        </div>
    );
});
