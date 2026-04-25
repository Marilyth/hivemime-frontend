import { createContext } from "react";
import { Api, HiveDto, UserDetailsDto } from "./Api";
import { makeAutoObservable } from "mobx";
import { toast } from "sonner";

class UserStore {
  user: UserDetailsDto | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  setUser(user: UserDetailsDto | null) {
    this.user = user;
  }
}

type FollowedHivesContextType = {
  followedHives: HiveDto[];
  setFollowedHives: React.Dispatch<React.SetStateAction<HiveDto[]>>;
};

type AccentColourContextType = {
  accentColour: string | null;
  setAccentColour: React.Dispatch<React.SetStateAction<string | null>>;
};

export const api = new Api({
  baseUrl: "https://home.mayiscoding.com/hivemime",
  securityWorker: (token) =>
    token ? { headers: { Authorization: `Bearer ${token}` } } : undefined,
  customFetch: async (input, init) => {
    const response = await fetch(input, init);

    const responseText = await response.clone().text();
    const data = await responseText ? JSON.parse(responseText) : null;

    if (response.ok)
    {
      if (data?.honeyDelta)
        userStore.user!.honey += data.honeyDelta;

      return response;
    }
    
    toast.error(data.error ?? "Request failed", { closeButton: true, duration: Infinity, richColors: true });
    throw new Error(`Request failed with status ${response.status}`);
  },
});

export const userStore = new UserStore();

export const FollowedHivesContext = createContext<FollowedHivesContextType | null>(null);
export const AccentColourContext = createContext<AccentColourContextType | null>(null);
