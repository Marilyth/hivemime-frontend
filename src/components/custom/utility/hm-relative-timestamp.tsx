export const HiveMimeRelativeTimestamp = ({ timestamp }: { timestamp: string }) => {
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

  const format = (v: number, unit: string) => `${v} ${unit}${v !== 1 ? "s" : ""}`;
  let result = "";

  if (years) result = format(years, "year");
  else if (months) result = format(months, "month");
  else if (weeks) result = format(weeks, "week");
  else if (days) result = format(days, "day");
  else if (hours) result = format(hours, "hour");
  else if (minutes) result = format(minutes, "minute");
  else result = format(seconds, "second");

  if (diff < 0) result = `in ${result}`;
  else result = `${result} ago`;
  
  return result;
};