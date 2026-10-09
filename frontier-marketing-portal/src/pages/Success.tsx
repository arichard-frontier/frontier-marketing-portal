import { Link, useParams } from "react-router-dom";

export default function Success() {
  const { number } = useParams();

  return (
    <div className="page narrow">
      <div className="success">
        <span>✓</span>

        <h1>Request Submitted Successfully</h1>

        <p>
          Request #{number} has been submitted successfully.
        </p>

        <p>
          You can track the progress of your request in the
          <strong> My Requests </strong>
          tab.
        </p>

        <div className="actions">
          <Link
            className="secondary buttonLink"
            to="/my-requests"
          >
            View My Requests
          </Link>

          <Link
            className="primary buttonLink"
            to="/"
          >
            Return Home
          </Link>
        </div>
      </div>
    </div>
  );
}