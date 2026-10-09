import {
  FormEvent,
  useEffect,
  useState,
} from "react";

import { useMsal } from "@azure/msal-react";
import { useNavigate } from "react-router-dom";

import { create } from "../services/store";

export default function CustomerSpotlightForm() {
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

  const [customerName, setCustomerName] =
    useState("");

  const [businessName, setBusinessName] =
    useState("");

  const [businessWebsite, setBusinessWebsite] =
  useState("");

  const [customerEmail, setCustomerEmail] =
    useState("");

  const [customerStory, setCustomerStory] =
    useState("");

  const [permissionStatus, setPermissionStatus] =
    useState("Not Yet");

  const [photosAvailable, setPhotosAvailable] =
    useState("No");

  const [photoLocation, setPhotoLocation] =
    useState("");

  const [additionalNotes, setAdditionalNotes] =
    useState("");

  const handleSubmit = async (
    e: FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    const request = await create({
      typeSlug: "customer-spotlight",
      typeTitle: "Customer Spotlight",
      workflow: "standard",

      requesterName: fullName,
      requesterEmail: email,

      branchDepartment: branch,

      dueDate: "",

      assignedTo: "",

      details: {
        fullName,
        email,
        branch,
        customerName,
        businessName,
        businessWebsite,
        customerEmail,
        customerStory,
        permissionStatus,
        photosAvailable,
        photoLocation,
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
          <span>⭐</span>

          <div>
            <p className="eyebrow">
              FRONTIER MARKETING REQUEST
            </p>

            <h1>
              Customer Spotlight Nomination
            </h1>

            <p>
              Nominate a customer to be featured in
              Frontier marketing and social media.
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
            Customer Name

            <input
              type="text"
              value={customerName}
              onChange={(e) =>
                setCustomerName(
                  e.target.value
                )
              }
            />
          </label>

          <label>
            Business Name (if applicable)

            <input
              type="text"
              value={businessName}
              onChange={(e) =>
                setBusinessName(
                  e.target.value
                )
              }
            />
          </label>

         <label>
  Business Website (optional)

  <input
    type="text"
    placeholder="https://..."
    value={businessWebsite}
    onChange={(e) =>
      setBusinessWebsite(
        e.target.value
      )
    }
  />
</label>


          <label>
            Customer Email (optional)

            <input
              type="email"
              value={customerEmail}
              onChange={(e) =>
                setCustomerEmail(
                  e.target.value
                )
              }
            />
          </label>

          <label>
            Tell Us About This Customer And Why They Should Be Featured

            <textarea
              rows={8}
              value={customerStory}
              onChange={(e) =>
                setCustomerStory(
                  e.target.value
                )
              }
            />
          </label>

          <label>
            Has The Customer Agreed To Be Featured?

            <select
              value={permissionStatus}
              onChange={(e) =>
                setPermissionStatus(
                  e.target.value
                )
              }
            >
              <option>
                Yes
              </option>

              <option>
                No
              </option>

              <option>
                Not Yet
              </option>
            </select>
          </label>

          <label>
            Do You Have Photos Available?

            <select
              value={photosAvailable}
              onChange={(e) =>
                setPhotosAvailable(
                  e.target.value
                )
              }
            >
              <option>
                Yes
              </option>

              <option>
                No
              </option>
            </select>
          </label>

          {photosAvailable === "Yes" && (
            <label>
              Where Are The Photos Saved?

              <input
                type="text"
                placeholder="Shared Drive folder path"
                value={photoLocation}
                onChange={(e) =>
                  setPhotoLocation(
                    e.target.value
                  )
                }
              />
            </label>
          )}

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
              Submit Customer Spotlight Nomination
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}