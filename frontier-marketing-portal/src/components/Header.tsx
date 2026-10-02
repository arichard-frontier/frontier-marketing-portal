import { Link } from "react-router-dom";
import type { Role } from "../types";
import LoginButton from "./LoginButton";

export default function Header({
  role,
  setRole,
}: {
  role: Role;
  setRole: (r: Role) => void;
}) {
  return (
    <header>
      <Link className="brand" to="/">
        <span className="brandMark">
          F
        </span>

        <span>
          <b>Frontier Bank</b>

          <small>
            Marketing Request Portal
          </small>
        </span>
      </Link>

      <nav>
        <Link to="/">
          New Request
        </Link>

        <Link to="/my-requests">
          My Requests
        </Link>

        {role === "marketing" && (
          <Link to="/marketing">
            Marketing Dashboard
          </Link>
        )}

        <LoginButton />
      </nav>
    </header>
  );
}