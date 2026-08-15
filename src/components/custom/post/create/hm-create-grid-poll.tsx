"use client";

import { observer } from "mobx-react-lite";
import { HiveMimeCreatePollProps } from "./hm-create-choice-poll";
import { HiveMimeBulletItem } from "../../utility/hm-bullet-item";
import { Trans } from "react-i18next";
import { Select, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { HiveMimeInlineSelectTrigger } from "../../utility/hm-inline-select";
import { mediaFiles } from "./hm-create-post";
import { getImageDimensions, getReferenceId } from "@/lib/utils";
import { useEffect, useState } from "react";
import { CellSelection } from "../../utility/cell-selection";
import { GridPicker, Variant } from "../../utility/grid-picker";
import { mutedColors } from "@/lib/colors";

const MAX_CELLS = 20;

export const HiveMimeCreateGridRules = observer((props: HiveMimeCreatePollProps) =>  {
  const candidate = props.poll.candidates![0];
  const candidateMedia = mediaFiles.get(getReferenceId(candidate));
  const [candidateObjectUrl, setCandidateObjectUrl] = useState<string | null>(null);

  const [maxRows, setMaxRows] = useState<number>(64);
  const [maxColumns, setMaxColumns] = useState<number>(64);

  const totalCells = Math.max(1, (props.poll.rows ?? 1) * (props.poll.columns ?? 1));
  const maxSelectableCells = Math.min(MAX_CELLS, totalCells);
  const effectiveMin = Math.max(0, Math.min(props.poll.minVotesPerCandidate ?? 0, maxSelectableCells));

  if (props.poll.minVotesPerCandidate == null || props.poll.minVotesPerCandidate > maxSelectableCells)
    props.poll.minVotesPerCandidate = Math.min(props.poll.minVotesPerCandidate ?? 0, maxSelectableCells);

  if (props.poll.maxVotesPerCandidate == null || props.poll.maxVotesPerCandidate < 1 || props.poll.maxVotesPerCandidate > maxSelectableCells)
    props.poll.maxVotesPerCandidate = maxSelectableCells;

  function updateRowCount(value: string) {
    props.poll.rows = Number(value);
  }

  function updateColumnCount(value: string) {
    props.poll.columns = Number(value);
  }

  function updateMinCells(value: string) {
    const newValue = Number(value);
    props.poll.minVotesPerCandidate = newValue;

    if (newValue > props.poll.maxVotesPerCandidate!) {
      props.poll.maxVotesPerCandidate = newValue;
    }
  }

  function updateMaxCells(value: string) {
    props.poll.maxVotesPerCandidate = Number(value);
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

      props.poll.minVotesPerCandidate = 0;
      props.poll.maxVotesPerCandidate = Math.min(MAX_CELLS, props.poll.rows! * props.poll.columns!);
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

      <HiveMimeBulletItem>
        <Trans
          i18nKey="posts:create.rules.minCells"
          components={{
            select: (
              <Select
                value={props.poll.minVotesPerCandidate!.toString()}
                onValueChange={updateMinCells}>
                <HiveMimeInlineSelectTrigger>
                  <SelectValue />
                </HiveMimeInlineSelectTrigger>
                <SelectContent>
                  {[...Array(maxSelectableCells + 1).keys()].map(i => (
                    <SelectItem key={i} value={i.toString()}>{i.toString()}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ),
          }}
        />
      </HiveMimeBulletItem>

      <HiveMimeBulletItem>
        <Trans
          i18nKey="posts:create.rules.maxCells"
          components={{
            select: (
              <Select
                value={props.poll.maxVotesPerCandidate!.toString()}
                onValueChange={updateMaxCells}>
                <HiveMimeInlineSelectTrigger>
                  <SelectValue />
                </HiveMimeInlineSelectTrigger>
                <SelectContent>
                  {[...Array(maxSelectableCells - effectiveMin + 1).keys()].map(i => (
                    <SelectItem key={i} value={(effectiveMin + i).toString()}>{(effectiveMin + i).toString()}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ),
          }}
        />
      </HiveMimeBulletItem>

      {candidateObjectUrl && (
        <GridPicker
          src={candidateObjectUrl}
          cellSelection={new CellSelection(props.poll.rows!, props.poll.columns!, props.poll.maxVotesPerCandidate!)}
          variant={Variant.View} 
          className="mt-2"
          canvasProps={{
            gridColor: mutedColors.gray,
          }}
        />
      )}
    </div>
  );
});
