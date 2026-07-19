"use client";

import { observer } from "mobx-react-lite";
import { HiveMimeCreatePollProps } from "./hm-create-choice-poll";
import { HiveMimeBulletItem } from "../../utility/hm-bullet-item";
import { Trans } from "react-i18next";
import { Select, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { HiveMimeInlineSelectTrigger } from "../../utility/hm-inline-select";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { mediaFiles } from "./hm-create-post";
import { getImageDimensions, getReferenceId } from "@/lib/utils";
import { useEffect, useState } from "react";
import { CellSelection, DrawPicker, Variant } from "../../utility/draw-picker";
import { mutedColors } from "@/lib/colors";


export const HiveMimeCreateDrawRules = observer((props: HiveMimeCreatePollProps) =>  {
  const candidate = props.poll.candidates![0];
  const candidateMedia = mediaFiles.get(getReferenceId(candidate));
  const [candidateObjectUrl, setCandidateObjectUrl] = useState<string | null>(null);

  const [maxRows, setMaxRows] = useState<number>(64);
  const [maxColumns, setMaxColumns] = useState<number>(64);

  function updateRowCount(value: string) {
    props.poll.rows = Number(value);
    props.poll.maxVotesPerCandidate = props.poll.rows! * props.poll.columns!;
  }

  function updateColumnCount(value: string) {
    props.poll.columns = Number(value);
    props.poll.maxVotesPerCandidate = props.poll.rows! * props.poll.columns!;
  }

  async function initializeGridDimensions() {
    if (!candidateMedia)
      return;

    const candidateUrl = URL.createObjectURL(candidateMedia!);
    setCandidateObjectUrl(candidateUrl);

    const dimensions = await getImageDimensions(candidateMedia);
    const aspectRatio = dimensions.width / dimensions.height;

    const maxRows = Math.min(64, dimensions.height);
    const maxColumns = Math.min(64, dimensions.width);

    setMaxRows(maxRows);
    setMaxColumns(maxColumns);

    if (!props.poll.rows) {
      if (aspectRatio >= 1) {
        props.poll.columns = Math.min(maxColumns, Math.floor(dimensions.width));
        props.poll.rows = Math.floor(props.poll.columns / aspectRatio);
      }

      else {
        props.poll.rows = Math.min(maxRows, Math.floor(dimensions.height));
        props.poll.columns = Math.floor(props.poll.rows * aspectRatio);
      }

      props.poll.maxVotesPerCandidate = props.poll.rows! * props.poll.columns!;
    }
  }

  useEffect(() => {
    initializeGridDimensions();
  }, [candidate]);

  return (
    <div>
      <HiveMimeBulletItem>
        <Trans
          i18nKey="posts:create.rules.rowCount"
          components={{
            select: (
              <Select
                value={props.poll.rows?.toString() ?? "1"}
                onValueChange={updateRowCount}>
                <HiveMimeInlineSelectTrigger>
                  <SelectValue />
                </HiveMimeInlineSelectTrigger>
                <SelectContent>
                  {[...Array(maxRows).keys()].map(i => (
                    <SelectItem key={i} value={(i + 1).toString()}>{(i + 1).toString()}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ),
          }}
        />
      </HiveMimeBulletItem>

      <HiveMimeBulletItem>
        <Trans
          i18nKey="posts:create.rules.columnCount"
          components={{
            select: (
              <Select
                value={props.poll.columns?.toString() ?? "1"}
                onValueChange={updateColumnCount}>
                <HiveMimeInlineSelectTrigger>
                  <SelectValue />
                </HiveMimeInlineSelectTrigger>
                <SelectContent>
                  {[...Array(maxColumns).keys()].map(i => (
                    <SelectItem key={i} value={(i + 1).toString()}>{(i + 1).toString()}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ),
          }}
        />
      </HiveMimeBulletItem>
      {candidateObjectUrl && (
        <DrawPicker
          src={candidateObjectUrl}
          cellSelection={new CellSelection(props.poll.rows!, props.poll.columns!, 1)}
          variant={Variant.View} 
          className="mt-2"
          canvasProps={{
            alwaysShowGrid: true,
            gridColor: mutedColors.gray,
          }}
        />
      )}
    </div>
  );
});
