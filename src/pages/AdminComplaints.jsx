import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function AdminComplaints() {

  const navigate = useNavigate();

  const [complaints, setComplaints] = useState([]);

  const [loading, setLoading] = useState(true);


  // ==========================================
  // CHECK ADMIN
  // ==========================================

  useEffect(() => {

    const storedUser =
      localStorage.getItem("user");

    if (!storedUser) {

      navigate("/login");

      return;
    }

    try {

      const user =
        JSON.parse(storedUser);

      if (user.role !== "ADMIN") {

        alert("Admin access required.");

        navigate("/dashboard");

        return;
      }

      fetchComplaints();

    } catch (error) {

      console.error(error);

      localStorage.removeItem("user");

      navigate("/login");

    }

  }, [navigate]);


  // ==========================================
  // GET COMPLAINTS
  // ==========================================

  const fetchComplaints = async () => {

    try {

      setLoading(true);

      const response =
        await axios.get(
          "http://localhost:8092/api/complaints"
        );

      setComplaints(response.data);

    } catch (error) {

      console.error(
        "Error loading complaints:",
        error
      );

      alert(
        "Failed to load complaints."
      );

    } finally {

      setLoading(false);

    }

  };


  // ==========================================
  // UPDATE STATUS
  // ==========================================

  const updateStatus = async (
    complaintId,
    newStatus
  ) => {

    try {

      await axios.put(
        `http://localhost:8092/api/complaints/${complaintId}`,
        {
          status: newStatus
        }
      );

      alert(
        "Complaint status updated."
      );

      fetchComplaints();

    } catch (error) {

      console.error(
        "Status update error:",
        error
      );

      alert(
        "Failed to update complaint status."
      );

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
  // PRIORITY CLASS
  // ==========================================

  const getPriorityClass = (priority) => {

    if (!priority) {
      return "priority-low";
    }

    if (
      priority.toLowerCase() === "high"
    ) {
      return "priority-high";
    }

    if (
      priority.toLowerCase() === "medium"
    ) {
      return "priority-medium";
    }

    return "priority-low";
  };


  // ==========================================
  // PAGE
  // ==========================================

  return (

    <div className="admin-page">


      {/* ======================================
          NAVBAR
          ====================================== */}

      <nav className="admin-navbar">

        <div className="admin-logo">

          🌱 Smart Village Admin

        </div>


        <div className="admin-nav-buttons">

          <button
            onClick={() =>
              navigate("/admin")
            }
          >
            Admin Dashboard
          </button>


          <button
            onClick={() =>
              navigate("/admin-services")
            }
          >
            Services
          </button>


          <button
            onClick={() =>
              navigate("/admin-users")
            }
          >
            Users
          </button>


          <button
            onClick={handleLogout}
          >
            Logout
          </button>

        </div>

      </nav>


      {/* ======================================
          CONTENT
          ====================================== */}

      <div className="admin-content">


        <h1>
          📋 Manage Complaints
        </h1>


        <p className="admin-description">
          View complaints and AI-generated
          category and priority.
        </p>


        {/* ==================================
            LOADING
            ================================== */}

        {loading ? (

          <div className="admin-loading">

            Loading complaints...

          </div>

        ) : complaints.length === 0 ? (

          <div className="no-complaints">

            <h2>
              🎉 No Complaints
            </h2>

            <p>
              There are currently no complaints.
            </p>

          </div>

        ) : (


          /* ==================================
             COMPLAINT CARDS
             ================================== */

          <div className="admin-complaints-list">


            {complaints.map((complaint) => (

              <div
                className="admin-complaint-card"
                key={complaint.complaintId}
              >


                {/* HEADER */}

                <div className="complaint-header">

                  <div>

                    <h2>

                      Complaint #
                      {complaint.complaintId}

                    </h2>

                    <p>

                      👤 User ID:
                      {" "}
                      {complaint.userId}

                    </p>

                  </div>


                  {/* STATUS */}

                  <span
                    className={
                      complaint.status ===
                      "RESOLVED"
                        ? "status-resolved"
                        : "status-pending"
                    }
                  >

                    {complaint.status}

                  </span>

                </div>


                {/* COMPLAINT */}

                <div className="complaint-section">

                  <h3>
                    📝 Complaint
                  </h3>

                  <p>
                    {complaint.complaintText}
                  </p>

                </div>


                {/* AI INFORMATION */}

                <div className="ai-complaint-info">


                  <h3>
                    🤖 AI Analysis
                  </h3>


                  <div className="ai-info-grid">


                    {/* CATEGORY */}

                    <div className="ai-info-item">

                      <span>
                        🏷️ Category
                      </span>

                      <strong>
                        {complaint.category ||
                          "Other"}
                      </strong>

                    </div>


                    {/* PRIORITY */}

                    <div className="ai-info-item">

                      <span>
                        🚨 Priority
                      </span>

                      <strong
                        className={
                          getPriorityClass(
                            complaint.priority
                          )
                        }
                      >

                        {complaint.priority ||
                          "Low"}

                      </strong>

                    </div>


                  </div>


                  {/* EXPLANATION */}

                  <div className="ai-explanation">

                    <strong>
                      Explanation:
                    </strong>

                    <p>

                      {complaint.aiExplanation ||
                        "No AI explanation available."}

                    </p>

                  </div>

                </div>


                {/* DATE */}

                <div className="complaint-date">

                  📅 Submitted:

                  {" "}

                  {complaint.createdAt
                    ? new Date(
                        complaint.createdAt
                      ).toLocaleString()
                    : "Not available"}

                </div>


                {/* ACTIONS */}

                <div className="complaint-actions">


                  {complaint.status !==
                    "RESOLVED" && (

                    <button
                      className="resolve-btn"
                      onClick={() =>
                        updateStatus(
                          complaint.complaintId,
                          "RESOLVED"
                        )
                      }
                    >

                      ✅ Mark Resolved

                    </button>

                  )}


                  {complaint.status ===
                    "RESOLVED" && (

                    <button
                      className="pending-btn"
                      onClick={() =>
                        updateStatus(
                          complaint.complaintId,
                          "PENDING"
                        )
                      }
                    >

                      🔄 Mark Pending

                    </button>

                  )}

                </div>


              </div>

            ))}


          </div>

        )}

      </div>

    </div>

  );

}

export default AdminComplaints;
