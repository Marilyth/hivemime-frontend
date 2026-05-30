"use client";

import { Select, SelectContent, SelectItem, SelectSeparator, SelectValue } from "@/components/ui/select";
import { useState, useRef } from "react";
import { HiveMimeInlineSelectTrigger } from "../../utility/hm-inline-select";
import { observer } from "mobx-react-lite";
import { CreateHiveDto, CreatePostDto, HiveDto, MemberRole } from "@/lib/Api";
import { HiveMimeBulletItem } from "../../utility/hm-bullet-item";
import { ChevronDownIcon, FileChartColumn, Plus, SearchIcon, SquareCheck, SquareX, User, X } from "lucide-react";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useQuery } from "@tanstack/react-query";
import { useQueryParam } from "../../utility/use-query-param";
import { api, followedHivesStore, userStore } from "@/lib/contexts";
import { useDebounce } from "../../utility/debounce";
import { Trans, useTranslation } from "react-i18next";
import { getEffectiveRole, getRoleColor, getRoleRank } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export interface HiveMimeHiveSelectionProps {
  post: CreatePostDto;
  newHive: CreateHiveDto;
}

export const HiveSelection = observer((props: HiveMimeHiveSelectionProps) => {
  const { t } = useTranslation();
  const [hiveIdQueryParam, setHiveIdQueryParam] = useQueryParam("hiveId", undefined);
  const [hiveSearchInput, setHiveSearchInput] = useState("");
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const [debouncedHiveSearchInput, isLoading] = useDebounce(hiveSearchInput, 300);
  const hiveUser = props.post.hiveId ? followedHivesStore.followedHives.get(props.post.hiveId) : undefined;
  const effectiveRole = getEffectiveRole(hiveUser?.role, hiveUser?.approvalStatus);

  const hiveData = useQuery({
    queryKey: ["hive", props.post.hiveId],
    enabled: props.post.hiveId !== undefined && props.post.hiveId! > 0,
    queryFn: async () => {
      const res = await api.api.hiveGetList({ hiveId: props.post.hiveId! });
      return res.data;
    }
  });

  const hiveSearchData = useQuery({
    queryKey: ["hive-search", debouncedHiveSearchInput],
    queryFn: async () => {
      const res = await api.api.hiveBrowseCreate({ filter: debouncedHiveSearchInput });
      return res.data;
    }
  });

  function setPrivacy(val: boolean) {
    props.post.hiveId = val ?
      undefined :
      hiveIdQueryParam ? Number(hiveIdQueryParam) : -1;
  }

  function setHiveId(id: number) {
    setIsPopoverOpen(false);
    props.post.hiveId = id;
    props.newHive.name = null;
  }
  
  function setNewHive() {
    setIsPopoverOpen(false);
    props.post.hiveId = -1;
    props.newHive.name = hiveSearchInput;
  }

  return (
    <div>
      <HiveMimeBulletItem>
        <Trans i18nKey="posts:create.hiveSelection.thisIsA" components={{ select:
          <Select value={props.post.hiveId == undefined ? "private" : "public"} onValueChange={(v) => setPrivacy(v === "private")}>
            <HiveMimeInlineSelectTrigger>
              <SelectValue />
            </HiveMimeInlineSelectTrigger>
            <SelectContent>
              <SelectItem value="private">{t("enums:visibility.private")}</SelectItem>
              <SelectItem value="public">{t("enums:visibility.public")}</SelectItem>
            </SelectContent>
          </Select>}} />
      </HiveMimeBulletItem>

      {props.post.hiveId != undefined && (
        <>
          <HiveMimeBulletItem>
            {t("posts:create.hiveSelection.postedInto")}
            <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
              <PopoverTrigger className="px-1 py-0 h-auto mx-1.5 border-b border-honey-brown ml-2 text-honey-brown">
                <div className="flex items-center gap-1">
                  {hiveData.data?.name ?? props.newHive?.name ?? t("posts:create.hiveSelection.selectHive")}
                  <ChevronDownIcon className="size-3" />
                </div>
              </PopoverTrigger>

              <PopoverContent className="px-2 py-2">
                <InputGroup>
                  <InputGroupInput
                    ref={inputRef}
                    placeholder={t("posts:create.hiveSelection.searchHives")}
                    value={hiveSearchInput}
                    onChange={(e) => setHiveSearchInput(e.target.value)}
                  />
                  <InputGroupAddon className="pl-2">
                    <SearchIcon />
                  </InputGroupAddon>
                </InputGroup>

                <SelectSeparator className="my-2" />

                {isLoading && <div>{t("common:loading")}</div>}

                {!isLoading && 
                  <>
                    {hiveSearchInput && !hiveSearchData.data?.items?.find((item) => item.name === hiveSearchInput) && (
                      <Button variant="outline" size="sm" className="mb-2 whitespace-normal text-left" onClick={setNewHive}>
                        <Plus /> {t("posts:create.hiveSelection.createNewHiveWithName")}
                      </Button>
                    )}

                    {(hiveSearchData.data?.items?.length ?? 0) == 0 && (
                      <div>
                        {t("posts:create.hiveSelection.noHivesFound")}
                      </div>
                    )}
                  </>
                }

                {!isLoading && hiveSearchData.data?.items?.map((s) => (
                  <div key={s.id} onClick={() => setHiveId(s.id!)}>
                    <HiveSelectionItem hive={s} />
                  </div>
                ))}
              </PopoverContent>
            </Popover>
          </HiveMimeBulletItem>

          <div className="mt-2 ml-4 text-muted-foreground">
            {!userStore.user?.isVerified && <div className="flex flex-row gap-2 items-center">
              {userStore.user?.isVerified ? (
                <SquareCheck className="text-green-500 size-4" />
              ) : (
                <SquareX className="text-red-400 size-4" />
              )}
              {t("posts:create.hiveSelection.loginRequiredToPost")}
            </div>}

            {hiveData.data && (
              <>
                {getRoleRank(effectiveRole) < getRoleRank(MemberRole.Moderator) && hiveData.data.settings?.minHoneyToPost! > 0 &&
                <div className="flex flex-row gap-2 items-center">
                  {userStore.user!.honey! >= hiveData.data.settings!.minHoneyToPost! ? (
                    <SquareCheck className="text-green-500 size-4" />
                  ) : (
                    <SquareX className="text-red-400 size-4" />
                  )}
                  <Trans
                    i18nKey="posts:create.hiveSelection.honeyRequiredToPost"
                    components={{
                      honey: <span className="text-honey-brown">🍯 {hiveData.data.settings!.minHoneyToPost}</span>
                    }}
                  />
                </div>}
                {getRoleRank(hiveData.data.settings?.minRoleToPost!) > 0 &&
                <div className="flex flex-row gap-2 items-center">
                  {getRoleRank(effectiveRole) >= getRoleRank(hiveData.data.settings!.minRoleToPost!) ? (
                    <SquareCheck className="text-green-500 size-4" />
                  ) : (
                    <SquareX className="text-red-400 size-4" />
                  )}
                  <Trans
                    i18nKey="posts:create.hiveSelection.roleRequiredToPost"
                    components={{
                      role: <span className={`${getRoleColor(hiveData.data.settings!.minRoleToPost!)}`}>
                        {t(`enums:memberRole.${hiveData.data.settings!.minRoleToPost?.toLowerCase()}`)}
                      </span>
                    }}
                  />
                </div>}
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
});

function HiveSelectionItem({ hive }: { hive: HiveDto }) {
  return (
    <div className="flex flex-col">
      <span>{hive.name}</span>
      <div className="text-muted-foreground text-sm flex gap-2 items-center">
        <User className="w-4" /> {hive.userCount}
        <FileChartColumn className="w-4" /> {hive.postCount}
      </div>
    </div>
  );
}
