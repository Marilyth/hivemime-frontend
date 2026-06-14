import { useQuery } from "@tanstack/react-query";
import { HiveMimePollResultProps as HiveMimePollCandidateResultProps } from "./hm-poll-result";
import { api } from "@/lib/contexts";
import { HiveMimeViewCandidate } from "../hm-candidate";
import { numberToColorHex } from "@/lib/colors";
import { AnimatedBackground } from "../../utility/hm-animated-background";
import { useTranslation } from "react-i18next";
import { HiveMimeCategoryTag } from "../vote/category/hm-category-poll-vote-category";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { CandidateDistributionResultDto, CandidateDto, CandidationDistributionResultValueDto, CategoryDto, PollDto } from "@/lib/Api";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";


export function HiveMimeCategoryResult(props: HiveMimePollCandidateResultProps) {
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

  
  const categoryResultCandidates = props.poll.candidates!.map(c => {
    const candidateResult = data.data!.candidates!.find(rc => rc.id === c.id);
    const winningDistribution = candidateResult?.distribution?.reduce((prev, current) => (prev.voteCount! >= current.voteCount!) ? prev : current);
    
    return {
      candidate: c,
      candidateResult: candidateResult!,
      winningDistribution: winningDistribution
    };
  }).sort((a, b) => (a.winningDistribution?.value ?? 0) - (b.winningDistribution?.value ?? 0) ||
                    (b.winningDistribution?.voteCount ?? 0) - (a.winningDistribution?.voteCount ?? 0));

  return (
    <div className="flex flex-col gap-2">
      {categoryResultCandidates!.map((c, i) => {
        return <HiveMimeCategoryCandidateResult key={c.candidate.id} candidate={c.candidate} candidateResult={c.candidateResult} winningDistribution={c.winningDistribution} poll={props.poll}  />;
      })}
    </div>
  );
}

interface HiveMimeCategoryCandidateResultProps {
  candidate: CandidateDto;
  candidateResult: CandidateDistributionResultDto;
  winningDistribution: CandidationDistributionResultValueDto | undefined;
  poll: PollDto;
}

function HiveMimeCategoryCandidateResult(props: HiveMimeCategoryCandidateResultProps) {
  const { t } = useTranslation();
  const category = props.winningDistribution ? props.poll.categories!.find(cat => cat.value === props.winningDistribution?.value) : null;
  const [isAccordionOpen, setIsAccordionOpen] = useState(false);

  return (
    <Accordion key={props.candidate.id} type="single" collapsible className="border-1 rounded-md overflow-hidden"
      onValueChange={(v) => setIsAccordionOpen(v === "candidate")}>
      <AccordionItem value="candidate">
        <AccordionTrigger className="relative p-0 pl-2 py-1">
          <AnimatePresence>
            {props.winningDistribution && !isAccordionOpen &&
              <motion.div
                initial={{ opacity: 1 }}
                exit={{ opacity: 0 }} className="absolute inset-0">
                <AnimatedBackground colorSegments={[
                  {
                    color: numberToColorHex(category!.color!) + "77",
                    startAt: 0
                  },
                  {
                    color: numberToColorHex(category!.color!) + "20",
                    startAt: (props.winningDistribution.voteCount! / props.candidateResult.voteCount!)
                  },
                  {
                    color: "transparent",
                    startAt: (props.winningDistribution.voteCount! / props.candidateResult.voteCount!)
                  }
                ]} />
              </motion.div>
            }
          </AnimatePresence>

          <div className="flex flex-row gap-2 items-center w-full p-0! z-10">
            <HiveMimeViewCandidate candidate={props.candidate} />
            
            <div className="flex flex-col items-end text-muted-foreground ml-auto">
              {category && <HiveMimeCategoryTag category={category} />}
            </div>
          </div>
        </AccordionTrigger>
        <AccordionContent className="border-t-1 flex flex-col gap-1 py-2">
          {props.poll.categories!.map(cat => {
            const distribution = props.candidateResult?.distribution?.find(d => d.value === cat.value);
            const ratio = distribution ? (distribution.voteCount! / props.candidateResult!.voteCount!) : 0;

            return (
              <div key={cat.value} className="relative flex flex-row gap-2 items-center overflow-hidden px-2">
                <AnimatedBackground colorSegments={[
                  {
                    color: numberToColorHex(cat.color!) + "77",
                    startAt: 0
                  },
                  {
                    color: numberToColorHex(cat.color!) + "20",
                    startAt: ratio
                  },
                  {
                    color: "transparent",
                    startAt: ratio
                  }
                ]} />

                <HiveMimeCategoryTag category={cat} />
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