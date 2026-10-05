import { useMsal } from "@azure/msal-react";
import { loginRequest } from "../auth/msalConfig";

export default function LoginButton() {
  const { instance, accounts } = useMsal();

  const signIn = () => {
    instance.loginRedirect(loginRequest);
  };

  const signOut = () => {
    instance.logoutRedirect();
  };

  const isLoggedIn =
    accounts.length > 0;

  return (
    <button
      onClick={
        isLoggedIn
          ? signOut
          : signIn
      }
      style={{
        padding: "10px 14px",
        borderRadius: "8px",
        border: "1px solid #AA202F",
        background: "#AA202F",
        color: "white",
        cursor: "pointer",
        fontWeight: 600,
      }}
    >
      {isLoggedIn
        ? "Sign Out"
        : "Sign In with Microsoft"}
    </button>
  );
}
