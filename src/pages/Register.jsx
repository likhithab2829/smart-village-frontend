import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Register() {

  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async (e) => {

    e.preventDefault();

    try {

      await axios.post(
        "http://localhost:8092/api/users/register",
        {
          name: name,
          email: email,
          phone: phone,
          password: password,
          role: "USER"
        }
      );

      alert("Registration successful!");

      navigate("/login");

    } catch (error) {

      console.error(error);

      alert("Registration failed. Please try again.");

    }
  };

  return (
    <div className="login-page">

      <div className="login-card">

        <h1>🌱 Smart Village</h1>

        <h2>Create Account</h2>

        <p>Register to access village services</p>

        <form onSubmit={handleRegister}>

          <label>Name</label>

          <input
            type="text"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <label>Email</label>

          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label>Phone</label>

          <input
            type="tel"
            placeholder="Enter your phone number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />

          <label>Password</label>

          <input
            type="password"
            placeholder="Create a password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit">
            Register
          </button>

        </form>

        <p className="register-text">
          Already have an account?

          <span onClick={() => navigate("/login")}>
            Login
          </span>
        </p>

      </div>

    </div>
  );
}

export default Register;