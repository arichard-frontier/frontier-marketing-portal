import { FormEvent, useState } from "react";
import { create } from "../services/store";

export default function MarketingMaterialsForm() {
  const [fullName, setFullName] =
  useState("");

const [email, setEmail] =
  useState("");

const [branch, setBranch] =
  useState("");

const [printed, setPrinted] =
  useState("No");

  const [materialType, setMaterialType] =
    useState("Flyer");

  const [audience, setAudience] =
    useState("");

  const [keyMessage, setKeyMessage] =
    useState("");

  const [contentToInclude, setContentToInclude] =
    useState("");

  const [fileFormat, setFileFormat] =
    useState("PDF");

  const [dueDate, setDueDate] =
    useState("");

  const [quantity, setQuantity] =
    useState("");

  const [additionalNotes, setAdditionalNotes] =
    useState("");

  const handleSubmit = (
    e: FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    const request = create({
      typeSlug: "marketing-materials",
      typeTitle: "Marketing Materials",
      workflow: "standard",

      requesterName: fullName,
requesterEmail: email,

branchDepartment: branch,

      dueDate,

      assignedTo: "",

      details: {
        fullName,
        email,
        branch,
        printed,
        quantity,
        materialType,
        audience,
        keyMessage,
        contentToInclude,
        fileFormat,
        additionalNotes,
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
          <span>🎨</span>

          <div>
            <p className="eyebrow">
              FRONTIER MARKETING REQUEST
            </p>

            <h1>
              Marketing Materials Request
            </h1>

            <p>
              Submit requests for flyers,
              brochures, posters, signage,
              social graphics, and other
              marketing materials.
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
      setFullName(e.target.value)
    }
  />
</label>

<label>
  Email Address

  <input
    type="email"
    value={email}
    onChange={(e) =>
      setEmail(e.target.value)
    }
  />
</label>

<label>
  Branch

  <select
    value={branch}
    onChange={(e) =>
      setBranch(e.target.value)
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
            Material Type

            <select
              value={materialType}
              onChange={(e) =>
                setMaterialType(
                  e.target.value
                )
              }
            >
              <option>
                Flyer (8.5 x 11)
              </option>

              <option>
                Brochure (tri-fold, 8.5 x 11)
              </option>

              <option>
                Vinyl Banner (varying sizes)
              </option>

              <option>
                Social Graphic (4 in x 5 in)
              </option>

              <option>
                Postcard Handout (small, 4 x 6)
              </option>

              <option>
                Postcard Handout (medium, 7 x 5)
              </option>

              <option>
                Postcard Handout (large, 8.5 x 5.5)
              </option>

              <option>
                Sticker (varying sizes)
              </option>

              <option>
                Other (describe in notes below)
              </option>
            </select>
          </label>

          <label>
            Audience (who is going to be reading this?)

            <input
              type="text"
              value={audience}
              onChange={(e) =>
                setAudience(
                  e.target.value
                )
              }
            />
          </label>

          <label>
            Key Message (what message are you trying to convey?)

            <textarea
              rows={3}
              value={keyMessage}
              onChange={(e) =>
                setKeyMessage(
                  e.target.value
                )
              }
            />
          </label>

          <label>
            Content to Include (branch info, perosnal info, event details, pictures etc.)

            <textarea
              rows={4}
              value={
                contentToInclude
              }
              onChange={(e) =>
                setContentToInclude(
                  e.target.value
                )
              }
            />
          </label>

          <label>
            File Format

            <select
              value={fileFormat}
              onChange={(e) =>
                setFileFormat(
                  e.target.value
                )
              }
            >
          
              <option>
                PDF
              </option>

              <option>
                PNG
              </option>

              <option>
                JPEG
              </option>

              <option>
                AI
              </option>

              <option>
                PSD
              </option>

              <option>
                SVG
              </option>
            </select>
          </label>

          <label>
  Will This Be Printed?

  <select
    value={printed}
    onChange={(e) =>
      setPrinted(
        e.target.value
      )
    }
  >
    <option>No</option>
    <option>Yes</option>
  </select>
</label>

{printed === "Yes" && (
  <label>
    Quantity Needed

    <input
      type="number"
      value={quantity}
      onChange={(e) =>
        setQuantity(
          e.target.value
        )
      }
    />
  </label>
)}

          <label>
            Due Date

            <input
              type="date"
              value={dueDate}
              onChange={(e) =>
                setDueDate(
                  e.target.value
                )
              }
            />
          </label>

          <label>
            Additional Notes

            <textarea
              rows={4}
              value={
                additionalNotes
              }
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
              Submit Marketing Request
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}