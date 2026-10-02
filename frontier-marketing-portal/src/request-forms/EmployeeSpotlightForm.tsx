import { FormEvent, useState } from "react";
import { create } from "../services/store";

export default function EmployeeSpotlightForm() {
  const [employeeName, setEmployeeName] =
    useState("");

  const [employeeStory, setEmployeeStory] =
    useState("");

  const handleSubmit = (
    e: FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    const request = create({
      typeSlug: "employee-spotlight",
      typeTitle: "Employee Spotlight",
      workflow: "standard",

      requesterName: employeeName,
      requesterEmail: "",

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

    alert(
      `Request ${request.requestNumber} submitted successfully`
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
            Tell Us About This Employee And Why They Should Be Featured

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
              Submit Employee Spotlight Nomination
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}