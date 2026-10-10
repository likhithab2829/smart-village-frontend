import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Services from "./pages/Services";
import Dashboard from "./pages/Dashboard";

import Complaint from "./pages/Complaint";
import MyComplaints from "./pages/MyComplaints";

import AIChatbot from "./pages/AIChatbot";

import AdminDashboard from "./pages/AdminDashboard";
import AdminServices from "./pages/AdminServices";
import AdminComplaints from "./pages/AdminComplaints";
import AdminUsers from "./pages/AdminUsers";

import "./App.css";


/* ==============================
   HOME PAGE
============================== */

function Home() {

  return (

    <div className="home-page">


      {/* NAVBAR */}

      <nav className="home-navbar">

        <div className="home-logo">
          🌱 Smart Village
        </div>


        <div className="home-nav-links">

          <a href="/">
            Home
          </a>

          <a href="/services">
            Services
          </a>

          <a href="/login">
            Login
          </a>

          <a href="/register">
            Register
          </a>

        </div>

      </nav>


      {/* HERO SECTION */}

      <section className="hero-section">

        <div className="hero-content">

          <div className="hero-icon">
            🌱
          </div>


          <h1>

            Welcome to

            <br />

            <span>
              Smart Village
            </span>

          </h1>


          <p>

            Your digital platform for accessing

            <br />

            village services easily.

          </p>


          <div className="hero-buttons">

            <a
              href="/services"
              className="primary-button"
            >
              Explore Services →
            </a>


            <a
              href="/login"
              className="secondary-button"
            >
              Login
            </a>

          </div>

        </div>

      </section>


      {/* ABOUT SECTION */}

      <section className="about-section">

        <h2>
          About Smart Village
        </h2>


        <p>

          Smart Village Service Platform is a
          digital platform that helps village
          residents easily find and access
          important local services.

        </p>

      </section>


      {/* FOOTER */}

      <footer className="home-footer">

        <p>
          © 2026 Smart Village Service Platform
        </p>

      </footer>


    </div>

  );

}


/* ==============================
   MAIN APP
============================== */

function App() {

  return (

    <BrowserRouter>

      <Routes>

        {/* HOME */}

        <Route
          path="/"
          element={<Home />}
        />


        {/* USER */}

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        <Route
          path="/services"
          element={<Services />}
        />

        <Route
          path="/dashboard"
          element={<Dashboard />}
        />


        {/* COMPLAINTS */}

        <Route
          path="/complaint"
          element={<Complaint />}
        />

        <Route
          path="/my-complaints"
          element={<MyComplaints />}
        />


        {/* AI CHATBOT */}

        <Route
          path="/ai-chat"
          element={<AIChatbot />}
        />


        {/* ADMIN */}

        <Route
          path="/admin"
          element={<AdminDashboard />}
        />

        <Route
          path="/admin-services"
          element={<AdminServices />}
        />

        <Route
          path="/admin-complaints"
          element={<AdminComplaints />}
        />

        <Route
          path="/admin-users"
          element={<AdminUsers />}
        />

      </Routes>

    </BrowserRouter>

  );

}


export default App;