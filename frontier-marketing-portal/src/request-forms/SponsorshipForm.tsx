import {
  FormEvent,
  useEffect,
  useState,
} from "react";

import { useMsal } from "@azure/msal-react";
import { useNavigate } from "react-router-dom";

import { create } from "../services/store";

export default function SponsorshipForm() {
    const { accounts } = useMsal();
  const navigate = useNavigate();

  const [email, setEmail] =
    useState("");

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

  const [branch, setBranch] =
    useState("");

  const [title, setTitle] =
    useState("");

  const [eventName, setEventName] =
    useState("");

  const [eventDate, setEventDate] =
    useState("");

  const [sponsorshipCost, setSponsorshipCost] =
    useState("");

  const [contactName, setContactName] =
    useState("");

  const [contactEmail, setContactEmail] =
    useState("");

  const [sponsorshipIncludes, setSponsorshipIncludes] =
    useState("");

  const [eventPlan, setEventPlan] =
    useState("");

  const [promoCost, setPromoCost] =
    useState("");

  const [printCost, setPrintCost] =
    useState("");

  const [attendees, setAttendees] =
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
      typeSlug: "sponsorship",
      typeTitle: "Sponsorship",
      workflow: "standard",

      requesterName: fullName,
      requesterEmail: email,

      branchDepartment: branch,

      dueDate: eventDate,

      assignedTo: "",

      details: {
        fullName,
        email,
        branch,
        title,
        eventName,
        eventDate,
        sponsorshipCost,
        contactName,
        contactEmail,
        sponsorshipIncludes,
        eventPlan,
        promoCost,
        printCost,
        attendees,
        alignment,
        tangibleValue,
        investmentJustification,
        previousParticipation,
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
          <span>🤝</span>

          <div>
            <p className="eyebrow">
              FRONTIER MARKETING REQUEST
            </p>

            <h1>
              Sponsorship Request
            </h1>

            <p>
              Sponsorship requests of $500 or more
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
          Sponsorship requests of $500 or more
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
            Your Title

            <input
              type="text"
              value={title}
              onChange={(e) =>
                setTitle(
                  e.target.value
                )
              }
            />
          </label>

          <label>
            Event Name

            <input
              type="text"
              value={eventName}
              onChange={(e) =>
                setEventName(
                  e.target.value
                )
              }
            />
          </label>

          <label>
            Date Of Event

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
            Cost Of Sponsorship

            <input
              type="number"
              placeholder="500.00"
              value={sponsorshipCost}
              onChange={(e) =>
                setSponsorshipCost(
                  e.target.value
                )
              }
            />
          </label>

          <label>
            Name Of Contact At Sponsorship Organization

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
            Email Of Contact At Sponsorship Organization

            <input
              type="email"
              placeholder="john@example.org"
              value={contactEmail}
              onChange={(e) =>
                setContactEmail(
                  e.target.value
                )
              }
            />
          </label>

          <label>
            What Is Included In The Sponsorship?

            <textarea
              rows={4}
              placeholder="Examples: logo placement, booth space, speaking opportunity, event tickets, website recognition, social media promotion, attendee list, program advertisement, VIP access, etc."
              value={sponsorshipIncludes}
              onChange={(e) =>
                setSponsorshipIncludes(
                  e.target.value
                )
              }
            />
          </label>

          <label>
            Plan For Event

            <textarea
              rows={4}
              placeholder="Examples: Frontier table with promotional items, large red tent, customer meetings, networking, speaking opportunity, employee volunteers, giveaways, cornhole, giant jenga, etc."
              value={eventPlan}
              onChange={(e) =>
                setEventPlan(
                  e.target.value
                )
              }
            />
          </label>

          <label>
            Additional Cost To Budget: Promotional / Table Items

            <input
              type="number"
              placeholder="0.00"
              value={promoCost}
              onChange={(e) =>
                setPromoCost(
                  e.target.value
                )
              }
            />
          </label>

          <label>
            Additional Cost To Budget: Marketing Print Materials

            <input
              type="number"
              placeholder="0.00"
              value={printCost}
              onChange={(e) =>
                setPrintCost(
                  e.target.value
                )
              }
            />
          </label>

          <label>
            Frontier Employee Event Attendees / Representatives

            <textarea
              rows={4}
              placeholder="List Frontier employees expected to attend. One name per line. Example: Abby Richard, John Smith, Jane Doe"
              value={attendees}
              onChange={(e) =>
                setAttendees(
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
              placeholder="What measurable value will Frontier receive? Examples: new leads, new accounts, networking opportunities, customer retention, visibility, referrals, community presence, etc."
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
              placeholder="Why should Frontier invest in this opportunity instead of another sponsorship or marketing effort? What makes this opportunity unique or especially valuable?"
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
              placeholder="Has Frontier participated before? If yes, what were the results? Include attendance, relationships built, leads generated, business opportunities, visibility gained, or lessons learned."
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
              Submit Sponsorship Request
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}