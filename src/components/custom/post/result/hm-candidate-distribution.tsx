import { PollDto, CandidateDto, CandidateDistributionDto, Api, PollType } from "@/lib/Api";
import { ReactNode, useEffect, useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { HiveMimeScoreDistributionResult } from "./score/hm-score-result";
import { HiveMimeRankDistributionResult } from "./rank/hm-rank-result";
import { HiveMimeCategoryDistributionResult } from "./category/hm-category-result";
import { api } from "@/lib/contexts";

export interface HiveMimeDistributionResultTypeProps {
    poll: PollDto;
    candidateResult: CandidateDistributionDto[];
}

export interface HiveMimeDistributionResultProps {
    poll: PollDto;
    candidate: CandidateDto;
    onClose?: () => void;
}

export function HiveMimeDistributionResult(props: HiveMimeDistributionResultProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [candidateDistribution, setCandidateDistribution] = useState<CandidateDistributionDto[] | null>(null);

  const pollMapping: { [key in PollType]: ReactNode } =
  {
    [PollType.Choice]: <div>Empty</div>,
    [PollType.Score]: <HiveMimeScoreDistributionResult poll={props.poll} candidateResult={candidateDistribution!} />,
    [PollType.Rank]: <HiveMimeRankDistributionResult poll={props.poll} candidateResult={candidateDistribution!} />,
    [PollType.Category]: <HiveMimeCategoryDistributionResult poll={props.poll} candidateResult={candidateDistribution!} />,
  };

  async function fetchCandidateDistributionAsync(candidateId: number) {
    setIsLoading(true);

    try {
        const response = await api.api.postDistributionList({ candidateId: candidateId });
        setCandidateDistribution(response.data);
    }
    finally {
        setIsLoading(false);
    }
  }

  useEffect(() => {
    if (props.candidate === null) {
        setCandidateDistribution(null);
    }
    else {
        fetchCandidateDistributionAsync(props.candidate.id!);
    }
  }, [props.candidate]);

  return (
    <div>
        <Dialog open={props.candidate !== null} onOpenChange={props.onClose}>
            <DialogContent>
            <DialogTitle>
                Vote distribution for <span className="text-honey-brown">{props.candidate?.name}</span>
            </DialogTitle>
            <span className="leading-tight">
                This is how users voted on each of the options for the candidate.
            </span>
                {isLoading ? (
                    <div>Loading...</div>
                ) : (
                    candidateDistribution !== null && pollMapping[props.poll.pollType!]
                )}
            </DialogContent>
        </Dialog>
    </div>
  );
}
