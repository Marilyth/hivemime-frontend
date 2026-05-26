import { observer } from "mobx-react-lite";
import { useObservableDraft } from "../../utility/observable-draft";

import { toast } from "sonner";
import { AsyncButton } from "../../utility/async-button";
import { api, followedHivesStore } from "@/lib/contexts";
import { ApprovalStatus, HiveDto, HiveUserDto, HiveUserOrderBy, MemberRole, PaginationCursorDto } from "@/lib/Api";
import { useInfiniteQuery } from "@tanstack/react-query";
import InfiniteScroll from "react-infinite-scroll-component";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowUpDown, Check, Gavel, Hammer, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HiveMimeHoverCard } from "../../utility/hm-hover-card";
import { useDebounce } from "../../utility/debounce";
import { observable } from "mobx";
import { getRoleColor, getRoleRank } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import Link from "next/link";

export interface HiveMembersSettingsProps {
  hiveDto: HiveDto;
  currentUser: HiveUserDto;
}

export const HiveMembersSettings = observer(({ hiveDto, currentUser }: HiveMembersSettingsProps) => {
  const [approvalStatus, setApprovalStatus] = useState<ApprovalStatus>(ApprovalStatus.Approved);
  const [userNameFilter, setUserNameFilter] = useState<string>("");
  const [orderBy, setOrderBy] = useState<HiveUserOrderBy>(HiveUserOrderBy.New);
  const [debouncedHiveSearchInput, isLoading] = useDebounce(userNameFilter, 300);

  const membersQuery = useInfiniteQuery({
    queryKey: ['hiveUsers', hiveDto.id, approvalStatus, debouncedHiveSearchInput, orderBy],
    queryFn: async ({ pageParam }) => {
      const task = api.api.hiveUsersCreate({pageSize: 50, cursor: pageParam, filter: debouncedHiveSearchInput, orderBy: orderBy}, { hiveId: hiveDto.id, status: approvalStatus });
      toast.promise(task, {
        loading: 'Loading members...',
        success: 'Members loaded.'
      });

      const response = await task;
      return response.data;
    },
    initialPageParam: undefined as PaginationCursorDto | undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor
  });

  const members = membersQuery.data?.pages.flatMap(p => p.items) ?? [];
  
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-row gap-4">
        <Input placeholder="Filter by username" className="flex-1" value={userNameFilter} onChange={(e) => setUserNameFilter(e.target.value)} />
        <Select onValueChange={(value) => setApprovalStatus(value as ApprovalStatus)} defaultValue={approvalStatus}>
          <SelectTrigger>
            <SelectValue placeholder="Filter by approval status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ApprovalStatus.Approved}>Approved</SelectItem>
            <SelectItem value={ApprovalStatus.Pending}>Pending</SelectItem>
            <SelectItem value={ApprovalStatus.Rejected}>Rejected</SelectItem>
          </SelectContent>
        </Select>
        <Select onValueChange={(value) => setOrderBy(value as HiveUserOrderBy)} defaultValue={orderBy}>
          <SelectTrigger>
            <ArrowUpDown />
            <SelectValue placeholder="Order by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={HiveUserOrderBy.New}>Newest</SelectItem>
            <SelectItem value={HiveUserOrderBy.Old}>Oldest</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <InfiniteScroll
        dataLength={members.length}
        next={membersQuery.fetchNextPage}
        hasMore={membersQuery.hasNextPage}
        loader=
        {
          <Skeleton className="h-64 w-full rounded-xl my-4">
            <span className="flex h-full w-full items-center justify-center text-informational">
              Loading...
            </span>
          </Skeleton>
        }
        endMessage=
        {
          <div className="my-4 text-center">There are no more members!</div>
        }
      >
      <div className="flex justify-center flex-row flex-wrap gap-4">
        {members.map((member, index) => (
          <HiveMember key={index} user={observable(member!)} currentUser={currentUser} />
        ))}
      </div>
    </InfiniteScroll>
    </div>
  );
});

