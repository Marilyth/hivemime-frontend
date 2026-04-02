import { useContext, useEffect, useMemo, useState } from "react";
import { HiveMimeApiContext } from "@/lib/contexts";
import { observer } from "mobx-react-lite";
import { Api, PostDto, PostResultDto } from "@/lib/Api";
import { Button } from "@/components/ui/button";
import { Vote, Filter } from "lucide-react";
import { Accordion } from "@/components/ui/accordion";
import { HiveMimePollResult } from "./hm-poll-result";
import { HiveMimePostResultFilter } from "./filter/hm-post-result-filter";
import { HiveMimeVoteQueryGroup } from "./filter/hm-vote-query-group";
import { VoteQueryGroup } from "@/lib/query-builder";

interface HiveMimePostResultProps {
  post: PostDto;
  requestVote?: () => void;
  footer: React.ReactNode;
}

export const HiveMimePostResult = observer(({ post, requestVote, footer }: HiveMimePostResultProps) => {
  const hiveMimeService: Api<unknown> = useContext(HiveMimeApiContext)!;
  const [results, setResults] = useState<PostResultDto | null>(null);
  const [filterOpen, setFilterOpen] = useState(false);
  const queryBuilder: VoteQueryGroup = useMemo(() => 
    new VoteQueryGroup(),
    []
  );

  async function fetchResults()
  {
    const response = await hiveMimeService.api.postResultsList({postId: post.id!, filter: queryBuilder.toString()});
    setResults(response.data);
  }

  function filterFinished() {
    setFilterOpen(false);
    fetchResults();
  }

  useEffect(() => {
    fetchResults();
  }, []);

  return (
    <div>
      <HiveMimePostResultFilter post={post} builder={queryBuilder} isOpen={filterOpen} onFinished={filterFinished} />
      <div className="flex flex-col gap-4">
        <div className="border rounded-md">
          <div className="flex justify-between items-center border-b bg-muted/30 px-2">
            <span className="font-semibold">
              Results 
              {post.voteCount && (
                <span className="font-normal text-sm text-muted-foreground ml-2">
                  ({post.voteCount.toLocaleString()} votes)
                </span>
              )}
            </span>
            <Button variant="link" onClick={() => setFilterOpen(true)}>
              <Filter />
              Filter votes
            </Button>
          </div>
          
          <Accordion type="single" collapsible>
            {post.polls!.map((poll, index) => (
              <HiveMimePollResult key={index} poll={poll} pollResult={results?.polls![index]} />
            ))}
          </Accordion>
        </div>

        <div className="flex flex-row gap-2 w-full">
          {footer}
          <Button variant="outline" className="text-muted-foreground" onClick={requestVote}>
            <Vote />
            Vote
          </Button>
        </div>
      </div>
    </div>);
  });
