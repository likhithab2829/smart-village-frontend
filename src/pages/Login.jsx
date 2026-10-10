import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Login() {

  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {

    e.preventDefault();

    try {

      const response = await axios.post(
        "http://localhost:8092/api/users/login",
        {
          email: email,
          password: password
        }
      );

      // Get logged-in user
      const loggedInUser = response.data;

      // Save user details
      localStorage.setItem(
        "user",
        JSON.stringify(loggedInUser)
      );

      alert("Login successful!");

      // =====================================
      // CHECK USER ROLE
      // =====================================

      if (loggedInUser.role === "ADMIN") {

        // Admin → Admin Dashboard
        navigate("/admin");

      } else {

        // Normal User → User Dashboard
        navigate("/dashboard");

      }

    } catch (error) {

      console.error(
        "Login error:",
        error
      );

      if (error.response) {

        alert("Invalid email or password.");

      } else if (error.request) {

        alert(
          "Cannot connect to backend. " +
          "Make sure Spring Boot is running on port 8092."
        );

      } else {

        alert("Something went wrong.");

      }
    }
  };


  return (

    <div className="login-page">

      <div className="login-card">

        <h1>
          🌱 Smart Village
        </h1>

        <h2>
          Login
        </h2>

        <p>
          Login to access village services
        </p>


        <form onSubmit={handleLogin}>

          {/* EMAIL */}

          <label>
            Email
          </label>

          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
            required
          />


          {/* PASSWORD */}

          <label>
            Password
          </label>

          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
            required
          />


          {/* LOGIN */}

          <button type="submit">
            Login
          </button>

        </form>


        {/* REGISTER */}

        <p className="register-text">

          Don't have an account?

          <span
            onClick={() =>
              navigate("/register")
            }
          >
            Register
          </span>

        </p>

      </div>

    </div>

  );
}

export default Login;