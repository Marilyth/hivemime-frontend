import type { ComponentType } from "react";
import { PollType } from "@/lib/Api";
import { ChoiceEditor } from "./hm-builder-choice";
import { ScoreEditor } from "./hm-builder-score";
import { RankEditor } from "./hm-builder-rank";
import { CategoryEditor } from "./hm-builder-category";
import { GridEditor } from "./hm-builder-grid";
import { DateEditor } from "./hm-builder-date";
import { HiveMimeFilterConditionEditorProps } from "./hm-builder-editor";

export const editorMapping: { [key in PollType]: ComponentType<HiveMimeFilterConditionEditorProps> } = {
    [PollType.Choice]: ChoiceEditor,
    [PollType.Score]: ScoreEditor,
    [PollType.Rank]: RankEditor,
    [PollType.Category]: CategoryEditor,
    [PollType.Grid]: GridEditor,
    [PollType.Date]: DateEditor,
};
