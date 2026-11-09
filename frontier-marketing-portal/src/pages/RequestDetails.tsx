import {
  useEffect,
  useState,
} from "react";

import { useMsal } from "@azure/msal-react";

import {
  Link,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";

import { list } from "../services/store";

import type {
  MarketingRequest,
  ProofHistoryItem,
} from "../types";

import { formatDate } from "../utils/formatDate";

export default function RequestDetails() {
  const { id } = useParams();

  const navigate = useNavigate();
  const location = useLocation();

  const cameFromDashboard =
    location.state?.from ===
    "dashboard";

    const returnTo =
  location.state?.returnTo;

  const [request, setRequest] =
    useState<MarketingRequest | null>(null);

    const [proofHistory, setProofHistory] =
  useState<ProofHistoryItem[]>([]);

  const [loading, setLoading] =
    useState(true);

    const { accounts } = useMsal();

const [proofFile, setProofFile] =
  useState<File | null>(null);

const [proofError, setProofError] =
  useState("");

const [uploadingProof, setUploadingProof] =
  useState(false);

  const [proofDecision, setProofDecision] =
  useState<
    "Approved" |
    "Needs Edits" |
    ""
  >("");

const [proofFeedback, setProofFeedback] =
  useState("");

const [reviewError, setReviewError] =
  useState("");

const [submittingReview, setSubmittingReview] =
  useState(false);

  const supportsProof =
  request?.typeTitle ===
    "Business Cards" ||
  request?.typeTitle ===
    "Advertisement" ||
  request?.typeTitle ===
    "Marketing Materials";

    const proofNeedsReview =
  supportsProof &&
  !cameFromDashboard &&
  request?.proofStatus ===
    "Waiting Approval";

    const uploadProof = async () => {
  if (!request) {
    return;
  }

  if (!proofFile) {
    setProofError(
      "Please select a PDF proof."
    );

    return;
  }

  if (
    proofFile.type !==
    "application/pdf"
  ) {
    setProofError(
      "Proofs must be PDF files."
    );

    return;
  }

  setProofError("");
  setUploadingProof(true);

  try {
    const nextVersion =
      (request.proofVersion || 0) + 1;

    let uploadCategory = "";

    if (
      request.typeTitle ===
      "Marketing Materials"
    ) {
      uploadCategory =
        "marketing-materials";
    } else if (
      request.typeTitle ===
      "Business Cards"
    ) {
      uploadCategory =
        "business-cards";
    } else if (
      request.typeTitle ===
      "Advertisement"
    ) {
      uploadCategory =
        "advertisement";
    }

    const fileData =
      await new Promise<string>(
        (resolve, reject) => {
          const reader =
            new FileReader();

          reader.onload = () => {
            const result =
              String(
                reader.result || ""
              );

            const base64 =
              result.includes(",")
                ? result.split(",")[1]
                : result;

            resolve(base64);
          };

          reader.onerror = () => {
            reject(
              new Error(
                "Unable to read the PDF."
              )
            );
          };

          reader.readAsDataURL(
            proofFile
          );
        }
      );

    const response =
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

            requestId:
              request.id,

            fileName:
              proofFile.name,

            fileType:
              proofFile.type,

            uploadCategory,

            proofVersion:
              nextVersion,

            fileData,
          }),
        }
      );

    const result =
      await response.json();

    if (!response.ok) {
  throw new Error(
    result.error ||
      "Unable to upload proof."
  );
}

console.log(
  "UPLOADED PROOF:",
  result
);


    const requests =
      await list();

    const refreshed =
      requests.find(
        (item) =>
          item.id ===
          request.id
      );

   if (refreshed) {
  setRequest(
    refreshed
  );
}

await loadProofHistory(
  request.id
);

setProofFile(null);

    window.dispatchEvent(
      new Event(
        "requests-changed"
      )
    );

    alert(
      `Proof ${nextVersion} uploaded and sent for approval.`
    );
  } catch (error) {
    console.error(
      "PROOF UPLOAD FAILED:",
      error
    );

    setProofError(
      error instanceof Error
        ? error.message
        : "Unable to upload proof."
    );
  } finally {
    setUploadingProof(false);
  }
};

