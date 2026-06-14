import { Button } from "@/components/ui/button";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { PollDto, PollVoteDto, PollType } from "@/lib/Api";
import { api } from "@/lib/contexts";
import { useQuery } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useDebounce } from "../../utility/debounce";
import { normalize } from "@/lib/utils";

export interface CustomCandidateInputProps {
  poll: PollDto;
  pollVote: PollVoteDto;
}

export const CustomCandidateInput = ({ poll, pollVote }: CustomCandidateInputProps) => {
  const { t } = useTranslation();
  const [value, setValue] = useState<string>("");
  const [debouncedInput, isLoading] = useDebounce(value, 300);
  const canAddCustomCandidate = poll.allowedCustomCandidateCount! > poll.candidates?.filter(c => c.isCustom).length!;

  const { data } = useQuery({
    queryKey: ["customCandidates", poll.id, debouncedInput],
    queryFn: async () => {
      const response = await api.api.postCustomCandidateSuggestionsList({ pollId: poll.id, query: debouncedInput });
      return response;
    },
    enabled: debouncedInput.trim().length >= 3,
  });

  function handleAdd(value: string) {
    const normalizedValue = normalize(value, false);

    if (normalizedValue.length === 0)
      return;

    if (poll.candidates?.some(c => normalize(c.name!, false) === normalizedValue)) {
      setValue("");
      return;
    }

    let candidateValue: number | null = null;
    let insertIndex = poll.candidates!.length;

    if (poll.pollType === PollType.Choice)
      candidateValue = 1;

    else if (poll.pollType === PollType.Rank)
    {
      const rankEndIndex = pollVote.candidates!.findIndex(c => c.value == null);
      candidateValue = (rankEndIndex === -1 ? pollVote.candidates!.length : rankEndIndex) + 1;

      if (rankEndIndex !== -1)
        insertIndex = rankEndIndex;
    }

    poll.candidates!.splice(insertIndex, 0, { name: value, id: undefined, description: "", isCustom: true });
    pollVote.candidates!.splice(insertIndex, 0, { name: value,
      id: null,
      value: candidateValue });

    setValue("");
  }

  if (!canAddCustomCandidate)
    return null;

  return (
    <Popover>
      <PopoverTrigger className="w-full">
        <InputGroup>
          <InputGroupAddon align="inline-end">
            <Button variant="ghost" className="h-auto" onClick={() => handleAdd(value)} disabled={value.trim().length === 0}>
              <Plus />
            </Button>
          </InputGroupAddon>
          <InputGroupInput
            placeholder={t("posts:vote.addCustomCandidate")}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleAdd(value);
              }
            }}
          />
        </InputGroup>
      </PopoverTrigger>
      
        <PopoverContent align="start" className="min-w-40 w-full p-0" onOpenAutoFocus={e => e.preventDefault()}>
          <div className="flex flex-col">
            {data?.data.map((candidate) => (
              <Button
                key={candidate.id}
                variant="ghost"
              className="border-b rounded-none justify-start"
              onClick={() => handleAdd(candidate.name!)}
            >
              {candidate.name}
            </Button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}