import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "./context/AuthContext";
import Login from "./pages/Login"; // make sure this import exists

function App() {
  const { token } = useAuth();
  const [msg, setMsg] = useState("");

  useEffect(() => {
    if (token) {
      axios.get("http://localhost:8000/protected", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(res => setMsg(res.data.msg))
      .catch(() => setMsg("Access denied"));
    }
  }, [token]);

  return (
    <div>
      {token ? (
        <h1>{msg}</h1>
      ) : (
        <>
          <h1>Please log in</h1>
          <Login />
        </>
      )}
    </div>
  );
}

export default App;
