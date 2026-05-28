"use client";

import { ApprovalStatus, MemberRole, PostDto } from "@/lib/Api";
import { useState } from "react";
import { observer } from "mobx-react-lite";
import { HiveMimePostResult } from "./result/hm-post-result";
import { HiveMimePostVote } from "./vote/hm-post-vote";
import { Card, CardHeader, CardTitle, CardContent } from "../../ui/card";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Ellipsis, FileMinus, FilePlus, Gavel, MessageSquare, Trash2, User } from "lucide-react";
import HexWrapper from "../utility/hm-hex-wrapper";
import { HiveMimeRelativeTimestamp } from "../utility/hm-relative-timestamp";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { api, followedHivesStore, userStore } from "@/lib/contexts";
import { toast } from "sonner";
import { getEffectiveRole, getRoleRank } from "@/lib/utils";

export interface HiveMimePostProps {
  post: PostDto;
  showResults?: boolean;
}

export const HiveMimePost = observer(({ post, showResults }: HiveMimePostProps) => {
  const [resultsVisible, setResultsVisible] = useState<boolean>(showResults || false);
  const router = useRouter();

  const currentHiveUser = post.hive ? followedHivesStore.followedHives.get(post.hive.id!) : null;
  const effectiveRole = getRoleRank(getEffectiveRole(currentHiveUser?.role, currentHiveUser?.approvalStatus));
  const posterRoleRank = getRoleRank(post.role ?? MemberRole.Follower);

  const canModify = effectiveRole >= getRoleRank(MemberRole.Moderator);
  const canBan = effectiveRole >= getRoleRank(MemberRole.Moderator) && posterRoleRank < effectiveRole && post.creator?.id !== userStore.user?.id;
  const canDelete = post.creator?.id === userStore.user?.id;
  
  const showContextMenu = canDelete || canModify;

  function toggleResults() {
    setResultsVisible(prev => !prev);
  }

  function navigateToDetails() {
    router.push(`/posts/view?postId=${post.id}`);
  }

  async function deletePost() {
    const task = api.api.postDeleteDelete({ postId: post.id! });
    
    toast.promise(task, {
      loading: 'Deleting post...',
      success: 'Post deleted.'
    });

    await task;
  }

  async function banUser() {
    const task = api.api.hiveBanUserPartialUpdate({ hiveId: post.hive!.id!, userId: post.creator!.id! });

    toast.promise(task, {
      loading: 'Banning user...',
      success: 'User banned from hive.'
    });

    await task;
  }

  async function modifyPost(approvalStatus: ApprovalStatus) {
    const task = api.api.postModifyPostPartialUpdate({ postId: post.id!, approvalStatus });

    toast.promise(task, {
      loading: 'Modifying post...',
      success: 'Post modified.'
    });

    post.approvalStatus = approvalStatus;
    await task;
  }

  const footer = (
  <div className="flex flex-row gap-2 cursor-pointer" onClick={navigateToDetails}>
    <HexWrapper className="self-end">
      <Badge className="h-6 bg-popover text-muted-foreground">
        <User  />
        {post.voteCount}
      </Badge>
    </HexWrapper>
    <HexWrapper className="self-end">
      <Badge className="h-6 bg-popover text-muted-foreground">
        <MessageSquare />
        {post.commentCount}
      </Badge>
    </HexWrapper>
  </div>);

  return (
    <Card className="py-4">
      <CardHeader>
        <CardTitle className="text-informational text-sm flex flex-row">
          <span>
            {post.hive ? <Button className="p-0 h-auto" variant="link"
              onClick={() => router.push(`/posts?hiveId=${post.hive!.id}`)}>{post.hive.name}</Button> : "Private"} • <HiveMimeRelativeTimestamp timestamp={post.createdAt!} />
          </span>
          {post.approvalStatus !== "Approved" && (
            <Badge variant="destructive" className="ml-2">
              {post.approvalStatus}
            </Badge>
          )}
          {showContextMenu && (
            <DropdownMenu>
              <DropdownMenuTrigger className="ml-auto" asChild>
                <Button variant="ghost" className="h-auto p-0">
                  <Ellipsis />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {canModify &&
                <>
                  {post.approvalStatus != ApprovalStatus.Approved && <DropdownMenuItem onSelect={() => modifyPost(ApprovalStatus.Approved)}><FilePlus /> Approve</DropdownMenuItem>}
                  {post.approvalStatus != ApprovalStatus.Rejected && <DropdownMenuItem onSelect={() => modifyPost(ApprovalStatus.Rejected)}><FileMinus /> Reject</DropdownMenuItem>}
                </>}
                {canDelete && <DropdownMenuItem onSelect={deletePost}><Trash2 /> Delete</DropdownMenuItem>}
                {canBan && <DropdownMenuItem onSelect={banUser}><Gavel className="text-red-400" /> Ban user</DropdownMenuItem>}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {!resultsVisible ?
          <HiveMimePostVote post={post} requestResults={toggleResults} footer={footer} /> :
          <HiveMimePostResult post={post} requestVote={toggleResults} footer={footer} />}
      </CardContent>
    </Card>
  );
});
