import { createContext, useState } from "react";
import { Api, HiveDto, UserDetailsDto } from "./Api";
import { toast } from "sonner";

type UserContextType = {
  user: UserDetailsDto | null;
  setUser: React.Dispatch<React.SetStateAction<UserDetailsDto | null>>;
};

type FollowedHivesContextType = {
  followedHives: HiveDto[];
  setFollowedHives: React.Dispatch<React.SetStateAction<HiveDto[]>>;
};

type AccentColourContextType = {
  accentColour: string | null;
  setAccentColour: React.Dispatch<React.SetStateAction<string | null>>;
};

export const HiveMimeApiContext = createContext<Api<unknown>>(new Api({
    baseUrl: "http://localhost:5138",
    securityWorker: (securityData) =>
      securityData ? { headers: { Authorization: `Bearer ${securityData}` } } : undefined,
    customFetch: async (input, init) => {
      const response = await fetch(input, init);
      
      if (response.ok)
        return response;
      const errorData = await response.json();
      
      console.log("Request failed:", errorData);
      let errorMessage: string = "";

      if (response.status === 400 || response.status === 404) {
        errorMessage = errorData.error;
      }
      else {
        errorMessage = `The server encountered an error. Please try again later. ${errorData.error ?? ""}`;
      }

      toast.error(errorMessage, { closeButton: true, duration: Infinity, richColors: true });
      throw new Error(`Request failed with status ${response.status}`);
    },
  }));

export const UserContext = createContext<UserContextType | null>(null);
export const FollowedHivesContext = createContext<FollowedHivesContextType | null>(null);
export const AccentColourContext = createContext<AccentColourContextType | null>(null);