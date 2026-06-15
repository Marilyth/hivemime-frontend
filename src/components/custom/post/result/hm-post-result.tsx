import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { observer } from "mobx-react-lite";
import { PostDto } from "@/lib/Api";
import { Button } from "@/components/ui/button";
import { Vote, Filter } from "lucide-react";
import { Accordion } from "@/components/ui/accordion";
import { HiveMimePollResult } from "./hm-poll-result";
import { HiveMimePostResultFilter } from "./filter/hm-post-result-filter";
import { VoteQueryGroup } from "@/lib/query-builder";

interface HiveMimePostResultProps {
  post: PostDto;
  requestVote?: () => void;
  footer: React.ReactNode;
}

export const HiveMimePostResult = observer(({ post, requestVote, footer }: HiveMimePostResultProps) => {
  const { t } = useTranslation();
  const [filterOpen, setFilterOpen] = useState(false);
  const queryBuilder: VoteQueryGroup = useMemo(() => 
    new VoteQueryGroup(),
    []
  );

  function filterFinished() {
    setFilterOpen(false);
  }

  return (
    <div>
      <HiveMimePostResultFilter post={post} builder={queryBuilder} isOpen={filterOpen} onFinished={filterFinished} />
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-center px-2 rounded-md">
          <span className="font-semibold">
            {t("posts:result.results")}
            <span className="font-normal text-sm text-muted-foreground ml-2">
              {t("posts:result.votes", { count: post.voteCount ?? 0 })}
            </span>
          </span>
          <Button variant="link" onClick={() => setFilterOpen(true)}>
            <Filter />
            {t("posts:result.filterVotes")}
          </Button>
        </div>
        
        <Accordion type="single" collapsible className="border rounded-md overflow-hidden">
          {post.polls!.map((poll, index) => (
            <HiveMimePollResult key={index} poll={poll} filter={queryBuilder.toString()} />
          ))}
        </Accordion>

        <div className="flex flex-row gap-2 w-full">
          {footer}
          <Button variant="outline" className="ml-auto text-muted-foreground" onClick={requestVote}>
            <Vote />
            {t("posts:vote.vote")}
          </Button>
        </div>
      </div>
    </div>);
  });
