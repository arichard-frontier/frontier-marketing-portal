import { create } from "../services/store";
import { FormEvent, useState } from "react";

type BranchInfo = {
  address: string;
  phone: string;
};

const branchData: Record<string, BranchInfo> = {
  "Elgin Headquarters": {
    address: "1213 US-290, Elgin, TX 78621",
    phone: "(512) 281-1500",
  },

  "Smithville Branch": {
    address: "107 NW Loop 230, Smithville, TX 78957",
    phone: "(512) 237-2487",
  },

  "Smithville Commercial Office": {
    address: "201 Main Street, Smithville, TX 78957",
    phone: "(512) 237-2487",
  },

  "Manor Branch": {
    address: "12400 Gregg Manor Rd, Manor, TX 78653",
    phone: "(512) 281-1579",
  },

  "Bastrop Branch": {
    address: "921 Main St, Bastrop, TX 78602",
    phone: "(512) 303-6000",
  },

  "Bastrop Executive Office": {
    address: "1500 Chestnut St, Bastrop, TX 78602",
    phone: "(512) 303-6000",
  },

  "Georgetown Branch": {
    address:
      "2651 E University Ave, Suite 700, Georgetown, TX 78626",
    phone: "(737) 284-7940",
  },

  "Taylor Branch": {
    address: "813 N Main Street, Taylor, TX 76574",
    phone: "(512) 352-1414",
  },

  "Round Rock Branch": {
    address: "7509 O'Connor Drive, Round Rock, TX 78681",
    phone: "(512) 255-2500",
  },

  "Leander Branch": {
    address:
      "2080 US Hwy 183 N, Suite 230, Leander, TX 78641",
    phone: "(512) 281-1573",
  },

  "Austin Commercial Office": {
    address:
      "2200 Lake Austin Blvd, Austin, TX 78703",
    phone: "(512) 970-0656",
  },

  "Buda Branch": {
    address: "215 Railroad Street, Buda, TX 78610",
    phone: "(512) 295-2574",
  },
};

export default function BusinessCardsForm() {
  const [fullName, setFullName] =
  useState("");

const [jobTitle, setJobTitle] =
  useState("");

const [email, setEmail] =
  useState("");

const [nmls, setNmls] =
  useState("");

const [directLine, setDirectLine] =
  useState("");

const [faxNumber, setFaxNumber] =
  useState("");

const [personalNumber, setPersonalNumber] =
  useState("");

const [quantity, setQuantity] =
  useState("50");

const [additionalNotes, setAdditionalNotes] =
  useState("");
  const [branch, setBranch] = useState(
    "Elgin Headquarters"
  );

  const [branchAddress, setBranchAddress] = useState(
    branchData["Elgin Headquarters"].address
  );

  const [branchPhone, setBranchPhone] = useState(
    branchData["Elgin Headquarters"].phone
  );

  const handleBranchChange = (
    branchName: string
  ) => {
    setBranch(branchName);

    setBranchAddress(
      branchData[branchName].address
    );

    setBranchPhone(
      branchData[branchName].phone
    );
  };
const handleSubmit = (
  e: FormEvent<HTMLFormElement>
) => {
  e.preventDefault();

  const request = create({
    typeSlug: "business-cards",
    typeTitle: "Business Cards",
    workflow: "standard",

    requesterName: fullName,
    requesterEmail: email,

    branchDepartment: branch,

    dueDate: "",
    assignedTo: "",

    details: {
      fullName,
      jobTitle,
      email,
      nmls,
      branch,
      branchAddress,
      branchPhone,
      directLine,
      faxNumber,
      personalNumber,
      quantity,
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
          <span>💳</span>

          <div>
            <p className="eyebrow">
              FRONTIER MARKETING REQUEST
            </p>

            <h1>Business Card Request</h1>

            <p>
              Please enter your information exactly as it
              should appear on your business card.
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
            Job Title
            <input
  type="text"
  value={jobTitle}
  onChange={(e) =>
    setJobTitle(e.target.value)
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
            NMLS # (if applicable)
            <input
  type="text"
  value={nmls}
  onChange={(e) =>
    setNmls(e.target.value)
  }
/>
          </label>

          <label>
            Branch

            <select
              value={branch}
              onChange={(e) =>
                handleBranchChange(
                  e.target.value
                )
              }
            >
              {Object.keys(branchData).map(
                (branchName) => (
                  <option
                    key={branchName}
                    value={branchName}
                  >
                    {branchName}
                  </option>
                )
              )}
            </select>
          </label>

          <label>
            Branch Address

            <input
              type="text"
              value={branchAddress}
              onChange={(e) =>
                setBranchAddress(
                  e.target.value
                )
              }
            />
          </label>

          <label>
            Branch Phone

            <input
              type="text"
              value={branchPhone}
              onChange={(e) =>
                setBranchPhone(
                  e.target.value
                )
              }
            />
          </label>

          <label>
            Direct Line (Work Phone)
            <input
  type="text"
  value={directLine}
  onChange={(e) =>
    setDirectLine(e.target.value)
  }
/>
          </label>

          <label>
            Fax Number (if applicable)
            <input
  type="text"
  value={faxNumber}
  onChange={(e) =>
    setFaxNumber(e.target.value)
  }
/>
          </label>

          <label>
            Personal Number
            <input
  type="text"
  value={personalNumber}
  onChange={(e) =>
    setPersonalNumber(e.target.value)
  }
/>
          </label>

          <label>
            Quantity

            <select
  value={quantity}
  onChange={(e) =>
    setQuantity(e.target.value)
  }
>
              <option>50 Cards</option>
              <option>100 Cards</option>
            </select>
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
              Submit Business Card Request
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}