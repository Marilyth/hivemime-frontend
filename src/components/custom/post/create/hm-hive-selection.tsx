"use client";

import { Select, SelectContent, SelectItem, SelectSeparator, SelectValue } from "@/components/ui/select";
import { useContext, useEffect, useRef, useState } from "react";
import { HiveMimeInlineSelectTrigger } from "../../utility/hm-inline-select";
import { observer } from "mobx-react-lite";
import { CreatePostDto, HiveDto } from "@/lib/Api";
import { useSearchParams } from "next/navigation";
import { HiveMimeApiContext } from "@/lib/contexts";
import { HiveMimeBulletItem } from "../../utility/hm-bullet-item";
import { ChevronDownIcon, FileChartColumn, SearchIcon, User } from "lucide-react";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

const hiveNameCache = new Map<number, HiveDto>([
  [-1, { id: -1, name: "General", followerCount: 0, postCount: 0 }]
]);

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
  const [isPopoverOpen, setIsPopoverOpen] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);

  function getHiveId() {
    const hiveId = props.post.hiveId ?? params.get("hiveId") ?? -1;
    console.log("Using hive ID:", hiveId);
    return Number(hiveId);
  }

  async function fetchHiveInformation() {
    const hiveId = getHiveId();

    if (!hiveId)
      return;

    if (!hiveNameCache.has(hiveId)) {
      const response = await hiveMimeService.api.hiveGetList({ hiveId: hiveId! });
      const hive = response.data;

      hiveNameCache.set(hiveId, hive);
    }

    props.post.hiveId = hiveId;
  }

  async function fetchSuggestionsAsync(query: string) {
    try {
      const response = await hiveMimeService.api.hiveBrowseList({ filter: query });
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

  function setHiveId(hiveId: number) {
    setIsPopoverOpen(false);
    props.post.hiveId = hiveId;
  }

  useEffect(() => {
    fetchHiveInformation();
  }, [props.post.hiveId]);

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

      {props.post.hiveId != undefined &&
        <HiveMimeBulletItem>
          It will be posted into
          <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
            <PopoverTrigger className="px-1 py-0 h-auto mx-1.5 border-b border-honey-brown ml-2 text-honey-brown">
              <div className="flex items-center gap-1">
                {hiveNameCache.get(props.post.hiveId!)?.name ?? "Select hive"}
                <ChevronDownIcon className="size-3 text-foreground ml-auto" />
              </div>
            </PopoverTrigger>
            <PopoverContent className="px-2 py-2">
              <InputGroup>
                <InputGroupInput placeholder="Search hives..." ref={inputRef}
                  value={hiveSearchInput} onChange={(e) => setHiveSearchInput(e.target.value)} />
                <InputGroupAddon className="pl-2">
                  <SearchIcon />
                </InputGroupAddon>
              </InputGroup>

              <SelectSeparator className="my-2" />

              {isLoadingSuggestions && <div className="text-muted-foreground">Loading...</div>}
              {!isLoadingSuggestions && suggestions.length === 0 && <div className="text-muted-foreground">No hives found.</div>}
              {!isLoadingSuggestions && suggestions.map(suggestion => (
                <div key={suggestion.id} onClick={() => setHiveId(suggestion.id!)}
                  className="px-2 py-1 rounded-md hover:bg-accent hover:text-accent-foreground">
                  <HiveSelectionItem hive={suggestion} />
                </div>
              ))}
            </PopoverContent>
          </Popover>
        </HiveMimeBulletItem>
      }
    </div>
  )
});

function HiveSelectionItem({ hive }: { hive: HiveDto }) {
  return (
    <div className="flex flex-col w-full">
      <span>{hive.name}</span>
      <div className="text-muted-foreground text-sm flex flex-row gap-1 items-center">
        <User className="w-4" />
        {hive.followerCount}
        <FileChartColumn className="ml-2 w-4" />
        {hive.postCount}
      </div>
    </div>
  )
}