import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Link,
  useSearchParams,
} from "react-router-dom";

import {
  list,
  updateStatus,
} from "../services/store";

import type {
  MarketingRequest,
  Status,
} from "../types";

import { formatDate } from "../utils/formatDate";

const standard: Status[] = [
  "Submitted",
  "In Progress",
  "Proof Sent",
  "Waiting Approval",
  "Ordered",
  "Completed",
  "Rejected",
];

const moody: Status[] = [
  "Submitted",
  "Accepted",
  "Rejected",
];

const apparel: Status[] = [
  "Submitted",
  "On Order List",
  "Ordered",
  "Rejected",
];
export default function Dashboard() {
  const [items, setItems] =
  useState<MarketingRequest[]>([]);

const [searchParams, setSearchParams] =
  useSearchParams();

const savedTab =
  searchParams.get("tab");

const initialTab:
  | "standard"
  | "moody"
  | "apparel"
  | "completed" =
  savedTab === "moody" ||
  savedTab === "apparel" ||
  savedTab === "completed"
    ? savedTab
    : "standard";

const [tab, setTabState] = useState<
  "standard" |
  "moody" |
  "apparel" |
  "completed"
>(initialTab);

const setTab = (
  newTab:
    | "standard"
    | "moody"
    | "apparel"
    | "completed"
) => {
  setTabState(newTab);

  setSearchParams({
    tab: newTab,
  });
};
  const [requestTypeFilter, setRequestTypeFilter] =
  useState("All");
  const [searchTerm, setSearchTerm] =
  useState("");

  useEffect(() => {
  const load = async () => {
    const requests = await list();
    setItems(requests);
  };

  load();

  const fn = async () => {
    const requests = await list();
    setItems(requests);
  };

  addEventListener(
    "requests-changed",
    fn
  );

  return () =>
    removeEventListener(
      "requests-changed",
      fn
    );
}, []);
 const filtered = items.filter(
  (request) => {
 const workflowMatch =
  tab === "completed"
  ? (
      request.typeTitle ===
        "Frontier Apparel"
        ? [
            "Ordered",
            "Rejected",
          ].includes(
            request.status
          )
        : [
            "Completed",
            "Rejected",
            "Accepted",
          ].includes(
            request.status
          )
    )

    : tab === "moody"
    ? request.typeTitle === "Moody Center Request" &&
      ![
        "Accepted",
        "Rejected",
      ].includes(request.status)

    : tab === "apparel"
? request.typeTitle ===
    "Frontier Apparel" &&
  ![
    "Ordered",
    "Rejected",
  ].includes(
    request.status
  )

    : request.typeTitle !== "Moody Center Request" &&
      request.typeTitle !== "Frontier Apparel" &&
      ![
        "Completed",
        "Rejected",
        "Accepted",
      ].includes(request.status);

    const typeMatch =
      requestTypeFilter === "All"
        ? true
        : request.typeTitle ===
          requestTypeFilter;

    const searchMatch =
      searchTerm === ""
        ? true
        : [
            request.requestNumber,
            request.requesterName,
            request.requesterEmail,
            request.branchDepartment,
            request.typeTitle,
          ]
            .join(" ")
            .toLowerCase()
            .includes(
              searchTerm.toLowerCase()
            );

    return (
      workflowMatch &&
      typeMatch &&
      searchMatch
    );
  }
);

const counts = useMemo(() => {
  const isApparelCompleted = (
    request: MarketingRequest
  ) =>
    request.typeTitle ===
      "Frontier Apparel" &&
    [
      "Ordered",
      "Rejected",
    ].includes(request.status);

  const isOtherCompleted = (
    request: MarketingRequest
  ) =>
    request.typeTitle !==
      "Frontier Apparel" &&
    [
      "Completed",
      "Rejected",
      "Accepted",
    ].includes(request.status);

  const isCompleted = (
    request: MarketingRequest
  ) =>
    isApparelCompleted(request) ||
    isOtherCompleted(request);

  return {
    submitted:
      items.filter(
        (request) =>
          request.status ===
            "Submitted" &&
          !isCompleted(request)
      ).length,

    inProgress:
      items.filter(
        (request) => {
          if (isCompleted(request)) {
            return false;
          }

          if (
            request.typeTitle ===
            "Frontier Apparel"
          ) {
            return (
              request.status ===
              "On Order List"
            );
          }

          return [
            "In Progress",
            "Proof Sent",
            "Waiting Approval",
            "Ordered",
          ].includes(request.status);
        }
      ).length,

    completed:
      items.filter(
        isCompleted
      ).length,
  };
}, [items]);
  const changeStatus = async (
    request: MarketingRequest,
    status: Status
  ) => {
    const note =
      prompt(
        "Add a submitter-visible status update:"
      ) || "";

    if (
      [
        "Completed",
        "Accepted",
        "Rejected",
      ].includes(status) &&
      !note
    ) {
      alert(
        "A note is required for a final status."
      );

      return;
    }

    await updateStatus(
  request.id,
  status,
  note
);

const requests =
  await list();

setItems(requests);
  };

  const completed: Status[] = [
  "Completed",
  "Accepted",
  "Rejected",
];

const statuses =
  tab === "completed"
    ? completed
    : tab === "moody"
    ? moody
    : tab === "apparel"
    ? apparel
    : standard;
      const requestTypes = [
  "All",
  ...new Set(
    items.map(
      (request) =>
        request.typeTitle
    )
  ),
];
  return (
    <div className="page">
      <div className="pageTitle">
        <div>
          <p className="eyebrow">
            Private Marketing Area
          </p>

          <h1>
            Marketing Dashboard
          </h1>
        </div>
      </div>

      <section className="stats">
  <div>
    <b>{counts.submitted}</b>

    <span>
      Submitted
    </span>
  </div>

  <div>
    <b>{counts.inProgress}</b>

    <span>
      In Progress
    </span>
  </div>

  <div>
    <b>{counts.completed}</b>

    <span>
      Completed
    </span>
  </div>
</section>

      <div className="tabs">
        <button
          className={
            tab === "standard"
              ? "active"
              : ""
          }
          onClick={() =>
            setTab(
              "standard"
            )
          }
          
        >
          Marketing Requests
        </button>

        <button
          className={
            tab === "moody"
              ? "active"
              : ""
          }
          onClick={() =>
            setTab(
              "moody"
            )
          }
        >
          Moody Center
        </button>
        <button
  className={
    tab === "apparel"
      ? "active"
      : ""
  }
  onClick={() =>
    setTab(
      "apparel"
    )
  }
>
  Frontier Apparel
</button>
<button
  className={
    tab === "completed"
      ? "active"
      : ""
  }
  onClick={() =>
    setTab(
      "completed"
    )
  }
>
  Completed
</button>
      </div>
      <div
  style={{
    marginTop: "20px",
    marginBottom: "20px",
  }}
>
  <label>
    Search Requests

    <input
      type="text"
      placeholder="Request #, name, email, branch..."
      value={searchTerm}
      onChange={(e) =>
        setSearchTerm(
          e.target.value
        )
      }
      style={{
        width: "100%",
        marginTop: "8px",
        padding: "10px",
        borderRadius: "8px",
        border:
          "1px solid #d6d0c4",
      }}
    />
  </label>
</div>
      <div
  style={{
    marginTop: "20px",
    marginBottom: "20px",
  }}
>
  <label>
    Request Type

    <select
      value={requestTypeFilter}
      onChange={(event) =>
        setRequestTypeFilter(
          event.target.value
        )
      }
      style={{
        marginLeft: "10px",
      }}
    >
      {requestTypes.map(
        (type) => (
          <option
            key={type}
            value={type}
          >
            {type}
          </option>
        )
      )}
    </select>
  </label>
</div>

      <section className="board">
        {statuses.map(
          (status) => (
            <div
              className="column"
              key={status}
            >
              <h2>
                {status}

                <span>
                  {
                    filtered.filter(
                      (
                        request
                      ) =>
                        request.status ===
                        status
                    ).length
                  }
                </span>
              </h2>

              {filtered
                .filter(
                  (
                    request
                  ) =>
                    request.status ===
                    status
                )
                .map(
                  (
                    request
                  ) => (
                    <article
                      className="requestCard"
                      key={
                        request.id
                      }
                    >
                      <p className="cardNo">
                        <Link
  to={`/requests/${request.id}`}
  state={{
    from: "dashboard",
    tab,
    returnTo:
      `/marketing?tab=${tab}`,
  }}
>
  {request.requestNumber}
</Link>
                      </p>

                      <h3>
                        {
                          request.typeTitle
                        }
                      </h3>

                      <p>
                        <strong>
                          {
                            request.requesterName
                          }
                        </strong>
                      </p>
{request.typeTitle === "Moody Center Request" && (
  <>
    <p>
      <strong>Event:</strong>{" "}
      {request.details?.eventName ||
        "Not provided"}
    </p>

    <p>
      <strong>Tickets Requested:</strong>{" "}
      {request.details?.ticketQuantity ||
        "Not provided"}
    </p>

    {request.details?.requestType && (
      <p>
        <strong>Request Type:</strong>{" "}
        {request.details.requestType}
      </p>
    )}
  </>
)}
{request.typeSlug === "frontier-apparel" && (
  <>
    <p>
      <strong>Item:</strong>{" "}
      {request.details?.item}
    </p>

    <p>
      <strong>
        {request.details?.cut}
      </strong>
      {" • "}
      {request.details?.size}
      {" • "}
      {request.details?.color}
    </p>
  </>
)}
                      <p>
                        {
                          request.branchDepartment
                        }
                      </p>

                      <p>
                        {
                          request.requesterEmail
                        }
                      </p>

                      {request.dueDate && (
  <small>
    Due{" "}
    {formatDate(
      request.dueDate
    )}
  </small>
)}

                      <div
                        style={{
                          marginTop:
                            "10px",
                          marginBottom:
                            "10px",
                        }}
                      >
                      <Link
  to={`/requests/${request.id}`}
  state={{
    from: "dashboard",
    tab,
    returnTo:
      `/marketing?tab=${tab}`,
  }}
>
  View Request
</Link>
                      </div>

                      <label>
                        Move To

                        <select
                          value={
                            request.status
                          }
                          onChange={(
                            event
                          ) =>
                            changeStatus(
                              request,
                              event
                                .target
                                .value as Status
                            )
                          }
                        >
                         {(
  request.typeTitle === "Moody Center Request"
    ? moody
    : request.typeTitle === "Frontier Apparel"
    ? apparel
    : standard
).map(
  (value) => (
    <option
      key={value}
      value={value}
    >
      {value}
    </option>
  )
)}
                        </select>
                      </label>

                      {request.submitterNote && (
                        <p className="note">
                          Update:{" "}
                          {
                            request.submitterNote
                          }
                        </p>
                      )}
                    </article>
                  )
                )}
            </div>
          )
        )}
      </section>
    </div>
  );
}