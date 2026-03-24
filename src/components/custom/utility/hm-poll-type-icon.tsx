"use client";

import { PollType } from "@/lib/Api";
import { ArrowDownWideNarrow, BadgeQuestionMark, CopyCheck, Tag, SlidersHorizontal } from "lucide-react";
import { FaRankingStar } from "react-icons/fa6";
import { observer } from "mobx-react-lite";

type HiveMimePollTypeIconProps = React.ComponentProps<typeof ArrowDownWideNarrow> & {
    answerType?: PollType;
};

export const HiveMimePollTypeIcon = observer(({ answerType, ...props }: HiveMimePollTypeIconProps) => {
    switch (answerType) {
      case PollType.Choice:
        return <CopyCheck {...props} className={props.className} />;
      case PollType.Score:
        return <SlidersHorizontal {...props} className={props.className} />;
      case PollType.Rank:
        return <FaRankingStar {...props} className={props.className} />;
      case PollType.Category:
        return <Tag {...props} className={props.className} />;
      default:
        return <BadgeQuestionMark {...props} className={props.className} />;
    }
});
