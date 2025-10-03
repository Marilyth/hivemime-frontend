import { observer } from "mobx-react-lite";
import { HiveMimeBulletItem } from "../hm-bullet-item";
import { Select, SelectContent, SelectItem, SelectValue } from "../../select";
import { HiveMimeInlineSelectTrigger } from "../hm-inline-select";
import { HiveMimeCreatePollProps } from "./hm-create-single-choice-poll";


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