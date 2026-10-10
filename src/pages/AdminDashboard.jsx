import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function AdminDashboard() {

  const navigate = useNavigate();

  const [user, setUser] = useState(null);

  const [totalServices, setTotalServices] = useState(0);

  const [totalUsers, setTotalUsers] = useState(0);

  const [totalComplaints, setTotalComplaints] = useState(0);

  const [loading, setLoading] = useState(true);


  // ==========================================
  // CHECK ADMIN LOGIN
  // ==========================================

  useEffect(() => {

    const storedUser =
      localStorage.getItem("user");

    if (!storedUser) {

      navigate("/login");

      return;
    }

    try {

      const loggedInUser =
        JSON.parse(storedUser);

      setUser(loggedInUser);


      // Check ADMIN role

      if (loggedInUser.role !== "ADMIN") {

        alert(
          "Access denied. Admin only."
        );

        navigate("/dashboard");

        return;
      }


      // Load dashboard data

      loadDashboardData();

    } catch (error) {

      console.error(
        "User data error:",
        error
      );

      localStorage.removeItem("user");

      navigate("/login");

    }

  }, [navigate]);


  // ==========================================
  // LOAD DASHBOARD DATA
  // ==========================================

  const loadDashboardData = async () => {

    try {

      // Get services

      const servicesResponse =
        await axios.get(
          "http://localhost:8092/api/village-services"
        );

      setTotalServices(
        servicesResponse.data.length
      );


      // Get users

      const usersResponse =
        await axios.get(
          "http://localhost:8092/api/users"
        );

      setTotalUsers(
        usersResponse.data.length
      );


      // Get complaints

      try {

        const complaintsResponse =
          await axios.get(
            "http://localhost:8092/api/complaints"
          );

        setTotalComplaints(
          complaintsResponse.data.length
        );

      } catch (complaintError) {

        console.log(
          "Complaints API not available yet."
        );

        setTotalComplaints(0);

      }

    } catch (error) {

      console.error(
        "Dashboard loading error:",
        error
      );

    } finally {

      setLoading(false);

    }

  };


  // ==========================================
  // LOGOUT
  // ==========================================

  const handleLogout = () => {

    localStorage.removeItem("user");

    navigate("/login");

  };


  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {

    return (

      <div className="admin-loading">

        <h2>
          Loading Admin Dashboard...
        </h2>

      </div>

    );

  }


  // ==========================================
  // DASHBOARD
  // ==========================================

  return (

    <div className="admin-dashboard-page">


      {/* ======================================
          NAVBAR
      ====================================== */}

      <nav className="admin-navbar">

        <div className="admin-logo">

          🌱 Smart Village Admin

        </div>


        <div className="admin-nav">

          <button
            onClick={() =>
              navigate("/")
            }
          >
            Home
          </button>


          <button
            onClick={() =>
              navigate("/services")
            }
          >
            Services
          </button>


          <button
            onClick={handleLogout}
          >
            Logout
          </button>

        </div>

      </nav>


      {/* ======================================
          WELCOME
      ====================================== */}

      <section className="admin-welcome">

        <h1>
          Welcome, {user?.name || "Admin"} 👋
        </h1>

        <p>
          Manage the Smart Village Service Platform
        </p>

      </section>


      {/* ======================================
          STATISTICS
      ====================================== */}

      <section className="admin-statistics">


        {/* SERVICES */}

        <div className="admin-stat-card">

          <div className="admin-stat-icon">
            🏘️
          </div>

          <div>

            <h2>
              {totalServices}
            </h2>

            <p>
              Total Services
            </p>

          </div>

        </div>


        {/* USERS */}

        <div className="admin-stat-card">

          <div className="admin-stat-icon">
            👥
          </div>

          <div>

            <h2>
              {totalUsers}
            </h2>

            <p>
              Registered Users
            </p>

          </div>

        </div>


        {/* COMPLAINTS */}

        <div className="admin-stat-card">

          <div className="admin-stat-icon">
            📝
          </div>

          <div>

            <h2>
              {totalComplaints}
            </h2>

            <p>
              Total Complaints
            </p>

          </div>

        </div>


        {/* ADMIN */}

        <div className="admin-stat-card">

          <div className="admin-stat-icon">
            👨‍💼
          </div>

          <div>

            <h2>
              Admin
            </h2>

            <p>
              Account Role
            </p>

          </div>

        </div>

      </section>


      {/* ======================================
          ADMIN ACTIONS
      ====================================== */}

      <section className="admin-actions">

        <h2>
          Admin Management
        </h2>


        <div className="admin-action-grid">


          {/* MANAGE SERVICES */}

          <div className="admin-action-card">

            <div className="admin-action-icon">
              🏘️
            </div>

            <h3>
              Manage Services
            </h3>

            <p>
              Add, edit, delete and manage
              village services.
            </p>

            <button
              onClick={() =>
                navigate("/admin-services")
              }
            >
              Manage Services
            </button>

          </div>


          {/* VIEW SERVICES */}

          <div className="admin-action-card">

            <div className="admin-action-icon">
              📋
            </div>

            <h3>
              View Services
            </h3>

            <p>
              View all services available
              in the village.
            </p>

            <button
              onClick={() =>
                navigate("/services")
              }
            >
              View Services
            </button>

          </div>


          {/* COMPLAINTS */}

          <div className="admin-action-card">

            <div className="admin-action-icon">
              📝
            </div>

            <h3>
              Manage Complaints
            </h3>

            <p>
              View and manage complaints
              submitted by users.
            </p>

            <button
              onClick={() =>
                navigate("/admin-complaints")
              }
            >
              View Complaints
            </button>

          </div>


          {/* USERS */}

          <div className="admin-action-card">

            <div className="admin-action-icon">
              👥
            </div>

            <h3>
              Manage Users
            </h3>

            <p>
              View registered users
              of the Smart Village platform.
            </p>

            <button
              onClick={() =>
                navigate("/admin-users")
              }
            >
              View Users
            </button>

          </div>

        </div>

      </section>


      {/* ======================================
          FOOTER
      ====================================== */}

      <footer className="admin-footer">

        <p>
          © 2026 Smart Village Service Platform
        </p>

      </footer>

    </div>

  );
}

export default AdminDashboard;