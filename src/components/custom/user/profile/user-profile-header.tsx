import { UserProfileDto } from "@/lib/Api";
import { useQueryParam } from "../../utility/use-query-param";
import { UserAvatar } from "../user-avatar";
import { Progress } from "@/components/ui/progress";
import { honeyToLevel } from "@/lib/utils";
import HexWrapper from "../../utility/hm-hex-wrapper";
import { Badge } from "@/components/ui/badge";

interface UserProfileHeaderProps {
  user: UserProfileDto;
}

export function UserProfileHeader(props: UserProfileHeaderProps) {
  const currentLevel = Math.floor(honeyToLevel(props.user.honey!));
  const currentLevelProgress =
    (honeyToLevel(props.user.honey!) - currentLevel) * 100;

  function formatDate(dateString: string) {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
    });
  }

  return (
    <div className="flex flex-row items-center gap-2 w-full">
      <UserAvatar
        user={props.user}
        size={64}
      />

      <div className="flex flex-col flex-1 gap-2">
        <div className="flex items-center justify-between gap-4">
          <div className="text-xl font-semibold">
            {props.user.username}
          </div>

          <HexWrapper>
            <Badge className="bg-popover text-honey-brown text-sm font-medium">
              🍯 {props.user.honey?.toFixed(2)}
            </Badge>
          </HexWrapper>
        </div>

        <div className="flex items-center gap-2 pr-2">
          <Progress value={currentLevelProgress} className="h-2 flex-1 rounded-full" />
          <span className="text-xs text-muted-foreground whitespace-nowrap">
            Lv. {currentLevel}
          </span>
        </div>
      </div>
    </div>
    
  );
}