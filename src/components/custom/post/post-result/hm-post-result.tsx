import { useContext, useEffect, useState } from "react";
import { HiveMimeApiContext } from "@/lib/contexts";
import { observer } from "mobx-react-lite";
import { Api, PostDto, PostResultDto } from "@/lib/Api";
import { Item, ItemContent, ItemDescription, ItemTitle } from "../../../ui/item";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MessageSquare, Vote } from "lucide-react";
import { Accordion } from "@/components/ui/accordion";
import { HiveMimePollResult } from "./hm-poll-result";

interface HiveMimePostResultProps {
  post: PostDto;
  requestVote?: () => void;
}

export const HiveMimePostResult = observer(({ post, requestVote }: HiveMimePostResultProps) => {
  const hiveMimeService: Api<unknown> = useContext(HiveMimeApiContext)!;
  const [results, setResults] = useState<PostResultDto | null>(null);

  async function fetchResults()
  {
    const response = await hiveMimeService.api.postResultsList({postId: post.id!});
    setResults(response.data);
  }

  useEffect(() => {
    fetchResults();
  }, []);

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-4 justify-center">
        <Item variant="outline" size="sm" className="w-55 items-start">
          <ItemContent>
            <ItemTitle>Voters</ItemTitle>
            <ItemDescription>
              100 votes were submitted</ItemDescription>
          </ItemContent>
        </Item>
        <Item variant="outline" size="sm" className="w-55 items-start">
          <ItemContent>
            <ItemTitle>Country</ItemTitle>
            <ItemDescription>Most voters are German</ItemDescription>
          </ItemContent>
        </Item>
        <Item variant="outline" size="sm" className="w-55 items-start">
          <ItemContent>
            <ItemTitle>Effort</ItemTitle>
            <ItemDescription>Voters spent 37 seconds on median voting</ItemDescription>
          </ItemContent>
        </Item>
      </div>
      
      <div className="flex flex-col gap-4">
        <Accordion type="single" collapsible className="border rounded-md">
          {post.polls!.map((poll, index) => (
            <HiveMimePollResult key={index} poll={poll} pollResult={results?.polls![index]} />
          ))}
        </Accordion>

        <div className="flex flex-row gap-2 w-full">
          <Badge variant={"outline"} className="h-6 self-end">
            <MessageSquare />
            64
          </Badge>
          <Button variant="outline" className="ml-auto text-muted-foreground" onClick={requestVote}>
            <Vote />
            Vote
          </Button>
        </div>
      </div>
    </div>);
  });
