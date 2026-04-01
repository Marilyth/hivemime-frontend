import { observer } from "mobx-react-lite";
import { HiveMimeBulletItem } from "../../utility/hm-bullet-item";
import { HiveMimeInlineInput } from "../../utility/hm-embedded-input";
import { Select, SelectContent, SelectItem, SelectValue } from "../../../ui/select";
import { HiveMimeInlineSelectTrigger } from "../../utility/hm-inline-select";
import { HiveMimeCreatePollProps } from "./hm-create-choice-poll";


export const HiveMimeCreateMinvoteRule = observer((props: HiveMimeCreatePollProps) =>  {
  return (
    <HiveMimeBulletItem>
        The user has to vote for at least
        <HiveMimeInlineInput max={props.poll.candidates?.length} min={1}
          value={props.poll.minVotes ?? 1} onChange={(e) => props.poll.minVotes = Number(e.target.value)} />
        candidates.
    </HiveMimeBulletItem>
  );
});

export const HiveMimeCreateMaxvoteRule = observer((props: HiveMimeCreatePollProps) =>  {
  return (
    <HiveMimeBulletItem>
        The user can vote for up to
        <HiveMimeInlineInput max={props.poll.candidates?.length} min={1}
          value={props.poll.maxVotes == -1 ? props.poll.candidates!.length : props.poll.maxVotes!} onChange={(e) => props.poll.maxVotes = Number(e.target.value)} />
        candidates.
    </HiveMimeBulletItem>
  );
});

export const HiveMimeCreateShuffleRule = observer((props: HiveMimeCreatePollProps) =>  {
  return (
    <HiveMimeBulletItem>
        The candidates
        <Select
        value={props.poll.isShuffled ? "true" : "false"}
        onValueChange={(value) => props.poll.isShuffled = value === "true"}>
        <HiveMimeInlineSelectTrigger>
            <SelectValue />
        </HiveMimeInlineSelectTrigger>
        <SelectContent>
            <SelectItem value="true">are</SelectItem>
            <SelectItem value="false">are not</SelectItem>
        </SelectContent>
        </Select>
        shuffled for the user.
    </HiveMimeBulletItem>
  );
});