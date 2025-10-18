import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function AuthCallback() {
  const { search } = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(search);
    const userData = Object.fromEntries(params.entries());

    console.log("Telegram User Data:", userData);

    // Send to backend for verification
    fetch("/api/verify-telegram", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });
  }, [search]);

  return <div>Logging in...</div>;
}
