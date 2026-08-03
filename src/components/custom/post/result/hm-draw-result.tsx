import { useQuery } from "@tanstack/react-query";
import { HiveMimePollResultProps as HiveMimePollCandidateResultProps } from "./hm-poll-result";
import { api } from "@/lib/contexts";
import { useTranslation } from "react-i18next";
import { CellSelection, DrawPicker, Variant } from "../../utility/draw-picker";


export function HiveMimeDrawResult(props: HiveMimePollCandidateResultProps) {
  const { t } = useTranslation();
  const data = useQuery({
    queryKey: ["poll-result", props.poll.id, JSON.stringify(props.filter)],
    queryFn: async () => {
      const r = await api.api.postDrawResultCreate(props.filter!, { pollId: props.poll.id! });
      return r.data;
    },
    staleTime: 0
  });

  if (!data.data)
    return (
      <div>
        Loading...
      </div>
    );

  return (
    <div className="flex flex-col gap-2">
      {props.poll.candidates!.map((candidate, i) => {
        const resultCandidate = data.data!.candidates!.find(rc => rc.id === candidate.id);
        const cellSelection = new CellSelection(props.poll.rows!, props.poll.columns!, props.poll.maxVotesPerCandidate!);

        if (resultCandidate) {
          for (const cell of resultCandidate.distribution!) {
            cellSelection.cells[cell.cellIndex!].value = cell.value!;
          }
        }

        return (
          <DrawPicker
            key={i}
            cellSelection={cellSelection}
            variant={Variant.Result} 
            src={candidate.mediaKeys?.find(key => !key.endsWith("thumbnail.webp"))!}
          />
        );
      })}
    </div>
  );
}
