import { Button } from "@/components/ui/button";
import HexWrapper from "../utility/hm-hex-wrapper";
import { User2 } from "lucide-react";
import { UserDetailsDto, UserProfileDto } from "@/lib/Api";

interface UserAvatarProps {
    user: UserDetailsDto | UserProfileDto;
    size: number;
    borderColor?: string;
}

export function UserAvatar(props: UserAvatarProps) {
  const w = props.size;
  const h = w * 0.875;

  return (
    <HexWrapper pointRatio={0.25} borderColor={props.borderColor || "border"}>
        <Button style={{height: h, width: w}}>
            <User2 />
        </Button>
    </HexWrapper>
  );
}