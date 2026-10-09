import {
  FormEvent,
  useEffect,
  useMemo,
  useState,
} from "react";

import { useMsal } from "@azure/msal-react";
import { useNavigate } from "react-router-dom";

import { create } from "../services/store";

export default function ApparelForm() {
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

  const [item, setItem] =
    useState("Cutter & Buck Polo");

  const [cut, setCut] =
    useState("Mens");

  const [size, setSize] =
    useState("M");

  const [color, setColor] =
    useState("Navy");

  const colors = useMemo(() => {
    switch (item) {
      case "Cutter & Buck Polo":
        return [
          "Navy",
          "Red",
          "Black",
          "Blue",
          "Grey",
        ];

      case "Cutter & Buck Pullover":
        return [
          "Black",
          "Navy",
        ];

      case "Ogio Cardigan":
        return ["Black"];

      default:
        return [];
    }
  }, [item]);

  const handleSubmit = async (
    e: FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    const request = await create({
      typeSlug: "frontier-apparel",
      typeTitle: "Frontier Apparel",
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
        item,
        cut,
        size,
        color,
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
        onClick={() =>
          window.history.back()
        }
      >
        ← All request types
      </button>

      <div className="formCard">
        <div className="formHead">
          <span>👕</span>

          <div>
            <p className="eyebrow">
              FRONTIER APPAREL
            </p>

            <h1>
              Frontier Apparel Request
            </h1>

            <p>
              Request Frontier-branded apparel.
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
          Apparel orders are grouped together and
          placed once the minimum order quantity of
          12 items is reached. Orders will be
          delivered directly to your branch when
          received.
        </div>

        <form onSubmit={handleSubmit}>
          <label>
            Name

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
            Email

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
            Item

            <select
              value={item}
              onChange={(e) => {
                const selectedItem =
                  e.target.value;

                setItem(
                  selectedItem
                );

                if (
                  selectedItem ===
                  "Ogio Cardigan"
                ) {
                  setColor(
                    "Black"
                  );

                  setCut(
                    "Womens"
                  );
                }

                if (
                  selectedItem ===
                  "Cutter & Buck Pullover"
                ) {
                  setColor(
                    "Black"
                  );
                }

                if (
                  selectedItem ===
                  "Cutter & Buck Polo"
                ) {
                  setColor(
                    "Navy"
                  );
                }
              }}
            >
              <option>
                Cutter & Buck Polo
              </option>

              <option>
                Cutter & Buck Pullover
              </option>

              <option>
                Ogio Cardigan
              </option>
            </select>
          </label>

          <label>
            Cut

            <select
              value={cut}
              disabled={
                item ===
                "Ogio Cardigan"
              }
              onChange={(e) =>
                setCut(
                  e.target.value
                )
              }
            >
              {item !==
                "Ogio Cardigan" && (
                <option>
                  Mens
                </option>
              )}

              <option>
                Womens
              </option>
            </select>
          </label>

          <label>
            Size

            <select
              value={size}
              onChange={(e) =>
                setSize(
                  e.target.value
                )
              }
            >
              <option>XS</option>
              <option>S</option>
              <option>M</option>
              <option>L</option>
              <option>XL</option>
              <option>2XL</option>
              <option>3XL</option>
              <option>4XL</option>
            </select>
          </label>

          <label>
            Color

            <select
              value={color}
              onChange={(e) =>
                setColor(
                  e.target.value
                )
              }
            >
              {colors.map(
                (
                  colorOption
                ) => (
                  <option
                    key={
                      colorOption
                    }
                  >
                    {
                      colorOption
                    }
                  </option>
                )
              )}
            </select>
          </label>

          <div className="actions">
            <button
              type="submit"
              className="primary"
            >
              Submit Apparel Request
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
