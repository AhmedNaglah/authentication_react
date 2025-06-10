import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "./context/AuthContext";
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/Home";  // Your protected home page component
import Register from "./pages/Register";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/*" element={<RequireAuth><Home /></RequireAuth>} />
      </Routes>
    </Router>
  );
}

// Protect routes with this component
function RequireAuth({ children }) {
  const { token, logout } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      setLoading(false);
      navigate("/login");
      return;
    }

    axios.get("http://localhost:8000/protected", {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then(() => setLoading(false))
    .catch(() => {
      logout();
      setLoading(false);
      navigate("/login");
    });
  }, [token, logout, navigate]);

  if (loading) return <div>Loading...</div>;

  return children;
}

export default App;
