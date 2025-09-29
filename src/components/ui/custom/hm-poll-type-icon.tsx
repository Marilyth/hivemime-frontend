"use client";

import { PollType } from "@/lib/Api";
import { ArrowDownWideNarrow, BadgeQuestionMark, CopyCheck, SquareCheck, Tag, SlidersHorizontal } from "lucide-react";
import { FaRankingStar } from "react-icons/fa6";
import { observer } from "mobx-react-lite";

type HiveMimePollTypeIconProps = React.ComponentProps<typeof ArrowDownWideNarrow> & {
    answerType?: PollType;
};

export const HiveMimePollTypeIcon = observer(({ answerType, ...props }: HiveMimePollTypeIconProps) => {
    switch (answerType) {
      case PollType.SingleChoice:
        return <SquareCheck {...props} className={props.className} />;
      case PollType.MultipleChoice:
        return <CopyCheck {...props} className={props.className} />;
      case PollType.Rating:
        return <SlidersHorizontal {...props} className={props.className} />;
      case PollType.Ranking:
        return <FaRankingStar {...props} className={props.className} />;
      case PollType.Categorization:
        return <Tag {...props} className={props.className} />;
      default:
        return <BadgeQuestionMark {...props} className={props.className} />;
    }
});
