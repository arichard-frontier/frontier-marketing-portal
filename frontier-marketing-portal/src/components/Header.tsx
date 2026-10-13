import {
  useEffect,
  useState,
} from "react";
import { useMsal } from "@azure/msal-react";

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
  const { accounts } = useMsal();

  const userEmail =
    accounts[0]?.username?.toLowerCase() || "";

  const [newRequestCount, setNewRequestCount] =
    useState(0);

  const [myRequestUpdateCount, setMyRequestUpdateCount] =
    useState(0);

 useEffect(() => {
  const loadCounts = async () => {
    const requests = await list();

    const submitted =
      requests.filter(
        (request) =>
          request.status === "Submitted"
      ).length;

    setNewRequestCount(submitted);

    const myUpdatedRequests =
      requests.filter((request) => {
        const belongsToUser =
          request.requesterEmail
            ?.toLowerCase()
            .trim() === userEmail;

        if (
          !belongsToUser ||
          !request.updatedAt
        ) {
          return false;
        }

        const seenAt =
          localStorage.getItem(
            `request-seen-${request.id}`
          );

        if (!seenAt) {
          return (
            request.updatedAt !==
            request.submittedAt
          );
        }

        return (
          new Date(
            request.updatedAt
          ).getTime() >
          new Date(seenAt).getTime()
        );
      }).length;

    setMyRequestUpdateCount(
      myUpdatedRequests
    );
  };

  loadCounts();

  const refresh = () => {
    loadCounts();
  };

  addEventListener(
    "requests-changed",
    refresh
  );

  addEventListener(
    "request-notifications-changed",
    refresh
  );

  return () => {
    removeEventListener(
      "requests-changed",
      refresh
    );

    removeEventListener(
      "request-notifications-changed",
      refresh
    );
  };
}, [userEmail]);

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
        <Link
  to="/my-requests"
  style={{
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
  }}
>
  My Requests

  {myRequestUpdateCount > 0 && (
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
      {myRequestUpdateCount}
    </span>
  )}
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