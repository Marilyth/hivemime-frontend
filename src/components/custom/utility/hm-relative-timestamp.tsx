"use client";

import { useTranslation } from "react-i18next";

export const HiveMimeRelativeTimestamp = ({ timestamp }: { timestamp: string }) => {
  const { t } = useTranslation();
  const date = new Date(timestamp);
  if (isNaN(date.getTime())) return "";

  const diff = Date.now() - date.getTime();
  const absoluteDiff = Math.abs(diff);

  const seconds = Math.floor(absoluteDiff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  const format = (v: number, singularKey: string, pluralKey: string) =>
    `${v} ${t(v !== 1 ? pluralKey : singularKey)}`;

  let result = "";

  if (years) result = format(years, "settings:timestamp.year", "settings:timestamp.years");
  else if (months) result = format(months, "settings:timestamp.month", "settings:timestamp.months");
  else if (weeks) result = format(weeks, "settings:timestamp.week", "settings:timestamp.weeks");
  else if (days) result = format(days, "settings:timestamp.day", "settings:timestamp.days");
  else if (hours) result = format(hours, "settings:timestamp.hour", "settings:timestamp.hours");
  else if (minutes) result = format(minutes, "settings:timestamp.minute", "settings:timestamp.minutes");
  else result = format(seconds, "settings:timestamp.second", "settings:timestamp.seconds");

  if (diff < 0) return t("settings:timestamp.in", { time: result });
  return t("settings:timestamp.ago", { time: result });
};