const submitProofReview = async () => {
  if (!request) {
    return;
  }

  if (!proofDecision) {
    setReviewError(
      "Please select Approved or Needs Edits."
    );
    return;
  }

  if (
    proofDecision === "Needs Edits" &&
    !proofFeedback.trim()
  ) {
    setReviewError(
      "Please enter comments explaining what needs to be changed."
    );
    return;
  }

  setReviewError("");
  setSubmittingReview(true);

  try {
    const response =
      await fetch(
        "/api/requests",
        {
          method: "PATCH",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            action:
              "proof-review",

            id:
              request.id,

            proofDecision,

            proofFeedback:
              proofFeedback.trim(),
          }),
        }
      );

    const result =
      await response.json();

    if (!response.ok) {
      throw new Error(
        result.error ||
          "Unable to submit proof review."
      );
    }

    const requests =
      await list();

    const refreshed =
      requests.find(
        (item) =>
          item.id === request.id
      );

  if (refreshed) {
  setRequest(refreshed);
}

await loadProofHistory(
  request.id
);

setProofDecision("");
setProofFeedback("");
    window.dispatchEvent(
      new Event(
        "requests-changed"
      )
    );

    window.dispatchEvent(
      new Event(
        "request-notifications-changed"
      )
    );

    alert(
      proofDecision === "Approved"
        ? "Proof approved successfully."
        : "Your requested edits were sent to Marketing."
    );
  } catch (error) {
    console.error(
      "PROOF REVIEW FAILED:",
      error
    );

    setReviewError(
      error instanceof Error
        ? error.message
        : "Unable to submit proof review."
    );
  } finally {
    setSubmittingReview(false);
  }
};

