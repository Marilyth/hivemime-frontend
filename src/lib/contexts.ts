import { createContext, useState } from "react";
import { Api, HiveDto, UserDetailsDto } from "./Api";

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
    baseUrl: "http://192.168.178.52:8080",
    securityWorker: (securityData) =>
      securityData ? { headers: { Authorization: `Bearer ${securityData}` } } : undefined,
  }));

export const UserContext = createContext<UserContextType | null>(null);
export const FollowedHivesContext = createContext<FollowedHivesContextType | null>(null);
export const AccentColourContext = createContext<AccentColourContextType | null>(null);