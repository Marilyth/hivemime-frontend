"use client";

import { Select, SelectContent, SelectItem, SelectSeparator, SelectValue } from "@/components/ui/select";
import { useState, useRef } from "react";
import { HiveMimeInlineSelectTrigger } from "../../utility/hm-inline-select";
import { observer } from "mobx-react-lite";
import { CreatePostDto, HiveDto } from "@/lib/Api";
import { HiveMimeBulletItem } from "../../utility/hm-bullet-item";
import { ChevronDownIcon, FileChartColumn, SearchIcon, User } from "lucide-react";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useQuery } from "@tanstack/react-query";
import { useQueryParam } from "../../utility/use-query-param";
import { api } from "@/lib/contexts";
import { useDebounce } from "../../utility/debounce";
import { useTranslation } from "react-i18next";

export interface HiveMimeHiveSelectionProps {
  post: CreatePostDto;
}

export const HiveSelection = observer((props: HiveMimeHiveSelectionProps) => {
  const { t } = useTranslation();
  const [hiveIdQueryParam, setHiveIdQueryParam] = useQueryParam("hiveId", undefined);
  const [hiveSearchInput, setHiveSearchInput] = useState("");
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const [debouncedHiveSearchInput, isLoading] = useDebounce(hiveSearchInput, 300);

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
    enabled: debouncedHiveSearchInput.length > 0,
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
  }

  return (
    <div>
      <HiveMimeBulletItem>
        {t("posts:create.hiveSelection.thisIsA")}
        <Select value={props.post.hiveId == undefined ? "private" : "public"} onValueChange={(v) => setPrivacy(v === "private")}>
          <HiveMimeInlineSelectTrigger>
            <SelectValue />
          </HiveMimeInlineSelectTrigger>
          <SelectContent>
            <SelectItem value="private">{t("enums:visibility.private")}</SelectItem>
            <SelectItem value="public">{t("enums:visibility.public")}</SelectItem>
          </SelectContent>
        </Select>
        {t("posts:create.hiveSelection.post")}
      </HiveMimeBulletItem>

      {props.post.hiveId != undefined && (
        <HiveMimeBulletItem>
          {t("posts:create.hiveSelection.postedInto")}
          <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
            <PopoverTrigger className="px-1 py-0 h-auto mx-1.5 border-b border-honey-brown ml-2 text-honey-brown">
              <div className="flex items-center gap-1">
                {hiveData.data?.name ?? t("posts:create.hiveSelection.selectHive")}
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

              {!isLoading && (hiveSearchData.data?.items?.length ?? 0) == 0 && (
                <div>{t("posts:create.hiveSelection.noHivesFound")}</div>
              )}

              {!isLoading && hiveSearchData.data?.items?.map((s) => (
                <div key={s.id} onClick={() => setHiveId(s.id!)}>
                  <HiveSelectionItem hive={s} />
                </div>
              ))}
            </PopoverContent>
          </Popover>
        </HiveMimeBulletItem>
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
