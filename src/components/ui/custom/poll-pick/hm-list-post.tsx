"use client";

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare, Send, User, AlertCircleIcon, CircleCheck, CircleX, ArrowRight, ChartBar } from "lucide-react"
import { Badge } from "../../badge";
import { HiveMimeListPoll } from "./hm-list-poll";
import { EmbeddedTabs, EmbeddedTabsContent, EmbeddedTabsList, EmbeddedTabsTrigger } from "../hm-embedded-tabs";
import { UpsertVoteToPostDto, ListPostDto, Api, PostResultsDto, ListPollDto, PollType } from "@/lib/Api";
import { useContext, useEffect, useState } from "react";
import { observable } from "mobx";
import { HiveMimeApiContext } from "@/app/layout";
import { Button } from "../../button";
import { validatePickPoll } from "@/lib/validate-vote";
import { toast } from "sonner";
import { getReferenceId } from "@/lib/utils";
import { observer } from "mobx-react-lite";
import { HiveMimeBulletItem } from "../hm-bullet-item";
import { HiveMimeListPollResult } from "./hm-list-poll-result";
import { ChartType } from "@/lib/view-models";

export interface HiveMimePostProps {
  post: ListPostDto;
  showResults?: boolean;
}

export const HiveMimePost = observer(({ post, showResults }: HiveMimePostProps) => {
  const [resultsVisible, setResultsVisible] = useState<boolean>(showResults || false);

  if (resultsVisible) {
    return <HiveMimeListPostResult post={post} />;
  } else {
    return <HiveMimeListPost post={post} onResultsRequested={() => {setResultsVisible(true)}} />;
  }
});

export interface HiveMimeListPostProps {
  post: ListPostDto;
  onResultsRequested?: () => void;
}

