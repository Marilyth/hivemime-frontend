"use client";

import { Select, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { useContext, useEffect, useState } from "react";
import { HiveMimeInlineSelectTrigger } from "../../utility/hm-inline-select";
import { observer } from "mobx-react-lite";
import { CreatePostDto, HiveDto } from "@/lib/Api";
import { useSearchParams } from "next/navigation";
import { HiveMimeApiContext } from "@/lib/contexts";
import { HiveMimeBulletItem } from "../../utility/hm-bullet-item";
import { FileChartColumn, User } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { HiveMimeInlineInput } from "../../utility/hm-embedded-input";

const hiveNameCache = new Map<number, HiveDto>();

export interface HiveMimeHiveSelectionProps {
  post: CreatePostDto;
}

export const HiveSelection = observer((props: HiveMimeHiveSelectionProps) => {
  const hiveMimeService = useContext(HiveMimeApiContext)!;
  const [isPrivate, setIsPrivate] = useState<boolean>(false);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState<boolean>(false);
  const params = useSearchParams();
  const [suggestions, setSuggestions] = useState<HiveDto[]>([]);
  const [hiveSearchInput, setHiveSearchInput] = useState<string>("");
  const [isFocused, setIsFocused] = useState<boolean>(false);

  function getHiveId() {
    const hiveId = props.post.hiveId ?? params.get("hiveId");

    if (!hiveId)
        return undefined;

    return Number(hiveId);
  }

  async function fetchHiveInformation() {
    const hiveId = getHiveId();

    if (!hiveId)
        return;

    if (!hiveNameCache.has(hiveId)) {
      const response = await hiveMimeService.api.hiveGetList({hiveId: hiveId!});
      const hive = response.data;

      hiveNameCache.set(hiveId, hive);
    }

    setHiveSearchInput(hiveNameCache.get(hiveId)!.name!);
  }

  async function fetchSuggestionsAsync(query: string) {
    try {
      const response = await hiveMimeService.api.hiveBrowseList({filter: query});
      for (const hive of response.data) {
        hiveNameCache.set(hive.id!, hive);
      }

      setSuggestions(response.data);
    } finally {
      setIsLoadingSuggestions(false);
    }
  } 

  function setPrivacy(isPrivate: boolean) {
    setIsPrivate(isPrivate);
    
    if (isPrivate)
      props.post.hiveId = undefined;
    else
      fetchHiveInformation();
  }

  function selectHive(hive: HiveDto) {
    props.post.hiveId = hive.id;
    fetchHiveInformation();
  }

  useEffect(() => {
    fetchHiveInformation();
  }, [props.post]);

  useEffect(() => {
    if (hiveSearchInput.length === 0) {
      setSuggestions([]);
      setIsLoadingSuggestions(false);
      return;
    }

    setIsLoadingSuggestions(true);
    const delayDebounceFn = setTimeout(() => {
      fetchSuggestionsAsync(hiveSearchInput);
    }, 500)

    return () => clearTimeout(delayDebounceFn);
  }, [hiveSearchInput]);

  return (
    <div>
      <HiveMimeBulletItem>
        This is a
        <Select
          value={isPrivate ? "private" : "public"}
          onValueChange={(value) => setPrivacy(value === "private")}>
          <HiveMimeInlineSelectTrigger>
              <SelectValue />
          </HiveMimeInlineSelectTrigger>
          <SelectContent>
              <SelectItem value="private">private</SelectItem>
              <SelectItem value="public">public</SelectItem>
          </SelectContent>
        </Select> post.
      </HiveMimeBulletItem>

      {!isPrivate &&
        <HiveMimeBulletItem>
          It will be posted into
          <Popover open={isFocused}>
            <PopoverTrigger>
              <HiveMimeInlineInput onFocus={() => setIsFocused(true)} onBlur={() => setIsFocused(false)}
              value={hiveSearchInput} className="min-w-32 text-left px-1.5 text-base!" onChange={(e) => setHiveSearchInput(e.target.value)} placeholder="Search hives..." />
            </PopoverTrigger>
            <PopoverContent onOpenAutoFocus={e => e.preventDefault()} className="p-1">
              <div className="flex flex-col max-h-320 overflow-y-auto text-sm">
                {isLoadingSuggestions && <div className="text-muted-foreground">Loading...</div>}
                {!isLoadingSuggestions && suggestions.length === 0 && <div className="text-muted-foreground">No hives found.</div>}
                {!isLoadingSuggestions && suggestions.map(suggestion => (
                  <div key={suggestion.id} className="cursor-pointer hover:bg-muted rounded-md p-2"
                    onClick={() => selectHive(suggestion)}>
                    {HiveSelectionItem(suggestion)}
                  </div>
                ))}
              </div>
            </PopoverContent>
          </Popover>
        </HiveMimeBulletItem>
      }
    </div>
  )
});

function HiveSelectionItem(hive: HiveDto){
  return (
    <div className="flex flex-col">
      <span>{hive.name}</span>
      <div className="text-muted-foreground text-sm flex flex-row gap-1 items-center">
        <User className="w-4"/>
        {hive.followerCount}
        <FileChartColumn className="ml-2 w-4" />
        {hive.postCount}
      </div>
    </div>
  )
}