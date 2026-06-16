export const formatDate = (date?: Date | null) =>
  date
    ? new Intl.DateTimeFormat("en-AU", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }).format(date)
    : "—";

export const inputDate = (date?: Date | null) => date?.toISOString().slice(0, 10) ?? "";

export const percentage = (part: number, total: number) =>
  total ? `${Math.round((part / total) * 100)}%` : "0%";
