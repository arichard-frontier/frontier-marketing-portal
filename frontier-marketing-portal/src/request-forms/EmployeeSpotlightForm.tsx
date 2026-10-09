import {
  FormEvent,
  useEffect,
  useState,
} from "react";

import { useMsal } from "@azure/msal-react";
import { useNavigate } from "react-router-dom";

import { create } from "../services/store";

export default function EmployeeSpotlightForm() {
  const { accounts } = useMsal();
  const navigate = useNavigate();

  const [requesterName, setRequesterName] =
    useState("");

  const [requesterEmail, setRequesterEmail] =
    useState("");

  const [employeeName, setEmployeeName] =
    useState("");

  const [employeeStory, setEmployeeStory] =
    useState("");

  useEffect(() => {
    if (accounts.length > 0) {
      setRequesterName(
        accounts[0].name || ""
      );

      setRequesterEmail(
        accounts[0].username || ""
      );
    }
  }, [accounts]);

  const handleSubmit = async (
    e: FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    const request = await create({
      typeSlug: "employee-spotlight",
      typeTitle: "Employee Spotlight",
      workflow: "standard",

      requesterName,
      requesterEmail,

      branchDepartment: "",

      dueDate: "",

      assignedTo: "",

      details: {
        employeeName,
        employeeStory,
      },

      submitterNote: "",
      privateNote: "",
    });

    navigate(
      `/success/${request.requestNumber}`
    );
  };

  return (
    <div className="page">
      <button
        className="back"
        type="button"
        onClick={() => window.history.back()}
      >
        ← All request types
      </button>

      <div className="formCard">
        <div className="formHead">
          <span>🏆</span>

          <div>
            <p className="eyebrow">
              FRONTIER MARKETING REQUEST
            </p>

            <h1>
              Employee Spotlight Nomination
            </h1>

            <p>
              Nominate a Frontier employee to
              be featured.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <label>
            Name of Employee to be Nominated

            <input
              type="text"
              value={employeeName}
              onChange={(e) =>
                setEmployeeName(
                  e.target.value
                )
              }
            />
          </label>

          <label>
            Tell Us About This Employee And Why
            They Should Be Featured

            <textarea
              rows={8}
              value={employeeStory}
              onChange={(e) =>
                setEmployeeStory(
                  e.target.value
                )
              }
            />
          </label>

          <div className="actions">
            <button
              type="submit"
              className="primary"
            >
              Submit Employee Spotlight
              Nomination
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}