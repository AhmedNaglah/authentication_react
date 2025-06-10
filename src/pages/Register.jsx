import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link  } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const { token } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  // Redirect logged-in user to home
  useEffect(() => {
    if (!token) return;

    axios.get("http://localhost:8000/protected", {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then(() => navigate("/")) // valid token → go home
    .catch(() => {
      // invalid token, do nothing, stay on register
    });
  }, [token, navigate]);

  // Simple email regex for custom validation
  const validateEmail = (email) => {
    return /\S+@\S+\.\S+/.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!validateEmail(form.email)) {
      setError("Please enter a valid email address.");
      return;
    }

    try {
      await axios.post("http://localhost:8000/register", form);
      alert("Registration successful! Please log in.");
      navigate("/login");
    } catch (err) {
      if (err.response?.status === 422) {
        setError("Please enter a valid email address.");
      } else {
        setError(err.response?.data?.detail || "Registration failed");
      }
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          required
        />
        <button type="submit">Register</button>
        {error && <p style={{ color: "red" }}>{error}</p>}
      </form>
      <p style={{ marginTop: "1rem" }}>
          Already have an account?{" "}
          <Link to="/login" style={{ color: "blue", textDecoration: "underline" }}>
            Log in
          </Link>
      </p>
    </>
  );
}
