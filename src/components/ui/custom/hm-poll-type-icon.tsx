"use client";

import { PollAnswerType } from "@/lib/Api";
import { ArrowDownWideNarrow, BadgeQuestionMark, CopyCheck, SquareCheck, Tag } from "lucide-react";
import { observer } from "mobx-react-lite";

type HiveMimePollTypeIconProps = React.ComponentProps<typeof ArrowDownWideNarrow> & {
    answerType?: PollAnswerType;
};

export const HiveMimePollTypeIcon = observer(({ answerType, ...props }: HiveMimePollTypeIconProps) => {
    switch (answerType) {
      case PollAnswerType.SingleChoice:
        return <SquareCheck {...props} className={props.className} />;
      case PollAnswerType.MultipleChoice:
        return <CopyCheck {...props} className={props.className} />;
      case PollAnswerType.Ranking:
        return <ArrowDownWideNarrow {...props} className={props.className} />;
      case PollAnswerType.Categorization:
        return <Tag {...props} className={props.className} />;
      default:
        return <BadgeQuestionMark {...props} className={props.className} />;
    }
});
