"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { HiveMimeCreatePoll } from "./hm-create-poll";
import { Api, CreatePollDto, CreatePostDto, PollType } from "@/lib/Api";
import { Button } from "../../../ui/button";
import { useContext, useRef, useState } from "react";
import { HiveMimeApiContext } from "@/lib/contexts";
import { Label } from "@radix-ui/react-label";
import { observer } from "mobx-react-lite";
import { useRouter } from "next/navigation";
import { observable } from "mobx";
import { toast } from "sonner";
import { validatePostTitle as validatePost } from "@/lib/validate-create";
import { Plus, Edit, Trash2 } from "lucide-react";
import { HiveMimeHoverCard } from "../../utility/hm-hover-card";
import { HiveMimePollTypeIcon } from "../../utility/hm-poll-type-icon";
import { deepCopy, getReferenceId } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { HiveMimeDraggable } from "../../utility/hm-draggable";
import { HiveSelection } from "./hm-hive-selection";
import { AsyncButton } from "../../utility/async-button";
import { useQueryParam } from "../../utility/use-query-param";

export const HiveMimeCreatePost = observer(() => {
  const router = useRouter();
  const hiveMimeService: Api<unknown> = useContext(HiveMimeApiContext)!;
  const [selectedPollIndex, setSelectedPollIndex] = useState<number>(0);
  const [selectedPoll, setSelectedPoll] = useState<CreatePollDto | null>(null);
  const [hiveId, setHiveId] = useQueryParam("hiveId", undefined);
  const postRef = useRef<CreatePostDto>(observable({ title: "", description: "", polls: [], hiveId: hiveId ? Number(hiveId) : undefined }));
  const post = postRef.current;

  if (post.polls!.length === 0 && selectedPoll == null) {
    addPoll();
  }

  function editPoll(index: number) {
    setSelectedPollIndex(index);
    setSelectedPoll(observable(deepCopy(post.polls![index])));
  }

  function finishPoll() {
    // Clean-up unused values depending on poll type.
    if (selectedPoll!.pollType != PollType.Category)
      selectedPoll!.categories = [];

    if (selectedPollIndex == -1)
      post.polls!.push(selectedPoll!);
    else
      post.polls![selectedPollIndex] = selectedPoll!;

    cancelPoll();
  }

  function addPoll() {
    setSelectedPollIndex(-1);
    setSelectedPoll(observable({ title: "", description: "", candidates: [], categories: [],
                       minValue: 0, maxValue: 100, minVotes: 1, maxVotes: 1, stepValue: 1,
                       pollType: undefined }));
  }

  function cancelPoll() {
    setSelectedPollIndex(-1);
    setSelectedPoll(null);
  }

  function removePoll(index: number) {
    post.polls?.splice(index, 1);

    if (index >= selectedPollIndex)
      setSelectedPollIndex(-1);
  }

  function canSubmitPost() {
    const errors: string[] = validatePost(post);

    for(const error of errors) {
      toast.error(error);
    }

    return errors.length === 0;
  }

  async function submitPost() {
    if (!canSubmitPost())
      return;

    const task = hiveMimeService.api.postCreateCreate(post);
    toast.promise(task, {
      loading: 'Submitting post...',
      success: 'Post submitted successfully!'
    });

    const response = await task;
    router.push(`/posts/view?postId=${response.data.id}`);
  }

  return (
    <Card className="py-4 text-foreground">
  <CardHeader>
    <h2 className="text-2xl font-bold">Create new post</h2>
  </CardHeader>

  <CardContent>
    {selectedPoll == null ? (
      <div className="flex flex-col gap-4">
        <HiveSelection post={post} />

        {/* Polls */}
        <div className="flex flex-col gap-2 border rounded-md p-4 bg-muted/40">
          <Label className="font-bold">Polls</Label>
          <AnimatePresence>
            {post.polls!.map((poll, index) => (
              <motion.div layout key={getReferenceId(poll)}>
                <HiveMimeDraggable isDraggable isDropArea isSticky data={poll} dataList={post.polls!} allowedZones={['top', 'bottom']} className="flex flex-row gap-1">
                  <HiveMimeHoverCard className="flex-1">
                    <div className="flex items-center gap-2">
                      <HiveMimePollTypeIcon answerType={poll.pollType} className="text-honey-brown w-8" />
                      <Label className="flex-1 break-words break-all">{poll.title}</Label>
                    </div>
                  </HiveMimeHoverCard>
                  <Button variant="ghost" onClick={() => editPoll(index)}>
                    <Edit />
                  </Button>
                  <Button variant="ghost"
                    className="text-muted-foreground hover:text-red-400"
                    onClick={() => removePoll(index)}>
                      <Trash2 />
                  </Button>
                </HiveMimeDraggable>
              </motion.div>
            ))}
          </AnimatePresence>

          <Button variant="outline" onClick={addPoll} className="mt-2">
            <Plus /> Add poll
          </Button>
          <Label className="text-muted-foreground text-sm mt-1">
            * Multiple polls help <Label className="text-honey-brown">visualize correlations</Label> between them.
          </Label>
        </div>

        <AsyncButton className="self-start ml-auto" onClick={submitPost}>
          Submit
        </AsyncButton>
      </div>
    ) : (
      <HiveMimeCreatePoll
        poll={selectedPoll!}
        canCancel={post.polls!.length >= 1}
        onCancelled={() => cancelPoll()}
        onFinished={() => finishPoll()}
      />
    )}
  </CardContent>
</Card>

  );
});