import {
  FormEvent,
  useEffect,
  useMemo,
  useState,
} from "react";

import { create } from "../services/store";

type MoodyEvent = {
  id: string;
  name: string;
  date: string;
};

export default function MoodyCenterForm() {
  const [fullName, setFullName] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [branch, setBranch] =
    useState("");

  const [requestType, setRequestType] =
    useState("Personal");

  const [ticketQuantity, setTicketQuantity] =
    useState("");

  const [selectedEventId, setSelectedEventId] =
    useState("");

  const [customerDescription,
    setCustomerDescription] =
    useState("");

  const [customerList,
    setCustomerList] =
    useState("");

  const [hostName,
    setHostName] =
    useState("");

  const [additionalNotes,
    setAdditionalNotes] =
    useState("");

  const [events,
    setEvents] =
    useState<MoodyEvent[]>([]);

  const [loading,
    setLoading] =
    useState(true);

  useEffect(() => {
  const loadEvents = async () => {
    try {
      const response =
       await fetch(
  "/api/moody-events"
);


      console.log(
        "Response Status:",
        response.status
      );

      const data =
        await response.json();
       

      console.log(
        "Events returned:",
        data.length
      );

      console.log(data);

      setEvents(
        Array.isArray(data)
          ? data
          : []
      );
    } catch (error) {
      console.error(
        "Fetch Error:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  loadEvents();
}, []);

  const availableEvents =
    useMemo(() => {
      if (
        requestType !==
        "Personal"
      ) {
        return events;
      }

      const today =
        new Date();

      const sixtyDaysOut =
        new Date();

      sixtyDaysOut.setDate(
        today.getDate() + 60
      );

      return events.filter(
        (event) => {
          const eventDate =
            new Date(
              event.date
            );

          return (
            eventDate <=
            sixtyDaysOut
          );
        }
      );
    }, [
      events,
      requestType,
    ]);

  const selectedEvent =
    availableEvents.find(
      (event) =>
        event.id ===
        selectedEventId
    );

  const handleSubmit = async (
    e: FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    const request = await create({
        typeSlug:
          "moody-center",

        typeTitle:
          "Moody Center Request",

        workflow:
          "moody",

        requesterName:
          fullName,

        requesterEmail:
          email,

        branchDepartment:
          branch,

        dueDate:
          selectedEvent
            ?.date || "",

        assignedTo:
          "",

        details: {
          fullName,
          email,
          branch,

          requestType,

          eventName:
            selectedEvent
              ?.name || "",

          eventDate:
            selectedEvent
              ?.date || "",

          ticketQuantity,

          customerDescription,

          customerList,

          hostName,

          additionalNotes,
        },

        submitterNote:
          "",

        privateNote:
          "",
      });

    alert(
      `Request ${request.requestNumber} submitted successfully`
    );
  };

  return (
    <div className="page">
      <button
        className="back"
        type="button"
        onClick={() =>
          window.history.back()
        }
      >
        ← All request types
      </button>

      <div className="formCard">
        <div className="formHead">
          <span>🎟️</span>

          <div>
            <p className="eyebrow">
              MOODY CENTER
            </p>

            <h1>
              Moody Center Request
            </h1>

            <p>
              Request Moody
              Center tickets
              for personal
              or customer use.
            </p>
          </div>
        </div>

        <form
          onSubmit={
            handleSubmit
          }
        >
          <label>
            Name

            <input
              type="text"
              value={
                fullName
              }
              onChange={(
                e
              ) =>
                setFullName(
                  e.target
                    .value
                )
              }
            />
          </label>

          <label>
            Email

            <input
              type="email"
              value={
                email
              }
              onChange={(
                e
              ) =>
                setEmail(
                  e.target
                    .value
                )
              }
            />
          </label>

          <label>
  Branch

  <select
    value={branch}
    onChange={(e) =>
      setBranch(
        e.target.value
      )
    }
  >
    <option value="">
      Select Branch
    </option>

    <option>
      Elgin Headquarters
    </option>

    <option>
      Smithville Branch
    </option>

    <option>
      Smithville Commercial Office
    </option>

    <option>
      Manor Branch
    </option>

    <option>
      Bastrop Branch
    </option>

    <option>
      Bastrop Executive Office
    </option>

    <option>
      Georgetown Branch
    </option>

    <option>
      Taylor Branch
    </option>

    <option>
      Round Rock Branch
    </option>

    <option>
      Leander Branch
    </option>

    <option>
      Austin Commercial Office
    </option>

    <option>
      Buda Branch
    </option>
  </select>
</label>

          <label>
            Request Type

            <select
              value={
                requestType
              }
              onChange={(
                e
              ) =>
                setRequestType(
                  e.target
                    .value
                )
              }
            >
              <option>
                Personal
              </option>

              <option>
                Customer / Prospect
              </option>
            </select>
          </label>

          <label>
  Event

  <select
    value={selectedEventId}
    onChange={(e) =>
      setSelectedEventId(
        e.target.value
      )
    }
  >
    <option value="">
      Select Event
    </option>

    {availableEvents.map(
  (event) => (
    <option
      key={event.id}
      value={event.id}
    >
      {event.name} •{" "}
      {new Date(
        event.date
      ).toLocaleDateString(
        "en-US",
        {
          month: "short",
          day: "numeric",
          year: "numeric",
        }
      )}
    </option>
  )
)}
  </select>
</label>
<label>
  Number of Tickets Requested

  <input
    type="number"
    min="1"
    value={ticketQuantity}
    onChange={(e) =>
      setTicketQuantity(
        e.target.value
      )
    }
  />
</label>


          {requestType ===
            "Customer / Prospect" && (
            <>
              <label>
                Describe This Customer /
                Potential Customer And
                Their Business With Frontier

                <textarea
                  rows={6}
                  placeholder="Examples:

• Is Frontier their primary bank?
• Business account, personal account, or both?
• Approximate relationship value
• How long have they been a customer?
• Do they refer customers?
• Existing customer or prospect?"
                  value={
                    customerDescription
                  }
                  onChange={(
                    e
                  ) =>
                    setCustomerDescription(
                      e
                        .target
                        .value
                    )
                  }
                />
              </label>

              <label>
                Please List The Customers You Are Bringing

                <textarea
                  rows={4}
                  placeholder="One customer per line."
                  value={
                    customerList
                  }
                  onChange={(
                    e
                  ) =>
                    setCustomerList(
                      e
                        .target
                        .value
                    )
                  }
                />
              </label>

              <label>
                Who Is Hosting These Customers?

                <textarea
                  rows={3}
                  placeholder="N/A is not accepted."
                  value={
                    hostName
                  }
                  onChange={(
                    e
                  ) =>
                    setHostName(
                      e
                        .target
                        .value
                    )
                  }
                />
              </label>
            </>
          )}

          <label>
            Additional Notes

            <textarea
              rows={4}
              value={
                additionalNotes
              }
              onChange={(
                e
              ) =>
                setAdditionalNotes(
                  e.target
                    .value
                )
              }
            />
          </label>

          <div className="actions">
            <button
              type="submit"
              className="primary"
            >
              Submit Moody Request
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}