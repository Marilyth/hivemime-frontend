"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { HiveMimeCreatePoll } from "./hm-create-poll";
import { CreateHiveDto, CreatePollDto, CreatePostDto, PollType } from "@/lib/Api";
import { Button } from "../../../ui/button";
import { useEffect, useRef, useState } from "react";
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
import { HiveSelection, NEW_HIVE_ID_SENTINEL } from "./hm-hive-selection";
import { AsyncButton } from "../../utility/async-button";
import { useQueryParam } from "../../utility/use-query-param";
import { api, followedHivesStore } from "@/lib/contexts";
import { useTranslation } from "react-i18next";
import { FieldSeparator } from "@/components/ui/field";

export const mediaFiles = observable.map<string, File>()

export const HiveMimeCreatePost = observer(() => {
  const { t } = useTranslation();
  const router = useRouter();
  const [selectedPollIndex, setSelectedPollIndex] = useState<number>(0);
  const [selectedPoll, setSelectedPoll] = useState<CreatePollDto | null>(null);
  const [hiveId, setHiveId] = useQueryParam("hiveId", undefined);

  const createHive = useRef<CreateHiveDto>(observable({ title: null, description: "" }));
  const postRef = useRef<CreatePostDto>(observable({ title: "", description: "", polls: [], hiveId: hiveId ?? undefined }));
  const post = postRef.current;

  if (post.polls!.length === 0 && selectedPoll == null) {
    addPoll();
  }

  useEffect(() => {
    mediaFiles.clear()
  }, []);

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
                       allowedCustomCandidateCount: 0, shuffleCandidates: false,
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

    // Handle new hive creation.
    if (post.hiveId === NEW_HIVE_ID_SENTINEL) {
      post.hiveId = undefined;
      const task = api.api.hiveCreateCreate(createHive.current);

      toast.promise(task, {
        loading: t("toasts:hive.creating"),
      });

      const response = await task;
      post.hiveId = response.data.hive!.id;
      followedHivesStore.addFollowedHive(response.data);
    }

    // Create post draft.
    const task = api.api.postCreateCreate(post);
    toast.promise(task, {
      loading: t("toasts:post.submitting")
    });

    const response = await task;

    // Upload media files.
    for (let i = 0; i < post.polls!.length; i++) {
      const uploadPoll = response.data.polls![i];
      const poll = post.polls![i];

      for (let j = 0; j < poll.candidates!.length; j++) {
        const uploadCandidate = response.data.polls![i].candidates![j];
        const candidate = poll.candidates![j];

        if (!candidate.media)
          continue;

        const uploadUrl = uploadCandidate.mediaUploadUrls!;
        const mainUploadTask = fetch(uploadUrl[0], {
          method: "PUT",
          body: mediaFiles.get(getReferenceId(candidate))
        });
        const thumbUploadTask = fetch(uploadUrl[1], {
          method: "PUT",
          body: mediaFiles.get(getReferenceId(candidate) + "-thumb")
        });

        const uploadTasks = Promise.all([mainUploadTask, thumbUploadTask]);
        toast.promise(uploadTasks, {
          loading: t("toasts:post.uploadingMedia", { name: candidate.name })
        });

        await uploadTasks;
      }
    }

    // Publish post.
    const publishTask = api.api.postPublishPartialUpdate({ postId: response.data.id });
    toast.promise(publishTask, {
      loading: t("toasts:post.publishing")
    });

    await publishTask;

    router.push(`/posts/view?postId=${response.data.id}`);
  }

  return (
    <div>
      <Card className="py-4 text-foreground">
        <CardHeader>
          <h2 className="text-2xl font-bold">{t("posts:create.title")}</h2>
        </CardHeader>

        <CardContent className="flex flex-col gap-4">
          <HiveSelection post={post} newHive={createHive.current} />
          <FieldSeparator />
          {selectedPoll == null ? (
            <div className="flex flex-col gap-4">
              {/* Polls */}
              <div className="flex flex-col gap-2 border rounded-md p-4 bg-muted/40">
                <Label className="font-bold">{t("posts:create.polls")}</Label>
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
                  <Plus /> {t("posts:create.addPoll")}
                </Button>
                <Label className="text-muted-foreground text-sm mt-1">
                  {t("posts:create.correlationsHint")}
                </Label>
              </div>

              <AsyncButton className="self-start ml-auto" onClick={submitPost}>
                {t("common:submit")}
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
    </div>
  );
});