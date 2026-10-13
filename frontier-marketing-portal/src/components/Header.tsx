import {
  useEffect,
  useState,
} from "react";

import { Link } from "react-router-dom";

import type { Role } from "../types";
import { list } from "../services/store";

import LoginButton from "./LoginButton";

export default function Header({
  role,
  setRole,
}: {
  role: Role;
  setRole: (r: Role) => void;
}) {
  const [newRequestCount, setNewRequestCount] =
    useState(0);

  useEffect(() => {
    const loadCount = async () => {
      const requests = await list();

      const submitted =
        requests.filter(
          (request) =>
            request.status === "Submitted"
        ).length;

      setNewRequestCount(submitted);
    };

    loadCount();

    const refresh = () => {
      loadCount();
    };

    addEventListener(
      "requests-changed",
      refresh
    );

    return () =>
      removeEventListener(
        "requests-changed",
        refresh
      );
  }, []);

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
  <Link
    to="/marketing"
    style={{
      position: "relative",
      display: "inline-flex",
      alignItems: "center",
      gap: "6px",
    }}
  >
    Marketing Dashboard

    {newRequestCount > 0 && (
      <span
        style={{
          background: "#c62828",
          color: "#ffffff",
          borderRadius: "999px",
          minWidth: "18px",
          height: "18px",
          padding: "0 5px",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "11px",
          fontWeight: "700",
          lineHeight: "18px",
        }}
      >
        {newRequestCount}
      </span>
    )}
  </Link>
)}

        <LoginButton />
      </nav>
    </header>
  );
}