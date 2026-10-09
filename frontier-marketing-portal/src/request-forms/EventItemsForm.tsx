import {
  FormEvent,
  useEffect,
  useState,
} from "react";

import { useMsal } from "@azure/msal-react";
import { useNavigate } from "react-router-dom";

import { create } from "../services/store";

export default function EventItemsForm() {
    const { accounts } = useMsal();
  const navigate = useNavigate();

  useEffect(() => {
    if (accounts.length > 0) {
      setFullName(
        accounts[0].name || ""
      );

      setEmail(
        accounts[0].username || ""
      );
    }
  }, [accounts]);
  const [fullName, setFullName] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [branch, setBranch] =
    useState("");

  const [eventPurpose, setEventPurpose] =
    useState("");

  const [dateNeeded, setDateNeeded] =
    useState("");

  const [itemsNeeded, setItemsNeeded] =
    useState<string[]>([]);

  const [additionalNotes, setAdditionalNotes] =
    useState("");

  const toggleItem = (
    item: string
  ) => {
    setItemsNeeded((current) =>
      current.includes(item)
        ? current.filter(
            (x) => x !== item
          )
        : [...current, item]
    );
  };

  const handleSubmit = async (
    e: FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    const request = await create({

      typeSlug: "event-items",
      typeTitle: "Event Items",
      workflow: "standard",

      requesterName: fullName,
      requesterEmail: email,

      branchDepartment: branch,

      dueDate: dateNeeded,

      assignedTo: "",

      details: {
        fullName,
        email,
        branch,
        eventPurpose,
        dateNeeded,
        itemsNeeded:
          itemsNeeded.join(", "),
        additionalNotes,
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
          <span>🎪</span>

          <div>
            <p className="eyebrow">
              FRONTIER MARKETING REQUEST
            </p>

            <h1>
              Event Items Request
            </h1>

            <p>
              Reserve Frontier event items
              for community events,
              sponsorships, and branch
              activities.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <label>
            First and Last Name

            <input
              type="text"
              value={fullName}
              onChange={(e) =>
                setFullName(
                  e.target.value
                )
              }
            />
          </label>

          <label>
            Email Address

            <input
              type="email"
              value={email}
              onChange={(e) =>
                setEmail(
                  e.target.value
                )
              }
            />
          </label>

          <label>
            Branch

            <select
              value={branch}
              onChange={(e) =>
                setBranch(
                  e.target.value
                )
              }
            >
              <option value="">
                Select Branch
              </option>

              <option>
                Elgin Headquarters
              </option>

              <option>
                Smithville Branch
              </option>

              <option>
                Smithville Commercial Office
              </option>

              <option>
                Manor Branch
              </option>

              <option>
                Bastrop Branch
              </option>

              <option>
                Bastrop Executive Office
              </option>

              <option>
                Georgetown Branch
              </option>

              <option>
                Taylor Branch
              </option>

              <option>
                Round Rock Branch
              </option>

              <option>
                Leander Branch
              </option>

              <option>
                Austin Commercial Office
              </option>

              <option>
                Buda Branch
              </option>
            </select>
          </label>

          <label>
            What Do You Need The Items For?

            <textarea
              rows={4}
              value={eventPurpose}
              onChange={(e) =>
                setEventPurpose(
                  e.target.value
                )
              }
            />
          </label>

          <label>
            Date Needed

            <input
              type="date"
              value={dateNeeded}
              onChange={(e) =>
                setDateNeeded(
                  e.target.value
                )
              }
            />
          </label>

          <label>
            Select All Items Needed
          </label>

          <label>
            <input
              type="checkbox"
              checked={itemsNeeded.includes(
                "Large Red Tent"
              )}
              onChange={() =>
                toggleItem(
                  "Large Red Tent"
                )
              }
            />
            Large Red Tent
          </label>

          <label>
            <input
              type="checkbox"
              checked={itemsNeeded.includes(
                "1 Corn Hole Set"
              )}
              onChange={() =>
                toggleItem(
                  "1 Corn Hole Set"
                )
              }
            />
            1 Corn Hole Set
          </label>

          <label>
            <input
              type="checkbox"
              checked={itemsNeeded.includes(
                "2 Corn Hole Sets"
              )}
              onChange={() =>
                toggleItem(
                  "2 Corn Hole Sets"
                )
              }
            />
            2 Corn Hole Sets
          </label>

          <label>
            <input
              type="checkbox"
              checked={itemsNeeded.includes(
                "Giant Jenga"
              )}
              onChange={() =>
                toggleItem(
                  "Giant Jenga"
                )
              }
            />
            Giant Jenga
          </label>

          <label>
            Additional Notes

            <textarea
              rows={4}
              value={additionalNotes}
              onChange={(e) =>
                setAdditionalNotes(
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
              Submit Event Items Request
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}