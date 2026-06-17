import { observer } from "mobx-react-lite";
import { useObservableDraft } from "../../utility/observable-draft";

import { toast } from "sonner";
import { AsyncButton } from "../../utility/async-button";
import { api } from "@/lib/contexts";
import { ApprovalStatus, HiveDto, HiveUserDto, HiveUserOrderBy, MemberRole, PaginationCursorDto } from "@/lib/Api";
import { useInfiniteQuery } from "@tanstack/react-query";
import InfiniteScroll from "react-infinite-scroll-component";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowUpDown, Gavel, UserRoundPlus, UserRoundX } from "lucide-react";
import { useDebounce } from "../../utility/debounce";
import { observable } from "mobx";
import { getRoleColor, getRoleRank } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import Link from "next/link";
import { UserAvatar } from "../../user/user-avatar";
import { useTranslation } from "react-i18next";

export interface HiveMembersSettingsProps {
  hiveDto: HiveDto;
  currentUser: HiveUserDto;
}

export const HiveMembersSettings = observer(({ hiveDto, currentUser }: HiveMembersSettingsProps) => {
  const { t } = useTranslation();
  const [approvalStatus, setApprovalStatus] = useState<ApprovalStatus>(ApprovalStatus.Approved);
  const [userNameFilter, setUserNameFilter] = useState<string>("");
  const [orderBy, setOrderBy] = useState<HiveUserOrderBy>(HiveUserOrderBy.New);
  const [debouncedUserNameFilter, isLoading] = useDebounce(userNameFilter, 1000);

  const membersQuery = useInfiniteQuery({
    queryKey: ['hiveUsers', hiveDto.id, approvalStatus, debouncedUserNameFilter, orderBy],
    queryFn: async ({ pageParam }) => {
      const task = api.api.hiveUsersCreate({pageSize: 50, cursor: pageParam, filter: debouncedUserNameFilter, orderBy: orderBy}, { hiveId: hiveDto.id, status: approvalStatus });
      toast.promise(task, {
        loading: t("toasts:hive.loadingMembers")
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
        <Input placeholder={t("hives:settings.membersSection.filterByUsername")} className="flex-1" value={userNameFilter} onChange={(e) => setUserNameFilter(e.target.value)} />
        <Select onValueChange={(value) => setApprovalStatus(value as ApprovalStatus)} defaultValue={approvalStatus}>
          <SelectTrigger>
            <SelectValue placeholder={t("hives:settings.membersSection.filterByApprovalStatus")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ApprovalStatus.Approved}>{t("enums:approvalStatus.approved")}</SelectItem>
            <SelectItem value={ApprovalStatus.Pending}>{t("enums:approvalStatus.pending")}</SelectItem>
            <SelectItem value={ApprovalStatus.Rejected}>{t("enums:approvalStatus.rejected")}</SelectItem>
            <SelectItem value={ApprovalStatus.Banned}>{t("enums:approvalStatus.banned")}</SelectItem>
          </SelectContent>
        </Select>
        <Select onValueChange={(value) => setOrderBy(value as HiveUserOrderBy)} defaultValue={orderBy}>
          <SelectTrigger>
            <ArrowUpDown />
            <SelectValue placeholder={t("hives:settings.membersSection.orderBy")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={HiveUserOrderBy.New}>{t("enums:memberOrder.newest")}</SelectItem>
            <SelectItem value={HiveUserOrderBy.Old}>{t("enums:memberOrder.oldest")}</SelectItem>
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
              {t("common:loading")}
            </span>
          </Skeleton>
        }
        endMessage=
        {
          <div className="my-4 text-center">{t("hives:settings.membersSection.noMoreMembers")}</div>
        }
      >
      <div className="flex flex-col">
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
  const { t } = useTranslation();
  const [draft, isDirty, resetChanges, applyChanges] = useObservableDraft(user);

  async function updateMember(){
    const task = api.api.hiveModifyUserPartialUpdate({ followRequestId: draft.id, approvalStatus: draft.approvalStatus, role: draft.role });

    toast.promise(task, {
      loading: t("toasts:hive.updatingMember")
    });

    try{
      await task;
      applyChanges();
    } catch (error) {
      resetChanges();
    }
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
    return getRoleRank(user.role!) > 0 &&
      getRoleRank(currentUser.role!) > getRoleRank(user.role!) &&
      getRoleRank(currentUser.role!) > getRoleRank(role);
  }

  function canBan() {
    return getRoleRank(currentUser.role!) > getRoleRank(user.role!);
  }

  return (
    <div className="flex flex-row gap-2 items-center w-full border-t p-2">
      <UserAvatar user={user.user!} size={48} />

      <div className="flex flex-col mr-auto">
        <Link href={`/user?id=${user.user?.id}`} className="text-sm text-honey-brown flex-1">
          {user.user?.username}
        </Link>
        <span className="text-sm text-muted-foreground">{t("hives:settings.membersSection.joinedOn", { date: new Date(user.createdAt!).toLocaleDateString() })}</span>
      </div>

      {user.approvalStatus == ApprovalStatus.Approved && (
        <>
          {canBan() && (
            <Tooltip>
              <TooltipTrigger className="text-sm">
                <AsyncButton variant="ghost" onClick={() => setMemberApprovalStatus(ApprovalStatus.Banned)}>
                  <Gavel className="text-failure" />
                </AsyncButton>
              </TooltipTrigger>
              <TooltipContent>
                {t("hives:settings.membersSection.banMember")}
              </TooltipContent>
            </Tooltip>
          )}
          <Select onValueChange={(value) => setMemberRole(value as MemberRole)} defaultValue={user.role}>
            <SelectTrigger size="sm">
              <span className={`text-sm ${getRoleColor(user.role!)}`}>
                {t(`enums:memberRole.${user.role!.toLowerCase()}`)}
              </span>
            </SelectTrigger>
            <SelectContent>
              <SelectItem className={getRoleColor(MemberRole.Guest)} disabled value={MemberRole.Guest}>{t("enums:memberRole.guest")}</SelectItem>
              <SelectItem className={getRoleColor(MemberRole.Follower)} disabled={!canSetToRole(MemberRole.Follower)} value={MemberRole.Follower}>{t("enums:memberRole.follower")}</SelectItem>
              <SelectItem className={getRoleColor(MemberRole.Moderator)} disabled={!canSetToRole(MemberRole.Moderator)} value={MemberRole.Moderator}>{t("enums:memberRole.moderator")}</SelectItem>
              <SelectItem className={getRoleColor(MemberRole.Admin)} disabled={!canSetToRole(MemberRole.Admin)} value={MemberRole.Admin}>{t("enums:memberRole.admin")}</SelectItem>
              <SelectItem className={getRoleColor(MemberRole.Creator)} disabled={!canSetToRole(MemberRole.Creator)} value={MemberRole.Creator}>{t("enums:memberRole.creator")}</SelectItem>
            </SelectContent>
          </Select>
        </>
      )}
      {user.approvalStatus != ApprovalStatus.Approved && (
        <Tooltip>
          <TooltipTrigger className="text-sm">
            <AsyncButton variant="ghost" onClick={() => setMemberApprovalStatus(ApprovalStatus.Approved)}>
              <UserRoundPlus />
            </AsyncButton>
          </TooltipTrigger>
          <TooltipContent>
            {t("hives:settings.membersSection.approveMember")}
          </TooltipContent>
        </Tooltip>
      )}
      {user.approvalStatus == ApprovalStatus.Pending && (
        <Tooltip>
          <TooltipTrigger className="text-sm">
            <AsyncButton variant="ghost" onClick={() => setMemberApprovalStatus(ApprovalStatus.Rejected)}>
              <UserRoundX />
            </AsyncButton>
          </TooltipTrigger>
          <TooltipContent>
            {t("hives:settings.membersSection.rejectMember")}
          </TooltipContent>
        </Tooltip>
      )}
    </div>
  );
});
