import express from "express";
import cors from "cors";
import ical from "node-ical";

const app = express();
const port = 3001;

app.use(cors());

const MOODY_CALENDAR_URL =
  "https://moodycenteratx.com/?post_type=tribe_events&ical=1&eventDisplay=list";

const MENS_BASKETBALL_URL =
  "http://texaslonghorns.com/api/v2/Calendar/subscribe?type=ics&sportId=4&scheduleId=696&locationIndicator=H&downloadFile=false";

const WOMENS_BASKETBALL_URL =
  "http://texaslonghorns.com/api/v2/Calendar/subscribe?type=ics&sportId=11&scheduleId=702&downloadFile=false";

app.get("/api/moody-events", async (_request, response) => {
  try {
    const moody =
      await ical.async.fromURL(
        MOODY_CALENDAR_URL
      );
console.log(
  "Moody events:",
  Object.keys(moody).length
);
    const mens =
      await ical.async.fromURL(
        MENS_BASKETBALL_URL
      );
console.log(
  "Mens events:",
  Object.keys(mens).length
);
    const womens =
      await ical.async.fromURL(
        WOMENS_BASKETBALL_URL
      );
console.log(
  "Womens events:",
  Object.keys(womens).length
);
    const allEvents = [
      ...Object.values(moody),
      ...Object.values(mens),
      ...Object.values(womens),
    ];

    const now = new Date();

    const events = allEvents
      .filter(
        (item) =>
          item &&
          item.type === "VEVENT" &&
          item.start instanceof Date &&
          item.start >= now
      )
      .map((item) => ({
        id:
          item.uid ||
          `${item.summary}-${item.start.toISOString()}`,

        name:
          item.summary ||
          "Event",

        date:
          item.start.toISOString(),

        endDate:
          item.end instanceof Date
            ? item.end.toISOString()
            : "",

        location:
          item.location || "",

        description:
          item.description || "",

        url:
          item.url || "",
      }))
      .sort(
        (first, second) =>
          new Date(first.date).getTime() -
          new Date(second.date).getTime()
      );

    response.json(events);
  } catch (error) {
    console.error(error);

    response.status(500).json({
      message:
        "Unable to load events.",
    });
  }
});

app.listen(port, () => {
  console.log(
    `Moody event API running on http://localhost:${port}`
  );
});