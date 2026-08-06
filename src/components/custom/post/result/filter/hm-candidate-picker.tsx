import { HiveMimeHoverCard } from "@/components/custom/utility/hm-hover-card";
import { useHiveMimeStep } from "@/components/custom/utility/hm-multistep-ui";
import { CandidateDto, PollDto } from "@/lib/Api";
import { getReferenceId } from "@/lib/utils";
import { observer } from "mobx-react-lite";
import { useTranslation } from "react-i18next";
import { HiveMimeViewCandidate } from "../../hm-candidate";


interface HiveMimeFilterConditionCandidatePickerProps {
    poll: PollDto;
    onCandidatePicked: (candidate: CandidateDto) => void;
}

export const HiveMimeFilterConditionCandidatePicker = observer(({ poll, onCandidatePicked }: HiveMimeFilterConditionCandidatePickerProps) => {
    const { t } = useTranslation();
    const stepContext = useHiveMimeStep();

    function handleCandidatePicked(candidate: CandidateDto) {
        onCandidatePicked(candidate);
        stepContext.next();
    }

    return (
        <div className="flex flex-col gap-2">
            <div className="text-sm text-muted-foreground mb-4">
                {t("posts:filter.pickCandidate")}
            </div>

            <div className="flex flex-col gap-2">
                {poll.candidates!.map((candidate) => (
                    <HiveMimeHoverCard key={getReferenceId(candidate)} onClick={() => handleCandidatePicked(candidate)} className="hover:text-honey-brown ">
                        <HiveMimeViewCandidate candidate={candidate} />
                    </HiveMimeHoverCard>
                ))}
            </div>
        </div>
    );
});
