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

  const [importantDetails, setImportantDetails] =
    useState("");

  const [photosAvailable, setPhotosAvailable] =
    useState("Yes");

  const [photoFiles, setPhotoFiles] =
  useState<File[]>([]);

const [uploadError, setUploadError] =
  useState("");

  const handlePhotoSelection = (
  e: React.ChangeEvent<HTMLInputElement>
) => {
  const selectedFiles = Array.from(
    e.target.files || []
  );

  setUploadError("");

  const allowedTypes = [
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/heic",
    "image/heif",
  ];

  const invalidType =
    selectedFiles.find(
      (file) =>
        !allowedTypes.includes(file.type)
    );

  if (invalidType) {
    setUploadError(
      "Only JPG, JPEG, PNG, WEBP, HEIC, and HEIF photos are allowed."
    );

    e.target.value = "";
    return;
  }

  const maxFileSize =
    10 * 1024 * 1024;

  const oversizedFile =
    selectedFiles.find(
      (file) =>
        file.size > maxFileSize
    );

  if (oversizedFile) {
    setUploadError(
      `${oversizedFile.name} is larger than 10 MB. Please choose a smaller photo.`
    );

    e.target.value = "";
    return;
  }

  setPhotoFiles((current) => [
    ...current,
    ...selectedFiles,
  ]);

  e.target.value = "";
};


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

  setUploadError("");

  if (
    photosAvailable === "Yes" &&
    photoFiles.length === 0
  ) {
    setUploadError(
      "Please upload at least one photo or select No for photos available."
    );

    return;
  }

  try {
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
        importantDetails,
        photosAvailable,
        eventDate,
        requestedPostDate,
        additionalNotes,
      },

      submitterNote: "",
      privateNote: "",
    });

    if (
      photosAvailable === "Yes" &&
      photoFiles.length > 0
    ) {
      for (const file of photoFiles) {
  const fileData =
    await new Promise<string>(
      (resolve, reject) => {
        const reader =
          new FileReader();

        reader.onload = () => {
          const result =
            String(reader.result || "");

          const base64 =
            result.includes(",")
              ? result.split(",")[1]
              : result;

          resolve(base64);
        };

        reader.onerror = () =>
          reject(
            new Error(
              `Unable to read ${file.name}.`
            )
          );

        reader.readAsDataURL(file);
      }
    );

  const uploadResponse =
    await fetch(
      "/api/uploads",
      {
        method: "POST",

        headers: {
          "Content-Type":
            "application/json",
        },

        body: JSON.stringify({
          requestNumber:
            request.requestNumber,

          fileName:
            file.name,

          fileType:
            file.type,

          uploadCategory:
            "social-media",

          fileData,
        }),
      }
    );

        const uploadResult =
          await uploadResponse.json();

        if (!uploadResponse.ok) {
          throw new Error(
            uploadResult.error ||
              `Unable to upload ${file.name}.`
          );
        }
      }
    }

    navigate(
      `/success/${request.requestNumber}`
    );
  } catch (error) {
    console.error(
      "SOCIAL MEDIA SUBMISSION FAILED:",
      error
    );

    setUploadError(
      error instanceof Error
        ? error.message
        : "The request or photo upload failed."
    );
  }
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
              required
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
              required
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
              required
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
              required
            />
          </label>

          <label>
            Do You Have Photos Available?

{photosAvailable === "Yes" && (
  <div
    style={{
      marginTop: "16px",
      marginBottom: "20px",
    }}
  >
    <label>
      Upload Photos

      <input
        type="file"
        accept="image/jpeg,image/png,image/webp,image/heic,image/heif,.jpg,.jpeg,.png,.webp,.heic,.heif"
        multiple
        onChange={
          handlePhotoSelection
        }
        style={{
          display: "block",
          marginTop: "8px",
        }}
      />
    </label>

    <small>
      JPG, PNG, WEBP, HEIC, or HEIF.
      Maximum 10 MB per photo.
    </small>

    {uploadError && (
      <p
        style={{
          color: "#c62828",
          fontWeight: 600,
        }}
      >
        {uploadError}
      </p>
    )}

    {photoFiles.length > 0 && (
      <div
        style={{
          marginTop: "14px",
        }}
      >
        <strong>
          Selected Photos
        </strong>

        {photoFiles.map(
          (file, index) => (
            <div
              key={`${file.name}-${index}`}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent:
                  "space-between",
                gap: "12px",
                marginTop: "8px",
                padding: "8px",
                background: "#f5f3ee",
                borderRadius: "6px",
              }}
            >
              <span>{file.name}</span>

              <button
                type="button"
                onClick={() =>
                  setPhotoFiles(
                    (current) =>
                      current.filter(
                        (_, i) =>
                          i !== index
                      )
                  )
                }
              >
                Remove
              </button>
            </div>
          )
        )}
      </div>
    )}
  </div>
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
required
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
    required
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