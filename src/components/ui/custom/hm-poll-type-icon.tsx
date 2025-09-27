"use client";

import { PollType } from "@/lib/Api";
import { ArrowDownWideNarrow, BadgeQuestionMark, CopyCheck, SquareCheck, Tag, SlidersHorizontal } from "lucide-react";
import { observer } from "mobx-react-lite";

type HiveMimePollTypeIconProps = React.ComponentProps<typeof ArrowDownWideNarrow> & {
    answerType?: PollType;
};

export const HiveMimePollTypeIcon = observer(({ answerType, ...props }: HiveMimePollTypeIconProps) => {
    switch (answerType) {
      case PollType.Value0:
        return <SquareCheck {...props} className={props.className} />;
      case PollType.Value1:
        return <CopyCheck {...props} className={props.className} />;
      case PollType.Value2:
        return <SlidersHorizontal {...props} className={props.className} />;
      case PollType.Value3:
        return <ArrowDownWideNarrow {...props} className={props.className} />;
      case PollType.Value4:
        return <Tag {...props} className={props.className} />;
      default:
        return <BadgeQuestionMark {...props} className={props.className} />;
    }
});