const loadProofHistory = async (
  requestId: string
) => {
  try {
    const response =
      await fetch(
        `/api/requests?proofHistoryFor=${encodeURIComponent(
          requestId
        )}`
      );

    const data =
      await response.json();

    if (!response.ok) {
      throw new Error(
        data.error ||
          "Unable to load proof history."
      );
    }

    const history:
      ProofHistoryItem[] =
      (data.value || []).map(
        (item: any) => ({
          id:
            String(item.id),

          requestId:
            item.fields?.RequestId ||
            "",

          requestNumber:
            item.fields?.RequestNumber ||
            "",

          proofVersion:
            Number(
              item.fields?.ProofVersion ||
              0
            ),

          proofFileName:
            item.fields?.ProofFileName ||
            "",

          proofUrl:
  item.fields?.ProofURL ||
  (
    item.fields?.ProofFileName
      ? `https://frontierbankoftexas.sharepoint.com/Marketing%20Request%20Uploads/${
          request?.typeTitle ===
          "Marketing Materials"
            ? "Marketing%20Materials"
            : request?.typeTitle ===
              "Business Cards"
            ? "Business%20Cards"
            : "Advertisements"
        }/${request?.requestNumber}/${encodeURIComponent(
          item.fields.ProofFileName
        )}?web=1`
      : ""
  ),
  

          reviewStatus:
            item.fields?.ReviewStatus ||
            "Waiting Approval",

          reviewFeedback:
            item.fields?.ReviewFeedback ||
            "",

          uploadedAt:
            item.fields?.UploadedAt ||
            "",

          reviewedAt:
            item.fields?.ReviewedAt ||
            "",

          reviewedBy:
            item.fields?.ReviewedBy ||
            "",
        })
      );

    setProofHistory(history);
  } catch (error) {
    console.error(
      "PROOF HISTORY LOAD FAILED:",
      error
    );

    setProofHistory([]);
  }
};

  useEffect(() => {
    const loadRequest = async () => {
      const requests = await list();

      const found =
  requests.find(
    (r) => r.id === id
  ) || null;

setRequest(found);
if (found) {
  await loadProofHistory(
    found.id
  );
}
if (found) {
  localStorage.setItem(
    
    `request-seen-${found.id}`,
    found.updatedAt ||
      found.submittedAt
  );

  window.dispatchEvent(
    new Event(
      "request-notifications-changed"
    )
  );
}

setLoading(false);
    };

    loadRequest();
  }, [id]);

  if (loading) {
    return (
      <div className="page">
        <div className="formCard">
          <h1>Loading...</h1>
        </div>
      </div>
    );
  }

  if (!request) {
    return (
      <div className="page">
        <button
  type="button"
  className="back"
  onClick={() => {
  if (returnTo) {
    navigate(returnTo);
  } else {
    navigate(-1);
  }
}}
  style={{
    border: "none",
    background: "none",
    padding: 0,
    cursor: "pointer",
    font: "inherit",
  }}
>
  {cameFromDashboard
    ? "← Back to Dashboard"
    : "← Back to My Requests"}
</button>


        <div className="formCard">
          <h1>Request Not Found</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
     <button
  type="button"
  className="back"
  onClick={() => navigate(-1)}
  style={{
    border: "none",
    background: "none",
    padding: 0,
    cursor: "pointer",
    font: "inherit",
  }}
>
  ← Back
</button>

      <div className="formCard">
        <div className="formHead">
          <span>📋</span>

          <div>
            <p className="eyebrow">
              REQUEST DETAILS
            </p>

            <h1>
              {request.requestNumber}
            </h1>

            <p>
              {request.typeTitle}
            </p>
          </div>
        </div>

        <hr />

        <h2>
          Request Information
        </h2>

        <p>
          <strong>Status:</strong>{" "}
          {request.status}
        </p>

        <p>
          <strong>Submitted:</strong>{" "}
          {new Date(
            request.submittedAt
          ).toLocaleString()}
        </p>

        <p>
          <strong>Requester:</strong>{" "}
          {request.requesterName}
        </p>

        <p>
          <strong>Email:</strong>{" "}
          {request.requesterEmail}
        </p>

        <p>
          <strong>Branch:</strong>{" "}
          {request.branchDepartment}
        </p>

        {request.dueDate && (
  <p>
    <strong>Due Date:</strong>{" "}
    {formatDate(request.dueDate)}
  </p>
)}
        {request.submitterNote && (
  <div
    className="note"
    style={{
      marginTop: "20px",
      padding: "16px",
      borderRadius: "8px",
      background: "#fff8e1",
    }}
  >
    <strong>Status Update:</strong>

    <p
      style={{
        marginBottom: 0,
      }}
    >
      {request.submitterNote}
    </p>
  </div>
)}

{supportsProof && cameFromDashboard && (
  <>
    <hr />

    <h2>
      Proof Approval
    </h2>

    {request.proofStatus &&
      request.proofStatus !==
        "No Proof" && (
        <div
          style={{
            marginBottom: "20px",
            padding: "16px",
            background: "#f5f3ee",
            borderRadius: "8px",
          }}
        >
          <p>
            <strong>
              Current Proof Status:
            </strong>{" "}
            {request.proofStatus}
          </p>

          {request.proofVersion ? (
            <p>
              <strong>
                Proof Version:
              </strong>{" "}
              {request.proofVersion}
            </p>
          ) : null}

          {request.proofFileName && (
            <p>
              <strong>
                Current Proof:
              </strong>{" "}
              {request.proofFileName}
            </p>
          )}

          {request.proofFeedback && (
            <p>
              <strong>
                Requester Feedback:
              </strong>{" "}
              {request.proofFeedback}
            </p>
          )}
        </div>
      )}

    <div
      style={{
        marginBottom: "24px",
      }}
    >
      <label>
        Upload PDF Proof

        <input
          type="file"
          accept=".pdf,application/pdf"
          onChange={(e) => {
            const file =
              e.target.files?.[0] ||
              null;

            setProofFile(file);
            setProofError("");
          }}
          style={{
            display: "block",
            marginTop: "8px",
            marginBottom: "12px",
          }}
        />
      </label>

      {proofFile && (
        <p>
          Selected:{" "}
          <strong>
            {proofFile.name}
          </strong>
        </p>
      )}

      {proofError && (
        <p
          style={{
            color: "#c62828",
            fontWeight: 600,
          }}
        >
          {proofError}
        </p>
      )}

      <button
        type="button"
        className="primary"
        onClick={uploadProof}
        disabled={
          !proofFile ||
          uploadingProof
        }
      >
        {uploadingProof
          ? "Uploading Proof..."
          : "Upload & Send for Approval"}
      </button>
    </div>
  </>
)}

{proofNeedsReview && (
  <>
    <hr />

    <div
      style={{
        padding: "18px",
        background: "#fff8e1",
        borderRadius: "8px",
        marginBottom: "24px",
      }}
    >
      <h2>
        Proof Ready for Review
      </h2>

      <p>
        Marketing has uploaded a proof
        for your review.
      </p>

      {request.proofVersion ? (
        <p>
          <strong>
            Proof Version:
          </strong>{" "}
          {request.proofVersion}
        </p>
      ) : null}

      {request.proofFileName && (
        <p>
          <strong>
            File:
          </strong>{" "}
          {request.proofFileName}
        </p>
      )}

      {request.proofUrl && (
        <p>
          <a
            href={request.proofUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            View PDF Proof
          </a>
        </p>
      )}

      <div
        style={{
          marginTop: "20px",
        }}
      >
        <strong>
          Your Decision
        </strong>

        <label
          style={{
            display: "block",
            marginTop: "10px",
          }}
        >
          <input
            type="radio"
            name="proofDecision"
            value="Approved"
            checked={
              proofDecision ===
              "Approved"
            }
            onChange={() =>
              setProofDecision(
                "Approved"
              )
            }
          />{" "}
          Approved
        </label>

        <label
          style={{
            display: "block",
            marginTop: "8px",
          }}
        >
          <input
            type="radio"
            name="proofDecision"
            value="Needs Edits"
            checked={
              proofDecision ===
              "Needs Edits"
            }
            onChange={() =>
              setProofDecision(
                "Needs Edits"
              )
            }
          />{" "}
          Needs Edits
        </label>
      </div>

      <label
        style={{
          display: "block",
          marginTop: "18px",
        }}
      >
        Comments

        <textarea
          rows={5}
          value={proofFeedback}
          onChange={(e) =>
            setProofFeedback(
              e.target.value
            )
          }
          placeholder={
            proofDecision ===
            "Needs Edits"
              ? "Tell Marketing what needs to be changed."
              : "Optional comments."
          }
        />
      </label>

      {reviewError && (
        <p
          style={{
            color: "#c62828",
            fontWeight: 600,
          }}
        >
          {reviewError}
        </p>
      )}

      <button
        type="button"
        className="primary"
        onClick={submitProofReview}
        disabled={
          !proofDecision ||
          submittingReview
        }
      >
        {submittingReview
          ? "Submitting Review..."
          : "Submit Review"}
      </button>
    </div>
  </>
)}

{supportsProof &&
  proofHistory.length > 0 && (
    <>
      <hr />

      <h2>
        Proof History
      </h2>

      <p>
        Previous proofs, review
        decisions, and requester
        feedback for this request.
      </p>

      <div
        style={{
          display: "grid",
          gap: "14px",
          marginBottom: "24px",
        }}
      >
        {proofHistory.map(
          (proof) => (
            <div
              key={proof.id}
              style={{
                padding: "16px",
                border:
                  "1px solid #d6d0c4",
                borderRadius: "8px",
                background:
                  "#f8f7f3",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent:
                    "space-between",
                  gap: "12px",
                  flexWrap: "wrap",
                }}
              >
                <strong>
                  Proof{" "}
                  {proof.proofVersion}
                </strong>

                <strong>
                  {proof.reviewStatus}
                </strong>
              </div>

              {proof.proofFileName && (
                <p>
                  <strong>
                    File:
                  </strong>{" "}
                  {proof.proofFileName}
                </p>
              )}

              {proof.uploadedAt && (
                <p>
                  <strong>
                    Uploaded:
                  </strong>{" "}
                  {new Date(
                    proof.uploadedAt
                  ).toLocaleString()}
                </p>
              )}

              {proof.proofUrl && (
                <p>
                  <a
                    href={
                      proof.proofUrl
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View Proof{" "}
                    {proof.proofVersion}
                  </a>
                </p>
              )}

              {proof.reviewFeedback && (
                <div
                  style={{
                    marginTop: "12px",
                    padding: "12px",
                    background:
                      "#fff8e1",
                    borderRadius:
                      "6px",
                  }}
                >
                  <strong>
                    Requester Feedback
                  </strong>

                  <p
                    style={{
                      marginBottom: 0,
                    }}
                  >
                    {
                      proof.reviewFeedback
                    }
                  </p>
                </div>
              )}

              {proof.reviewedAt && (
                <p
                  style={{
                    marginTop: "12px",
                    marginBottom: 0,
                    fontSize: "13px",
                  }}
                >
                  <strong>
                    Reviewed:
                  </strong>{" "}
                  {new Date(
                    proof.reviewedAt
                  ).toLocaleString()}
                </p>
              )}
            </div>
          )
        )}
      </div>
    </>
  )}

<hr />

<h2>Form Details</h2>

      

        <div className="detailsGrid">
          {Object.entries(
            request.details || {}
          ).map(([key, value]) => (
            <div
              key={key}
              className="detailRow"
            >
              <strong>
                {key
                  .replace(
                    /([A-Z])/g,
                    " $1"
                  )
                  .replace(
                    /^./,
                    (str) =>
                      str.toUpperCase()
                  )}
              </strong>

              <span>
                {String(value)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}