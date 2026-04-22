import { observer } from "mobx-react-lite";
import { HiveMimeBulletItem } from "../../utility/hm-bullet-item";
import { Select, SelectContent, SelectItem, SelectValue } from "../../../ui/select";
import { HiveMimeInlineSelectTrigger } from "../../utility/hm-inline-select";
import { HiveMimeCreatePollProps } from "./hm-create-choice-poll";


export const HiveMimeCreateMinvoteRule = observer((props: HiveMimeCreatePollProps) =>  {
  function updateMinVotes(value: string)  {
    const newValue = Number(value);
    props.poll.minVotes = newValue;

    if (newValue > props.poll.maxVotes!) {
      props.poll.maxVotes = newValue;
    }
  }

  return (
    <HiveMimeBulletItem>
        The user has to vote for at least
        <Select
          value={props.poll.minVotes!.toString()}
          onValueChange={updateMinVotes}>
          <HiveMimeInlineSelectTrigger>
              <SelectValue />
          </HiveMimeInlineSelectTrigger>
          <SelectContent>
            {[...Array(props.poll.candidates?.length ?? 0).keys()].map(i => (
              <SelectItem key={i} value={(i + 1).toString()}>{i + 1}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        candidates.
    </HiveMimeBulletItem>
  );
});

export const HiveMimeCreateMaxvoteRule = observer((props: HiveMimeCreatePollProps) =>  {
  return (
    <HiveMimeBulletItem>
        The user can vote for up to
        <Select
          value={props.poll.maxVotes!.toString()}
          onValueChange={(value) => props.poll.maxVotes = Number(value)}>
          <HiveMimeInlineSelectTrigger>
              <SelectValue />
          </HiveMimeInlineSelectTrigger>
          <SelectContent>
            {[...Array(props.poll.candidates!.length - props.poll.minVotes! + 1).keys()].map(i => (
              <SelectItem key={i} value={(props.poll.minVotes! + i).toString()}>{props.poll.minVotes! + i}</SelectItem>
            ))}
          </SelectContent>
        </Select>
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