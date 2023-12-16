"use client";

import { useEffect, useState } from "react";

const relativeFormatter = new Intl.RelativeTimeFormat("en-US", {
  style: "long",
});

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  timeStyle: "short",
  dateStyle: "medium",
});

const formatDate = (date: Date): string => {
  const diff = date.getTime() - new Date().getTime();
  if (diff > -60000)
    return relativeFormatter.format(Math.round(diff / 1000), "second");
  if (diff > -3600000)
    return relativeFormatter.format(Math.round(diff / 60000), "minute");
  if (diff > -86400000)
    return relativeFormatter.format(Math.round(diff / 3600000), "hour");
  if (diff > -604800000)
    return relativeFormatter.format(Math.round(diff / 86400000), "day");
  return `on ${dateFormatter.format(date)}`;
};

export const Time = ({
  date,
  ...otherProps
}: { date: Date } & Omit<
  React.ComponentProps<"time">,
  "title" | "dateTime"
>) => {
  const [formattedDate, setFormattedDate] = useState<
    | {
        relative: string;
        absolute: string;
      }
    | undefined
  >();

  useEffect(() => {
    setFormattedDate({
      relative: formatDate(date),
      absolute: dateFormatter.format(date),
    });
  }, []);

  return (
    <time
      dateTime={date.toISOString()}
      title={formattedDate?.absolute ?? date.toUTCString()}
      {...otherProps}
    >
      {formattedDate?.relative ?? date.toUTCString()}
    </time>
  );
};
