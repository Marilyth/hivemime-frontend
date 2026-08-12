import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { observer } from "mobx-react-lite";
import { PostDto, FilterQueryBase, FilterQueryGroup } from "@/lib/Api";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Vote, Filter } from "lucide-react";
import { Accordion } from "@/components/ui/accordion";
import { HiveMimePollResult } from "./hm-poll-result";
import { HiveMimePostResultFilter } from "./filter/hm-post-result-filter";
import { createFilterQueryGroup } from "@/lib/vote-query";

interface HiveMimePostResultProps {
  post: PostDto;
  requestVote?: () => void;
  footer: React.ReactNode;
}

export const HiveMimePostResult = observer(({ post, requestVote, footer }: HiveMimePostResultProps) => {
  const { t } = useTranslation();
  const [filterOpen, setFilterOpen] = useState(false);
  const queryBuilder: FilterQueryGroup = useMemo(() =>
    createFilterQueryGroup(),
    []
  );

  function addCondition(result: FilterQueryBase) {
    queryBuilder.children!.push(result);
  }

  return (
    <div>
      <Dialog open={filterOpen} onOpenChange={(open) => !open && setFilterOpen(false)}>
        <DialogContent onClick={(e) => e.stopPropagation()}>
          <div className="flex flex-col">
            <span className="text-lg font-semibold">
              {t("posts:filter.title")}
            </span>

            <span className="text-sm text-muted-foreground mb-4">
              {t("posts:filter.description")}
            </span>

            <HiveMimePostResultFilter post={post} builder={queryBuilder} onAddCondition={addCondition} />
          </div>
        </DialogContent>
      </Dialog>

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
            <HiveMimePollResult key={index} poll={poll} filter={queryBuilder} />
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
