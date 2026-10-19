export function formatDate(
  value?: string
): string {
  if (!value) {
    return "";
  }

  const dateOnly =
    /^\d{4}-\d{2}-\d{2}$/.test(value);

  const date = dateOnly
    ? new Date(`${value}T12:00:00`)
    : new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  const day = date.getDate();

  const suffix =
    day % 10 === 1 &&
    day % 100 !== 11
      ? "st"
      : day % 10 === 2 &&
        day % 100 !== 12
      ? "nd"
      : day % 10 === 3 &&
        day % 100 !== 13
      ? "rd"
      : "th";

  const weekday =
    date.toLocaleDateString(
      "en-US",
      {
        weekday: "long",
      }
    );

  const month =
    date.toLocaleDateString(
      "en-US",
      {
        month: "long",
      }
    );

  const year =
    date.getFullYear();

  return `${weekday}, ${month} ${day}${suffix}, ${year}`;
}