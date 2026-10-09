import { useMsal } from "@azure/msal-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { list } from "../services/store";
import type { MarketingRequest } from "../types";

export default function MyRequests() {
  const { accounts } = useMsal();

const userEmail =
accounts[0]?.username?.toLowerCase() || "";
 
const [items, setItems] =
useState<MarketingRequest[]>([]);
 
console.log("Logged In User:", userEmail);
console.log("Requests:", items);
  

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

  return (
    <div className="page">
      <div className="pageTitle">
        <div>
          <p className="eyebrow">
            Employee Portal
          </p>

          <h1>My Requests</h1>
        </div>
      </div>

      <div className="tableWrap">
        <table>
          <thead>
            <tr>
              <th>Request</th>
              <th>Type</th>
              <th>Submitted</th>
              <th>Due</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
  {items
    .filter(
      (r) =>
        r.requesterEmail
          ?.toLowerCase()
          .trim() === userEmail
    )
    .map((r) => (
              <tr key={r.id}>
                <td>
                  <Link
                    to={`/requests/${r.id}`}
                  >
                    <b>
                      {r.requestNumber}
                    </b>
                  </Link>
                </td>

                <td>
                  {r.typeTitle}
                </td>

                <td>
                  {new Date(
                    r.submittedAt
                  ).toLocaleDateString()}
                </td>

                <td>
                  {r.dueDate}
                </td>

                <td>
                  <span
                    className={
                      "status " +
                      r.status
                        .toLowerCase()
                        .replaceAll(
                          " ",
                          "-"
                        )
                    }
                  >
                    {r.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}