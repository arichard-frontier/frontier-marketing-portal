const ical = require("node-ical");

const MOODY_CALENDAR_URL =
  "https://moodycenteratx.com/?post_type=tribe_events&ical=1&eventDisplay=list";

const MENS_BASKETBALL_URL =
  "https://texaslonghorns.com/api/v2/Calendar/subscribe?type=ics&sportId=4&scheduleId=696&locationIndicator=H&downloadFile=false";

const WOMENS_BASKETBALL_URL =
  "https://texaslonghorns.com/api/v2/Calendar/subscribe?type=ics&sportId=11&scheduleId=702&downloadFile=false";

async function loadCalendar(url) {
  try {
    const calendar = await ical.async.fromURL(url);
    return Object.values(calendar);
  } catch (error) {
    return [];
  }
}

module.exports = async function (context, req) {
  try {
    const [
      moodyEvents,
      mensEvents,
      womensEvents,
    ] = await Promise.all([
      loadCalendar(MOODY_CALENDAR_URL),
      loadCalendar(MENS_BASKETBALL_URL),
      loadCalendar(WOMENS_BASKETBALL_URL),
    ]);

    const allEvents = [
      ...moodyEvents,
      ...mensEvents,
      ...womensEvents,
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
          item.summary || "Event",

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
        (a, b) =>
          new Date(a.date).getTime() -
          new Date(b.date).getTime()
      );

    context.res = {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
      body: events,
    };
  } catch (error) {
    context.res = {
      status: 500,
      body: {
        message: "Unable to load events.",
      },
    };
  }
};