export interface HiveMemberProps {
  user: HiveUserDto;
  currentUser: HiveUserDto;
}

export const HiveMember = observer(({ user, currentUser }: HiveMemberProps) => {
  const [draft, isDirty, resetChanges, applyChanges] = useObservableDraft(user);

  async function updateMember(){
    const task = api.api.hiveModifyUserPartialUpdate({ followRequestId: draft.id, approvalStatus: draft.approvalStatus, role: draft.role });

    toast.promise(task, {
      loading: `Updating member...`,
      success: `Member updated.`,
      error: () => {
        resetChanges();
      }
    });

    await task;
    applyChanges();
  }

  async function banMemberApprovalStatus() {
    draft.approvalStatus = ApprovalStatus.Rejected;
    draft.role = MemberRole.Follower;
    await updateMember();
  }

  async function setMemberApprovalStatus(status: ApprovalStatus) {
    draft.approvalStatus = status;
    await updateMember();
  }

  async function setMemberRole(role: MemberRole) {
    draft.role = role;
    await updateMember();
  }

  function canSetToRole(role: MemberRole) {
    return getRoleRank(currentUser.role!) > getRoleRank(user.role!) &&
      getRoleRank(currentUser.role!) > getRoleRank(role);
  }

  function canBan() {
    return getRoleRank(currentUser.role!) > getRoleRank(user.role!);
  }

  return (
    <HiveMimeHoverCard className="flex flex-col gap-1 border rounded-lg w-full pt-2">
      <div className="flex flex-row gap-4 items-start w-full">
        <Link href={`/user?id=${user.user?.id}`} className="text-sm text-honey-brown flex-1">
          {user.user?.username}
        </Link>

        {user.approvalStatus == ApprovalStatus.Approved && (
          <>
            {canBan() && (
              <Tooltip>
                <TooltipTrigger className="text-sm text-destructive">
                  <Button variant="ghost" className="text-red-500" onClick={banMemberApprovalStatus}>
                    <Gavel />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  Reject member
                </TooltipContent>
              </Tooltip>
            )}
            <Select onValueChange={(value) => setMemberRole(value as MemberRole)} defaultValue={user.role}>
              <SelectTrigger size="sm">
                <span className={`text-sm ${getRoleColor(user.role!)}`}>
                  {user.role}
                </span>
              </SelectTrigger>
              <SelectContent>
                <SelectItem className={getRoleColor(MemberRole.Follower)} disabled={!canSetToRole(MemberRole.Follower)} value={MemberRole.Follower}>Follower</SelectItem>
                <SelectItem className={getRoleColor(MemberRole.Moderator)} disabled={!canSetToRole(MemberRole.Moderator)} value={MemberRole.Moderator}>Moderator</SelectItem>
                <SelectItem className={getRoleColor(MemberRole.Admin)} disabled={!canSetToRole(MemberRole.Admin)} value={MemberRole.Admin}>Admin</SelectItem>
                <SelectItem className={getRoleColor(MemberRole.Creator)} disabled={!canSetToRole(MemberRole.Creator)} value={MemberRole.Creator}>Creator</SelectItem>
              </SelectContent>
            </Select>
          </>
        )}
        {user.approvalStatus != ApprovalStatus.Approved && (
          <Tooltip>
            <TooltipTrigger className="text-sm text-green-500">
              <Button variant="ghost" className="text-green-500" onClick={() => setMemberApprovalStatus(ApprovalStatus.Approved)}>
                <Check />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              Approve member
            </TooltipContent>
          </Tooltip>
        )}
        {user.approvalStatus == ApprovalStatus.Pending && (
          <Tooltip>
            <TooltipTrigger className="text-sm text-destructive">
              <Button variant="ghost" className="text-red-500" onClick={banMemberApprovalStatus}>
                <X />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              Reject member
            </TooltipContent>
          </Tooltip>
        )}
      </div>
      <span className="text-sm text-muted-foreground">Joined on {new Date(user.createdAt!).toLocaleDateString()}</span>
    </HiveMimeHoverCard>
  );
});