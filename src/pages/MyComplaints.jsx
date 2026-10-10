import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function MyComplaints() {

  const navigate = useNavigate();

  const [user, setUser] = useState(null);

  const [complaints, setComplaints] = useState([]);

  const [loading, setLoading] = useState(true);


  // ==========================================
  // CHECK LOGIN
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

      getComplaints(
        loggedInUser.userId
      );

    } catch (error) {

      console.error(
        "Invalid user data:",
        error
      );

      localStorage.removeItem("user");

      navigate("/login");

    }

  }, [navigate]);


  // ==========================================
  // GET USER COMPLAINTS
  // ==========================================

  const getComplaints = async (userId) => {

    try {

      setLoading(true);

      const response =
        await axios.get(
          `http://localhost:8092/api/complaints/user/${userId}`
        );

      console.log(
        "My complaints:",
        response.data
      );

      setComplaints(
        response.data
      );

    } catch (error) {

      console.error(
        "Error loading complaints:",
        error
      );

      alert(
        "Unable to load complaints."
      );

    } finally {

      setLoading(false);

    }

  };


  // ==========================================
  // GET STATUS CLASS
  // ==========================================

  const getStatusClass = (status) => {

    if (status === "RESOLVED") {

      return "status-resolved";

    }

    if (status === "IN_PROGRESS") {

      return "status-progress";

    }

    return "status-pending";

  };


  // ==========================================
  // GET PRIORITY CLASS
  // ==========================================

  const getPriorityClass = (priority) => {

    if (priority === "High") {

      return "priority-high";

    }

    if (priority === "Medium") {

      return "priority-medium";

    }

    return "priority-low";

  };


  // ==========================================
  // LOGOUT
  // ==========================================

  const handleLogout = () => {

    localStorage.removeItem("user");

    navigate("/login");

  };


  // ==========================================
  // PAGE
  // ==========================================

  return (

    <div className="complaints-page">


      {/* ======================================
          NAVBAR
      ====================================== */}

      <nav className="dashboard-navbar">


        {/* LOGO */}

        <div className="dashboard-logo">

          🌱 Smart Village

        </div>


        {/* NAVIGATION */}

        <div className="dashboard-nav-buttons">


          {/* DASHBOARD */}

          <button
            onClick={() =>
              navigate("/dashboard")
            }
          >
            Dashboard
          </button>


          {/* NEW COMPLAINT */}

          <button
            onClick={() =>
              navigate("/complaint")
            }
          >
            New Complaint
          </button>


          {/* SERVICES */}

          <button
            onClick={() =>
              navigate("/services")
            }
          >
            Services
          </button>


          {/* LOGOUT */}

          <button
            onClick={handleLogout}
          >
            Logout
          </button>


        </div>

      </nav>



      {/* ======================================
          HEADER
      ====================================== */}

      <div className="complaints-header">

        <h1>

          📝 My Complaints

        </h1>


        <p>

          View the complaints you have submitted
          and their current status.

        </p>

      </div>



      {/* ======================================
          LIST
      ====================================== */}

      <div className="complaints-list">


        {/* ==================================
            LOADING
        ================================== */}

        {loading ? (

          <div className="complaints-loading">

            <h3>

              Loading complaints...

            </h3>

          </div>


        ) : complaints.length === 0 ? (


          /* ==================================
             NO COMPLAINTS
          ================================== */

          <div className="no-complaints">

            <div className="no-complaints-icon">

              📭

            </div>


            <h2>

              No complaints found.

            </h2>


            <p>

              You have not submitted any
              complaints yet.

            </p>


            <button
              onClick={() =>
                navigate("/complaint")
              }
            >

              Submit Complaint

            </button>

          </div>


        ) : (


          /* ==================================
             COMPLAINTS
          ================================== */

          complaints.map((complaint) => (

            <div
              className="complaint-item"
              key={complaint.complaintId}
            >


              {/* ==================================
                  COMPLAINT HEADER
              ================================== */}

              <div className="complaint-item-header">


                <div className="complaint-number">

                  Complaint #
                  {complaint.complaintId}

                </div>


                {/* STATUS */}

                <span
                  className={`complaint-status ${getStatusClass(
                    complaint.status
                  )}`}
                >

                  {complaint.status || "PENDING"}

                </span>


              </div>



              {/* ==================================
                  COMPLAINT TEXT
              ================================== */}

              <div className="complaint-text-section">

                <h3>

                  Complaint

                </h3>


                <p>

                  {complaint.complaintText}

                </p>

              </div>



              {/* ==================================
                  AI ANALYSIS
              ================================== */}

              <div className="complaint-ai-section">


                <h3>

                  🤖 AI Analysis

                </h3>


                {/* AI DETAILS */}

                <div className="ai-details">


                  {/* CATEGORY */}

                  <div className="ai-detail-box">

                    <strong>

                      Category

                    </strong>


                    <p>

                      {complaint.category ||
                        "Other"}

                    </p>

                  </div>



                  {/* PRIORITY */}

                  <div className="ai-detail-box">

                    <strong>

                      Priority

                    </strong>


                    <p
                      className={getPriorityClass(
                        complaint.priority
                      )}
                    >

                      {complaint.priority ||
                        "Low"}

                    </p>

                  </div>


                </div>



                {/* AI EXPLANATION */}

                <div className="ai-explanation">

                  <strong>

                    Explanation

                  </strong>


                  <p>

                    {complaint.aiExplanation ||
                      "No AI explanation available."}

                  </p>

                </div>


              </div>



              {/* ==================================
                  CREATED DATE
              ================================== */}

              <div className="complaint-created">

                <strong>

                  Submitted:

                </strong>{" "}

                {complaint.createdAt
                  ? new Date(
                      complaint.createdAt
                    ).toLocaleString()
                  : "-"}

              </div>


            </div>

          ))

        )}

      </div>



      {/* ======================================
          BACK TO DASHBOARD
      ====================================== */}

      <div className="complaints-bottom">

        <button
          onClick={() =>
            navigate("/dashboard")
          }
        >

          ← Back to Dashboard

        </button>

      </div>


    </div>

  );

}

export default MyComplaints;