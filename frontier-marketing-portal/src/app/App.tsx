import { useState } from "react";
import { useMsal } from "@azure/msal-react";
import {
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import Header from "../components/Header";

import Home from "../pages/Home";
import RequestForm from "../pages/RequestForm";
import Success from "../pages/Success";
import MyRequests from "../pages/MyRequests";
import Dashboard from "../pages/Dashboard";
import RequestDetails from "../pages/RequestDetails";

import type { Role } from "../types";

export default function App() {
  const { accounts } = useMsal();

  const marketingUsers = [
    "arichard@frontierbankoftexas.bank",
    "mpoynter@frontierbankoftexas.bank",
  ];

  const userEmail =
    accounts?.[0]?.username?.toLowerCase() ?? "";

  const isMarketingUser =
    marketingUsers.includes(userEmail);

  const role: Role =
  isMarketingUser
    ? "marketing"
    : "employee";

const setRole = () => {};

  return (
    <>
      <Header
        role={role}
        setRole={setRole}
      />

      <main>
        <Routes>
          <Route
            path="/"
            element={<Home />}
          />

          <Route
            path="/request/:slug"
            element={<RequestForm />}
          />

          <Route
            path="/success/:number"
            element={<Success />}
          />

          <Route
            path="/my-requests"
            element={<MyRequests />}
          />

          <Route
            path="/requests/:id"
            element={<RequestDetails />}
          />

          <Route
            path="/marketing"
            element={
              isMarketingUser ? (
                <Dashboard />
              ) : (
                <Navigate to="/" />
              )
            }
          />

          <Route
            path="*"
            element={<Navigate to="/" />}
          />
        </Routes>
      </main>
    </>
  );
}