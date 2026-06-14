import { useQuery } from "@tanstack/react-query";
import { HiveMimePollResultProps as HiveMimePollCandidateResultProps } from "./hm-poll-result";
import { api } from "@/lib/contexts";
import { HiveMimeViewCandidate } from "../hm-candidate";
import { AnimatedBackground } from "../../utility/hm-animated-background";
import { useTranslation } from "react-i18next";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { CandidateDistributionResultDto, CandidateDto, PollDto } from "@/lib/Api";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { hiveMimeRankIcon, hiveMimeRankIconColor } from "../../utility/hm-rank-icon";


export function HiveMimeRankResult(props: HiveMimePollCandidateResultProps) {
  const data = useQuery({
    queryKey: ["poll-result", props.poll.id, props.filter],
    queryFn: async () => {
      const r = await api.api.postDistributionResultList({ pollId: props.poll.id!, filter: props.filter });
      const existingCandidateIds = new Set(props.poll.candidates!.map(c => c.id));

      for (const candidateResult of r.data.candidates!) {
        if (!existingCandidateIds.has(candidateResult.id!)) {
          props.poll.candidates!.push({ id: candidateResult.id, name: candidateResult.name, isCustom: true } as CandidateDto);
        }
      }

      return r.data;
    },
    staleTime: 1000 * 60 * 5
  });

  if (!data.data)
    return (
      <div>
        Loading...
      </div>
    );

  const rankResultCandidates = props.poll.candidates!.map(c => {
    const candidateResult = data.data!.candidates!.find(rc => rc.id === c.id);
    const score = candidateResult ? candidateResult.distribution?.reduce((sum, d) => sum + (d.voteCount! * (1 + props.poll.maxValue! - d.value!)), 0) : 0;
    
    return {
      candidate: c,
      candidateResult: candidateResult!,
      score: score!
    };
  }).sort((a, b) => b.score! - a.score!);

  const totalScore = rankResultCandidates.reduce((sum, c) => sum + c.score!, 0);

  return (
    <div className="flex flex-col gap-2">
      {rankResultCandidates!.map((c, i) => {
        return <HiveMimeCategoryRankResult key={c.candidate.id} candidate={c.candidate} candidateResult={c.candidateResult}
        totalScore={totalScore} score={c.score} rank={i + 1} poll={props.poll} />;
      })}
    </div>
  );
}

interface HiveMimeCategoryRankResultProps {
  candidate: CandidateDto;
  candidateResult: CandidateDistributionResultDto;
  totalScore: number;
  score: number;
  rank: number;
  poll: PollDto;
}

function HiveMimeCategoryRankResult(props: HiveMimeCategoryRankResultProps) {
  const { t } = useTranslation();
  const resultCandidate = props.candidateResult;
  const [isAccordionOpen, setIsAccordionOpen] = useState(false);
  const color = hiveMimeRankIconColor(props.rank);
  const ratio = props.totalScore > 0 ? (props.score / props.totalScore) : 0;

  return (
    <Accordion key={props.candidate.id} type="single" collapsible className="border-1 rounded-md overflow-hidden"
      onValueChange={(v) => setIsAccordionOpen(v === "candidate")}>
      <AccordionItem value="candidate">
        <AccordionTrigger className="relative p-0 pl-2 py-1">
          <AnimatePresence>
            {!isAccordionOpen &&
              <motion.div
                initial={{ opacity: 1 }}
                exit={{ opacity: 0 }} className="absolute inset-0">
                <AnimatedBackground colorSegments={[
                  {
                    color: color + "77",
                    startAt: 0
                  },
                  {
                    color: color + "20",
                    startAt: ratio
                  },
                  {
                    color: "transparent",
                    startAt: ratio
                  }
                ]} />
              </motion.div>
            }
          </AnimatePresence>

          <div className="flex flex-row gap-2 items-center w-full p-0! z-10">
            <HiveMimeViewCandidate candidate={props.candidate} />
            
            <div className="flex flex-col items-end text-muted-foreground ml-auto">
              <div className="text-muted-foreground">
                {t("posts:result.score", { score: props.score })} 
              </div>
            </div>
          </div>
        </AccordionTrigger>
        <AccordionContent className="border-t-1 flex flex-col gap-1 py-2">
          {[...Array(props.poll.maxValue!).keys()].map(value => {
            const rank = value + 1;
            const distribution = resultCandidate?.distribution?.find(d => d.value === rank);
            const ratio = distribution ? (distribution.voteCount! / resultCandidate!.voteCount!) : 0;
            const color = hiveMimeRankIconColor(rank);

            return (
              <div key={value} className="relative flex flex-row gap-2 items-center overflow-hidden px-2">
                <AnimatedBackground colorSegments={[
                  {
                    color: color + "77",
                    startAt: 0
                  },
                  {
                    color: color + "20",
                    startAt: ratio
                  },
                  {
                    color: "transparent",
                    startAt: ratio
                  }
                ]} />

                <span className="w-6 text-center">{hiveMimeRankIcon(rank)}</span>
                <div className="flex flex-col items-end text-muted-foreground ml-auto">
                  {t("posts:result.votes", { count: distribution?.voteCount ?? 0 })}
                </div>
              </div>
            );
          })}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}