import { PostVoteDto, PostDto } from "@/lib/Api";
import { validatePickPoll } from "@/lib/validate-vote";
import { ChartBar, Vote } from "lucide-react";
import { observable, reaction, toJS } from "mobx";
import { observer } from "mobx-react-lite";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Button } from "../../../ui/button";
import { HiveMimeListPoll } from "./hm-poll-vote";
import { Accordion } from "@/components/ui/accordion";
import { AsyncButton } from "../../utility/async-button";
import { api } from "@/lib/contexts";

interface HiveMimePostVoteProps {
  post: PostDto;
  requestResults?: () => void;
  footer: React.ReactNode;
}

export const HiveMimePostVote = observer(({ post, requestResults, footer }: HiveMimePostVoteProps) => {
  const [isValid, setIsValid] = useState(false);
  const [postVote, setPostVote] = useState<PostVoteDto>(() => (observable({
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
    const task = api.api.postVoteCreate(postVote);
    toast.promise(task, {
      loading: 'Submitting your vote...',
      success: 'Your vote has been submitted!'
    });
    await task;

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
        <AsyncButton variant="default" disabled={!isValid} onClick={submitVote}>
          <Vote />
          Vote
        </AsyncButton>
      </div>
    </div>
  );
});