const HiveMimeListPost = observer(({ post, onResultsRequested }: HiveMimeListPostProps) => {
  const hiveMimeService: Api<unknown> = useContext(HiveMimeApiContext)!;
  const [results, setResults] = useState<PostResultsDto | null>(null);
  const [selectedQuestion, setSelectedQuestion] = useState<string>("0");
  const [postVote, setPostVote] = useState<UpsertVoteToPostDto>(() => (observable({
    postId: post.id!,
    polls: (post.polls || []).map(poll => ({
      candidates: (poll.candidates || []).map(() => ({
        value: null,
      })),
    })),
  })));

  return (
    <Card className="py-4">
      <CardHeader>
        <CardTitle>
          <div className="flex flex-col gap-1">
            <div className="flex flex-row gap-2">
              <span className="text-gray-500 text-sm">
                User has {post.polls?.length} poll{post.polls?.length === 1 ? "" : "s"} for you
              </span>
            </div>
            <span className="font-bold text-honey-brown">{post.title}</span>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <span className="text-muted-foreground">
          {post.description}
        </span>
        <EmbeddedTabs value={selectedQuestion} onValueChange={(value) => setSelectedQuestion(value)}>
          <EmbeddedTabsList className="mt-4">
            {post.polls!.map((subPost, index) => (
              <EmbeddedTabsTrigger key={getReferenceId(subPost)} value={`${index}`}>{index + 1}</EmbeddedTabsTrigger>
            ))}
            <EmbeddedTabsTrigger key={"overview"} value={`${post.polls!.length}`}>Overview</EmbeddedTabsTrigger>
          </EmbeddedTabsList>
          {post.polls!.map((poll, index) => (
            <EmbeddedTabsContent key={getReferenceId(poll)} value={`${index}`}>
              {results == null ?
                <HiveMimeListPoll poll={poll} pollVote={postVote.polls![index]} footer={
                  <Button className="w-full flex-1 text-honey-brown" variant="outline" onClick={() => setSelectedQuestion(`${index + 1}`)}
                          disabled={validatePickPoll(poll, postVote.polls![index]).length > 0}
                  >
                    Next
                  <ArrowRight />
                </Button>
                } />
              :
              <HiveMimeListPollResult poll={poll} pollResult={results!.polls![index]} /> }
            </EmbeddedTabsContent>
          ))}
          <EmbeddedTabsContent key={"overview"} value={`${post.polls!.length}`}>
            <HiveMimeVoteOverview post={post} vote={postVote} />
          </EmbeddedTabsContent>
        </EmbeddedTabs>
      </CardContent>
      <CardFooter>
        <div className="flex flex-row gap-4 w-full">
          <Badge variant={"outline"} className="h-6 self-end">
            <User  />
            128
          </Badge>
          <Badge variant={"outline"} className="h-6 self-end">
            <MessageSquare />
            64
          </Badge>
          <Button variant="ghost" className="text-honey-brown ml-auto" onClick={onResultsRequested}>
            <ChartBar className="w-4 h-4 mr-2" />
            View Results
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
});


const HiveMimeListPostResult = observer(({ post }: HiveMimePostProps) => {
  const hiveMimeService: Api<unknown> = useContext(HiveMimeApiContext)!;
  const [results, setResults] = useState<PostResultsDto | null>(null);
  const [selectedQuestion, setSelectedQuestion] = useState<string>("0");
  const [countryPoll, setCountryPoll] = useState<ListPollDto>({ title: "Where are you from?", description: "This geographical data was automatically collected.", pollType: PollType.SingleChoice, candidates: [] });
  const [calendarPoll, setCalendarPoll] = useState<ListPollDto>({ title: "When did you vote?", description: "This temporal data was automatically collected.", pollType: PollType.SingleChoice, candidates: [] });

  async function fetchResults()
  {
    const response = await hiveMimeService.api.postDetail(post.id!);
    setResults(response.data);
  }

  useEffect(() => {
    fetchResults();
  }, []);

  return (
    <Card className="py-4">
      <CardHeader>
        <CardTitle>
          <div className="flex flex-col gap-1">
            <div className="flex flex-row gap-2">
              <span className="text-gray-500 text-sm">
                User had {post.polls?.length} poll{post.polls?.length === 1 ? "" : "s"}
              </span>
            </div>
            <span className="font-bold text-honey-brown">{post.title}</span>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <span className="text-muted-foreground">
          {post.description}
        </span>
        <EmbeddedTabs value={selectedQuestion} onValueChange={(value) => setSelectedQuestion(value)}>
          <EmbeddedTabsList className="mt-4">
            {post.polls!.map((subPost, index) => (
              <EmbeddedTabsTrigger key={getReferenceId(subPost)} value={`${index}`}>{index + 1}</EmbeddedTabsTrigger>
            ))}
            <EmbeddedTabsTrigger key="country" value="country">Country</EmbeddedTabsTrigger>
            <EmbeddedTabsTrigger key="calendar" value="calendar">Calendar</EmbeddedTabsTrigger>
          </EmbeddedTabsList>
          {results && (
            <>
              {post.polls!.map((poll, index) => (
                <EmbeddedTabsContent key={getReferenceId(poll)} value={`${index}`}>
                  <HiveMimeListPollResult poll={poll} pollResult={results!.polls![index]} />
                </EmbeddedTabsContent>
              ))}
              <EmbeddedTabsContent key="country" value="country">
                <HiveMimeListPollResult poll={countryPoll} pollResult={results!.country!} chartType={ChartType.World} />
              </EmbeddedTabsContent>
              <EmbeddedTabsContent key="calendar" value="calendar">
                <HiveMimeListPollResult poll={calendarPoll} pollResult={results!.date!} chartType={ChartType.Calendar} />
              </EmbeddedTabsContent>
            </>
          )}
        </EmbeddedTabs>
      </CardContent>
      <CardFooter>
        <div className="flex flex-row gap-4">
          <Badge variant={"outline"}>
            <User  />
            128
          </Badge>
          <Badge variant={"outline"} onClick={fetchResults}>
            <MessageSquare height={241} />
            64
          </Badge>
        </div>
      </CardFooter>
    </Card>
  );
});

export interface HiveMimeVoteOverviewProps {
  post: ListPostDto;
  vote: UpsertVoteToPostDto;
}

export const HiveMimeVoteOverview = observer(({ post, vote }: HiveMimeVoteOverviewProps) => {
  const hiveMimeService: Api<unknown> = useContext(HiveMimeApiContext)!;
  const [errorMessages, setErrorMessages] = useState<string[][]>(() => post.polls!.map(() => []));
  const [isValid, setIsValid] = useState<boolean>(true);

  function validatePost()
  {
    const pollErrors: string[][] = [];

    for (let i = 0; i < post.polls!.length; i++) {
      const poll = post.polls![i];
      const pollVote = vote.polls![i];
      const errors = validatePickPoll(poll, pollVote);

      pollErrors.push(errors);

      if (errors.length > 0)
        setIsValid(false);
    }

    setErrorMessages(pollErrors);
  }

  async function submitVote()
  {
    await hiveMimeService.api.postVoteCreate(post.id!.toString(), vote);
    toast.success("Your vote has been submitted.");
  }

  useEffect(() => {
    validatePost();
    console.log(errorMessages);
  }, [vote]);

  return (
    <div className="flex flex-col gap-4">
      {post.polls!.map((poll, index) => (
        <div key={getReferenceId(poll)} className="flex flex-col gap-2 p-2 border rounded-md text-muted-foreground text-sm">
          <div className="flex flex-row items-center gap-2">
            {errorMessages[index].length > 0 ?
              <CircleX className="h-4 w-4 text-red-400"/> :
              <CircleCheck className="h-4 w-4 text-green-700" />}
            <span>
              Poll {index + 1}: {poll.title}
            </span>
          </div>

          {errorMessages[index].length > 0 && (
            <HiveMimeBulletItem className="pl-1 text-red-400">
              {errorMessages[index].map((error, errIndex) => (
                <div key={errIndex}>
                  {error}
                </div>
              ))}
            </HiveMimeBulletItem>)}
        </div>
      ))}
      <Button className="w-full flex-1 text-honey-brown" variant="outline" onClick={submitVote}
                          disabled={!isValid}>
        <Send />
        Submit vote
      </Button>
    </div>
  );
});
