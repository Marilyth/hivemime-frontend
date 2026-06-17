import { createContext } from "react";
import { Api, HiveUserDto, UserDetailsDto } from "./Api";
import { makeAutoObservable } from "mobx";
import { toast } from "sonner";
import i18n from "./i18n";

class UserStore {
  user: UserDetailsDto | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  setUser(user: UserDetailsDto | null) {
    this.user = user;
  }
}

class FollowedHivesStore {
  followedHives: Map<string, HiveUserDto> = new Map();

  constructor() {
    makeAutoObservable(this);
  }

  setFollowedHives(hives: HiveUserDto[]) {
    this.followedHives.clear();
    
    hives.forEach(hive => {
      if (hive.hive?.id != null) {
        this.followedHives.set(hive.hive.id, hive);
      }
    });
  }

  addFollowedHive(hive: HiveUserDto) {
    if (hive.hive?.id != null) {
      this.followedHives.set(hive.hive.id, hive);
    }
  }

  removeFollowedHive(hiveId: string) {
    this.followedHives.delete(hiveId);
  }
}

type AccentColourContextType = {
  accentColour: string | null;
  setAccentColour: React.Dispatch<React.SetStateAction<string | null>>;
};

export const api = new Api({
  baseUrl: "http://localhost:5138",
  securityWorker: (token) =>
    token ? { headers: { Authorization: `Bearer ${token}` } } : undefined,
  customFetch: async (input, init) => {
    let response!: Response;

    // Retry if rate limited up to 3 times.
    for (let attempt = 0; attempt < 1; attempt++) {
      response = await fetch(input, init);

      if (response.status !== 429)
        break;

      const retryAfter = Number(response.headers.get("Retry-After")) || 1;
      const cumulativeWait = retryAfter * (attempt + 1);

      const promise = new Promise(resolve => setTimeout(resolve, retryAfter * 1000));

      if (cumulativeWait > 5) {
        await toast.promise(promise, {
          loading: i18n.t("toasts:requestRetrying", { attempt: attempt + 1, seconds: retryAfter })
        }).unwrap();
      } else {
        await promise;
      }
    }

    const responseText = await response.clone().text();
    let data: unknown = null;

    if (responseText) {
      try {
        data = JSON.parse(responseText);
      } catch {
        data = null;
      }
    }

    if (response.ok)
    {
      const honeyDelta = (data as { honeyDelta?: number } | null)?.honeyDelta;
      if (honeyDelta && userStore.user)
        userStore.user.honey = (userStore.user.honey ?? 0) + honeyDelta;

      if (data != null) {
        const headers = new Headers(response.headers);
        headers.delete("content-length");
        return new Response(JSON.stringify(data), {
          status: response.status,
          statusText: response.statusText,
          headers,
        });
      }

      return response;
    }
    
    const errorMessage = (data as { error?: string } | null)?.error;
    toast.error(errorMessage ?? i18n.t("toasts:requestFailed"), { closeButton: true, duration: 5, richColors: true });
    throw new Error(`Request failed with status ${response.status}`);
  },
});

export const userStore = new UserStore();
export const followedHivesStore = new FollowedHivesStore();

export const AccentColourContext = createContext<AccentColourContextType | null>(null);
