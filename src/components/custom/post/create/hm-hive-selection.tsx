"use client";

import { Select, SelectContent, SelectItem, SelectSeparator, SelectValue } from "@/components/ui/select";
import { useContext, useEffect, useRef, useState } from "react";
import { HiveMimeInlineSelectTrigger } from "../../utility/hm-inline-select";
import { observer } from "mobx-react-lite";
import { CreatePostDto, HiveDto } from "@/lib/Api";
import { useSearchParams } from "next/navigation";
import { HiveMimeApiContext } from "@/lib/contexts";
import { HiveMimeBulletItem } from "../../utility/hm-bullet-item";
import { FileChartColumn, SearchIcon, User } from "lucide-react";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";

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
      const response = await hiveMimeService.api.hiveGetList({hiveId: hiveId!});
      const hive = response.data;

      hiveNameCache.set(hiveId, hive);
    }

    props.post.hiveId = hiveId;
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

      {props.post.hiveId != undefined &&
        <HiveMimeBulletItem>
          It will be posted into
          <Select
            onOpenChange={(open) => {
              if (open) {
                requestAnimationFrame(() => {
                  inputRef.current?.focus();
                });
              }
            }}
            value={props.post.hiveId.toString()}
            onValueChange={(value) => props.post.hiveId = Number(value)}>
            <HiveMimeInlineSelectTrigger>
              {hiveNameCache.get(props.post.hiveId!)?.name ?? "Select hive"}
            </HiveMimeInlineSelectTrigger>
            <SelectContent className="flex flex-col max-h-320 overflow-y-auto text-sm">
              <InputGroup>
                <InputGroupInput placeholder="Search..." ref={inputRef} onBlur={e => e.currentTarget.focus()}
                  value={hiveSearchInput} onChange={(e) => setHiveSearchInput(e.target.value)} />
                <InputGroupAddon className="pl-2">
                  <SearchIcon />
                </InputGroupAddon>
              </InputGroup>
              
              <SelectSeparator className="my-2" />

              {isLoadingSuggestions && <div className="text-muted-foreground">Loading...</div>}
              {!isLoadingSuggestions && suggestions.length === 0 && <div className="text-muted-foreground">No hives found.</div>}
              {!isLoadingSuggestions && suggestions.map(suggestion => (
                <SelectItem key={suggestion.id} value={suggestion.id!.toString()} className="hover:bg-accent hover:text-accent-foreground">
                  <HiveSelectionItem hive={suggestion} />
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </HiveMimeBulletItem>
      }
    </div>
  )
});

function HiveSelectionItem({ hive }: { hive: HiveDto }) {
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