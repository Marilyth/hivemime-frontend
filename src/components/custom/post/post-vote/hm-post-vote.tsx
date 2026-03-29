import { Api, VoteOnPostDto, PostDto } from "@/lib/Api";
import { HiveMimeApiContext } from "@/lib/contexts";
import { validatePickPoll } from "@/lib/validate-vote";
import { ChartBar, MessageSquare, Send, User, Vote } from "lucide-react";
import { observable, reaction, toJS } from "mobx";
import { observer } from "mobx-react-lite";
import { useContext, useState, useEffect } from "react";
import { toast } from "sonner";
import { Button } from "../../../ui/button";
import { HiveMimeListPoll } from "./hm-poll-vote";
import { Accordion } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";

interface HiveMimePostVoteProps {
  post: PostDto;
  requestResults?: () => void;
  footer: React.ReactNode;
}

export const HiveMimePostVote = observer(({ post, requestResults, footer }: HiveMimePostVoteProps) => {
  const hiveMimeService: Api<unknown> = useContext(HiveMimeApiContext)!;
  const [isValid, setIsValid] = useState(false);
  const [postVote, setPostVote] = useState<VoteOnPostDto>(() => (observable({
    postId: post.id!,
    polls: (post.polls || []).map(poll => ({
      candidates: (poll.candidates || []).map(() => ({
        value: null,
      })),
    })),
  })));

  function validateVote()
  {
    for (let i = 0; i < post.polls!.length; i++) {
      const poll = post.polls![i];
      const pollVote = postVote.polls![i];
      const errors = validatePickPoll(poll, pollVote);

      if (errors.length > 0){
        setIsValid(false);
        return;
      }
    }

    setIsValid(true);
  }

  async function submitVote()
  {
    await hiveMimeService.api.postVoteCreate(postVote);
    toast.success("Your vote has been submitted.");

    requestResults!();
  }

  useEffect(() => {
    validateVote();
    const dispose = reaction(
      () => toJS(postVote),
      validateVote
    );

    return () => dispose();
  }, []);

  return (
    <div className="flex flex-col gap-4">
      <Accordion type="single" collapsible className="border rounded-md">
        {post.polls!.map((poll, index) => (
            <HiveMimeListPoll key={index} poll={poll} pollVote={postVote.polls![index]} />
        ))}
      </Accordion>

      <div className="flex flex-row gap-2 w-full">
        {footer}
        <Button variant="outline" className="ml-auto text-muted-foreground" onClick={requestResults}>
          <ChartBar />
          Results
        </Button>
        <Button variant="default" disabled={!isValid} onClick={submitVote}>
          <Vote />
          Vote
        </Button>
      </div>
    </div>
  );
});