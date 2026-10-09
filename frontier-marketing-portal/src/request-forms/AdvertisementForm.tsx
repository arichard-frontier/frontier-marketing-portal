import { FormEvent, useState } from "react";
import { create } from "../services/store";

export default function AdvertisementForm() {
  const [fullName, setFullName] =
    useState("");

  const [branch, setBranch] =
    useState("");

    const [adSize, setAdSize] =
  useState("");

 const [email, setEmail] =
  useState("");

  const [publicationLocation, setPublicationLocation] =
    useState("");

  const [contractLength, setContractLength] =
    useState("");

  const [medium, setMedium] =
    useState("Digital");

  const [adCost, setAdCost] =
    useState("");

  const [contactName, setContactName] =
    useState("");

  const [contactEmail, setContactEmail] =
    useState("");

  const [alignment, setAlignment] =
    useState("");

  const [tangibleValue, setTangibleValue] =
    useState("");

  const [investmentJustification, setInvestmentJustification] =
    useState("");

  const [previousParticipation, setPreviousParticipation] =
    useState("");

  const handleSubmit = async (
    e: FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    const request = await create({
      typeSlug: "advertisement",
      typeTitle: "Advertisement",
      workflow: "standard",

      requesterName: fullName,
      requesterEmail: "",

      branchDepartment: branch,

      dueDate: contractLength,

      assignedTo: "",

      details: {
        fullName,
        email,
        branch,
        publicationLocation,
        contractLength,
        medium,
        adSize,
        adCost,
        contactName,
        contactEmail,
        alignment,
        tangibleValue,
        investmentJustification,
        previousParticipation,
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
          <span>📣</span>

          <div>
            <p className="eyebrow">
              FRONTIER MARKETING REQUEST
            </p>

            <h1>
              Advertisement Request
            </h1>

            <p>
              Advertising requests of $500 or more
              require Marketing review and approval
              before commitments are made.
            </p>
          </div>
        </div>

        <div
          style={{
            background: "#fff8e1",
            padding: "12px",
            borderRadius: "8px",
            marginTop: "12px",
            marginBottom: "20px",
            fontWeight: "600",
          }}
        >
          Advertising requests of $500 or more
          require Marketing review and approval
          before commitments are made.
        </div>

        <form onSubmit={handleSubmit}>
          <label>
            Your Name

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
            Your Branch

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

              <option>Elgin Headquarters</option>
              <option>Smithville Branch</option>
              <option>Smithville Commercial Office</option>
              <option>Manor Branch</option>
              <option>Bastrop Branch</option>
              <option>Bastrop Executive Office</option>
              <option>Georgetown Branch</option>
              <option>Taylor Branch</option>
              <option>Round Rock Branch</option>
              <option>Leander Branch</option>
              <option>Austin Commercial Office</option>
              <option>Buda Branch</option>
            </select>
          </label>

          <label>
  Your Email

  <input
    type="email"
    placeholder="name@frontierbankoftexas.bank"
    value={email}
    onChange={(e) =>
      setEmail(
        e.target.value
      )
    }
  />
</label>

          <label>
            Publication / Location Of Ad

            <input
              type="text"
              placeholder="Example: Elgin Courier, Community Impact, Austin Business Journal, Billboard on Hwy 290, etc."
              value={publicationLocation}
              onChange={(e) =>
                setPublicationLocation(
                  e.target.value
                )
              }
            />
          </label>

          <label>
            Contract End Date

            <input
              type="date"
              value={contractLength}
              onChange={(e) =>
                setContractLength(
                  e.target.value
                )
              }
            />
          </label>

          <label>
            Medium

            <select
              value={medium}
              onChange={(e) =>
                setMedium(
                  e.target.value
                )
              }
            >
              <option>
                Digital
              </option>

              <option>
                Print
              </option>

              <option>
                Banner
              </option>

              <option>
                Outdoor
              </option>
            </select>
          </label>

<label>
  Size of Ad (inches or pixels)

  <input
    type="text"
    value={adSize}
    onChange={(e) =>
      setAdSize(e.target.value)
    }
    placeholder='Example: 8.5" x 11" or 1080 x 1080 px'
  />
</label>


          <label>
            Cost Of Ad

            <input
              type="text"
              placeholder="$500.00/month, $2,000 contract, etc."
              value={adCost}
              onChange={(e) =>
                setAdCost(
                  e.target.value
                )
              }
            />
          </label>

          <label>
            Name Of Contact At Organization

            <input
              type="text"
              placeholder="John Smith"
              value={contactName}
              onChange={(e) =>
                setContactName(
                  e.target.value
                )
              }
            />
          </label>

          <label>
            Email Of Contact At Organization

            <input
              type="email"
              placeholder="john@example.com"
              value={contactEmail}
              onChange={(e) =>
                setContactEmail(
                  e.target.value
                )
              }
            />
          </label>

          <label>
            Alignment

            <textarea
              rows={4}
              placeholder="How does this opportunity support Frontier's goals? Examples: business development, community involvement, customer relationships, deposit growth, brand awareness, referral opportunities, etc."
              value={alignment}
              onChange={(e) =>
                setAlignment(
                  e.target.value
                )
              }
            />
          </label>

          <label>
            Tangible Value

            <textarea
              rows={4}
              placeholder="What measurable value will Frontier receive? Examples: new leads, deposits, visibility, networking opportunities, customer engagement, referrals, or community presence."
              value={tangibleValue}
              onChange={(e) =>
                setTangibleValue(
                  e.target.value
                )
              }
            />
          </label>

          <label>
            Justification For Investment

            <textarea
              rows={4}
              placeholder="Why should Frontier invest in this opportunity instead of another advertising or marketing opportunity? What makes this placement especially valuable?"
              value={investmentJustification}
              onChange={(e) =>
                setInvestmentJustification(
                  e.target.value
                )
              }
            />
          </label>

          <label>
            Previous Participation

            <textarea
              rows={4}
              placeholder="Has Frontier advertised here before? If yes, what were the results? Include visibility, customer engagement, leads, deposits, relationships, or lessons learned."
              value={previousParticipation}
              onChange={(e) =>
                setPreviousParticipation(
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
              Submit Advertisement Request
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}