import { Link, useParams } from "react-router-dom";
import { list } from "../services/store";

export default function RequestDetails() {
  const { id } = useParams();

  const request = list().find(
    (r) => r.id === id
  );

  if (!request) {
    return (
      <div className="page">
        <div className="formCard">
          <h1>Request Not Found</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <Link
        to="/my-requests"
        className="back"
      >
        ← Back to My Requests
      </Link>

      <div className="formCard">
        <div className="formHead">
          <span>📋</span>

          <div>
            <p className="eyebrow">
              REQUEST DETAILS
            </p>

            <h1>
              {request.requestNumber}
            </h1>

            <p>
              {request.typeTitle}
            </p>
          </div>
        </div>

        <hr />

        <h2>
          Request Information
        </h2>

        <p>
          <strong>Status:</strong>{" "}
          {request.status}
        </p>

        <p>
          <strong>Submitted:</strong>{" "}
          {new Date(
            request.submittedAt
          ).toLocaleString()}
        </p>

        <p>
          <strong>Requester:</strong>{" "}
          {request.requesterName}
        </p>

        <p>
          <strong>Email:</strong>{" "}
          {request.requesterEmail}
        </p>

        <p>
          <strong>Branch:</strong>{" "}
          {request.branchDepartment}
        </p>

        {request.dueDate && (
          <p>
            <strong>Due Date:</strong>{" "}
            {request.dueDate}
          </p>
        )}

        <hr />

        <h2>Form Details</h2>

        <div className="detailsGrid">
          {Object.entries(
            request.details
          ).map(([key, value]) => (
            <div
              key={key}
              className="detailRow"
            >
              <strong>
                {key
                  .replace(
                    /([A-Z])/g,
                    " $1"
                  )
                  .replace(
                    /^./,
                    (str) =>
                      str.toUpperCase()
                  )}
              </strong>

              <span>
                {String(value)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}