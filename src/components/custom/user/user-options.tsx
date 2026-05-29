"use client"

import {
  Settings,
  User2,
  LogOut,
} from "lucide-react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "../../ui/button"
import { api, followedHivesStore, userStore } from "@/lib/contexts"
import { useEffect, useRef, useState } from "react"
import { getCurrentUser, logInAnonymously, logOut } from "@/lib/firebase"
import { User } from "firebase/auth"
import { LoginForm } from "./login-dialog"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { SelectSeparator } from "@/components/ui/select"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { observer } from "mobx-react-lite"
import { reaction } from "mobx"
import { UserAvatar } from "./user-avatar"
import { useTranslation } from "react-i18next"

export const UserOptions = observer(() => {
  const { t } = useTranslation();
  const router = useRouter();
  const [currentFirebaseUser, setCurrentFirebaseUser] = useState<User | null>(null);
  const [isLoginDialogOpen, setIsLoginDialogOpen] = useState(false);

  async function autoLogIn(){
    const user = await getCurrentUser() || (await logInAnonymously()).user;
    const token = await user.getIdToken();

    api.setSecurityData(token);

    const previousUser = currentFirebaseUser;
    setCurrentFirebaseUser(user);

    const userDetailsResponse = await api.api.userLoginList();

    if (previousUser?.uid !== user.uid
        && previousUser?.isAnonymous) {
      await api.api.userMergeList({previousJwt: await previousUser.getIdToken()});
    }

    const followedHivesResponse = await api.api.hiveJoinedList();

    userStore!.setUser(userDetailsResponse.data);
    followedHivesStore!.setFollowedHives(followedHivesResponse.data);

    return userDetailsResponse.data;
  }

  async function logOutSession() {
    await logOut();
    userStore!.setUser(null);
  }

  useEffect(() => {
    const dispose = reaction(
      () => userStore.user,
      (user) => {
        setIsLoginDialogOpen(false);

        if (!user) {
          toast.promise(autoLogIn(), {
            loading: t("toasts:auth.loggingIn"),
            success: (u) => t("toasts:auth.loggedInAs", { username: u.username }),
            error: t("toasts:auth.loginFailed"),
          });
        }
      },
      { fireImmediately: true }
    );

    return () => dispose();
  }, []);

  return (
    <div>
      <Dialog open={isLoginDialogOpen} onOpenChange={setIsLoginDialogOpen}>
        <DialogContent>
          <DialogTitle>{t("auth:login.title")}</DialogTitle>
          <LoginForm />
        </DialogContent>
      </Dialog>
      
      {currentFirebaseUser == null || currentFirebaseUser?.isAnonymous ?
        <Button
          variant="link"
          onClick={() => setIsLoginDialogOpen(true)}
        >
          {t("auth:login.title")}
        </Button>
      :
        <DropdownMenu>
          <DropdownMenuTrigger>
            <UserAvatar user={userStore.user!} size={40} />
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            align="end"
            sideOffset={4}
          >
            <div className="text-muted-foreground text-sm mb-2 px-2 py-2">
              {t("auth:userOptions.greeting", { username: userStore?.user?.username })}
            </div>
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={() => router.push("/user?userId=" + userStore.user?.id)}>
                <User2 />
                {t("auth:userOptions.profile")}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push("/user/settings")}>
                <Settings />
                {t("auth:userOptions.settings")}
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <SelectSeparator />
            <DropdownMenuItem onClick={logOutSession}>
              <LogOut />
              {t("auth:userOptions.logOut")}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      }
    </div>
  )
});
