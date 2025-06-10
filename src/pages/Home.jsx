import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

export default function Home() {
  const { token, logout } = useAuth();
  const [msg, setMsg] = useState("Loading...");

  useEffect(() => {
    if (!token) return;

    axios
      .get("http://localhost:8000/protected", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setMsg(res.data.msg))
      .catch(() => {
        setMsg("Access denied");
      });
  }, [token]);

  return (
    <div>
      <h1>{msg}</h1>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
