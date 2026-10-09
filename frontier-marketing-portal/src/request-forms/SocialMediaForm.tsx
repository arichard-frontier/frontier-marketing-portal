import {
  FormEvent,
  useEffect,
  useState,
} from "react";

import { useMsal } from "@azure/msal-react";
import { useNavigate } from "react-router-dom";

import { create } from "../services/store";

export default function SocialMediaForm() {
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

  const [whatToPost, setWhatToPost] =
    useState("");

  const [postGoal, setPostGoal] =
    useState("");

  const [importantDetails, setImportantDetails] =
    useState("");

  const [photosAvailable, setPhotosAvailable] =
    useState("Yes");

    const [photoLocation, setPhotoLocation] =
  useState("");

  const [eventDate, setEventDate] =
    useState("");

  const [requestedPostDate, setRequestedPostDate] =
    useState("");

  const [additionalNotes, setAdditionalNotes] =
    useState("");

  const handleSubmit = async (
    e: FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

   const request = await create({

      typeSlug: "social-media",
      typeTitle: "Social Media",
      workflow: "standard",

      requesterName: fullName,
      requesterEmail: email,

      branchDepartment: branch,

      dueDate: requestedPostDate,

      assignedTo: "",

      details: {
        fullName,
        email,
        branch,
        whatToPost,
        postGoal,
        importantDetails,
        photosAvailable,
        photoLocation,
        eventDate,
        requestedPostDate,
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
          <span>📱</span>

          <div>
            <p className="eyebrow">
              FRONTIER MARKETING REQUEST
            </p>

            <h1>
              Social Media Request
            </h1>

            <p>
              Request a social media post
              for an event, milestone,
              branch update, or promotion.
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
            What Would You Like Posted? (ex: event promotion, photos from a past event, branch activity)

            <textarea
              rows={4}
              value={whatToPost}
              onChange={(e) =>
                setWhatToPost(
                  e.target.value
                )
              }
            />
          </label>

          <label>
            Important Details To Include (ex: event date, time and loaction)

            <textarea
              rows={4}
              value={
                importantDetails
              }
              onChange={(e) =>
                setImportantDetails(
                  e.target.value
                )
              }
            />
          </label>

          <label>
            Do You Have Photos Available?

{photosAvailable === "Yes" && (
  <label>
    Where Are The Photos Saved?

    <input
      type="text"
      placeholder="Shared Drive folder path, do not email photos"
      value={photoLocation}
      onChange={(e) =>
        setPhotoLocation(
          e.target.value
        )
      }
    />
  </label>
)}
            <select
              value={
                photosAvailable
              }
              onChange={(e) =>
                setPhotosAvailable(
                  e.target.value
                )
              }
            >
              <option>Yes</option>
              <option>No</option>
            </select>
          </label>

         <label>
  Event Date (past or future)

  <input
    type="date"
    value={eventDate}
    onChange={(e) =>
      setEventDate(
        e.target.value
      )
    }
  />
</label>

<label>
  Requested Post Date

  <input
    type="date"
    value={requestedPostDate}
    onChange={(e) =>
      setRequestedPostDate(
        e.target.value
      )
    }
  />
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
    Submit Social Media Request
  </button>
</div>
</form>
</div>
</div>
);
}