import {
  useEffect,
  useMemo,
  useState,
} from "react";

import { Link } from "react-router-dom";

import {
  list,
  updateStatus,
} from "../services/store";

import type {
  MarketingRequest,
  Status,
} from "../types";

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
];
export default function Dashboard() {
  const [items, setItems] =
  useState<MarketingRequest[]>([]);

  const [tab, setTab] = useState<
  "standard" |
  "moody" |
  "apparel"
>("standard");
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
  tab === "apparel"
    ? request.typeSlug ===
      "frontier-apparel"
    : request.workflow ===
      tab;

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
  return {
    submitted: items.filter(
      (request) =>
        request.status ===
        "Submitted"
    ).length,

    inProgress: items.filter(
      (request) =>
        [
          "In Progress",
          "Proof Sent",
          "Waiting Approval",
          "Ordered",
          "Accepted",
        ].includes(
          request.status
        )
    ).length,

    completed: items.filter(
      (request) =>
        [
          "Completed",
          "Rejected",
        ].includes(
          request.status
        )
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

  const statuses =
  tab === "moody"
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
                        >
                          {
                            request.requestNumber
                          }
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
{request.typeSlug === "moody-center" && (
  <>
    <p>
      <strong>Event:</strong>{" "}
      {request.details?.eventName}
    </p>

    <p>
      <strong>Tickets:</strong>{" "}
      {request.details?.ticketQuantity}
    </p>
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
                          {
                            request.dueDate
                          }
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
                        >
                          View
                          Request
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
                          {statuses.map(
                            (
                              value
                            ) => (
                              <option
                                key={
                                  value
                                }
                              >
                                {
                                  value
                                }
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