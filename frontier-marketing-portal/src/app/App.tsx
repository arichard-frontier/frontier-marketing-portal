import { useState } from "react";
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
  /*
    TEMPORARY:
    Default everyone to marketing while we build.
    Later we'll switch this back to employee
    and use Microsoft login/group membership.
  */
  const [role, setRole] =
    useState<Role>("marketing");

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
            element={<Dashboard />}
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